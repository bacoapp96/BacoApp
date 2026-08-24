import pool from "../config/db.js";

// OBTENER TODAS
export const obtenerOfertas = async () => {

const [rows] = await pool.query(
`
SELECT 
    o.*,
    p.nombre AS producto,

    CASE

        WHEN o.hasta_agotar_existencias = 1 
        AND p.stock <= 0
        THEN 'Agotada'

        WHEN CURDATE() < o.fecha_inicio
        THEN 'Programada'

        WHEN CURDATE() BETWEEN o.fecha_inicio AND o.fecha_fin
        THEN 'Activa'

        ELSE 'Finalizada'

    END AS estado

FROM ofertas o

LEFT JOIN productos p
ON o.id_producto = p.id

ORDER BY o.fecha_inicio DESC
`
);

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
        (id_producto, 
        titulo,
        descripcion,
        descuento, 
        fecha_inicio, 
        fecha_fin,
        hasta_agotar_existencias, 
        estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
        data.id_producto,
        data.titulo,
        data.descripcion,
        data.descuento,
        data.fecha_inicio,
        data.fecha_fin,
        data.hasta_agotar_existencias ? 1 : 0,
        "Programada"
    ]);

    return result;
};

// ACTUALIZAR
export const actualizarOferta = async (id, data) => {
    const sql = `
        UPDATE ofertas 
        SET id_producto=?, 
        titulo=?,
        descripcion=?,
        descuento=?, 
        fecha_inicio=?, 
        fecha_fin=?,
        hasta_agotar_existencias=?
        WHERE id_oferta=?
    `;

    const [result] = await pool.query(sql, [
        data.id_producto,
        data.titulo,
        data.descripcion,
        data.descuento,
        data.fecha_inicio,
        data.fecha_fin,
        data.hasta_agotar_existencias,
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


export const obtenerEstadisticasOfertas = async()=>{

const [rows] = await pool.query(
`
SELECT
SUM(estado='Activa') AS activas,
SUM(estado='Programada') AS programadas,
SUM(estado='Finalizada') AS finalizadas,
SUM(estado='Agotada') AS agotadas

FROM (

SELECT

CASE

WHEN o.hasta_agotar_existencias = 1 
AND p.stock <=0
THEN 'Agotada'

WHEN CURDATE() < o.fecha_inicio
THEN 'Programada'

WHEN CURDATE() BETWEEN o.fecha_inicio AND o.fecha_fin
THEN 'Activa'

ELSE 'Finalizada'

END AS estado

FROM ofertas o

LEFT JOIN productos p
ON o.id_producto = p.id

) AS estados
`
);

return rows[0];

};

export const obtenerOfertasActivas = async () => {

    const [rows] = await pool.query(`

        SELECT
            o.id_oferta,
            o.id_producto,
            o.titulo,
            o.descripcion,
            o.descuento,
            o.fecha_inicio,
            o.fecha_fin,
            o.hasta_agotar_existencias,
            o.estado,
            o.fecha_creacion,

            p.nombre AS producto,
            p.precio,
            p.stock,
            p.categoria,
            p.marca,
            p.tipo,
            p.pais,
            p.material,
            p.imagen,

            ROUND(
                p.precio - (p.precio * o.descuento / 100),
                0
            ) AS precio_oferta

        FROM ofertas o

        INNER JOIN productos p
            ON o.id_producto = p.id

        WHERE
        CURDATE() BETWEEN o.fecha_inicio AND o.fecha_fin

        AND (
            o.hasta_agotar_existencias = 0
            OR p.stock > 0
        )

        ORDER BY o.fecha_inicio DESC

    `);

    return rows;
};