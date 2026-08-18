# RPD — Requerimientos del Producto de Software

## BacoApp

| Campo | Detalle |
|---|---|
| **Proyecto** | BacoApp |
| **Versión del documento** | 1.0 |
| **Fecha** | 18 de agosto de 2026 |
| **Autor** | Grupo Software SENA |
| **Repositorio** | [github.com/jaideralmanza-ops/BacoApp](https://github.com/jaideralmanza-ops/BacoApp) |
| **Estado** | En desarrollo / producción parcial |

---

## 1. Resumen ejecutivo

**BacoApp** es una aplicación web integral para la gestión comercial y operativa de una licorería (*baco*). El sistema combina un **catálogo y tienda en línea** orientada al cliente final con un **panel administrativo** para control de inventario, ventas, clientes, proveedores, ofertas y reportes.

La solución está construida con arquitectura **desacoplada**: un backend REST API (Node.js + Express + MySQL) y un frontend de presentación (Node.js + Express + EJS) que actúa como proxy seguro hacia la API.

---

## 2. Problema y oportunidad

### 2.1 Problema

Las licorerías pequeñas y medianas suelen gestionar inventario, ventas y clientes con herramientas dispersas (hojas de cálculo, cuadernos, mensajería), lo que genera:

- Descontrol de stock y quiebres de inventario.
- Dificultad para analizar ventas y productos más vendidos.
- Procesos manuales de registro de clientes y pedidos.
- Ausencia de canal digital de ventas con pagos en línea.

### 2.2 Oportunidad

Centralizar en una sola plataforma la operación comercial de la licorería: catálogo digital, carrito de compras, pagos en línea, administración de inventario y reportes de negocio.

---

## 3. Objetivos del producto

| ID | Objetivo | Indicador de éxito |
|---|---|---|
| OBJ-01 | Digitalizar el catálogo de productos por categorías | Catálogo navegable con búsqueda y filtros |
| OBJ-02 | Permitir compras en línea con pago seguro | Checkout funcional con Mercado Pago y/o Wompi |
| OBJ-03 | Controlar inventario en tiempo real | Stock actualizado tras cada venta |
| OBJ-04 | Gestionar clientes y su historial comercial | CRUD de clientes con pedidos y reportes |
| OBJ-05 | Administrar proveedores | Registro y consulta de proveedores |
| OBJ-06 | Promocionar productos mediante ofertas | Ofertas activas visibles en la tienda |
| OBJ-07 | Generar reportes de ventas | Dashboard y reportes mensuales/semanales |
| OBJ-08 | Garantizar seguridad por roles | Separación admin / cliente con autenticación |

---

## 4. Usuarios y roles

### 4.1 Cliente (usuario final)

- Registra cuenta y accede a la tienda.
- Navega categorías, busca productos y agrega al carrito.
- Realiza compras con pago en línea.
- Consulta y actualiza su perfil.
- Recupera contraseña por correo electrónico.

### 4.2 Administrador

- Accede al panel de administración (`/dashboard`).
- Gestiona productos, inventario, clientes, proveedores y ofertas.
- Consulta reportes y métricas de ventas.
- Registra nuevos administradores.
- Bloquea o reporta clientes según políticas comerciales.

---

## 5. Alcance

### 5.1 Dentro del alcance

- Tienda en línea con catálogo por categorías.
- Carrito de compras persistente en el navegador.
- Autenticación con sesiones y roles (admin / cliente).
- CRUD de productos con carga de imágenes (Cloudinary).
- Gestión de inventario y alertas de stock bajo.
- Procesamiento de ventas con transacciones y descuento de stock.
- Integración de pagos: **Mercado Pago** y **Wompi**.
- Gestión de ofertas y promociones con fechas y descuentos.
- Gestión de clientes y proveedores.
- Reportes de ventas (diarias, semanales, mensuales).
- Recuperación de contraseña vía correo (Brevo).
- Despliegue en la nube (Railway / Render).

### 5.2 Fuera del alcance (v1)

- Aplicación móvil nativa (iOS / Android).
- Facturación electrónica DIAN (Colombia).
- Sistema de envíos / logística con tracking.
- Chat en vivo o soporte multicanal.
- Programa de fidelización automatizado (puntos / cashback).
- Multi-sucursal o multi-tenant.

---

## 6. Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Navegador)                     │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTP
┌─────────────────────────────▼───────────────────────────────┐
│              FRONTEND (Express + EJS) — Puerto 4000           │
│  • Vistas EJS (tienda + admin)                                │
│  • Archivos estáticos (CSS, JS)                               │
│  • Sesiones en memoria (Map)                                  │
│  • Proxy seguro hacia backend con firma Bearer                │
└─────────────────────────────┬───────────────────────────────┘
                              │ API REST + Bearer Token
┌─────────────────────────────▼───────────────────────────────┐
│              BACKEND (Express API) — Puerto 3000              │
│  • Controladores y rutas REST                                   │
│  • Sesiones (express-session)                                   │
│  • Middleware de autenticación y roles                          │
│  • Servicios de ventas y pagos                                  │
└──────┬──────────────┬──────────────┬──────────────────────────┘
       │              │              │
       ▼              ▼              ▼
   MySQL         Cloudinary    Mercado Pago / Wompi / Brevo
```

### 6.1 Stack tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | Node.js, Express 5, EJS, CSS, JavaScript vanilla |
| **Backend** | Node.js, Express 5, ES Modules |
| **Base de datos** | MySQL (mysql2/promise) |
| **Autenticación** | bcrypt, express-session, tokens de recuperación |
| **Imágenes** | Cloudinary |
| **Correo** | Brevo (@getbrevo/brevo) |
| **Pagos** | Mercado Pago SDK, Wompi (API + webhooks) |
| **Despliegue** | Docker (backend), Railway |

### 6.2 Estructura del repositorio

```
Proyecto/
├── BACKEND/          # API REST
│   ├── app/
│   │   ├── config/   # DB, Cloudinary, Brevo, Mail
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── server.js
│   └── Dockerfile
├── FRONTEND/         # Servidor de vistas + proxy
│   ├── app/
│   ├── public/       # CSS, JS, assets
│   ├── views/        # Plantillas EJS
│   └── server.js
└── RPD.md            # Este documento
```

---

## 7. Requerimientos funcionales

### 7.1 Módulo de autenticación y usuarios

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-AUTH-01 | El sistema debe permitir registro de clientes con nombre, usuario, email, contraseña y celular | Alta |
| RF-AUTH-02 | El sistema debe permitir inicio de sesión con usuario y contraseña | Alta |
| RF-AUTH-03 | Las contraseñas deben almacenarse con hash bcrypt | Alta |
| RF-AUTH-04 | El sistema debe migrar automáticamente contraseñas en texto plano a bcrypt al iniciar sesión | Media |
| RF-AUTH-05 | El administrador debe poder registrar otros administradores | Alta |
| RF-AUTH-06 | El usuario debe poder cerrar sesión | Alta |
| RF-AUTH-07 | El sistema debe mantener sesión activa (24 h en backend) | Media |
| RF-AUTH-08 | El frontend debe exponer endpoint `/api/session` para consultar sesión activa | Media |

### 7.2 Módulo de recuperación de contraseña

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-PWD-01 | El usuario debe poder solicitar recuperación ingresando su email | Alta |
| RF-PWD-02 | El sistema debe generar un token único con expiración de 20 minutos | Alta |
| RF-PWD-03 | El sistema debe enviar enlace de restablecimiento por correo (Brevo) | Alta |
| RF-PWD-04 | El usuario debe poder establecer nueva contraseña mediante el enlace | Alta |
| RF-PWD-05 | El sistema no debe revelar si un email existe o no (respuesta genérica) | Media |

### 7.3 Módulo de catálogo y productos

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-PROD-01 | El sistema debe listar todos los productos disponibles | Alta |
| RF-PROD-02 | El sistema debe filtrar productos por categoría | Alta |
| RF-PROD-03 | El sistema debe permitir búsqueda de productos por nombre | Alta |
| RF-PROD-04 | El administrador debe poder crear, editar y eliminar productos | Alta |
| RF-PROD-05 | Cada producto debe incluir: nombre, descripción, precio, stock, categoría e imagen | Alta |
| RF-PROD-06 | Las imágenes deben almacenarse en Cloudinary | Alta |
| RF-PROD-07 | El sistema debe mostrar productos más vendidos | Media |
| RF-PROD-08 | El sistema debe ofrecer filtros dinámicos por categoría | Media |
| RF-PROD-09 | El administrador debe recibir alertas de stock bajo | Media |

**Categorías soportadas:**

- Vinos, Whiskys, Rones, Cervezas, Tequilas, Aguardientes
- Gaseosas, Jugos, Vodkas, Ginebras
- Desechables, Dulces, Accesorios

### 7.4 Módulo de tienda y carrito

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-TIENDA-01 | El cliente debe poder navegar el catálogo por categorías | Alta |
| RF-TIENDA-02 | El cliente debe poder agregar productos al carrito | Alta |
| RF-TIENDA-03 | El carrito debe persistir en el navegador (localStorage) | Alta |
| RF-TIENDA-04 | El cliente debe poder modificar cantidades y eliminar items | Alta |
| RF-TIENDA-05 | La página de inicio debe mostrar ofertas activas y más vendidos | Media |
| RF-TIENDA-06 | El sistema debe soportar modo claro/oscuro (theme) | Baja |

### 7.5 Módulo de ventas

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-VENTA-01 | El sistema debe registrar ventas con cliente, usuario, productos y total | Alta |
| RF-VENTA-02 | La creación de venta debe ejecutarse en transacción de base de datos | Alta |
| RF-VENTA-03 | El stock debe descontarse automáticamente al confirmar la venta | Alta |
| RF-VENTA-04 | El sistema debe validar stock disponible antes de procesar | Alta |
| RF-VENTA-05 | El sistema debe aplicar descuentos de ofertas activas al calcular precios | Alta |
| RF-VENTA-06 | El administrador debe consultar historial de ventas y detalle por venta | Alta |
| RF-VENTA-07 | El cliente debe consultar su historial de pedidos | Media |
| RF-VENTA-08 | El administrador debe poder eliminar ventas | Baja |

### 7.6 Módulo de pagos

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-PAGO-01 | El cliente autenticado debe poder pagar con Mercado Pago | Alta |
| RF-PAGO-02 | El sistema debe crear preferencia de pago con productos del carrito | Alta |
| RF-PAGO-03 | El sistema debe redirigir a páginas de resultado: exitoso, fallido, pendiente | Alta |
| RF-PAGO-04 | El sistema debe soportar pagos con Wompi (crear, confirmar, webhook) | Alta |
| RF-PAGO-05 | Al confirmar pago, el sistema debe registrar la venta automáticamente | Alta |
| RF-PAGO-06 | El checkout debe incluir subtotal, envío y total | Media |

### 7.7 Módulo de ofertas

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-OFE-01 | El administrador debe crear ofertas con producto, título, descripción, descuento y fechas | Alta |
| RF-OFE-02 | Las ofertas deben calcular estado: Programada, Activa, Finalizada, Agotada | Alta |
| RF-OFE-03 | Las ofertas activas deben mostrarse en la tienda | Alta |
| RF-OFE-04 | El administrador debe consultar estadísticas de ofertas | Media |
| RF-OFE-05 | Las ofertas pueden configurarse como "hasta agotar existencias" | Media |

### 7.8 Módulo de clientes

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-CLI-01 | El administrador debe listar, crear, editar y eliminar clientes | Alta |
| RF-CLI-02 | Cada cliente debe tener: tipo, estado, nivel, cupo de crédito, compras y total gastado | Alta |
| RF-CLI-03 | Al registrar usuario cliente, se debe crear registro en tabla clientes automáticamente | Alta |
| RF-CLI-04 | El administrador debe consultar pedidos de un cliente | Media |
| RF-CLI-05 | El administrador debe poder bloquear clientes | Media |
| RF-CLI-06 | El administrador debe poder reportar clientes | Media |
| RF-CLI-07 | El sistema debe reportar clientes nuevos del mes | Baja |

### 7.9 Módulo de proveedores

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-PROV-01 | El administrador debe listar, crear, editar y eliminar proveedores | Alta |
| RF-PROV-02 | Cada proveedor debe incluir: nombre, teléfono, correo, dirección, ciudad, NIT y contacto | Alta |

### 7.10 Módulo de inventario

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-INV-01 | El administrador debe consultar inventario por producto | Alta |
| RF-INV-02 | El administrador debe crear, actualizar y eliminar registros de inventario | Alta |
| RF-INV-03 | El stock de productos debe sincronizarse con las ventas | Alta |

### 7.11 Módulo de reportes y dashboard

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-REP-01 | El dashboard debe mostrar ventas del día, pedidos y total de productos | Alta |
| RF-REP-02 | El sistema debe reportar ventas del mes y de la semana | Alta |
| RF-REP-03 | El sistema debe identificar producto más vendido (mes y semana) | Media |
| RF-REP-04 | El sistema debe identificar mejor vendedor del mes | Media |
| RF-REP-05 | El administrador debe consultar últimas ventas | Media |
| RF-REP-06 | El panel debe ofrecer accesos rápidos a inventario, clientes, reportes y proveedores | Media |

### 7.12 Módulo de cuenta de usuario

| ID | Requerimiento | Prioridad |
|---|---|---|
| RF-CUENTA-01 | El cliente debe ver y editar su perfil (nombre, email, celular, dirección) | Alta |
| RF-CUENTA-02 | El administrador debe gestionar su cuenta desde panel admin | Media |

---

## 8. Requerimientos no funcionales

| ID | Categoría | Requerimiento |
|---|---|---|
| RNF-01 | **Seguridad** | Comunicación frontend-backend protegida con token Bearer (`BACKEND_SECRET_KEY`) |
| RNF-02 | **Seguridad** | Rutas administrativas requieren rol `admin` |
| RNF-03 | **Seguridad** | CORS restringido a orígenes permitidos (`localhost:4000`, `FRONTEND_URL`) |
| RNF-04 | **Seguridad** | Cookies de sesión con `httpOnly`, `sameSite: lax` en producción |
| RNF-05 | **Rendimiento** | Pool de conexiones MySQL con límite de 5 conexiones |
| RNF-06 | **Disponibilidad** | Backend desplegable con Docker en Railway |
| RNF-07 | **Usabilidad** | Interfaz responsive con sidebar de navegación |
| RNF-08 | **Mantenibilidad** | Código modular: rutas, controladores, modelos y servicios separados |
| RNF-09 | **Compatibilidad** | Navegadores modernos (Chrome, Firefox, Edge, Safari) |
| RNF-10 | **Escalabilidad** | Arquitectura desacoplada permite escalar frontend y backend por separado |

---

## 9. Modelo de datos (entidades principales)

```
usuario
├── Id_usuario (PK)
├── Nombre, Usuario, Email, Password, Celular
├── Documento, Direccion, rol
├── ResetToken, ResetTokenExpira
└── Relación 1:1 → clientes

clientes
├── id / id_cliente (PK)
├── id_usuario (FK)
├── tipo, estado, nivel
├── cupoCredito, compras, totalGastado
└── observaciones

productos
├── id (PK)
├── nombre, descripcion, precio, stock
├── categoria, imagen (URL Cloudinary)
└── Relación 1:N → detalle_venta, ofertas, inventario

venta
├── Id_venta (PK)
├── Id_cliente, Id_usuario
├── total, fecha, estado
└── Relación 1:N → detalle_venta

detalle_venta
├── Id_detalle (PK)
├── Id_venta (FK), Id_producto (FK)
├── Cantidad, Precio
└── subtotal calculado

ofertas
├── id_oferta (PK)
├── id_producto (FK)
├── titulo, descripcion, descuento
├── fecha_inicio, fecha_fin
├── hasta_agotar_existencias, estado
└── estado calculado (Programada/Activa/Finalizada/Agotada)

proveedores
├── id_proveedor (PK)
├── nombre, telefono, correo
├── direccion, ciudad, nit, contacto
└── observaciones

inventario
├── Id_inventario (PK)
├── Id_producto (FK)
└── Stock
```

---

## 10. Integraciones externas

| Servicio | Propósito | Variables de entorno |
|---|---|---|
| **MySQL** | Base de datos relacional | `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` |
| **Cloudinary** | Almacenamiento de imágenes de productos | Configuración en `cloudinary.js` |
| **Mercado Pago** | Pasarela de pagos (preferencias) | `MERCADOPAGO_ACCESS_TOKEN` |
| **Wompi** | Pasarela de pagos alternativa | Configuración en controlador Wompi |
| **Brevo** | Envío de correos (recuperación de contraseña) | `BREVO_API_KEY` |
| **Railway** | Hosting en producción | `FRONTEND_URL`, `BACKEND_URL`, `PORT` |

---

## 11. Flujos principales

### 11.1 Flujo de compra (cliente)

```
Inicio → Categoría → Producto → Agregar al carrito
    → Carrito → Checkout → Pago (Mercado Pago / Wompi)
    → Confirmación → Venta registrada → Stock descontado
```

### 11.2 Flujo de autenticación

```
Login → Validar credenciales (bcrypt) → Crear sesión
    → Frontend almacena usuario en sesión Map
    → Proxy envía x-user-id y x-user-role al backend
```

### 11.3 Flujo de recuperación de contraseña

```
Recovery → Email → Token generado (20 min)
    → Correo Brevo con enlace → Reset password → Nueva contraseña (bcrypt)
```

### 11.4 Flujo administrativo

```
Login admin → Dashboard → Módulo (inventario/clientes/reportes/etc.)
    → Proxy verifica rol admin → Backend procesa → Respuesta JSON
```

---

## 12. API REST — Endpoints principales

| Prefijo | Descripción | Protección |
|---|---|---|
| `/api/usuarios` | Login, registro, CRUD usuarios | Mixta |
| `/api/productos` | CRUD productos, búsqueda, filtros, stock | Lectura pública / escritura admin |
| `/api/ventas` | CRUD ventas, reportes, detalle | Admin / usuario logueado |
| `/api/clientes` | CRUD clientes, pedidos, bloqueo | Admin |
| `/api/proveedores` | CRUD proveedores | Admin |
| `/api/inventario` | CRUD inventario | Admin |
| `/api/ofertas` | CRUD ofertas, activas, estadísticas | Admin / activas públicas |
| `/api/pagos` | Mercado Pago (crear preferencia) | Usuario logueado |
| `/api/pagos/wompi` | Wompi (crear, confirmar, webhook) | Mixta |
| `/api/password` | Recuperación y reset de contraseña | Pública |
| `/api/detalle_venta` | CRUD detalle de ventas | Admin |

---

## 13. Interfaces de usuario

### 13.1 Vistas del cliente

| Ruta | Descripción |
|---|---|
| `/index` | Landing / página principal |
| `/inicio` | Home de la tienda con ofertas y más vendidos |
| `/tienda` | Catálogo general |
| `/categorias` | Listado de categorías |
| `/vinos`, `/whiskys`, `/rones`, etc. | Catálogo por categoría |
| `/busqueda` | Resultados de búsqueda |
| `/carrito` | Carrito de compras |
| `/cuenta` | Perfil del cliente |
| `/login`, `/registro` | Autenticación |
| `/recovery`, `/reset-password/:token` | Recuperación de contraseña |
| `/pago-exitoso`, `/pago-fallido`, `/pago-pendiente` | Resultados de pago |
| `/ofertas` | Ofertas activas |
| `/ayuda` | Ayuda al usuario |

### 13.2 Vistas del administrador

| Ruta | Descripción |
|---|---|
| `/dashboard` | Panel principal con métricas |
| `/inventario` | Gestión de inventario |
| `/gestion-productos` | CRUD de productos |
| `/clientes` | Gestión de clientes |
| `/proveedores` | Gestión de proveedores |
| `/reportes` | Reportes de ventas |
| `/ofertas` (admin) | Gestión de ofertas |
| `/configuracion` | Configuración del sistema |
| `/cuenta-admin` | Perfil del administrador |
| `/registroadmin` | Registro de administradores |

---

## 14. Restricciones y supuestos

### 14.1 Restricciones

- Requiere conexión a internet para pagos, correos e imágenes en la nube.
- Base de datos MySQL debe estar disponible y configurada.
- Las claves de API (Mercado Pago, Wompi, Brevo, Cloudinary) deben configurarse en variables de entorno.
- El frontend actúa como único punto de acceso al backend en producción (proxy pattern).

### 14.2 Supuestos

- Los usuarios administradores son de confianza y gestionan el inventario.
- La licorería opera en Colombia (integración Wompi, Mercado Pago).
- Un solo negocio / una sola licorería por despliegue.
- Los clientes tienen acceso a correo electrónico para recuperación de contraseña.

---

## 15. Criterios de aceptación generales

1. Un cliente puede registrarse, iniciar sesión, agregar productos al carrito y completar una compra con pago en línea.
2. Tras una venta exitosa, el stock del producto disminuye correctamente.
3. Un administrador puede crear productos con imagen, gestionar inventario y consultar reportes.
4. Las rutas administrativas rechazan acceso a usuarios sin rol admin (HTTP 403).
5. La recuperación de contraseña envía correo y permite restablecer la clave dentro de 20 minutos.
6. Las ofertas activas se muestran en la tienda y aplican descuento al checkout.
7. El dashboard refleja métricas de ventas del día actualizadas.

---

## 16. Riesgos identificados

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Sesiones en memoria en frontend (Map) | Pérdida de sesión al reiniciar servidor | Migrar a Redis o sesiones persistentes |
| Dependencia de servicios externos (pagos, correo) | Fallo en checkout o recuperación | Manejo de errores + reintentos + logs |
| Stock no sincronizado en concurrencia | Sobreventa | Transacciones SQL + validación de stock |
| Secretos en variables de entorno | Compromiso de seguridad | No commitear `.env`, rotar claves |

---

## 17. Configuración y despliegue

### 17.1 Variables de entorno — Backend

```env
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://tu-frontend.up.railway.app
SESSION_SECRET=cambia-este-secreto
BACKEND_SECRET_KEY=clave_firma_seguridad_bacoapp
DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT
MERCADOPAGO_ACCESS_TOKEN
BREVO_API_KEY
```

### 17.2 Variables de entorno — Frontend

```env
PORT=4000
BACKEND_URL=https://bacoapp-production.up.railway.app
BACKEND_SECRET_KEY=clave_firma_seguridad_bacoapp
```

### 17.3 Ejecución local

```bash
# Backend (puerto 3000)
cd BACKEND && npm install && npm run dev

# Frontend (puerto 4000)
cd FRONTEND && npm install && npm run dev
```

---

## 18. Glosario

| Término | Definición |
|---|---|
| **Baco** | Licorería; establecimiento de venta de licores y bebidas |
| **RPD** | Requerimientos del Producto de Software |
| **CRUD** | Create, Read, Update, Delete — operaciones básicas de datos |
| **Proxy** | Intermediario que reenvía peticiones del frontend al backend con seguridad |
| **Webhook** | Notificación automática de un servicio externo (ej. Wompi confirma pago) |
| **Preferencia** | Objeto de Mercado Pago que define una orden de pago |

---

## 19. Historial de cambios

| Versión | Fecha | Autor | Descripción |
|---|---|---|---|
| 1.0 | 18/08/2026 | Grupo Software SENA | Documento inicial basado en el estado actual del código |

---

*Documento generado a partir del análisis del repositorio BacoApp.*
