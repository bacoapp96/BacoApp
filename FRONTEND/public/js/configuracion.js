document.addEventListener("DOMContentLoaded", () => {
    const toggles = document.querySelectorAll(".toggle");
    const themes = document.querySelectorAll(".theme[data-theme-option]");
    const saveBtn = document.querySelector(".save-btn");
    const backupBtn = document.querySelector(".backup-btn");
    const securityBtns = document.querySelectorAll(".security-btn");
    const dangerBtn = document.querySelector(".danger-btn");

    const syncActiveTheme = () => {
        const currentTheme = window.BacoTheme?.get?.() || "dark";
        themes.forEach((theme) => {
            theme.classList.toggle("active-theme", theme.dataset.themeOption === currentTheme);
        });
    };

    toggles.forEach((toggle) => {
        toggle.addEventListener("click", () => {
            toggle.classList.toggle("active");
        });
    });

    themes.forEach((theme) => {
        theme.addEventListener("click", () => {
            window.BacoTheme?.set?.(theme.dataset.themeOption);
            syncActiveTheme();
        });
    });

    document.addEventListener("bacoapp:themechange", syncActiveTheme);

    saveBtn?.addEventListener("click", () => {
        alert("Configuracion guardada correctamente.");
    });

    backupBtn?.addEventListener("click", () => {
        alert("Respaldo creado exitosamente.");
    });

    securityBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (btn.textContent.includes("Cerrar")) {
                alert("Todas las sesiones fueron cerradas.");
            } else {
                alert("Redireccionando para cambiar contrasena.");
            }
        });
    });

    dangerBtn?.addEventListener("click", () => {
        if (confirm("Seguro que deseas eliminar la cuenta administrativa?")) {
            alert("Cuenta eliminada.");
        }
    });

    syncActiveTheme();
});
