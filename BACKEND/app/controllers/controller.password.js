import crypto from "crypto";
import bcrypt from "bcrypt";
import pool from "../config/db.js";
import transporter from "../config/mail.js";

// Enviar correo de recuperación
export const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                ok: false,
                message: "Debe enviar un correo."
            });
        }

        const [usuarios] = await pool.query(
            "SELECT Id_usuario, Nombre, Email FROM usuario WHERE Email = ?",
            [email]
        );

        if (usuarios.length === 0) {
            return res.json({
                ok: true,
                message: "Si el correo está registrado, recibirá un enlace para restablecer la contraseña."
            });
        }

        const usuario = usuarios[0];

const token = crypto.randomBytes(32).toString("hex");
console.log("==================================");
console.log("Usuario:", usuario.Id_usuario);
console.log("Email:", usuario.Email);
console.log("Nuevo token:", token);
console.log("Expira en 20 minutos (UTC, calculado por MySQL)");

const [resultado] = await pool.query(
    `UPDATE usuario
     SET ResetToken = ?,
         ResetTokenExpira = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 20 MINUTE)
     WHERE Id_usuario = ?`,
    [token, usuario.Id_usuario]
);

console.log("Resultado UPDATE:", resultado);

const [verificar] = await pool.query(
    `SELECT ResetToken, ResetTokenExpira
     FROM usuario
     WHERE Id_usuario = ?`,
    [usuario.Id_usuario]
);

console.log("Datos guardados:", verificar);
console.log("==================================");

        const requestOrigin = req.get("origin") || "";
        const allowedOrigins = [
            "http://localhost:4000",
            process.env.FRONTEND_URL
        ].filter(Boolean).map(url => url.trim().replace(/\/$/, ""));

        const safeRequestOrigin = allowedOrigins.includes(requestOrigin.replace(/\/$/, ""))
            ? requestOrigin
            : "";
        const frontendUrl = (safeRequestOrigin || process.env.FRONTEND_URL || process.env.BASE_URL || "")
            .split(",")[0]
            .trim()
            .replace(/\/$/, "");

        if (!frontendUrl) {
            return res.status(500).json({
                ok: false,
                message: "Falta configurar FRONTEND_URL para recuperar la contraseña."
            });
        }

        const enlace = `${frontendUrl}/reset-password/${token}`;
  

        

await transporter.sendMail({
            from: "BacoApp <onboarding@resend.dev>",
            to: usuario.Email,
            subject: "Recuperación de contraseña - BacoApp",
            html: `
                <h2>Hola ${usuario.Nombre}</h2>

                <p>Haz clic en el siguiente botón para cambiar tu contraseña.</p>

                <a href="${enlace}"
                   style="
                        background:#6b21a8;
                        color:white;
                        padding:12px 20px;
                        text-decoration:none;
                        border-radius:8px;
                        display:inline-block;
                   ">
                   Restablecer contraseña
                </a>

                <p>Este enlace expirará en 20 minutos.</p>

                <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
            `
        });

        return res.json({
            ok: true,
            message: "Se envió el enlace de recuperación."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor."
        });

    }
};

// Verificar token

export const verificarToken = async (req, res) => {

    try {

        const { token } = req.params;

        const [usuarios] = await pool.query(
            `SELECT Id_usuario
             FROM usuario
             WHERE ResetToken = ?
             AND ResetTokenExpira > UTC_TIMESTAMP()`,
            [token]
        );

        if (usuarios.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "El enlace es inválido o ha expirado."
            });
        }

        return res.json({
            ok: true,
            message: "Token válido."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor."
        });

    }

};

// Cambiar contraseña
export const cambiaPassword = async (req, res) => {

    try {

        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({
                ok: false,
                message: "Debe completar todos los campos."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                ok: false,
                message: "Las contraseñas no coinciden."
            });
        }

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                ok: false,
                message: "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
            });
        }

        const [usuarios] = await pool.query(
            `SELECT *
             FROM usuario
             WHERE ResetToken = ?
             AND ResetTokenExpira > UTC_TIMESTAMP()`,
            [token]
        );

        if (usuarios.length === 0) {
            return res.status(400).json({
                ok: false,
                message: "El enlace es inválido o ha expirado."
            });
        }

        const usuario = usuarios[0];

        const hash = await bcrypt.hash(password, 10);

        await pool.query(
            `UPDATE usuario
             SET Password = ?,
                 ResetToken = NULL,
                 ResetTokenExpira = NULL
             WHERE Id_usuario = ?`,
            [hash, usuario.Id_usuario]
        );

        return res.json({
            ok: true,
            message: "La contraseña fue actualizada correctamente."
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            ok: false,
            message: "Error interno del servidor."
        });

    }

};
