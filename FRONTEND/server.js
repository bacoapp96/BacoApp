import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import ejs from "ejs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import fetch from 'node-fetch';
import multer from "multer";
import { FormData } from "node-fetch";
import routes from "./app/routes/routes.views.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const app = express();
const upload = multer();
const PORT = process.env.PORT || 4000;

app.locals.BACKEND_URL = process.env.BACKEND_URL || (process.env.NODE_ENV === "production" ? "https://bacoapp-production.up.railway.app" : "http://localhost:3000");

const sessions = new Map();

const parseCookies = (cookieHeader = "") => Object.fromEntries(
  cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .map((cookie) => {
      const [key, ...value] = cookie.split("=");
      return [key, decodeURIComponent(value.join("="))];
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  let sessionId = cookies.baco_sid;

  if (!sessionId || !sessions.has(sessionId)) {
    sessionId = crypto.randomUUID();
    sessions.set(sessionId, {});
    res.cookie("baco_sid", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    });
  }

  req.session = sessions.get(sessionId);
  req.sessionID = sessionId;

  req.destroySession = () => {
    sessions.delete(sessionId);
    res.clearCookie("baco_sid", { path: "/" });
  };

  next();
});

//archivos estaticos
app.use(express.static(path.join(__dirname, "public")));

//configuracion de ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", routes);

// Configuración dinámica de API cliente (Sin exponer secretos)
app.get("/js/config.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send(`window.BACKEND_URL = "${app.locals.BACKEND_URL}";`);
});

// Clasificación de rutas para seguridad
const getRequiredRole = (method, urlPath) => {
  const cleanUrl = urlPath.split("?")[0].replace(/\/$/, "");
  
  if (cleanUrl.startsWith("/api/pagos/crear-preferencia")) {
    return "user";
  }
  
  if (
    cleanUrl.startsWith("/api/clientes") ||
    cleanUrl.startsWith("/api/proveedores") ||
    cleanUrl.startsWith("/api/inventario") ||
    cleanUrl.startsWith("/api/ventas") ||
    (cleanUrl.startsWith("/api/productos") && (method === "POST" || method === "PUT" || method === "DELETE")) ||
    cleanUrl.endsWith("/stock") ||
    cleanUrl.endsWith("/admin") ||
    (cleanUrl.startsWith("/api/ofertas") && !cleanUrl.endsWith("/activas"))
  ) {
    return "admin";
  }
  
  return null;
};

// Proxy para peticiones protegidas y administrativas
app.all(/^\/api\/(.*)/, upload.any(), async (req, res) => {
    const requiredRole = getRequiredRole(req.method, req.path);
  if (requiredRole) {
    if (!req.session?.usuario?.id) {
      return res.status(401).json({ ok: false, error: "No autorizado", message: "Debe iniciar sesión." });
    }
    if (requiredRole === "admin" && req.session.usuario.rol?.toLowerCase() !== "admin") {
      return res.status(403).json({ ok: false, error: "Prohibido", message: "Requiere rol de administrador." });
    }
  }

  const targetUrl = `${app.locals.BACKEND_URL}${req.originalUrl}`;
  
  const targetHeaders = {
    "content-type": "application/json",
    "authorization": `Bearer ${process.env.BACKEND_SECRET_KEY || "clave_firma_seguridad_bacoapp"}`
  };

  if (req.session?.usuario?.id) {
    targetHeaders["x-user-id"] = String(req.session.usuario.id);
    targetHeaders["x-user-role"] = String(req.session.usuario.rol || "");
  }

  try {
    const fetchOptions = {
      method: req.method,
      headers: targetHeaders
    };

if (req.method !== "GET" && req.method !== "HEAD") {
    if (req.headers["content-type"]?.includes("multipart/form-data")) {
        const formData = new FormData();

        Object.entries(req.body).forEach(([key, value]) => {
            formData.append(key, value);
        });

        fetchOptions.body = formData;
        delete targetHeaders["content-type"];
    } else {
        fetchOptions.body = JSON.stringify(req.body);
    }
}

    const response = await fetch(targetUrl, fetchOptions);
    res.status(response.status);

    response.headers.forEach((value, name) => {
if (
  name.toLowerCase() !== "transfer-encoding" &&
  name.toLowerCase() !== "connection" &&
  name.toLowerCase() !== "content-encoding" &&
  name.toLowerCase() !== "content-length"
) {        res.setHeader(name, value);
      }
    });

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      res.json(data);
    } else {
      const data = await response.text();
      res.send(data);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Proxy connection error", message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
