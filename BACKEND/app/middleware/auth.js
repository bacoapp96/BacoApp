import 'dotenv/config';

export const verificarFirmaFrontend = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No autorizado. Firma ausente." });
    }

    const token = authHeader.split(" ")[1];
    const backendSecret = process.env.BACKEND_SECRET_KEY || "clave_firma_seguridad_bacoapp";
    if (token !== backendSecret) {
        return res.status(401).json({ error: "No autorizado. Firma inválida." });
    }

    // El backend confía en las cabeceras provistas por el frontend seguro
    req.usuarioAutenticado = {
        id: req.headers["x-user-id"] ? Number(req.headers["x-user-id"]) : null,
        rol: req.headers["x-user-role"] || null
    };

    next();
};

export const requiereAdmin = (req, res, next) => {

    const rol = req.usuarioAutenticado?.rol?.trim().toLowerCase();

    if (rol !== "admin" && rol !== "administrador") {
        return res.status(403).json({
            error: "Prohibido. Requiere rol de administrador."
        });
    }

    next();
};
export const requiereUsuarioLogueado = (req, res, next) => {
    if (!req.usuarioAutenticado || !req.usuarioAutenticado.id) {
        return res.status(403).json({ error: "Prohibido. Requiere estar autenticado." });
    }
    next();
};
