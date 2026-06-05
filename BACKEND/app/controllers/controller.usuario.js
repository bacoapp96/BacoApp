import pool from "../config/db.js";



export const login = async (req, res) => {

    const { Usuario, password } = req.body;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM usuario WHERE Usuario = ? AND Password = ?",
            [Usuario, password]
        );

        if (rows.length > 0) {

            return res.json({
                ok: true,
                user: {
                    Usuario: rows[0].Usuario,
                    rol: rows[0].rol
                }
            });

        }

        return res.json({
            ok: false,
            message: "Credenciales incorrectas"
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
};

// LISTAR
export const listarUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT Id_usuario, Nombre, Usuario, Email, rol FROM usuario"
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// OBTENER POR ID
export const obtenerUsuario = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT Id_usuario, Nombre, Usuario, Email, rol FROM usuario WHERE Id_usuario = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(rows[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREAR
export const crearUsuario = async (req, res) => {
    try {
        const { nombre, usuario, email, password, celular} = req.body;

        const query = `
            INSERT INTO usuario (Nombre, Usuario, Email, Password, Celular, Rol)
            VALUES (?, ?, ?, ?, ?, 'cliente')
        `;

        await pool.query(query, [nombre, usuario, email, password, celular]);

        res.json({ message: "Usuario registrado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar usuario" });
    }
};

// ACTUALIZAR
export const actualizarUsuario = async (req, res) => {
    try {
        const { Nombre, Usuario, Email, Password, rol } = req.body;
        const id = req.params.id;

        const [result] = await pool.query(
            "UPDATE usuario SET Nombre = ?, Usuario = ?, Email = ?, Password = ?, rol = ? WHERE Id_usuario = ?",
            [Nombre, Usuario, Email, Password, rol, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ mensaje: "Usuario actualizado" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ELIMINAR
export const eliminarUsuario = async (req, res) => {
    try {
        const id = req.params.id;

        const [result] = await pool.query(
            "DELETE FROM usuario WHERE Id_usuario = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ mensaje: "Usuario eliminado" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};