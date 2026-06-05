document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("product-search");
  const clearSearch = document.getElementById("clear-search");
  const searchStatus = document.getElementById("search-status");
  const cards = Array.from(document.querySelectorAll("[data-product-card]"));

  if (!searchInput || !cards.length) return;

  const noResults = document.createElement("p");
  noResults.className = "no-results is-hidden";
  noResults.textContent = "No encontramos productos con esa busqueda.";

  const productGrid = document.getElementById("contenedor-productos");
  if (productGrid) {
    productGrid.appendChild(noResults);
  }

  const normalize = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const filterProducts = () => {
    const query = normalize(searchInput.value);
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = normalize(card.dataset.search || card.textContent);
      const isVisible = !query || text.includes(query);
      card.classList.toggle("is-hidden", !isVisible);

      if (isVisible) {
        visibleCount += 1;
      }
    });

    if (searchStatus) {
      searchStatus.textContent = query
        ? `${visibleCount} resultado(s) para "${searchInput.value.trim()}".`
        : "Explora lo mas vendido de la tienda.";
    }

    noResults.classList.toggle("is-hidden", !query || visibleCount > 0);
  };

  searchInput.addEventListener("input", filterProducts);

  if (clearSearch) {
    clearSearch.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      filterProducts();
    });
  }
});
