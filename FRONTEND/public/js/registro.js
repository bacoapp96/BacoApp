document.getElementById("registro-form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const password = document.getElementById("password").value;

    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

    if (!passwordRegex.test(password)) {

        alert("La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.");

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

        const response = await fetch("http://localhost:3000/api/usuarios",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(data)

        });

        const result = await response.json();

       if (!response.ok) {
            alert(result.message);
                return;
}

        if(response.ok){

            document.getElementById("registro-form").reset();

        }

    }catch(error){

        console.error(error);

        alert("Error al conectar con el servidor");

    }

});