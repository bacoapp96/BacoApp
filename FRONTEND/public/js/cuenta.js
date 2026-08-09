
document.addEventListener("DOMContentLoaded", async () => {

    // =========================
    // ELEMENTOS DEL DOM
    // =========================

    const fields = {
        nombre: document.getElementById("accountName"),
        email: document.getElementById("accountEmail"),
        telefono: document.getElementById("accountPhone"),
        documento: document.getElementById("accountDocument"),
        direccion: document.getElementById("accountAddress")
    };

    const profileName =
        document.getElementById("profileName");

    const profileTier =
        document.getElementById("profileTier");

    const themeSelector =
        document.getElementById("clientThemeSelector");

    const saveButton =
        document.getElementById("saveAccount");

    const editButton =
        document.getElementById("editProfile");


    // =========================
    // OBTENER DATOS DEL FORMULARIO
    // =========================

    const accountFromFields = () => ({
        nombre: fields.nombre?.value.trim() || "",
        email: fields.email?.value.trim() || "",
        telefono: fields.telefono?.value.trim() || "",
        documento: fields.documento?.value.trim() || "",
        direccion: fields.direccion?.value.trim() || ""
    });


    // =========================
    // MOSTRAR DATOS DEL USUARIO
    // =========================

    const renderAccount = (account = {}) => {

        if (fields.nombre) {
            fields.nombre.value = account.nombre || "";
        }

        if (fields.email) {
            fields.email.value = account.email || "";
        }

        if (fields.telefono) {
            fields.telefono.value = account.telefono || "";
        }

        if (fields.documento) {
            fields.documento.value = account.documento || "";
        }

        if (fields.direccion) {
            fields.direccion.value = account.direccion || "";
        }

        if (profileName) {
            profileName.textContent =
                account.nombre || "Mi cuenta";
        }

        if (profileTier) {
            profileTier.textContent =
                account.rol === "admin"
                    ? "Administrador"
                    : "Cliente";
        }
    };


    // =========================
    // TEMAS
    // =========================

    const renderThemeButtons = () => {

        const currentTheme =
            window.BacoTheme?.get?.() || "dark";

        themeSelector
            ?.querySelectorAll("[data-theme-option]")
            .forEach((button) => {

                button.classList.toggle(
                    "active",
                    button.dataset.themeOption === currentTheme
                );

            });
    };


    // =========================
    // GUARDAR CAMBIOS
    // =========================

    const saveAccount = async () => {

        if (!saveButton) return;

        const account = accountFromFields();

        saveButton.disabled = true;
        saveButton.classList.add("is-loading");

        try {

            const response = await fetch(
                "/api/cuenta",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(account)
                }
            );

            const data = await response.json();


            // Sesión expirada

            if (response.status === 401) {

                window.location.href = "/login";

                return;
            }


            // Error al guardar

            if (!response.ok || !data.ok) {

                throw new Error(
                    data.message ||
                    "No se pudo guardar el perfil."
                );

            }


            // Guardar usuario actualizado

            localStorage.setItem(
                "bacoUser",
                JSON.stringify(data.usuario)
            );


            // Actualizar información en pantalla

            renderAccount(data.usuario);


            alert(
                "Cambios guardados correctamente."
            );


        } catch (error) {

            console.error(
                "Error al guardar la cuenta:",
                error
            );

            alert(error.message);


        } finally {

            saveButton.disabled = false;
            saveButton.classList.remove("is-loading");

        }
    };


    // =========================
    // BOTÓN EDITAR PERFIL
    // =========================

    editButton?.addEventListener(
        "click",
        () => {

            fields.nombre?.focus();

        }
    );


    // =========================
    // BOTÓN GUARDAR
    // =========================

    saveButton?.addEventListener(
        "click",
        saveAccount
    );


    // =========================
    // CAMBIO DE TEMA
    // =========================

    themeSelector?.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    "[data-theme-option]"
                );

            if (!button) return;

            window.BacoTheme?.set?.(
                button.dataset.themeOption
            );

            renderThemeButtons();

        }
    );


    // Actualizar botones si el tema
    // cambia desde otro lugar

    document.addEventListener(
        "bacoapp:themechange",
        renderThemeButtons
    );


    // =========================
    // CARGAR SESIÓN
    // =========================

    try {

        const response =
            await fetch("/api/session");

        const data =
            await response.json();


        // Usuario no autenticado

        if (!data.ok) {

            window.location.href = "/login";

            return;
        }


        const usuario = data.usuario;


        // Normalizar nombres de campos
        // provenientes de la base de datos

        renderAccount({

            nombre:
                usuario.Nombre ||
                usuario.nombre ||
                "",

            email:
                usuario.Email ||
                usuario.email ||
                "",

            telefono:
                usuario.Celular ||
                usuario.telefono ||
                usuario.Telefono ||
                "",

            documento:
                usuario.Documento ||
                usuario.documento ||
                "",

            direccion:
                usuario.Direccion ||
                usuario.direccion ||
                "",

            rol:
                usuario.rol ||
                usuario.Rol ||
                ""

        });


    } catch (error) {

        console.error(
            "Error al cargar la sesión:",
            error
        );

    }


    // =========================
    // INICIALIZAR TEMA
    // =========================

    renderThemeButtons();

});

