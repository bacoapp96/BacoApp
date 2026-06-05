
document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       MENU
    ========================= */

    const menuBtn =
    document.getElementById("menu-btn");

    const sidebar =
    document.getElementById("sidebar");

    const closeBtn =
    document.getElementById("close-btn");

    const overlay =
    document.getElementById("overlay");

    function abrirMenu(){

        sidebar.classList.add("active");

        overlay.classList.add("active");

        menuBtn.classList.add("hide");

    }

    function cerrarMenu(){

        sidebar.classList.remove("active");

        overlay.classList.remove("active");

        menuBtn.classList.remove("hide");

    }

    menuBtn.addEventListener(
        "click",
        abrirMenu
    );

    closeBtn.addEventListener(
        "click",
        cerrarMenu
    );

    overlay.addEventListener(
        "click",
        cerrarMenu
    );

    document.addEventListener("keydown", (e) => {

        if(e.key === "Escape"){

            cerrarMenu();

        }

    });

    /* =========================
       SEARCH CATEGORÍAS
    ========================= */

    const searchInput =
    document.querySelector(".search input");

    const categoryCards =
    document.querySelectorAll(".category-card");

    searchInput.addEventListener("input", () => {

        const texto =
        searchInput.value
        .toLowerCase()
        .trim();

        categoryCards.forEach(card => {

            const nombre =
            card.querySelector("h3")
            .textContent
            .toLowerCase();

            if(nombre.includes(texto)){

                card.style.display = "block";

            }else{

                card.style.display = "none";

            }

        });

    });

});

