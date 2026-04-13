const tipo = document.getElementById("TipoRegistro");

tipo.addEventListener ( "change", function() {
    let seleccion = tipo.value;

    if (seleccion === "Negocio") {
    document.getElementById("formNegocio").style.display = "block";
    document.getElementById("formPersona").style.display = "none";
    }
    if (seleccion === "PersonaNatural") {
    document.getElementById("formPersona").style.display = "block";
    document.getElementById("formNegocio").style.display = "none";
    }
    if (seleccion === "") {
    document.getElementById("formPersona").style.display = "none";
    document.getElementById("formNegocio").style.display = "none";
    }   
} );
    