import pool from "../config/db.js";
import bcrypt from "bcrypt";

const usuarioSinPassword = (usuario) => {
    const { Password, password, ...datosUsuario } = usuario;
    return datosUsuario;
};


export const login = async (req, res) => {

    const { Usuario, password } = req.body;
    

    try {
        const [rows] = await pool.query(
             `SELECT 
             u.*,
             c. id AS Id_cliente,
             c.tipo,
             c.estado,
             c.nivel,
             c.cupoCredito,
             c.compras,
             c.totalGastado
             FROM usuario u
             LEFT JOIN clientes c
             ON c.Id_usuario = u.Id_usuario
             WHERE u.Usuario = ? `,
            [Usuario]
        );

       if (rows.length > 0) {

            const usuarioEncontrado = rows[0];
            const passwordGuardada = usuarioEncontrado.Password || usuarioEncontrado.password || "";
            const passwordValida = passwordGuardada.startsWith("$2")
                ? await bcrypt.compare(password || "", passwordGuardada)
                : password === passwordGuardada;

            if (!passwordValida) {
                return res.status(401).json({
                    ok: false,
                    message: "Credenciales incorrectas"
                });
            }

            // Compatibilidad con cuentas antiguas que aún guardaban la clave en
            // texto plano: tras un inicio de sesión válido quedan migradas.
            if (!passwordGuardada.startsWith("$2")) {
                const hash = await bcrypt.hash(password, 10);
                await pool.query(
                    "UPDATE usuario SET Password = ? WHERE Id_usuario = ?",
                    [hash, usuarioEncontrado.Id_usuario]
                );
            }

            req.session.usuario = {
            
            Id_usuario: rows[0].Id_usuario,
            Id_cliente: rows[0].Id_cliente,

            Nombre: rows[0].Nombre,
            Usuario: rows[0].Usuario,
            Email: rows[0].Email,
            Celular: rows[0].Celular,
            Documento: rows[0].Documento,
            Direccion: rows[0].Direccion,

            rol: rows[0].rol || rows[0].Rol,

            tipo: rows[0].tipo,
            estado: rows[0].estado,
            nivel: rows[0].nivel,
            cupoCredito: rows[0].cupoCredito,
            compras: rows[0].compras,
            totalGastado: rows[0].totalGastado 
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
    `SELECT
        u.*,
        c.id AS Id_cliente,
        c.tipo,
        c.estado,
        c.nivel,
        c.cupoCredito,
        c.compras,
        c.totalGastado,
        c.observaciones
    FROM usuario u
    LEFT JOIN clientes c
        ON u.Id_usuario = c.Id_usuario
    WHERE u.Id_usuario = ?`,
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

    if (!nombre || !usuario || !email || !password || !celular) {
      return res.status(400).json({
        ok: false,
        message: "Todos los campos son obligatorios."
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        ok: false,
        message: "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial."
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO usuario (Nombre, Usuario, Email, Password, Celular, rol)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, usuario, email, passwordHash, celular, "cliente"]
    );

    // Crea el cliente automaticamente

    await pool.query(
        `INSERT INTO clientes
        (Id_usuario, tipo, estado, nivel, cupoCredito, compras, totalGastado)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            result.insertId,
            "Nuevo",
            "Activo",
            "Bronce",
            0,
            0,
            0
        ]
    );



    return res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente.",
      id: result.insertId
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    return res.status(500).json({
      ok: false,
      message: "Error al registrar usuario."
    });
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
        const passwordRegex =
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

if (!passwordRegex.test(password)) {
    return res.status(400).json({
        message: "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
    });
}

const passwordHash = await bcrypt.hash(password, 10);

        if (!nombre || !usuario || !email || !password) {
            return res.status(400).json({ message: "Nombre, usuario, correo y contrasena son obligatorios" });
        }

        const [columnas] = await pool.query("SHOW COLUMNS FROM usuario");
        const columnasValidas = new Set(columnas.map((columna) => columna.Field));
        const camposPermitidos = {
            Nombre: nombre,
            Usuario: usuario,
            Email: email,
            Password: passwordHash,
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
