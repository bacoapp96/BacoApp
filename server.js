import express from 'express';

import productoRoutes from './app/routes/routes.producto.js';
import clienteRoutes from './app/routes/routes.cliente.js';
import detallesVentaRoutes from './app/routes/routes.detalle_venta.js';
import inventarioRoutes from './app/routes/routes.inventario.js';
import usuarioRoutes  from './app/routes/routes.usuario.js';
import venta from './app/routes/routes.venta.js';


const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Rutas
app.use('/api', productoRoutes);
app.use('/api', clienteRoutes);
app.use('/api/detalle_venta', detallesVentaRoutes);
app.use('/api', inventarioRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', venta);

app.get('/', (req, res) => {
    res.json({ message: "Hola Mundo" });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});