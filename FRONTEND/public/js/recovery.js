// Capturamos el formulario
const form = document.getElementById("recoveryForm");

// Capturamos el mensaje
const message = document.getElementById("message");

// Evento submit
form.addEventListener("submit", async (event) => {

    // Evita que la página se recargue
    event.preventDefault();

    // Capturamos el correo
    const email = document.getElementById("email").value.trim();

    // Validación simple
    if (email === "") {

        message.textContent = "Por favor ingresa un correo.";
        message.style.color = "red";
        return;

    }

    // Validación de formato
    if (!email.includes("@")) {

        message.textContent = "Correo inválido.";
        message.style.color = "red";
        return;

    }

    try {

        // Enviar el correo al backend
        const response = await fetch(`${window.BACKEND_URL}/api/password/forgot`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email
            })

        });

        const data = await response.json();

        // Mostrar el mensaje recibido del backend
        message.textContent = data.message;

        if (data.ok) {

            message.style.color = "green";

            // Limpia el formulario
            form.reset();

        } else {

            message.style.color = "red";

        }

    } catch (error) {

        console.error(error);

        message.textContent = "No fue posible conectar con el servidor.";
        message.style.color = "red";

    }

});