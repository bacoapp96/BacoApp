const formLogin = document.getElementById("form-login");
const loginMessage = document.getElementById("login-message");

const showMessage = (message, isError = false) => {
    if (!loginMessage) return;
    loginMessage.textContent = message;
    loginMessage.classList.toggle("error", isError);
};

formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const Usuario = document.getElementById("Usuario").value.trim();
    const password = document.getElementById("password").value.trim();
    const submitBtn = formLogin.querySelector("button[type='submit']");

    showMessage("Validando acceso...");
    submitBtn.disabled = true;

    try {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ Usuario, password })
        });

        const data = await res.json();

        if (data.ok && data.user) {
            showMessage("Login correcto. Redirigiendo...");
            localStorage.setItem("bacoUser", JSON.stringify(data.user));

            const rol = data.user.rol?.trim().toLowerCase();
            window.location.href = rol === "admin" ? "/Dashboard" : "/Inicio";
            return;
        }

        showMessage(data.message || "Error en login", true);
    } catch (error) {
        console.error(error);
        showMessage("No se pudo conectar con el servidor de usuarios.", true);
    } finally {
        submitBtn.disabled = false;
    }
});
