// DATOS SIMULADOS
let data = {
    sales: 1250000,
    orders: 24,
    stores: 8,
    users: 120
};

// CARGAR DATOS
function loadDashboard(){
    document.getElementById("sales").innerText = data.sales.toLocaleString();
    document.getElementById("orders").innerText = data.orders;
    document.getElementById("stores").innerText = data.stores;
    document.getElementById("users").innerText = data.users;
}

// SIMULAR ACTUALIZACIÓN
function refreshDashboard(){

    data.sales += Math.floor(Math.random() * 50000);
    data.orders += 1;

    loadDashboard();

    alert("Dashboard actualizado");
}

// INICIAR
loadDashboard();