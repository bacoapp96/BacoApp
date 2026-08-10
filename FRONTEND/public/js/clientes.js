const clientesContainer = document.getElementById("clientesContainer");
const searchInput = document.getElementById("searchInput");
const filters = document.getElementById("filters");

let activeFilter = "Todos";
let openPanels = {};

let clientes = [];

async function cargarClientes(){
  try {
    const respuesta = await fetch ("http://https://bacoapp.onrender.com/api/clientes");

    const datos = await respuesta.json();

    clientes = datos.map(cliente => ({
      id: cliente.id,
      nombre: cliente.nombre,
      correo: cliente.correo,
      telefono: cliente.telefono,
      direccion : cliente.direccion,
      tipo: cliente.tipo,
      estado: cliente.estado || "Nuevo",
      nivel: cliente.nivel || "Activo",
      cupoCredito: Number(cliente.cupoCredito || 0),
      compras: Number(cliente.compras || 0),
      totalGastado: Number(cliente.totalGastado || 0),
      ultimaCompra: cliente.ultimaCompra || "Sin compras registradas",
      fechaRegistro: cliente.fechaRegistro || "Sin registro",
      observaciones: cliente.observaciones || "",
      favoritos: [],
      beneficios: [],
      historial: [],
      reportado: false


    }));

    renderClientes();
  }catch (error) {
    console.error("Error cargando clientes:", error);
  }
}

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
        <button class="action-btn warning" type="button" data-action="gestionar">
          <i class="fa-solid fa-sliders"></i> Gestionar
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
  if (panel === "gestionar") {
    return renderGestionPanel(cliente);
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

    if (!cliente.historial.length) {
        return `
            <div class="panel-inner">
                <div class="panel-title">
                    <h4>Pedidos recientes</h4>
                    <button class="close-panel"
                            type="button"
                            data-action="cerrar">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <p>Este cliente todavía no tiene compras registradas.</p>

            </div>
        `;
    }

    return `
        <div class="panel-inner">

            <div class="panel-title">
                <h4>Pedidos recientes</h4>

                <button class="close-panel"
                        type="button"
                        data-action="cerrar">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <div class="history-list">

                ${cliente.historial.map((pedido,index)=>`

                    <div class="history-item">

                        <strong>
                            Pedido #${index+1}
                        </strong>

                        <p>${pedido.detalle}</p>

                        <span>${pedido.fecha}</span>

                        <strong>${formatCurrency(pedido.total)}</strong>

                    </div>

                `).join("")}

            </div>

        </div>
    `;
}

function renderGestionPanel(cliente) {

        return `
        <div class="panel-inner">

        <div class="panel-title">
        <h4>Gestionar cliente</h4>

        <button class="close-panel" type="button" data-action="cerrar">
        <i class="fa-solid fa-xmark"></i>
        </button>

        </div>


        <form class="edit-form" data-form-id="${cliente.id}">


        <div class="field">

        <label>Estado</label>

        <select name="estado">

        ${[
        "Activo",
        "Inactivo",
        "Suspendido",
        "Bloqueado"
        ]
        .map(value => option(value, cliente.estado))
        .join("")}

        </select>

        </div>



        <div class="field">

        <label>Nivel de fidelización</label>

        <select name="nivel">

        ${[
        "Bronce",
        "Plata",
        "Oro",
        "VIP"
        ]
        .map(value => option(value, cliente.nivel))
        .join("")}

        </select>

        </div>



        <div class="field">

        <label>Cupo de crédito</label>

        <input 
        type="number"
        name="cupoCredito"
        value="${cliente.cupoCredito}"
        >

        </div>



        <div class="field">

        <label>Observaciones administrativas</label>

        <textarea name="observaciones">${escapeHtml(cliente.observaciones)}</textarea>

        </div>



        <div class="form-actions">

        <button 
        type="button"
        class="cancel-btn"
        data-action="cerrar">

        Cancelar

        </button>


        <button 
        class="save-btn"
        type="submit">

        <i class="fa-solid fa-floppy-disk"></i>

        Guardar cambios

        </button>


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
  if (action === "gestionar") setPanel(cliente.id, openPanels[cliente.id] === "gestionar" ? null : "gestionar");
 if (action === "pedidos") {

    fetch(`https://bacoapp.onrender.com/api/clientes/${cliente.id}/pedidos`)
        .then(res => res.json())
        .then(pedidos => {

            cliente.historial = pedidos.map(p => ({
                detalle: `${p.nombre} x${p.Cantidad}`,
                fecha: new Date(p.Fecha).toLocaleDateString("es-CO"),
                total: Number(p.Precio) * Number(p.Cantidad)
            }));

            setPanel(cliente.id, "pedidos");

        })
        .catch(err => {
            console.error(err);
            alert("No se pudieron cargar los pedidos.");
        });

}
  if (action === "cerrar") closePanel(cliente.id);

  if (action === "eliminar" && confirm(`Deseas eliminar a ${cliente.nombre}?`)) {
    clientes = clientes.filter((item) => item.id !== cliente.id);
    delete openPanels[cliente.id];
    renderClientes();
  }

 if (action === "bloquear") {

    fetch(`https://bacoapp.onrender.com/api/clientes/${cliente.id}/bloquear`, {
        method: "PUT"
    })
    .then(res => res.json())
    .then(data => {

        alert(data.mensaje);

        updateCliente(cliente.id, {
            estado: "Bloqueado"
        });

    })
    .catch(error => {
        console.error(error);
        alert("No se pudo bloquear el cliente.");
    });

}

  if (action === "suspender") {
    updateCliente(cliente.id, { estado: "Suspendido", observaciones: `${cliente.observaciones} Cuenta suspendida temporalmente.` });
  }

  if (action === "reportar") {

    const motivo = prompt("Escriba el motivo del reporte:");

    if (!motivo) return;

    fetch(`https://bacoapp.onrender.com/api/clientes/${cliente.id}/reportar`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            motivo
        })

    })
    .then(res => res.json())
    .then(data => {

        alert(data.mensaje);

        updateCliente(cliente.id, {
            reportado: true,
            observaciones: motivo
        });

    })
    .catch(error => {
        console.error(error);
        alert("No se pudo reportar el cliente.");
    });

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

clientesContainer.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = event.target.closest(".edit-form");
    if (!form) return;

    const id = Number(form.dataset.formId);
    const data = new FormData(form);

    try {

        const response = await fetch(`http://https://bacoapp.onrender.com/api/clientes/${id}/admin`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                estado: data.get("estado"),
                nivel: data.get("nivel"),
                cupoCredito: Number(data.get("cupoCredito") || 0),
                observaciones: data.get("observaciones").trim()
            })
        });

        if (!response.ok) {
            throw new Error("No se pudo actualizar");
        }

        await cargarClientes();

        alert("Cliente actualizado correctamente.");

    } catch (error) {

        console.error(error);
        alert("Error al actualizar el cliente.");

    }

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

cargarClientes();
