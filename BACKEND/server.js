import dotenv from "dotenv";
dotenv.config(); 
import express from 'express';
import cors from 'cors';

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





// Rutas API
import productosRoutes from './app/routes/routes.productos.js';
import clienteRoutes from './app/routes/routes.cliente.js';
import detallesVentaRoutes from './app/routes/routes.detalle_venta.js';
import inventarioRoutes from './app/routes/routes.inventario.js';
import usuarioRoutes from './app/routes/routes.usuario.js';
import ventasRoutes from './app/routes/routes.venta.js';
import ofertasRoutes from './app/routes/routes.ofertas.js';
import passwordRoutes from "./app/routes/routes.password.js";
import proveedoresRoutes from "./app/routes/routes.proveedor.js";
import pedidosProveedorRoutes from "./app/routes/routes.pedidosProveedor.js";
import mercadoPagoRoutes from './app/routes/routes.mercadopago.js';
import wompiRoutes from "./app/routes/routes.wompi.js";







const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
    "/img/productos",
    express.static(
        path.join(__dirname, "public/img/productos")
    )
);
app.use(express.json());
// FRONTEND_URL contiene la URL pública del frontend (https://bacoapp-production.up.railway.app) en producción.
const allowedOrigins = [
    "http://localhost:4000",
    process.env.FRONTEND_URL
].filter(Boolean).map(url => url.trim().replace(/\/$/, ""));

app.use(cors({
    origin(origin, callback) {
        // Permitir llamadas sin origin (servidor-a-servidor) u orígenes permitidos
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true
}));
import session from 'express-session';



//para recibir datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "bacoapp_secret",
        resave: false,
        saveUninitialized: false,
       cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000

        }
    })
);



import { verificarFirmaFrontend, requiereAdmin, requiereUsuarioLogueado } from './app/middleware/auth.js';

// RUTAS API 
app.use('/api/productos', productosRoutes);
app.use('/api/clientes', verificarFirmaFrontend, requiereAdmin, clienteRoutes);
app.use('/api/detalle_venta', verificarFirmaFrontend, requiereAdmin, detallesVentaRoutes);
app.use('/api/inventario', verificarFirmaFrontend, requiereAdmin, inventarioRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ventas', ventasRoutes);
app.use("/api/pagos/wompi", wompiRoutes);
app.use('/api/pagos', verificarFirmaFrontend, requiereUsuarioLogueado, mercadoPagoRoutes);
app.use('/api/ofertas', ofertasRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/proveedores", verificarFirmaFrontend, requiereAdmin, proveedoresRoutes);
app.use("/api/pedidos-proveedor", verificarFirmaFrontend, requiereAdmin, pedidosProveedorRoutes);






// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'Backend funcionando correctamente 🚀' });
});


// Servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Backend corriendo en el puerto ${PORT}`);
});



// Configuración de la sesión
function verificarLogin(req, res, next) {
    if (!req.session.usuario) {
        return res.redirect("/login");
    }
    next();
}

app.get("/api/session", (req, res) => {

    if (!req.session.usuario) {
        return res.status(401).json({
            ok: false,
            message: "No autenticado"
        });
    }

    res.json({
        ok: true,
        usuario: req.session.usuario
    });
});
