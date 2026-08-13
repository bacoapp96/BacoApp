import pool from '../config/db.js';

// BUSCAR
export const buscarProductos = async (req, res) => {
    
  
    const { q } = req.query;

    let sql = "SELECT * FROM productos";
    let params = [];

    if (q) {
        sql = "SELECT * FROM productos WHERE Nombre LIKE ?";
        params = [`%${q}%`];
    }

    const [productos] = await pool.query(sql, params);

    res.json(productos);
};

// LISTAR
export const listarProductos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');

        console.log("PRODUCTOS:", rows);

        res.status(200).json(rows);

    } catch (error) {
        console.error("ERROR PRODUCTOS:", error);

        res.status(500).json({
            error: error.message
        });
    }
};

// OBTENER
export const obtenerProducto = async (req, res) => {
    
    console.log("=================================");
    console.log("ENTRÓ A OBTENER MAS VENDIDOS");
    console.log("=================================");
    
    try {
        const [rows] = await pool.query(
            'SELECT * FROM productos WHERE id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREAR
export const crearProducto = async (req, res) => {

    try {

        const {
            nombre,
            descripcion,
            precio,
            stock,
            categoria,
            marca,
            tipo,
            pais,
            material
        } = req.body;

        if (!nombre || precio === undefined || precio === "" || !categoria) {

            return res.status(400).json({
                error: "Faltan campos necesarios"
            });

        }

        // Ruta de la imagen
        const imagen = req.file
            ? `/img/productos/${req.file.filename}`
            : null;

        const [result] = await pool.query(
            `INSERT INTO productos
            (
                nombre,
                descripcion,
                precio,
                stock,
                categoria,
                marca,
                tipo,
                pais,
                material,
                imagen
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre,
                descripcion,
                precio,
                stock || 0,
                categoria,
                marca,
                tipo,
                pais,
                material,
                imagen
            ]
        );

        res.status(201).json({

            mensaje: "Producto creado exitosamente",

            id: result.insertId,

            imagen: imagen

        });

    } catch (error) {

        console.error(
            "Error creando producto:",
            error
        );

        res.status(500).json({
            error: error.message
        });

    }

};

// ACTUALIZAR 
export const actualizarProducto = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                error: "No se enviaron datos en el body"
            });
        }

        const {
            nombre,
            descripcion,
            precio,
            stock,
            categoria,
            marca,
            tipo,
            pais,
            material
        } = req.body;

        const imagen = req.file
            ? `/img/productos/${req.file.filename}`
            : null;

        if (
            !nombre ||
            !descripcion ||
            precio === undefined ||
            precio === "" ||
            stock === undefined ||
            !categoria ||
            !marca ||
            !tipo ||
            !pais ||
            !material 
        ) {
            return res.status(400).json({
                error: "Faltan campos obligatorios"
            });
        }

        const [result] = await pool.query(
            `UPDATE productos
             SET nombre = ?,
                 descripcion = ?,
                 precio = ?,
                 stock = ?,
                 categoria = ?,
                 marca = ?,
                 tipo = ?,
                 pais = ?,
                 material = ?,
                 imagen = COALESCE(?, imagen)
             WHERE id = ?`,
            [
                nombre,
                descripcion,
                precio,
                stock,
                categoria,
                marca,
                tipo,
                pais,
                material,
                imagen,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json({
            mensaje: "Producto actualizado correctamente"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
};
// ELIMINAR
export const eliminarProducto = async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM productos WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        res.json({
            mensaje: "Producto eliminado correctamente"
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const listarPorCategoria = async (req, res) => {
    try {

        const categoria = req.params.categoria;
        const [rows] = await pool.query(
             `SELECT * FROM productos WHERE categoria = ? `,
             [categoria]
        );

        res.json(rows);
    } catch(error){
        res.status(500).json({
            error: error.message
        });
    }
};

export const obtenerFiltros = async (req, res) => {

    try {
        const [tipos] = await pool.query(`
            SELECT DISTINCT tipo
            FROM productos
            WHERE categoria = ? AND tipo IS NOT null
            ORDER BY tipo
            `,[req.params.categoria]);

            const [pais] = await pool.query(`
            SELECT DISTINCT pais
            FROM productos
            WHERE categoria = ? AND pais IS NOT null
            ORDER BY pais
            `,[req.params.categoria]);

            const [marca] = await pool.query(`
            SELECT DISTINCT marca
            FROM productos
            WHERE categoria = ? AND marca IS NOT null
            ORDER BY marca
            `,[req.params.categoria]);

            const [material] = await pool.query(`
            SELECT DISTINCT material
            FROM productos
            WHERE categoria = ? AND material IS NOT null
            ORDER BY material
            `,[req.params.categoria]);

            res.json({
                tipos,
                pais,
                marca,
                material
            });
        
    } catch (error){
        res.status(500).json({
            error: error.message
        });
    }
};


export const obtenerMasVendidos = async (req, res) => {
      

  

    try {

        const [productos] = await pool.query(`
            SELECT
                p.id,
                p.nombre,
                p.precio,
                SUM(dv.Cantidad) AS total_vendidos
            FROM detalle_venta dv
            INNER JOIN productos p
                ON p.id = dv.Id_producto
            GROUP BY p.id, p.nombre, p.precio
            ORDER BY total_vendidos DESC
            LIMIT 8
        `);

        res.json(productos);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Error obteniendo productos más vendidos"
        });

    }

};
 export const obtenerStockBajo = async (req, res) => {

    try {
         const [rows] = await pool.query(`
                SELECT id, nombre, stock
            FROM productos
            WHERE stock <= 5
            ORDER BY stock ASC
        `);

        res.json(rows);
         
    } catch (error) {

        res.status(500).json({
            error: error.message
        });
        
    }
 }

 export const cambiarStock = async (req, res) => {

    try {

        const { cantidad } = req.body;

        const [rows] = await pool.query(
            "SELECT stock FROM productos WHERE id = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        let nuevoStock = rows[0].stock + cantidad;

        if (nuevoStock < 0) {
            nuevoStock = 0;
        }

        await pool.query(
            "UPDATE productos SET stock = ? WHERE id = ?",
            [nuevoStock, req.params.id]
        );

        res.json({
            mensaje: "Stock actualizado"
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};
