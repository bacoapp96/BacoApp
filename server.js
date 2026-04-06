import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import router from './app/routes/routes.views.js';
import productoRoutes from './app/routes/routes.producto.js';
import clienteRoutes from './app/routes/routes.cliente.js';
import detallesVentaRoutes from './app/routes/routes.detalle_venta.js';
import inventarioRoutes from './app/routes/routes.inventario.js';
import usuarioRoutes from './app/routes/routes.usuario.js';
import venta from './app/routes/routes.venta.js';

const app = express();
const PORT = 4000;

// Configuración de rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json());

// Rutas API
app.use('/api', productoRoutes);
app.use('/api', clienteRoutes);
app.use('/api/detalle_venta', detallesVentaRoutes);
app.use('/api', inventarioRoutes);
app.use('/api', usuarioRoutes);
app.use('/api', venta);

// Rutas vistas (HTML)
app.use('/', router);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});