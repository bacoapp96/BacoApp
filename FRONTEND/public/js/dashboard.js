async function loadDashboard() {

    try {

        const [
            resProductos,
            resClientes,
            resVentas
        ] = await Promise.all([
            fetch("/api/productos"),
            fetch("/api/clientes"),
            fetch("/api/ventas")
        ]);

        const productos = await resProductos.json();
        const clientes = await resClientes.json();
        const ventas = await resVentas.json();
        const totalVentas = ventas.reduce((total, venta) => {
        return total + Number(venta.Total);
        }, 0);

        document.getElementById("productos").textContent = productos.length;
        document.getElementById("users").textContent = clientes.length;
        document.getElementById("orders").textContent = ventas.length;
        document.getElementById("sales").textContent = totalVentas.toLocaleString("es-CO");

    } catch (error) {

        console.error("Error cargando dashboard:", error);

    }

} 

async function cargarUltimosPedidos() {

    try {
        
        const response = await fetch("/api/ventas");
        const ventas = await response.json();

        const lista = document.getElementById("ordersList");

        lista.innerHTML = "";

        ventas.reverse().slice(0,5).forEach(venta => {

            lista.innerHTML += `
                <div class="item">
                    <span>Pedido #${venta.Id_venta}</span>
                    <strong>$${Number(venta.Total).toLocaleString("es-CO")}</strong>
                </div>
            `;
            
        });
    } catch (error) {
         console.error(error);
    }
    
} 

async function cargarStockBajo() {

    try {

        const response = await fetch("/api/productos/stock-bajo");
        const productos = await response.json();

        const lista = document.getElementById("stockList");

        lista.innerHTML = "";

        if (productos.length === 0) {

            lista.innerHTML = `
                <div class="item">
                    <span>No hay productos con stock bajo.</span>
                </div>
            `;

            return;
        }

        productos.forEach(producto => {

    let estado = "";
    let clase = "";

    if (producto.stock <= 2) {
        estado = "🔴 Crítico";
        clase = "stock-critico";
    } else {
        estado = "🟡 Bajo";
        clase = "stock-bajo";
    }

    lista.innerHTML += `
        <div class="item ${clase}">
            <div>
                <span>${producto.nombre}</span>
                <small>${estado}</small>
            </div>

            <strong>${producto.stock} unidades</strong>
        </div>
    `;

});

    } catch (error) {

        console.error("Error cargando stock bajo:", error);

    }

}

loadDashboard();
cargarUltimosPedidos();
cargarStockBajo();