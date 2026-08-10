import dotenv from "dotenv";
dotenv.config();


import transporter from "./app/config/mail.js";

async function pruebaCorreo(){

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, 

            subject: "Prueba BacoApp",

            html:`
            <h2>Correo de prueba</h2>

            <p>Si estas leyendo este correo, la configuracion funciona correctamente.</p>
        `});

        console.log("♠Correo enviado")


    } catch (error) {

        console.error(error);
        
    }
}

pruebaCorreo();