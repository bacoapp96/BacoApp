
// BUSCADOR FAQ

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {

        const text = item.innerText.toLowerCase();

        if(text.includes(value)){

            item.style.display = "block";

        }else{

            item.style.display = "none";

        }

    });

});

// BOTONES SOPORTE

const helpButtons = document.querySelectorAll(".help-btn");

helpButtons.forEach(button => {

    button.addEventListener("click", () => {

        alert("Función disponible próximamente");

    });

});

// ENVIAR REPORTE

const sendBtn = document.querySelector(".send-btn");

sendBtn.addEventListener("click", () => {

    const textarea = document.querySelector("textarea");

    if(textarea.value.trim() === ""){

        alert("Describe el problema primero");

        return;

    }

    alert("Reporte enviado correctamente");

    textarea.value = "";

});
