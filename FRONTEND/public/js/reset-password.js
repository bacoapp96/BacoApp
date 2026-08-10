

const form = document.getElementById("resetForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {

        mensaje.innerHTML = `
            <div class="alert alert-error">
                Las contraseñas no coinciden.
            </div>
        `;

        return;
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

    if (!passwordRegex.test(password)) {

        mensaje.innerHTML = `
            <div class="alert alert-error">
                La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
            </div>
        `;

        return;
    }

   const token = window.location.pathname.split("/").pop();

    console.log(token);

    try {

        const response = await fetch(
            `https://bacoapp.onrender.com/api/password/reset-password/${token}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    password,
                    confirmPassword
                })
            }
        );

        const data = await response.json();

        if (data.ok) {

            mensaje.innerHTML = `
                <div class="alert alert-success">
                    ${data.message}
                </div>
            `;

            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);

        } else {

            mensaje.innerHTML = `
                <div class="alert alert-error">
                    ${data.message}
                </div>
            `;

        }

    } catch (error) {

        console.error(error);

        mensaje.innerHTML = `
            <div class="alert alert-error">
                Ocurrió un error al cambiar la contraseña.
            </div>
        `;

    }

});

