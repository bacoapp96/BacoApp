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

//para recibir datos de formularios
app.use(express.urlencoded({ extended: true }));



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