import express from 'express';
import ejs from "ejs";
import crypto from "crypto";
import routes from "./app/routes/routes.views.js";


const app = express();
const PORT = 4000;

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
app.use(express.static("public"));

//configuracion de ejs
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
