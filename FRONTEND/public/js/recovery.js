// Capturamos el formulario
const form = document.getElementById("recoveryForm");

// Capturamos el mensaje
const message = document.getElementById("message");

// Evento submit
form.addEventListener("submit", function(event){

    // Evita que la página se recargue
    event.preventDefault();

    // Capturamos el email
    const email = document.getElementById("email").value;

    // Validación simple
    if(email === ""){

        message.textContent = "Por favor ingresa un correo";

        message.style.color = "red";

        return;
    }

    // Validación de formato
    if(!email.includes("@")){

        message.textContent = "Correo inválido";

        message.style.color = "red";

        return;
    }

    // Simulación de envío
    message.textContent =
    "Se envió un enlace de recuperación a tu correo";

    message.style.color = "green";

});