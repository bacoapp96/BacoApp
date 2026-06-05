
document.getElementById("registro-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        nombre: document.getElementById("username").value,
        usuario: document.getElementById("user").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        celular: document.getElementById("celular").value
    };

    try {
        const response = await fetch("http://localhost:3000/api/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        alert(result.message);

       
        document.getElementById("formRegistro").reset();

    } catch (error) {
        console.error("Error:", error);
    }
});