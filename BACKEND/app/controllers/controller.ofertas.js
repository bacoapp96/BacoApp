
import {
    obtenerOfertas,
    obtenerOfertaPorId,
    crearOferta,
    actualizarOferta,
    eliminarOferta
} from "../models/ofertas.models.js";

// GET ALL
export const getOfertas = async (req, res) => {
    try {
        const ofertas = await obtenerOfertas();
        res.json(ofertas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener ofertas" });
    }
};

// GET ONE
export const getOferta = async (req, res) => {
    try {
        const oferta = await obtenerOfertaPorId(req.params.id);

        if (!oferta) {
            return res.status(404).json({ message: "No encontrada" });
        }

        res.json(oferta);

    } catch (error) {
        res.status(500).json({ message: "Error al obtener la oferta" });
    }
};

// CREATE
export const postOferta = async (req, res) => {
    try {
        const result = await crearOferta(req.body);

        res.json({
            message: "Oferta creada",
            id: result.insertId
        });

    } catch (error) {
        res.status(500).json({ message: "Error al crear la oferta" });
    }
};

// UPDATE
export const putOferta = async (req, res) => {
    try {
        await actualizarOferta(req.params.id, req.body);

        res.json({ message: "Oferta actualizada" });

    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la oferta" });
    }
};

// DELETE
export const deleteOferta = async (req, res) => {
    try {
        await eliminarOferta(req.params.id);

        res.json({ message: "Oferta eliminada" });

    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la oferta" });
    }
};