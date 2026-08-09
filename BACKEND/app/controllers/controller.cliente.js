import pool from '../config/db.js';

// LISTAR CLIENTES
export const listarClientes = async (req, res) => {

    try {

        const [rows] = await pool.query(`
            SELECT

                c.id AS id,

                u.Nombre AS nombre,
                u.Email AS correo,
                u.Celular AS telefono,
                u.Direccion AS direccion,

                c.tipo,
                c.estado,
                c.nivel,
                c.cupoCredito,
                c.compras,
                c.totalGastado,
                c.observaciones

            FROM clientes c

            INNER JOIN usuario u
            ON c.id_usuario = u.Id_usuario

        `);


        res.json(rows);


    } catch(error){

        console.error(error);

        res.status(500).json({
            error:error.message
        });

    }

};
// OBTENER CLIENTE
export const obtenerCliente = async (req,res)=>{

try{

const [rows] = await pool.query(`

            SELECT

            c.id AS id,

            u.Nombre AS nombre,
            u.Email AS correo,
            u.Celular AS telefono,
            u.Direccion AS direccion,

            c.tipo,
            c.estado,
            c.nivel,
            c.cupoCredito,
            c.compras,
            c.totalGastado,
            c.observaciones

            FROM clientes c

            INNER JOIN usuario u
            ON c.id_usuario = u.Id_usuario

            WHERE c.id_cliente = ?

            `,[req.params.id]);


            if(rows.length===0){

            return res.status(404).json({
            error:"Cliente no encontrado"
            });

            }


            res.json(rows[0]);


            }catch(error){

            res.status(500).json({
            error:error.message
            });

}

};
// CREAR CLIENTE
export const crearCliente = async (req, res) => {
    try {
        const { nombre,
                correo,
                telefono,
                direccion,
                tipo,
                estado,
                nivel,
                cupoCredito,
                compras,
                totalGastado,
                observaciones } = req.body;

        if (!nombre) {
            return res.status(400).json({
                error: "El nombre es obligatorio"
            });
        }

        const [result] = await pool.query(
            'INSERT INTO clientes (nombre, correo, telefono, direccion, tipo, estado, nivel, cupoCredito, compras, totalGastado, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [   nombre,
                correo,
                telefono,
                direccion,
                tipo,
                estado,
                nivel,
                cupoCredito,
                compras,
                totalGastado,
                observaciones]
        );

        res.json({ id: result.insertId });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ACTUALIZAR CLIENTE
export const actualizarCliente = async (req, res) => {
    try {
        const { 
                estado,
                nivel,
                cupoCredito,
                observaciones } = req.body;
        const id = parseInt(req.params.id);

        const [result] = await pool.query(
            'UPDATE clientes SET  estado = ?, nivel = ?, cupoCredito = ?, compras = ?,  observaciones = ? WHERE id = ?',
            [   
                estado,
                nivel,
                cupoCredito,
                observaciones, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.json({ mensaje: "Cliente actualizado correctamente" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ELIMINAR CLIENTE
export const eliminarCliente = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const [result] = await pool.query(
            'DELETE FROM clientes WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }
        res.json({ mensaje: "Cliente eliminado correctamente" });


    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ACTUALIZAR DATOS ADMINISTRATIVOS DEL CLIENTE
export const actualizarClienteAdmin = async (req, res) => {

    try {

        const {
            estado,
            nivel,
            cupoCredito,
            observaciones
        } = req.body;

        const id = Number(req.params.id);

        const [result] = await pool.query(
            `
            UPDATE clientes
            SET
                estado = ?,
                nivel = ?,
                cupoCredito = ?,
                observaciones = ?
            WHERE id = ?
            `,
            [
                estado,
                nivel,
                cupoCredito,
                observaciones,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Cliente no encontrado"
            });
        }

        res.json({
            ok: true,
            message: "Cliente actualizado correctamente."
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            error: error.message
        });

    }

};

// OBTENER PEDIDOS DE UN CLIENTE
export const pedidosCliente = async (req, res) => {
    try {

        const idCliente = req.params.id;

        const [rows] = await pool.query(`
            SELECT
                v.Id_venta,
                v.Fecha,
                v.Total,
                p.nombre,
                d.Cantidad,
                d.Precio
            FROM venta v
            INNER JOIN detalle_venta d
                ON v.Id_venta = d.Id_venta
            INNER JOIN productos p
                ON d.Id_producto = p.id
            WHERE v.Id_cliente = ?
            ORDER BY v.Fecha DESC
        `, [idCliente]);

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// REPORTAR CLIENTE
export const reportarCliente = async (req, res) => {

    try {

        const idCliente = req.params.id;

        const { motivo } = req.body;

        const idAdmin = req.session.usuario?.id || null;

        if (!motivo) {
            return res.status(400).json({
                error: "Debe ingresar un motivo."
            });
        }

        await pool.query(
            `INSERT INTO reportes_clientes
            (id_cliente, id_admin, motivo)
            VALUES (?, ?, ?)`,
            [idCliente, idAdmin, motivo]
        );

        res.json({
            mensaje: "Cliente reportado correctamente."
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};

// BLOQUEAR CLIENTE
export const bloquearCliente = async (req, res) => {

    try {

        const id = req.params.id;

        await pool.query(
            `UPDATE clientes
             SET estado = 'Bloqueado'
             WHERE id = ?`,
            [id]
        );

        res.json({
            mensaje: "Cliente bloqueado correctamente."
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


// =========================
// CLIENTES NUEVOS DEL MES
// =========================



export const obtenerClientesNuevosMes = async (req, res) => {

try {

    const [rows] = await pool.query(`
        SELECT
            c.id AS id,
            u.Nombre AS nombre,
            u.Email AS correo,
            u.Celular AS telefono,
            c.tipo,
            c.nivel,
            c.estado,
            c.fechaRegistro

        FROM clientes c

        INNER JOIN usuario u
            ON c.id_usuario = u.Id_usuario

        WHERE MONTH(c.fechaRegistro) = MONTH(CURDATE())
        AND YEAR(c.fechaRegistro) = YEAR(CURDATE())

        ORDER BY c.fechaRegistro DESC
    `);

    res.json({
        cantidad: rows.length,
        clientes: rows
    });

} catch (error) {

    console.error(
        "ERROR SQL CLIENTES NUEVOS:",
        error.sqlMessage || error.message
    );

    res.status(500).json({
        ok: false,
        error: error.sqlMessage || error.message
    });

}


};
