import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// BACKEND/middleware
//        ↓
// PROYECTO
//        ↓
// FRONTEND/public/img/productos

const carpetaProductos = path.resolve(
    __dirname,
    "../../public/img/productos"
);

// Crear la carpeta si no existe
if (!fs.existsSync(carpetaProductos)) {
    fs.mkdirSync(carpetaProductos, {
        recursive: true
    });
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, carpetaProductos);

    },

    filename: (req, file, cb) => {

        const extension = path
            .extname(file.originalname)
            .toLowerCase();

        const nombre = path
            .basename(file.originalname, extension)
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .toLowerCase();

        const nombreArchivo =
            `${nombre}-${Date.now()}${extension}`;

        cb(null, nombreArchivo);

        console.log("ARCHIVO QUE MULTER VA A GUARDAR:");
console.log(nombreArchivo);

    }

});

const fileFilter = (req, file, cb) => {

    const extensionesPermitidas = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
        ".jfif"
    ];

    const extension = path
        .extname(file.originalname)
        .toLowerCase();

    if (!extensionesPermitidas.includes(extension)) {

        return cb(
            new Error(
                "Solo se permiten imágenes JPG, JPEG, PNG o WEBP"
            )
        );

    }

    cb(null, true);

};

export const uploadProducto = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024
    }

});