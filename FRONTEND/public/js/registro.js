const form = document.getElementById("registro-form");
const passwordInput = document.getElementById("password");

const requisitos = {
    longitud: document.getElementById("req-longitud"),
    mayuscula: document.getElementById("req-mayuscula"),
    minuscula: document.getElementById("req-minuscula"),
    numero: document.getElementById("req-numero"),
    especial: document.getElementById("req-especial")
};


// ==============================
// VALIDACIÓN EN TIEMPO REAL
// ==============================

passwordInput.addEventListener("input", () => {

    const password = passwordInput.value;

    const validaciones = {
        longitud: password.length >= 8,
        mayuscula: /[A-Z]/.test(password),
        minuscula: /[a-z]/.test(password),
        numero: /\d/.test(password),
        especial: /[@$!%*?&.#_-]/.test(password)
    };

    Object.entries(validaciones).forEach(([requisito, valido]) => {

        requisitos[requisito].textContent =
            `${valido ? "✅" : "❌"} ${obtenerTexto(requisito)}`;

        requisitos[requisito].style.color =
            valido ? "green" : "var(--gray)";
    });
});


function obtenerTexto(requisito) {

    const textos = {
        longitud: "Mínimo 8 caracteres.",
        mayuscula: "Una letra mayúscula.",
        minuscula: "Una letra minúscula.",
        numero: "Un número.",
        especial: "Un carácter especial."
    };

    return textos[requisito];
}


// ==============================
// REGISTRO
// ==============================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const password = passwordInput.value;

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

    if (!passwordRegex.test(password)) {

        alert(
            "La contraseña no cumple todos los requisitos."
        );

        return;
    }

    const data = {

        nombre: document.getElementById("username").value,
        usuario: document.getElementById("user").value,
        email: document.getElementById("email").value,
        password,
        celular: document.getElementById("celular").value

    };

    try {

        const response = await fetch(
            `${window.BACKEND_URL}/api/usuarios`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (!response.ok) {

            alert(result.message || "No se pudo registrar el usuario.");

            return;
        }

        alert("¡Registro exitoso!");

        form.reset();

        // Reiniciar requisitos
        Object.values(requisitos).forEach((element) => {

            element.style.color = "var(--gray)";

        });

        requisitos.longitud.textContent = "❌ Mínimo 8 caracteres.";
        requisitos.mayuscula.textContent = "❌ Una letra mayúscula.";
        requisitos.minuscula.textContent = "❌ Una letra minúscula.";
        requisitos.numero.textContent = "❌ Un número.";
        requisitos.especial.textContent = "❌ Un carácter especial.";

    } catch (error) {

        console.error(error);

        alert("Error al conectar con el servidor.");

    }

});