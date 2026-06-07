document.addEventListener("DOMContentLoaded", async () => {
    const fields = {
        nombre: document.getElementById("accountName"),
        email: document.getElementById("accountEmail"),
        telefono: document.getElementById("accountPhone"),
        documento: document.getElementById("accountDocument"),
        direccion: document.getElementById("accountAddress")
    };
    const profileName = document.getElementById("profileName");
    const profileTier = document.getElementById("profileTier");
    const addressCard = document.getElementById("addressCard");
    const paymentCard = document.getElementById("paymentCard");
    const themeSelector = document.getElementById("clientThemeSelector");
    const saveButton = document.getElementById("saveAccount");

    const accountFromFields = () => ({
        nombre: fields.nombre?.value.trim() || "",
        email: fields.email?.value.trim() || "",
        telefono: fields.telefono?.value.trim() || "",
        documento: fields.documento?.value.trim() || "",
        direccion: fields.direccion?.value.trim() || ""
    });

    const renderAccount = (account = accountFromFields()) => {
        if (fields.nombre) fields.nombre.value = account.nombre || "";
        if (fields.email) fields.email.value = account.email || "";
        if (fields.telefono) fields.telefono.value = account.telefono || "";
        if (fields.documento) fields.documento.value = account.documento || "";
        if (fields.direccion) fields.direccion.value = account.direccion || "";
        if (profileName) profileName.textContent = account.nombre || "Mi cuenta";
        if (profileTier) profileTier.textContent = account.rol === "admin" ? "Administrador" : "Cliente";
        if (addressCard) addressCard.querySelector("p").textContent = account.direccion || "Sin direccion registrada";
        if (paymentCard) paymentCard.querySelector("span").textContent = "Sin metodo registrado";
    };

    const renderThemeButtons = () => {
        const currentTheme = window.BacoTheme?.get?.() || "dark";
        themeSelector?.querySelectorAll("[data-theme-option]").forEach((button) => {
            button.classList.toggle("active", button.dataset.themeOption === currentTheme);
        });
    };

    const saveAccount = async () => {
        const account = accountFromFields();

        saveButton.disabled = true;
        saveButton.classList.add("is-loading");

        try {
            const response = await fetch("/api/cuenta", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(account)
            });
            const data = await response.json();

            if (response.status === 401) {
                window.location.href = "/login";
                return;
            }

            if (!response.ok || !data.ok) {
                throw new Error(data.message || "No se pudo guardar el perfil.");
            }

            localStorage.setItem("bacoUser", JSON.stringify(data.usuario));
            renderAccount(data.usuario);
            alert("Cambios guardados correctamente.");
        } catch (error) {
            alert(error.message);
        } finally {
            saveButton.disabled = false;
            saveButton.classList.remove("is-loading");
        }
    };

    document.getElementById("editProfile")?.addEventListener("click", () => fields.nombre?.focus());
    saveButton?.addEventListener("click", saveAccount);

    themeSelector?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-theme-option]");
        if (!button) return;
        window.BacoTheme?.set?.(button.dataset.themeOption);
        renderThemeButtons();
    });

    document.addEventListener("bacoapp:themechange", renderThemeButtons);

    document.getElementById("changePassword")?.addEventListener("click", () => {
        alert("La actualizacion de contrasena debe hacerse desde recuperacion de acceso.");
    });

    document.getElementById("showDevices")?.addEventListener("click", () => {
        alert("Sesion web activa en este navegador.");
    });

    document.getElementById("addAddress")?.addEventListener("click", () => fields.direccion?.focus());

    document.getElementById("addPayment")?.addEventListener("click", () => {
        alert("Metodo de pago no configurado en esta version.");
    });

    document.getElementById("deleteAccount")?.addEventListener("click", async () => {
        if (!confirm("Seguro que deseas cerrar la sesion?")) return;
        await fetch("/api/logout", { method: "POST" });
        localStorage.removeItem("bacoUser");
        window.location.href = "/login";
    });

    renderAccount();
    renderThemeButtons();

    try {
        const response = await fetch("/api/session");
        const data = await response.json();

        if (!data.ok) {
            window.location.href = "/login";
            return;
        }

        renderAccount({
            nombre: data.usuario.Nombre || data.usuario.nombre || "",
            email: data.usuario.Email || data.usuario.email || "",
            telefono: data.usuario.Celular || data.usuario.telefono || data.usuario.Telefono || "",
            documento: data.usuario.Documento || data.usuario.documento || "",
            direccion: data.usuario.Direccion || data.usuario.direccion || "",
            rol: data.usuario.rol || data.usuario.Rol || ""
        });
    } catch (error) {
        console.error("Error al cargar la sesion:", error);
    }
});
