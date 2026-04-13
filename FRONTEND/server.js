import express from 'express';
import ejs from "ejs";
import routes from "./app/routes/routes.views.js";


const app = express();
const PORT = 4000;

//archivos estaticos
app.use(express.static("public"));

//configuracion de ejs
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});