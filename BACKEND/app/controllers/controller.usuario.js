import pool from "../config/db.js";

const usuarioSinPassword = (usuario) => {
    const { Password, password, ...datosUsuario } = usuario;
    return datosUsuario;
};


export const login = async (req, res) => {

    const { Usuario, password } = req.body;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM usuario WHERE Usuario = ? AND Password = ?",
            [Usuario, password]
        );

       if (rows.length > 0) {

            req.session.usuario = {
            Id_usuario: rows[0].Id_usuario,
            Nombre: rows[0].Nombre,
            Usuario: rows[0].Usuario,
            Email: rows[0].Email,
            Celular: rows[0].Celular,
            Documento: rows[0].Documento,
            Direccion: rows[0].Direccion,
            rol: rows[0].rol || rows[0].Rol
    };

    return res.json({
        ok: true,
        user: req.session.usuario
    });
}

        return res.json({
            ok: false,
            message: "Credenciales incorrectas"
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error: error.message
        });
    }
};

// LISTAR
export const listarUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM usuario"
        );

        res.json(rows.map(usuarioSinPassword));

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// OBTENER POR ID
export const obtenerUsuario = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM usuario WHERE Id_usuario = ?",
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(usuarioSinPassword(rows[0]));

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREAR
export const crearUsuario = async (req, res) => {
    try {
        const { nombre, usuario, email, password, celular } = req.body;
        const [columnas] = await pool.query("SHOW COLUMNS FROM usuario");
        const columnasValidas = new Set(columnas.map((columna) => columna.Field));
        const camposPermitidos = {
            Nombre: nombre,
            Usuario: usuario,
            Email: email,
            Password: password,
            Celular: celular,
            Rol: "cliente",
            rol: "cliente"
        };
        const campos = Object.entries(camposPermitidos)
            .filter(([campo]) => columnasValidas.has(campo))
            .filter(([, value]) => value !== undefined && value !== "");

        await pool.query(
            `INSERT INTO usuario (${campos.map(([campo]) => campo).join(", ")}) VALUES (${campos.map(() => "?").join(", ")})`,
            campos.map(([, value]) => value)
        );

        res.json({ message: "Usuario registrado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar usuario" });
    }
};

export const crearAdministrador = async (req, res) => {
    try {
        const {
            nombre,
            usuario,
            email,
            password,
            celular,
            documento,
            direccion
        } = req.body;

        if (!nombre || !usuario || !email || !password) {
            return res.status(400).json({ message: "Nombre, usuario, correo y contrasena son obligatorios" });
        }

        const [columnas] = await pool.query("SHOW COLUMNS FROM usuario");
        const columnasValidas = new Set(columnas.map((columna) => columna.Field));
        const camposPermitidos = {
            Nombre: nombre,
            Usuario: usuario,
            Email: email,
            Password: password,
            Celular: celular,
            Documento: documento,
            Direccion: direccion,
            Rol: "admin",
            rol: "admin"
        };

        const campos = Object.entries(camposPermitidos)
            .filter(([campo]) => columnasValidas.has(campo))
            .filter(([, value]) => value !== undefined && value !== "");

        const [result] = await pool.query(
            `INSERT INTO usuario (${campos.map(([campo]) => campo).join(", ")}) VALUES (${campos.map(() => "?").join(", ")})`,
            campos.map(([, value]) => value)
        );

        res.status(201).json({
            message: "Administrador registrado correctamente",
            id: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar administrador", error: error.message });
    }
};

// ACTUALIZAR
export const actualizarUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const camposPermitidos = {
            Nombre: req.body.Nombre,
            Usuario: req.body.Usuario,
            Email: req.body.Email,
            Password: req.body.Password || req.body.password,
            Celular: req.body.Celular,
            Documento: req.body.Documento,
            Direccion: req.body.Direccion,
            Rol: req.body.Rol || req.body.rol,
            rol: req.body.rol
        };

        const [columnas] = await pool.query("SHOW COLUMNS FROM usuario");
        const columnasValidas = new Set(columnas.map((columna) => columna.Field));

        const campos = Object.entries(camposPermitidos)
            .filter(([campo]) => columnasValidas.has(campo))
            .filter(([, value]) => value !== undefined)
            .map(([campo, value]) => ({ campo, value }));

        if (campos.length === 0) {
            return res.status(400).json({ error: "No hay datos para actualizar" });
        }

        const [result] = await pool.query(
            `UPDATE usuario SET ${campos.map(({ campo }) => `${campo} = ?`).join(", ")} WHERE Id_usuario = ?`,
            [...campos.map(({ value }) => value), id]
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
