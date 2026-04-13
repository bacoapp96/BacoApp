    
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("close-btn");
const searchInput = document.querySelector(".search input");
const categoryCards = document.querySelectorAll(".category-card");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.querySelector(".close-cart");
const btnCarrito = document.querySelector('a[href="#carrito"]');


if (btnCarrito && cartSidebar) {
  btnCarrito.addEventListener("click", () => {
    cartSidebar.classList.add("open");
  });
}


if (closeCartBtn && cartSidebar) {
  closeCartBtn.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
  });
}

menuBtn.addEventListener("click", () => {
    sidebar.classList.add("open");
});


closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("open");
});


document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.remove("open");
    }
});


document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });
});

searchInput.addEventListener("input", () => {
    const texto = searchInput.value.toLowerCase().trim();

    categoryCards.forEach(card => {
        const nombre = card.querySelector("h3").textContent.toLowerCase();

        if (nombre.includes(texto)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});


