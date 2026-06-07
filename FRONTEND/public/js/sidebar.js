document.addEventListener("DOMContentLoaded", () => {
  let menuBtn = document.getElementById("menu-btn");
  const sidebar = document.querySelector(".sidebar");

  if (!sidebar) return;

  if (!sidebar.id) {
    sidebar.id = "sidebar";
  }

  if (!menuBtn) {
    menuBtn = document.createElement("button");
    menuBtn.id = "menu-btn";
    menuBtn.className = "menu-btn";
    menuBtn.type = "button";
    menuBtn.setAttribute("aria-label", "Abrir menu");
    menuBtn.textContent = "☰";
    document.body.prepend(menuBtn);
  }

  let overlay = document.getElementById("overlay");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.className = "overlay";
    document.body.appendChild(overlay);
  }

  let closeBtn = document.getElementById("close-btn");

  if (!closeBtn) {
    closeBtn = document.createElement("button");
    closeBtn.id = "close-btn";
    closeBtn.className = "close-btn";
    closeBtn.type = "button";
    closeBtn.setAttribute("aria-label", "Cerrar menu");
    closeBtn.textContent = "×";
    sidebar.prepend(closeBtn);
  }

  const openSidebar = () => {
    sidebar.classList.add("active", "open");
    overlay.classList.add("active");
    menuBtn.classList.add("hide");
  };

  const closeSidebar = () => {
    sidebar.classList.remove("active", "open");
    overlay.classList.remove("active");
    menuBtn.classList.remove("hide");
  };

  menuBtn.addEventListener("click", openSidebar);
  closeBtn.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSidebar();
    }
  });

  // Limpiar localStorage al cerrar sesión
  const logoutLinks = document.querySelectorAll('a[href="/Index"], a[href="/index"]');
  logoutLinks.forEach(link => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      await fetch("/api/logout", { method: "POST" });
      localStorage.removeItem("bacoUser");
      window.location.href = "/login";
    });
  });
});
