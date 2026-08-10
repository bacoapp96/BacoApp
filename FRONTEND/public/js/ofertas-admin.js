const btnNuevaOferta = document.querySelector("#btnNuevaOferta");
const modal = document.querySelector("#modalOferta");
const cerrarModal = document.querySelector("#cerrarModal");
const formOferta = document.querySelector("#formOferta");

const tituloModal = document.querySelector("#tituloModal");
const idOferta = document.querySelector("#id_oferta");
const API_OFERTAS = "https://bacoapp.onrender.com/api/ofertas";

// =======================
// Abrir modal nueva oferta
// =======================

btnNuevaOferta.addEventListener("click", () => {

    formOferta.reset();

    idOferta.value = "";

    tituloModal.textContent = "Nueva oferta";

    modal.classList.add("active");

});

// =======================
// Cerrar modal
// =======================

cerrarModal.addEventListener("click", () => {

    modal.classList.remove("active");

});

// =======================
// Cerrar haciendo click afuera
// =======================

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.classList.remove("active");

    }

});

// =======================
// Editar oferta
// =======================

document.querySelectorAll(".btn-editar").forEach(btn => {

    btn.addEventListener("click", async () => {

        const id = btn.dataset.id;

        tituloModal.textContent = "Editar oferta";

        modal.classList.add("active");

        try {

            const response = await fetch(`${API_OFERTAS}/${id}`);

            if (!response.ok) {
                throw new Error("No fue posible obtener la oferta.");
            }

            const oferta = await response.json();

            idOferta.value = oferta.id_oferta;

            document.querySelector("#producto").value = oferta.id_producto;

            document.querySelector("#titulo").value = oferta.titulo;

            document.querySelector("#descuento").value = oferta.descuento;

            document.querySelector("#fecha_inicio").value =
                oferta.fecha_inicio.split("T")[0];

            document.querySelector("#fecha_fin").value =
                oferta.fecha_fin.split("T")[0];

            document.querySelector("#agotable").value =
            oferta.hasta_agotar_existencias;

        } catch (error) {

            console.error(error);

            alert("No fue posible cargar la oferta.");

        }

    });

});

// =======================
// Eliminar oferta
// =======================

document.querySelectorAll(".btn-eliminar").forEach(btn => {

    btn.addEventListener("click", async () => {

        const id = btn.dataset.id;

        const confirmar = confirm("¿Desea eliminar esta oferta?");

        if (!confirmar) return;

        try {

            const response = await fetch(`${API_OFERTAS}/${id}`, {

                method: "DELETE"

            });

            if (!response.ok) {

                throw new Error();

            }

            location.reload();

        } catch (error) {

            alert("No fue posible eliminar la oferta.");

        }

    });

});

// =======================
// Guardar oferta
// =======================

formOferta.addEventListener("submit", async (e) => {

    e.preventDefault();

    const datos = {

        id_producto: document.querySelector("#producto").value,

        titulo: document.querySelector("#titulo").value,

        descripcion: "",

        descuento: document.querySelector("#descuento").value,

        fecha_inicio: document.querySelector("#fecha_inicio").value,

        fecha_fin: document.querySelector("#fecha_fin").value,

        hasta_agotar_existencias:
        document.querySelector("#agotable").value

    };

    const id = idOferta.value;

    const url = id
        ? `${API_OFERTAS}/${id}`
        : API_OFERTAS;

    const metodo = id
        ? "PUT"
        : "POST";

    try {

        const response = await fetch(url, {

            method: metodo,

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(datos)

        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "No fue posible guardar la oferta.");
        }

        modal.classList.remove("active");

        location.reload();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

});

const API_ESTADISTICAS = "https://bacoapp.onrender.com/api/ofertas/estadisticas";


async function cargarEstadisticasOfertas(){

    try{

        const response = await fetch(API_ESTADISTICAS);

        if(!response.ok){
            throw new Error("Error cargando estadísticas");
        }

        const datos = await response.json();


        document.querySelector("#ofertasActivas").textContent =
            datos.activas || 0;


        document.querySelector("#ofertasProgramadas").textContent =
            datos.programadas || 0;


        document.querySelector("#ofertasFinalizadas").textContent =
            datos.finalizadas || 0;


        document.querySelector("#ofertasAgotadas").textContent =
            datos.agotadas || 0;


    }catch(error){

        console.error(
            "Error estadísticas ofertas:",
            error
        );

    }

}


cargarEstadisticasOfertas();
