import pool from "../config/db.js";

// OBTENER TODAS
export const obtenerOfertas = async () => {
    const [rows] = await pool.query("SELECT * FROM ofertas");
    return rows;
};

// OBTENER UNA
export const obtenerOfertaPorId = async (id) => {
    const [rows] = await pool.query(
        "SELECT * FROM ofertas WHERE id_oferta = ?",
        [id]
    );
    return rows[0];
};

// CREAR
export const crearOferta = async (data) => {

    const sql = `
        INSERT INTO ofertas
        (id_producto, titulo, descuento, fecha_inicio, fecha_fin, estado)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
        data.id_producto,
        data.titulo,
        data.descuento,
        data.fecha_inicio,
        data.fecha_fin,
        data.estado
    ]);

    return result;
};

// ACTUALIZAR
export const actualizarOferta = async (id, data) => {
    const sql = `
        UPDATE ofertas 
        SET id_producto=?, titulo=?, descuento=?, fecha_inicio=?, fecha_fin=?, estado=?
        WHERE id_oferta=?
    `;

    const [result] = await pool.query(sql, [
        data.id_producto,
        data.titulo,
        data.descuento,
        data.fecha_inicio,
        data.fecha_fin,
        data.estado,
        id
    ]);

    return result;
};

// ELIMINAR
export const eliminarOferta = async (id) => {
    const [result] = await pool.query(
        "DELETE FROM ofertas WHERE id_oferta = ?",
        [id]
    );

    return result;
};
