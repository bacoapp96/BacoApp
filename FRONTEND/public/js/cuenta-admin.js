document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("admin-account-form");
  const resetBtn = document.getElementById("reset-admin-account");
  const alertBox = document.getElementById("admin-account-alert");
  const securityBtns = document.querySelectorAll(".security-action");

  if (!form || !alertBox) return;

  const storageKey = "bacoapp-admin-account";
  const defaults = {
    nombre: "Administrador BacoApp",
    usuario: "admin",
    correo: "admin@bacoapp.com",
    telefono: "+57 321 000 0000"
  };

  const showMessage = (message, type = "success") => {
    alertBox.className = `admin-account-alert show ${type === "error" ? "error" : ""}`;
    alertBox.innerHTML = `<i class="fa-solid ${type === "error" ? "fa-triangle-exclamation" : "fa-circle-check"}"></i><span>${message}</span>`;

    window.clearTimeout(showMessage.timeout);
    showMessage.timeout = window.setTimeout(() => {
      alertBox.className = "admin-account-alert";
      alertBox.textContent = "";
    }, 3200);
  };

  const getValues = () => Object.fromEntries(new FormData(form).entries());

  const setValues = (values) => {
    Object.entries({ ...defaults, ...values }).forEach(([name, value]) => {
      const input = form.elements[name];
      if (input) input.value = value;
    });
  };

  const validate = () => {
    const values = getValues();
    const emailInput = form.elements.correo;
    const requiredInputs = form.querySelectorAll("input");
    let valid = true;

    requiredInputs.forEach((input) => {
      const isEmpty = input.value.trim() === "";
      input.classList.toggle("is-invalid", isEmpty);
      if (isEmpty) valid = false;
    });

    if (!emailInput.value.includes("@")) {
      emailInput.classList.add("is-invalid");
      valid = false;
    }

    return { valid, values };
  };

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (saved) setValues(saved);
  } catch {
    localStorage.removeItem(storageKey);
  }

  form.addEventListener("input", (event) => {
    event.target.classList.remove("is-invalid");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const { valid, values } = validate();

    if (!valid) {
      showMessage("Revisa los campos marcados antes de guardar.", "error");
      return;
    }

    localStorage.setItem(storageKey, JSON.stringify(values));
    showMessage("Datos de la cuenta administrativa guardados.");
  });

  resetBtn?.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    setValues(defaults);
    form.querySelectorAll(".is-invalid").forEach((input) => input.classList.remove("is-invalid"));
    showMessage("Datos restaurados a los valores principales.");
  });

  securityBtns.forEach((button) => {
    button.addEventListener("click", () => {
      const actions = {
        password: "Abriendo el flujo para cambiar la contrasena.",
        devices: "Mostrando las sesiones activas del administrador.",
        logout: "Todas las sesiones administrativas fueron cerradas."
      };

      showMessage(actions[button.dataset.action] || "Accion aplicada correctamente.");
    });
  });
});
