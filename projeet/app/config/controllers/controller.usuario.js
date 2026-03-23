import pool from "../config/db.js";

export const listarUsuarios = async(req, res) => { res.send("mostrando todos los usuario")};
export const obtenerUsuario = async(req, res) => {res.send("obtener un usuario") };
export const crearUsuario = async(req, res) => {res.send("crear usuario") };
export const actualiceUsuario = async(req, res) => {res.send("actualizar usuario") };
export const elimineUsuario = async(req, res) => {res.send("eliminar usuarios") };
