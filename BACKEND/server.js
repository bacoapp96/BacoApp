import express from 'express';
import cors from 'cors';





// Rutas API
import productoRoutes from './app/routes/routes.producto.js';
import clienteRoutes from './app/routes/routes.cliente.js';
import detallesVentaRoutes from './app/routes/routes.detalle_venta.js';
import inventarioRoutes from './app/routes/routes.inventario.js';
import usuarioRoutes from './app/routes/routes.usuario.js';
import venta from './app/routes/routes.venta.js';
import ofertasRoutes from './app/routes/routes.ofertas.js';


const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());
import session from 'express-session';

//para recibir datos de formularios
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "bacoapp_secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);



// RUTAS API 
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/detalle_venta', detallesVentaRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ventas', venta);
app.use('/api/ofertas', ofertasRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ mensaje: 'Backend funcionando correctamente 🚀' });
});


// Servidor
app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
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