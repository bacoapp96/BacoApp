document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("admin-account-form");
  const newAdminForm = document.getElementById("new-admin-form");
  const resetBtn = document.getElementById("reset-admin-account");
  const alertBox = document.getElementById("admin-account-alert");
  const securityBtns = document.querySelectorAll(".security-action");
  const profileName = document.getElementById("adminProfileName");
  const profileEmail = document.getElementById("adminProfileEmail");

  if (!form || !alertBox) return;

  const initialValues = Object.fromEntries(new FormData(form).entries());

  const showMessage = (message, type = "success") => {
    alertBox.className = `admin-account-alert show ${type === "error" ? "error" : ""}`;
    alertBox.innerHTML = `<i class="fa-solid ${type === "error" ? "fa-triangle-exclamation" : "fa-circle-check"}"></i><span>${message}</span>`;

    window.clearTimeout(showMessage.timeout);
    showMessage.timeout = window.setTimeout(() => {
      alertBox.className = "admin-account-alert";
      alertBox.textContent = "";
    }, 3600);
  };

  const getValues = (targetForm) => Object.fromEntries(new FormData(targetForm).entries());

  const setValues = (values) => {
    Object.entries(values).forEach(([name, value]) => {
      const input = form.elements[name];
      if (input) input.value = value || "";
    });
  };

  const validate = (targetForm) => {
    const values = getValues(targetForm);
    const requiredInputs = targetForm.querySelectorAll("input[required], input[type='email']");
    let valid = true;

    requiredInputs.forEach((input) => {
      const isEmpty = input.hasAttribute("required") && input.value.trim() === "";
      const isBadEmail = input.type === "email" && input.value.trim() && !input.value.includes("@");
      input.classList.toggle("is-invalid", isEmpty || isBadEmail);
      if (isEmpty || isBadEmail) valid = false;
    });

    return { valid, values };
  };

  const syncHeader = (usuario) => {
    if (profileName) profileName.textContent = usuario.nombre || "Administrador BacoApp";
    if (profileEmail) profileEmail.textContent = usuario.email || "";
  };

  form.addEventListener("input", (event) => {
    event.target.classList.remove("is-invalid");
  });

  newAdminForm?.addEventListener("input", (event) => {
    event.target.classList.remove("is-invalid");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const { valid, values } = validate(form);

    if (!valid) {
      showMessage("Revisa los campos marcados antes de guardar.", "error");
      return;
    }

    try {
      const response = await fetch("/api/cuenta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "No se pudo guardar la cuenta admin.");
      }

      syncHeader(data.usuario);
      showMessage("Datos de la cuenta administrativa guardados.");
    } catch (error) {
      showMessage(error.message, "error");
    }
  });

  newAdminForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const { valid, values } = validate(newAdminForm);

    if (!valid) {
      showMessage("Completa los datos obligatorios del nuevo administrador.", "error");
      return;
    }

    try {
      const response = await fetch("/api/administradores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/login";
        return;
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "No se pudo crear el administrador.");
      }

      newAdminForm.reset();
      showMessage("Administrador creado correctamente en la base de datos.");
    } catch (error) {
      showMessage(error.message, "error");
    }
  });

  resetBtn?.addEventListener("click", () => {
    setValues(initialValues);
    form.querySelectorAll(".is-invalid").forEach((input) => input.classList.remove("is-invalid"));
    showMessage("Datos restaurados a la informacion de la sesion.");
  });

  securityBtns.forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.dataset.action === "logout") {
        await fetch("/api/logout", { method: "POST" });
        localStorage.removeItem("bacoUser");
        window.location.href = "/login";
        return;
      }

      const actions = {
        password: "Usa recuperacion de acceso para cambiar la contrasena.",
        devices: "Sesion web activa en este navegador."
      };

      showMessage(actions[button.dataset.action] || "Accion aplicada correctamente.");
    });
  });
});
