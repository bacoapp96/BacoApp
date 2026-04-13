document.getElementById("formAdmin").addEventListener("submit", function(e) {

    e.preventDefault(); 

    
    let nombre = document.getElementById("NombreAdmin").value.trim();
    let documento = document.getElementById("DocumentoAdmin").value.trim();
    let email = document.getElementById("EmailAdmin").value.trim();
    let usuario = document.getElementById("UsuarioAdmin").value.trim();
    let password = document.getElementById("PasswordAdmin").value.trim();
    let codigo = document.getElementById("CodigoAuth").value.trim();

    let mensaje = document.getElementById("mensaje");

  
    if (
        nombre === "" ||
        documento === "" ||
        email === "" ||
        usuario === "" ||
        password === "" ||
        codigo === ""
    ) {
        mensaje.style.display = "block";
        mensaje.className = "error";
        mensaje.textContent = " Todos los campos son obligatorios.";
        return;
    }

   
    if (codigo !== "ADMIN001") {
        mensaje.style.display = "block";
        mensaje.className = "error";
        mensaje.textContent = " Código de autorización inválido.";
        return;
    }


    mensaje.style.display = "block";
    mensaje.className = "exito";
    mensaje.textContent = " ¡Registro exitoso! Bienvenido administrador.";

   
    document.getElementById("formAdmin").reset();
});
