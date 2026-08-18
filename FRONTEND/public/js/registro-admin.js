document.getElementById("formAdmin").addEventListener("submit", async function (e) {

    e.preventDefault();

    const nombre = document.getElementById("NombreAdmin").value.trim();
    const documento = document.getElementById("DocumentoAdmin").value.trim();
    const email = document.getElementById("EmailAdmin").value.trim();
    const usuario = document.getElementById("UsuarioAdmin").value.trim();
    const password = document.getElementById("PasswordAdmin").value.trim();
    const codigo = document.getElementById("CodigoAuth").value.trim();

    const mensaje = document.getElementById("mensaje");

    // Validar campos
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
        mensaje.textContent = "Todos los campos son obligatorios.";
        return;
    }

    // Validar código de autorización
    if (codigo !== "ADMIN001") {
        mensaje.style.display = "block";
        mensaje.className = "error";
        mensaje.textContent = "Código de autorización inválido.";
        return;
    }

    try {

        const payload = {
            nombre,
            documento,
            email,
            usuario,
            password
        };

        console.log("Enviando administrador:", payload);
        console.log("BACKEND_URL:", window.BACKEND_URL);

        const response = await fetch(
            `${window.BACKEND_URL}/api/usuarios/admin`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();

        console.log("Respuesta del servidor:", response.status, data);

        if (!response.ok) {
            throw new Error(
                data.message || "No se pudo registrar el administrador."
            );
        }

        mensaje.style.display = "block";
        mensaje.className = "exito";
        mensaje.textContent =
            "¡Administrador registrado correctamente! Redirigiendo al login...";

        document.getElementById("formAdmin").reset();

        setTimeout(() => {
            window.location.href = "/login?rol=admin";
        }, 2000);

    } catch (error) {

        console.error("Error al registrar administrador:", error);

        mensaje.style.display = "block";
        mensaje.className = "error";
        mensaje.textContent =
            error.message || "Error al conectar con el servidor.";
    }
});