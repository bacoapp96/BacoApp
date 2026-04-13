document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();

    const Usuario = document.getElementById("Usuario").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:3000/api/usuarios/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Usuario,
                password
            })
        });

       
        console.log("STATUS:", res.status);

        const data = await res.json();
        console.log("DATA:", data);

    
    if (data.ok && data.user) {

    console.log("ROL QUE LLEGA:", data.user.rol);

    alert("Login correcto");

    const rol = data.user.rol?.trim().toLowerCase();

    if (rol === "admin") {
    window.location.href = "http://localhost:4000/Administrador";
    } else {
    window.location.href = "http://localhost:4000/Tienda";
}

}
    else {
            alert(data.message || "Error en login");
        }

    } catch (error) {
        console.error(error);
        alert("Error en el servidor");
    }
});