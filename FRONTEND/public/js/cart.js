document.addEventListener("DOMContentLoaded", () => {
  const storageKey = "bacoapp_cart";
  const couponKey = "bacoapp_coupon";
  const cartSidebar = document.getElementById("cart-sidebar");
  const closeCartBtn = document.querySelector(".close-cart");
  const cartLinks = document.querySelectorAll('a[href="#carrito"]');
  const cartContainers = document.querySelectorAll("[data-cart-container], #carrito-contenido");
  const totalEls = document.querySelectorAll("[data-cart-total], #total-price");
  const subtotalEls = document.querySelectorAll("[data-cart-subtotal]");
  const discountEls = document.querySelectorAll("[data-cart-discount]");
  const shippingEls = document.querySelectorAll("[data-cart-shipping]");
  const countEls = document.querySelectorAll("[data-cart-count]");
  const recommendationEl = document.querySelector("[data-cart-recommendation]");
  const couponInput = document.getElementById("couponCode");

  let cart = readJson(storageKey, []);
  let coupon = localStorage.getItem(couponKey) || "";

  if (couponInput) couponInput.value = coupon;

  function readJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function saveCart() {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }

  function money(value) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  function normalizePrice(value) {
    return Number(String(value || "0").replace(/[^\d]/g, "")) || 0;
  }

  function getSummary() {
    const subtotal = cart.reduce((acc, item) => acc + (Number(item.precio) || 0) * (Number(item.cantidad) || 1), 0);
    const quantity = cart.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0);
    const discount = coupon.toUpperCase() === "BACO10" ? Math.round(subtotal * 0.1) : 0;
    const shipping = subtotal === 0 || subtotal >= 250000 ? 0 : 12000;
    const total = Math.max(subtotal - discount + shipping, 0);

    return { subtotal, quantity, discount, shipping, total };
  }

  function getProductData(button) {
    const name = button.dataset.nombre || button.dataset.titulo || button.closest("[data-product-card], .promo-card, .result-item")?.querySelector("h3")?.textContent;
    const price = normalizePrice(button.dataset.precio || button.dataset.price || button.dataset.descuento || 0);

    if (button.dataset.descuento && !button.dataset.precio) {
      return {
        nombre: `Promocion: ${name}`,
        precio: 0,
        tipo: "Promocion"
      };
    }

    return {
      nombre: name?.trim(),
      precio: price,
      tipo: button.dataset.tipo || "Producto"
    };
  }

  function addItem(item) {
    if (!item.nombre) return;

    const existingItem = cart.find((cartItem) => cartItem.nombre === item.nombre);
    if (existingItem) {
      existingItem.cantidad += 1;
    } else {
      cart.push({ ...item, cantidad: 1 });
    }

    saveCart();
    renderCart();
    openCart();
  }

  function renderCart() {
    const { subtotal, quantity, discount, shipping, total } = getSummary();

    cartContainers.forEach((container) => {
      container.innerHTML = cart.length ? cart.map(renderCartItem).join("") : renderEmptyCart();
    });

    totalEls.forEach((el) => {
      el.textContent = `Total: ${money(total)}`;
    });

    subtotalEls.forEach((el) => {
      el.textContent = money(subtotal);
    });

    discountEls.forEach((el) => {
      el.textContent = discount ? `-${money(discount)}` : money(0);
    });

    shippingEls.forEach((el) => {
      el.textContent = shipping ? money(shipping) : "Gratis";
    });

    countEls.forEach((el) => {
      el.textContent = quantity;
    });

    if (recommendationEl) {
      recommendationEl.textContent = subtotal >= 250000
        ? "Tu envio queda gratis. Puedes agregar hielo, gaseosas o snacks para completar la compra."
        : `Te faltan ${money(250000 - subtotal)} para envio gratis.`;
    }
  }

  function renderCartItem(item, index) {
    const price = Number(item.precio) || 0;
    const quantity = Number(item.cantidad) || 1;

    return `
      <article class="item-carrito" data-index="${index}">
        <div class="cart-item-icon">
          <i class="fa-solid fa-wine-bottle"></i>
        </div>
        <div class="info-producto">
          <p>${escapeHtml(item.nombre)}</p>
          <span class="precio-producto">${money(price)}</span>
          <small>${escapeHtml(item.tipo || "Producto")} - ${money(price * quantity)}</small>
        </div>
        <div class="cantidad-controles" aria-label="Cantidad">
          <button class="btn-disminuir" type="button" data-index="${index}">-</button>
          <span class="cantidad">${quantity}</span>
          <button class="btn-aumentar" type="button" data-index="${index}">+</button>
        </div>
        <button class="btn-eliminar" type="button" data-index="${index}">
          <i class="fa-solid fa-trash"></i>
        </button>
      </article>
    `;
  }

  function renderEmptyCart() {
    return `
      <div class="cart-empty">
        <i class="fa-solid fa-cart-shopping"></i>
        <strong>Tu carrito esta vacio</strong>
        <span>Agrega productos desde Inicio o Categorias para preparar tu pedido.</span>
      </div>
    `;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function openCart() {
    cartSidebar?.classList.add("open");
  }

  function closeCart() {
    cartSidebar?.classList.remove("open");
  }

  cartLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (cartSidebar) {
        event.preventDefault();
        openCart();
      }
    });
  });

  closeCartBtn?.addEventListener("click", closeCart);

  document.querySelectorAll(".btn-agregar").forEach((button) => {
    button.addEventListener("click", () => addItem(getProductData(button)));
  });

  document.addEventListener("click", (event) => {
    const actionButton = event.target.closest(".btn-aumentar, .btn-disminuir, .btn-eliminar");
    if (!actionButton) return;

    const index = Number(actionButton.dataset.index);
    if (!cart[index]) return;

    if (actionButton.classList.contains("btn-aumentar")) {
      cart[index].cantidad += 1;
    }

    if (actionButton.classList.contains("btn-disminuir")) {
      cart[index].cantidad = Math.max((cart[index].cantidad || 1) - 1, 0);
      if (cart[index].cantidad === 0) cart.splice(index, 1);
    }

    if (actionButton.classList.contains("btn-eliminar")) {
      cart.splice(index, 1);
    }

    saveCart();
    renderCart();
  });

  document.getElementById("btn-vaciar")?.addEventListener("click", () => {
    if (!cart.length || confirm("Deseas vaciar todo el carrito?")) {
      cart = [];
      saveCart();
      renderCart();
    }
  });

  document.getElementById("btn-seguir")?.addEventListener("click", closeCart);

  document.getElementById("applyCoupon")?.addEventListener("click", () => {
    coupon = couponInput?.value.trim().toUpperCase() || "";
    localStorage.setItem(couponKey, coupon);
    renderCart();
    alert(coupon === "BACO10" ? "Cupon aplicado: 10% de descuento." : "Cupon guardado. Prueba BACO10 para ver el descuento demo.");
  });

  document.getElementById("clearCoupon")?.addEventListener("click", () => {
    coupon = "";
    localStorage.removeItem(couponKey);
    if (couponInput) couponInput.value = "";
    renderCart();
  });

  document.getElementById("btn-pagar")?.addEventListener("click", () => {
    if (!cart.length) {
      alert("Tu carrito esta vacio.");
      return;
    }

    alert("Pedido preparado. El siguiente paso recomendado es conectar checkout, metodo de pago y direccion de entrega.");
  });

  renderCart();
});
