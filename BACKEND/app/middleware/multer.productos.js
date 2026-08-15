import multer from "multer";
import path from "path";

// Usamos memoria porque la imagen se enviará directamente a Cloudinary.
// Ya NO necesitamos guardar archivos físicamente en Railway.

const storage = multer.memoryStorage();

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
                "Solo se permiten imágenes JPG, JPEG, PNG, WEBP o JFIF"
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