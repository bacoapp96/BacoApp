import dotenv from "dotenv";
dotenv.config();

import transporter from "./app/config/mail.js";

async function pruebaCorreo() {
    try {
        await transporter.emails.send({
            from: "BacoApp <onboarding@resend.dev>",
            to: process.env.EMAIL_USER,

            subject: "Prueba BacoApp",

            html: `
                <h2>Correo de prueba</h2>
                <p>Si estás leyendo este correo, la configuración funciona correctamente.</p>
            `
        });

        console.log("Correo enviado");

    } catch (error) {
        console.error(error);
    }
}

pruebaCorreo();