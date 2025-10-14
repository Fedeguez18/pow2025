
let cantidadMostrada = 0;
const cantidadPorCarga = 20;

const lista = document.getElementById("paises");
const botonVerMas = document.getElementById("verMas");

//local storage
if (!localStorage.getItem("paisesStorage")){
    localStorage.setItem("paisesStorage", JSON.stringify([]));
}

let paisesLocal = JSON.parse(localStorage.getItem("paisesStorage"));



//mostrar paises
function MostrarPaises() {
    const fragmento = document.createDocumentFragment();

    const paisesAMostrar = paisesFiltrados.slice(cantidadMostrada, cantidadMostrada + cantidadPorCarga);

    paisesAMostrar.forEach(pais => {
        const div = document.createElement("div");
        div.classList.add("card", "text-bg-dark", "p-0");

        div.innerHTML = `
            <img src="${pais.flags.png}" class="card-img" alt="Bandera de ${pais.name.common}">
            <a href="card.html  "><div class="overlay"></div>
            <div class="info">
                <h5 class="nombre">${pais.name.common}</h5>
            </div> </a>
        `;
        fragmento.appendChild(div);
    });

    lista.appendChild(fragmento);
    cantidadMostrada += cantidadPorCarga;

    if (cantidadMostrada >= paisesLocal.length) {
        botonVerMas.style.display = "none";
    }
}




// filtrado
function filtrarPorContinente(continente) {
    if (continente === "Todos") {
        paisesFiltrados = paisesLocal;
    } else {
        paisesFiltrados = paisesLocal.filter(pais => pais.region === continente);
    }

    lista.innerHTML = "";
    cantidadMostrada = 0;
    MostrarPaises();
}

function filtrarCriterio(criterio) {
    if (criterio === "A-Z") {
        paisesFiltrados.sort((paisA, paisB) => paisA.name.common.localeCompare(paisB.name.common));
    } else if (criterio === "Mas poblado") {
        paisesFiltrados.sort((paisA, paisB) => paisB.population - paisA.population);
    } else if (criterio === "Menos poblado") {
        paisesFiltrados.sort((paisA, paisB) => paisA.population - paisB.population);
    }

    lista.innerHTML = "";
    cantidadMostrada = 0;
    MostrarPaises();
}



// Leer la API
fetch("https://restcountries.com/v3.1/all?fields=name,capital,population,flags,region")
    .then(response => response.json())
    .then(data => {
        const paisesGuardados = JSON.parse(localStorage.getItem("paisesStorage")) || [];
        paisesLocal = [...data, ...paisesGuardados];
        paisesFiltrados = paisesLocal;
        MostrarPaises();
    })
    .catch(error => console.error("Error al leer la API:", error));


botonVerMas.addEventListener("click", MostrarPaises);





// Eventos para los filtros
document.querySelectorAll(".continentes a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const continente = e.target.textContent;
        filtrarPorContinente(continente);
    })
});

document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        const criterio = e.target.textContent;
        filtrarCriterio(criterio);
    })
});






