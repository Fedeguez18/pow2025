const generarNro = document.getElementById("generarNRO");
const reiniciarBtn = document.getElementById("reiniciar");

const turnoText = document.getElementById("nroGenerado");


const nroMinInput = document.getElementById("nroMin");
const nroMaxInput = document.getElementById("nroMax");


const minInicial = nroMinInput.value;
const maxInicial = nroMaxInput.value;

let listaTurnos = JSON.parse(localStorage.getItem("listaTurnos")) || [];
nroMinInput.value = localStorage.getItem("min") || minInicial;
nroMaxInput.value = localStorage.getItem("max") || maxInicial;

generarNro.addEventListener("click", generarTurno);
reiniciarBtn.addEventListener("click", reiniciar);

function reiniciar(){
    listaTurnos = [];
    turnoText.textContent = "";
    nroMinInput.value = minInicial;
    nroMaxInput.value = maxInicial;
    
    
}

function generarTurno(){
    let limInferior = parseInt(nroMinInput.value);
    let limSuperior = parseInt(nroMaxInput.value);

    if(limInferior >= limSuperior){
        turnoText.textContent = "Limites invalidos";
        return;
    }

    if(listaTurnos.length >= (limSuperior - limInferior + 1)){
        turnoText.textContent = "Ya no hay mas turnos disponibles";
        return;
    }

    let nroTurno = Math.floor(Math.random() * (limSuperior - limInferior + 1)) + limInferior;
    
    if(listaTurnos.includes(nroTurno)){
        nroTurno = buscarTurno(nroTurno, limInferior, limSuperior);
    }
    listaTurnos.push(nroTurno);
    turnoText.textContent = nroTurno;

    localStorage.setItem("listaTurnos", JSON.stringify(listaTurnos));
    localStorage.setItem("min", limInferior);
    localStorage.setItem("max", limSuperior);
    
}

function buscarTurno(nroTurno, limInferior, limSuperior){
    
     for(let i = nroTurno+1; i <= limSuperior; i++){
        if(!listaTurnos.includes(i)){
            return i;
        }
    }

    for(let i = nroTurno-1; i >= limInferior; i--){
        if(!listaTurnos.includes(i)){
            return i;
        }
    }

    return null;

    
}