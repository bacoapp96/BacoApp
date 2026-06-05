const clientesContainer = document.getElementById("clientesContainer");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");

let activeFilter = "Todos";
let openPanels = {};

let clientes = [
  {
    id: 1,
    nombre: "Carlos Perez",
    correo: "carlos.perez@gmail.com",
    telefono: "3001234567",
    direccion: "Cra 15 #82-24, Bogota",
    tipo: "Mayorista",
    estado: "Activo",
    fechaRegistro: "12/01/2026",
    ultimaCompra: "28/05/2026",
    totalGastado: 1850000,
    compras: 18,
    favoritos: ["Whisky premium", "Ron Medellin", "Cervezas importadas"],
    beneficios: ["5% descuento mayorista", "Envio prioritario"],
    nivel: "Oro",
    cupoCredito: 900000,
    reportado: false,
    historial: [
      { fecha: "28/05/2026", detalle: "Whisky premium x2", total: 420000 },
      { fecha: "18/05/2026", detalle: "Ron Medellin x6", total: 390000 },
      { fecha: "02/05/2026", detalle: "Cervezas importadas x24", total: 288000 }
    ],
    observaciones: "Cliente frecuente para eventos empresariales. Prefiere entregas en la tarde."
  },
  {
    id: 2,
    nombre: "Laura Martinez",
    correo: "laura.martinez@correo.com",
    telefono: "3157654321",
    direccion: "Cl 45 #19-60, Medellin",
    tipo: "Frecuente",
    estado: "Activo",
    fechaRegistro: "03/02/2026",
    ultimaCompra: "30/05/2026",
    totalGastado: 2450000,
    compras: 26,
    favoritos: ["Vino tinto", "Ginebra", "Tequila reposado"],
    beneficios: ["Promociones premium", "Preventas especiales"],
    nivel: "VIP",
    cupoCredito: 1400000,
    reportado: false,
    historial: [
      { fecha: "30/05/2026", detalle: "Vino tinto reserva x4", total: 520000 },
      { fecha: "16/05/2026", detalle: "Ginebra x2", total: 310000 },
      { fecha: "29/04/2026", detalle: "Tequila reposado x1", total: 185000 }
    ],
    observaciones: "Excelente historial de pago. Interesada en lanzamientos y productos premium."
  },
  {
    id: 3,
    nombre: "Distribuidora El Norte",
    correo: "compras@elnorte.com",
    telefono: "6015558899",
    direccion: "Av 68 #12-40, Bogota",
    tipo: "Corporativo",
    estado: "Suspendido",
    fechaRegistro: "21/11/2025",
    ultimaCompra: "14/05/2026",
    totalGastado: 5200000,
    compras: 41,
    favoritos: ["Aguardiente", "Ron anejo", "Desechables"],
    beneficios: ["Lista mayorista", "Reserva de inventario"],
    nivel: "Plata",
    cupoCredito: 2200000,
    reportado: true,
    historial: [
      { fecha: "14/05/2026", detalle: "Aguardiente x36", total: 1260000 },
      { fecha: "01/05/2026", detalle: "Ron anejo x18", total: 990000 },
      { fecha: "20/04/2026", detalle: "Desechables surtidos", total: 340000 }
    ],
    observaciones: "Suspension temporal por documentos pendientes. Revisar soporte antes de aprobar credito."
  },
  {
    id: 4,
    nombre: "Andres Gomez",
    correo: "andres.gomez@mail.com",
    telefono: "3209988776",
    direccion: "Cl 10 #6-33, Cali",
    tipo: "Nuevo",
    estado: "Bloqueado",
    fechaRegistro: "10/04/2026",
    ultimaCompra: "19/04/2026",
    totalGastado: 360000,
    compras: 3,
    favoritos: ["Vodka", "Gaseosas", "Dulces"],
    beneficios: ["Bono bienvenida"],
    nivel: "Bronce",
    cupoCredito: 0,
    reportado: true,
    historial: [
      { fecha: "19/04/2026", detalle: "Vodka x1", total: 135000 },
      { fecha: "15/04/2026", detalle: "Gaseosas surtidas", total: 90000 },
      { fecha: "10/04/2026", detalle: "Dulces y snacks", total: 65000 }
    ],
    observaciones: "Bloqueado por validacion administrativa. No habilitar pedidos hasta confirmar identidad."
  }
];

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value) {
  return String(value).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function estadoClass(estado) {
  return normalize(estado);
}

function initials(nombre) {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function renderStats() {
  document.getElementById("statTotal").textContent = clientes.length;
  document.getElementById("statVip").textContent = clientes.filter((cliente) => cliente.nivel === "VIP").length;
  document.getElementById("statActivos").textContent = clientes.filter((cliente) => cliente.estado === "Activo").length;
  document.getElementById("statCredito").textContent = formatCurrency(
    clientes.reduce((total, cliente) => total + Number(cliente.cupoCredito || 0), 0)
  );
}

function getVisibleClientes() {
  const query = normalize(searchInput.value.trim());

  return clientes.filter((cliente) => {
    const searchable = normalize([
      cliente.nombre,
      cliente.correo,
      cliente.telefono,
      cliente.nivel,
      cliente.estado,
      cliente.tipo
    ].join(" "));

    const matchesSearch = !query || searchable.includes(query);
    const matchesFilter =
      activeFilter === "Todos" ||
      cliente.estado === activeFilter ||
      cliente.nivel === activeFilter;

    return matchesSearch && matchesFilter;
  });
}

function renderClientes() {
  renderStats();
  const visibles = getVisibleClientes();

  if (!visibles.length) {
    clientesContainer.innerHTML = '<div class="empty-state">No hay clientes que coincidan con la busqueda o filtro actual.</div>';
    return;
  }

  clientesContainer.innerHTML = visibles.map(renderCard).join("");
}

function renderCard(cliente) {
  const panel = openPanels[cliente.id];
  const statusClass = estadoClass(cliente.estado);
  const reportBadge = cliente.reportado ? '<span class="badge bloqueado"><i class="fa-solid fa-flag"></i> Reportado</span>' : "";

  return `
    <article class="cliente-card" data-id="${cliente.id}">
      <div class="cliente-card-header">
        <div class="avatar" aria-hidden="true">${escapeHtml(initials(cliente.nombre))}</div>
        <div class="client-title">
          <h3>${escapeHtml(cliente.nombre)}</h3>
          <p>${escapeHtml(cliente.correo)}</p>
          <div class="badge-row">
            <span class="estado ${statusClass}">
              <i class="fa-solid fa-circle"></i> ${escapeHtml(cliente.estado)}
            </span>
            <span class="badge ${estadoClass(cliente.nivel)}">
              <i class="fa-solid fa-gem"></i> ${escapeHtml(cliente.nivel)}
            </span>
            ${reportBadge}
          </div>
        </div>
      </div>

      <div class="cliente-summary">
        <div class="summary-item">
          <span>Telefono</span>
          <strong>${escapeHtml(cliente.telefono)}</strong>
        </div>
        <div class="summary-item">
          <span>Total compras</span>
          <strong>${formatCurrency(cliente.totalGastado)}</strong>
        </div>
        <div class="summary-item">
          <span>Compras realizadas</span>
          <strong>${cliente.compras}</strong>
        </div>
        <div class="summary-item">
          <span>Cupo credito</span>
          <strong>${formatCurrency(cliente.cupoCredito)}</strong>
        </div>
      </div>

      <div class="acciones">
        <button class="action-btn primary" type="button" data-action="ver">
          <i class="fa-solid fa-eye"></i> Ver
        </button>
        <button class="action-btn warning" type="button" data-action="editar">
          <i class="fa-solid fa-pen-to-square"></i> Editar
        </button>
        <button class="action-btn danger" type="button" data-action="eliminar">
          <i class="fa-solid fa-trash"></i> Eliminar
        </button>
      </div>

      <div class="admin-actions">
        <button class="action-btn" type="button" data-action="bloquear"><i class="fa-solid fa-ban"></i> Bloquear cliente</button>
        <button class="action-btn" type="button" data-action="suspender"><i class="fa-solid fa-pause"></i> Suspender cliente</button>
        <button class="action-btn" type="button" data-action="reportar"><i class="fa-solid fa-flag"></i> Reportar cliente</button>
        <button class="action-btn" type="button" data-action="vip"><i class="fa-solid fa-crown"></i> Convertir a VIP</button>
        <button class="action-btn" type="button" data-action="pedidos"><i class="fa-solid fa-receipt"></i> Ver pedidos</button>
        <button class="action-btn" type="button" data-action="promocion"><i class="fa-solid fa-paper-plane"></i> Enviar promocion</button>
        <button class="action-btn" type="button" data-action="credito"><i class="fa-solid fa-wallet"></i> Ajustar credito</button>
        <button class="action-btn" type="button" data-action="toggle-activo"><i class="fa-solid fa-power-off"></i> Activar/desactivar</button>
      </div>

      <div class="cliente-extra ${panel ? "open" : ""}">
        ${panel ? renderPanel(cliente, panel) : ""}
      </div>
    </article>
  `;
}

function renderPanel(cliente, panel) {
  if (panel === "editar") {
    return renderEditPanel(cliente);
  }

  if (panel === "pedidos") {
    return renderPedidosPanel(cliente);
  }

  return renderDetailPanel(cliente);
}

function renderDetailPanel(cliente) {
  return `
    <div class="panel-inner">
      <div class="panel-title">
        <h4>Informacion completa del cliente</h4>
        <button class="close-panel" type="button" data-action="cerrar"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="detail-grid">
        <div class="detail-item"><span>Informacion personal</span><p>${escapeHtml(cliente.nombre)}<br>${escapeHtml(cliente.correo)}<br>${escapeHtml(cliente.telefono)}<br>${escapeHtml(cliente.direccion)}</p></div>
        <div class="detail-item"><span>Estado del cliente</span><strong>${escapeHtml(cliente.estado)} - ${escapeHtml(cliente.tipo)}</strong></div>
        <div class="detail-item"><span>Fecha de registro</span><strong>${escapeHtml(cliente.fechaRegistro)}</strong></div>
        <div class="detail-item"><span>Ultima compra</span><strong>${escapeHtml(cliente.ultimaCompra)}</strong></div>
        <div class="detail-item"><span>Total gastado</span><strong>${formatCurrency(cliente.totalGastado)}</strong></div>
        <div class="detail-item"><span>Cantidad de compras</span><strong>${cliente.compras}</strong></div>
        <div class="detail-item"><span>Nivel de fidelizacion</span><strong>${escapeHtml(cliente.nivel)}</strong></div>
        <div class="detail-item"><span>Cupo de credito</span><strong>${formatCurrency(cliente.cupoCredito)}</strong></div>
        <div class="detail-item field full"><span>Productos favoritos</span><div class="chips">${cliente.favoritos.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("")}</div></div>
        <div class="detail-item field full"><span>Beneficios activos</span><div class="chips">${cliente.beneficios.map((item) => `<span class="chip">${escapeHtml(item)}</span>`).join("")}</div></div>
        <div class="note-box field full"><span>Observaciones internas</span><p>${escapeHtml(cliente.observaciones)}</p></div>
      </div>

      <div class="history-list">
        ${cliente.historial.map((pedido) => `
          <div class="history-item">
            <strong>${escapeHtml(pedido.detalle)}</strong>
            <span>${escapeHtml(pedido.fecha)} - ${formatCurrency(pedido.total)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderPedidosPanel(cliente) {
  return `
    <div class="panel-inner">
      <div class="panel-title">
        <h4>Pedidos recientes</h4>
        <button class="close-panel" type="button" data-action="cerrar"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="history-list">
        ${cliente.historial.map((pedido, index) => `
          <div class="history-item">
            <strong>Pedido #${cliente.id}${index + 1} - ${escapeHtml(pedido.detalle)}</strong>
            <span>${escapeHtml(pedido.fecha)} - ${formatCurrency(pedido.total)}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderEditPanel(cliente) {
  return `
    <div class="panel-inner">
      <div class="panel-title">
        <h4>Editar cliente</h4>
        <button class="close-panel" type="button" data-action="cerrar"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <form class="edit-form" data-form-id="${cliente.id}">
        <div class="field">
          <label for="nombre-${cliente.id}">Nombre</label>
          <input id="nombre-${cliente.id}" name="nombre" value="${escapeHtml(cliente.nombre)}" required>
        </div>
        <div class="field">
          <label for="correo-${cliente.id}">Correo</label>
          <input id="correo-${cliente.id}" name="correo" type="email" value="${escapeHtml(cliente.correo)}" required>
        </div>
        <div class="field">
          <label for="telefono-${cliente.id}">Telefono</label>
          <input id="telefono-${cliente.id}" name="telefono" value="${escapeHtml(cliente.telefono)}" required>
        </div>
        <div class="field">
          <label for="direccion-${cliente.id}">Direccion</label>
          <input id="direccion-${cliente.id}" name="direccion" value="${escapeHtml(cliente.direccion)}" required>
        </div>
        <div class="field">
          <label for="tipo-${cliente.id}">Tipo de cliente</label>
          <select id="tipo-${cliente.id}" name="tipo">
            ${["Nuevo", "Frecuente", "Mayorista", "Corporativo"].map((value) => option(value, cliente.tipo)).join("")}
          </select>
        </div>
        <div class="field">
          <label for="estado-${cliente.id}">Estado</label>
          <select id="estado-${cliente.id}" name="estado">
            ${["Activo", "Inactivo", "Suspendido", "Bloqueado"].map((value) => option(value, cliente.estado)).join("")}
          </select>
        </div>
        <div class="field">
          <label for="credito-${cliente.id}">Cupo de credito</label>
          <input id="credito-${cliente.id}" name="cupoCredito" type="number" min="0" step="50000" value="${cliente.cupoCredito}">
        </div>
        <div class="field">
          <label for="nivel-${cliente.id}">Nivel de fidelizacion</label>
          <select id="nivel-${cliente.id}" name="nivel">
            ${["Bronce", "Plata", "Oro", "VIP"].map((value) => option(value, cliente.nivel)).join("")}
          </select>
        </div>
        <div class="field full">
          <label for="observaciones-${cliente.id}">Observaciones</label>
          <textarea id="observaciones-${cliente.id}" name="observaciones">${escapeHtml(cliente.observaciones)}</textarea>
        </div>
        <div class="form-actions">
          <button class="cancel-btn" type="button" data-action="cerrar">Cancelar</button>
          <button class="save-btn" type="submit"><i class="fa-solid fa-floppy-disk"></i> Guardar cambios</button>
        </div>
      </form>
    </div>
  `;
}

function option(value, current) {
  return `<option value="${value}" ${value === current ? "selected" : ""}>${value}</option>`;
}

function findCliente(card) {
  const id = Number(card.dataset.id);
  return clientes.find((cliente) => cliente.id === id);
}

function updateCliente(id, changes) {
  clientes = clientes.map((cliente) => (
    cliente.id === id ? { ...cliente, ...changes } : cliente
  ));
  renderClientes();
}

function setPanel(id, panel) {
  openPanels = { [id]: panel };
  renderClientes();
}

function closePanel(id) {
  delete openPanels[id];
  renderClientes();
}

function handleAction(action, card) {
  const cliente = findCliente(card);
  if (!cliente) return;

  if (action === "ver") setPanel(cliente.id, openPanels[cliente.id] === "ver" ? null : "ver");
  if (action === "editar") setPanel(cliente.id, openPanels[cliente.id] === "editar" ? null : "editar");
  if (action === "pedidos") setPanel(cliente.id, "pedidos");
  if (action === "cerrar") closePanel(cliente.id);

  if (action === "eliminar" && confirm(`Deseas eliminar a ${cliente.nombre}?`)) {
    clientes = clientes.filter((item) => item.id !== cliente.id);
    delete openPanels[cliente.id];
    renderClientes();
  }

  if (action === "bloquear") {
    updateCliente(cliente.id, { estado: "Bloqueado", observaciones: `${cliente.observaciones} Cliente bloqueado por administracion.` });
  }

  if (action === "suspender") {
    updateCliente(cliente.id, { estado: "Suspendido", observaciones: `${cliente.observaciones} Cuenta suspendida temporalmente.` });
  }

  if (action === "reportar") {
    updateCliente(cliente.id, { reportado: true, observaciones: `${cliente.observaciones} Cliente reportado para revision interna.` });
  }

  if (action === "vip") {
    const beneficios = Array.from(new Set([...cliente.beneficios, "Beneficio VIP activo", "Atencion prioritaria"]));
    updateCliente(cliente.id, { nivel: "VIP", beneficios });
  }

  if (action === "promocion") {
    const beneficios = Array.from(new Set([...cliente.beneficios, "Promocion enviada hoy"]));
    updateCliente(cliente.id, { beneficios });
    alert(`Promocion enviada a ${cliente.correo}`);
  }

  if (action === "credito") {
    const nuevoCupo = prompt("Nuevo cupo de credito", cliente.cupoCredito);
    if (nuevoCupo !== null && !Number.isNaN(Number(nuevoCupo)) && Number(nuevoCupo) >= 0) {
      updateCliente(cliente.id, { cupoCredito: Number(nuevoCupo) });
    }
  }

  if (action === "toggle-activo") {
    const nuevoEstado = cliente.estado === "Activo" ? "Inactivo" : "Activo";
    updateCliente(cliente.id, { estado: nuevoEstado });
  }
}

clientesContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  const card = event.target.closest(".cliente-card");

  if (!button || !card) return;
  handleAction(button.dataset.action, card);
});

clientesContainer.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target.closest(".edit-form");
  if (!form) return;

  const id = Number(form.dataset.formId);
  const data = new FormData(form);

  updateCliente(id, {
    nombre: data.get("nombre").trim(),
    correo: data.get("correo").trim(),
    telefono: data.get("telefono").trim(),
    direccion: data.get("direccion").trim(),
    tipo: data.get("tipo"),
    estado: data.get("estado"),
    cupoCredito: Number(data.get("cupoCredito") || 0),
    observaciones: data.get("observaciones").trim(),
    nivel: data.get("nivel")
  });
});

searchInput.addEventListener("input", renderClientes);

filters.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-btn");
  if (!button) return;

  activeFilter = button.dataset.filter;
  filters.querySelectorAll(".filter-btn").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  renderClientes();
});

renderClientes();
