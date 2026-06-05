document.addEventListener("DOMContentLoaded", () => {
    const storageKey = "bacoAccount";
    const fields = {
        name: document.getElementById("accountName"),
        email: document.getElementById("accountEmail"),
        phone: document.getElementById("accountPhone"),
        document: document.getElementById("accountDocument")
    };
    const profileName = document.getElementById("profileName");
    const profileTier = document.getElementById("profileTier");
    const addressCard = document.getElementById("addressCard");
    const paymentCard = document.getElementById("paymentCard");
    const themeSelector = document.getElementById("clientThemeSelector");

    const defaultData = {
        name: fields.name?.value || "Juan Perez",
        email: fields.email?.value || "juan@gmail.com",
        phone: fields.phone?.value || "3210000000",
        document: fields.document?.value || "CC 1000000000",
        address: "Calle 20 # 10 - 30",
        payment: "**** 4589",
        tier: "Cliente Premium"
    };

    const loadAccount = () => ({
        ...defaultData,
        ...JSON.parse(localStorage.getItem(storageKey) || "{}")
    });

    const renderThemeButtons = () => {
        const currentTheme = window.BacoTheme?.get?.() || "dark";
        themeSelector?.querySelectorAll("[data-theme-option]").forEach((button) => {
            button.classList.toggle("active", button.dataset.themeOption === currentTheme);
        });
    };

    const renderAccount = () => {
        const account = loadAccount();
        if (fields.name) fields.name.value = account.name;
        if (fields.email) fields.email.value = account.email;
        if (fields.phone) fields.phone.value = account.phone;
        if (fields.document) fields.document.value = account.document;
        if (profileName) profileName.textContent = account.name;
        if (profileTier) profileTier.textContent = account.tier;
        if (addressCard) addressCard.querySelector("p").textContent = account.address;
        if (paymentCard) paymentCard.querySelector("span").textContent = account.payment;
        renderThemeButtons();
    };

    const saveAccount = (patch = {}) => {
        const account = {
            ...loadAccount(),
            name: fields.name.value.trim(),
            email: fields.email.value.trim(),
            phone: fields.phone.value.trim(),
            document: fields.document.value.trim(),
            ...patch
        };

        localStorage.setItem(storageKey, JSON.stringify(account));
        renderAccount();
        alert("Cambios guardados correctamente.");
    };

    document.getElementById("editProfile")?.addEventListener("click", () => fields.name?.focus());
    document.getElementById("saveAccount")?.addEventListener("click", () => saveAccount());

    themeSelector?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-theme-option]");
        if (!button) return;
        window.BacoTheme?.set?.(button.dataset.themeOption);
        renderThemeButtons();
    });

    document.addEventListener("bacoapp:themechange", renderThemeButtons);

    document.getElementById("changePassword")?.addEventListener("click", () => {
        const password = prompt("Nueva contrasena:");
        if (password && password.length >= 6) {
            alert("Contrasena actualizada localmente.");
        } else if (password) {
            alert("La contrasena debe tener minimo 6 caracteres.");
        }
    });

    document.getElementById("showDevices")?.addEventListener("click", () => {
        alert("Dispositivos conectados: navegador actual, sesion web BacoApp.");
    });

    document.getElementById("addAddress")?.addEventListener("click", () => {
        const address = prompt("Direccion:", loadAccount().address);
        if (address) saveAccount({ address });
    });

    document.getElementById("addPayment")?.addEventListener("click", () => {
        const payment = prompt("Ultimos 4 digitos de la tarjeta:", loadAccount().payment.replace("**** ", ""));
        if (payment) saveAccount({ payment: `**** ${payment.slice(-4)}` });
    });

    document.getElementById("deleteAccount")?.addEventListener("click", () => {
        if (confirm("Seguro que deseas eliminar tu cuenta local?")) {
            localStorage.removeItem(storageKey);
            localStorage.removeItem("bacoUser");
            window.location.href = "/Index";
        }
    });

    renderAccount();
});
