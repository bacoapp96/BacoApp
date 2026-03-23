import express from "express";
import routerUsuario from "./app/config/controllers/models/routes/routes.usuario.js";
const app = express();
const PORT = 3000

//Middleware para parsear JSON
app.use(express.json())

//rutas

app.use("/api", routerUsuario);

app.get("/", (req, res)=>{res.json({message : "el servidor esta funcionando"})})

app.listen(PORT, ()=>{console.log("el servidor esta corriendo en el puerto: "+PORT)})