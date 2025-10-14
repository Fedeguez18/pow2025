let paisesLocal = JSON.parse(localStorage.getItem("paisesStorage")) || [];

const form = document.getElementById("formCrearPais");

form.addEventListener("submit", (e) =>{
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const capital = document.getElementById("capital").value;
    const poblacion = parseInt(document.getElementById("poblacion").value);
    const region = document.getElementById("continente").value;
    const bandera = document.getElementById("bandera").value;

    const nuevoPais = {
        name: { common: nombre },
        capital: [capital],
        population: poblacion,
        region: region,
        flags: { png: bandera }
    };

    paisesLocal.push(nuevoPais);
    localStorage.setItem("paisesStorage", JSON.stringify(paisesLocal));

    alert("País creado exitosamente");
    form.reset();

    window.location.href = "paises.html";
})