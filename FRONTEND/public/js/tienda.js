const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const closeBtn = document.getElementById("close-btn");

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

const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.querySelector(".close-cart");

document.querySelector('a[href="#carrito"]').addEventListener("click", () => {
  cartSidebar.classList.add("open");
});

closeCartBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
});

document.querySelectorAll(".btn-agregar").forEach(boton => {
  boton.addEventListener("click", () => {
    const nombre = boton.dataset.nombre;
    const precio = parseInt(boton.dataset.precio);
    agregarAlCarrito(nombre, precio);
  });
});

function agregarAlCarrito(nombre, precio) {
  const contenedor = document.getElementById("carrito-contenido");

  const item = document.createElement("div");
  item.classList.add("item-carrito");

  item.innerHTML = `
    <div class="info-producto">
      <p>${nombre}</p>
      <span class="precio-producto" data-precio="${precio}">$${precio.toLocaleString()}</span>
    </div>

    <div class="cantidad-controles">
      <button class="btn-disminuir">-</button>
      <span class="cantidad">1</span>
      <button class="btn-aumentar">+</button>
    </div>

    <button class="btn-eliminar">Eliminar</button>
  `;

  contenedor.appendChild(item);

  actualizarTotal();
}



document.querySelector(".cart-items").addEventListener("click", e => {
  const item = e.target.closest(".item-carrito");

  if (!item) return;

  const cantidadSpan = item.querySelector(".cantidad");
  const precio = parseInt(item.querySelector(".precio-producto").dataset.precio);
  let cantidad = parseInt(cantidadSpan.textContent);

  
  if (e.target.classList.contains("btn-aumentar")) {
    cantidad++;
    cantidadSpan.textContent = cantidad;
    actualizarTotal();
  }

 
  else if (e.target.classList.contains("btn-disminuir")) {
    if (cantidad > 1) {
      cantidad--;
      cantidadSpan.textContent = cantidad;
      actualizarTotal();
    }
  }

  
  else if (e.target.classList.contains("btn-eliminar")) {
    item.remove();
    actualizarTotal();
  }
});


function actualizarTotal() {
  let total = 0;

  document.querySelectorAll("#carrito-contenido .item-carrito").forEach(item => {
    const precio = parseInt(item.querySelector(".precio-producto").dataset.precio);
    const cantidad = parseInt(item.querySelector(".cantidad").textContent);
    total += precio * cantidad;
  });

  document.getElementById("total-price").textContent =
    `Total: $${total.toLocaleString()}`;
}
