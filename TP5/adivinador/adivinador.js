const numeroSeccretoBtn = document.getElementById("generarNRO");
const probarBtn = document.getElementById("probarNRO");
const reiniciarBtn = document.getElementById("reiniciar");

let intentos = 0;
let numeroSeccreto = 0;



const intentosText = document.getElementById("intentos");
const mejorText = document.getElementById("mejor");
const partidasText = document.getElementById("partidas");
const promedioText = document.getElementById("promedio");
const mensajeText = document.getElementById("mensaje");

let datos = JSON.parse(localStorage.getItem("datosAdivinador")) || {
    sumaIntentos: 0,
    mejorPuntaje: null,
    partidasFinalizadas: 0,
    promedio: 0
};


numeroSeccretoBtn.addEventListener("click", generarNumeroSecreto);
probarBtn.addEventListener("click", comprobarNumero);
reiniciarBtn.addEventListener("click", reiniciar);


function reiniciar(){
    
    generarNumeroSecreto();
    
}

function generarNumeroSecreto(){
    numeroSeccreto = Math.floor(Math.random() * 1000) + 1;
    console.log(numeroSeccreto);

    document.getElementById("inicio").style.display = "none";
    
    document.getElementById("juego").style.display = "block";

    document.getElementById("reiniciar").disabled = true; 

    document.getElementById("numero").disabled = false;
    probarBtn.disabled = false;
    mostrarEstadisticas();
    intentos = 0;  
    datos.sumaIntentos = 0;
    actualizar();
      
}



function comprobarNumero(){
    let numeroUser = parseInt(document.getElementById("numero").value);
    intentos++;
    datos.intentos++;

    let mensaje = "";
    if(numeroUser < numeroSeccreto){
       mensaje = "El número es mayor";
       alert(mensaje);
    }else if(numeroUser > numeroSeccreto){
        mensaje = "El número es menor";
        alert(mensaje);
    }else{
        mensaje = "Has acertado!";
        alert(mensaje + " Lo has conseguido en " + intentos + " intentos");

        datos.partidasFinalizadas++;
        datos.sumaIntentos += intentos;

        if(datos.mejorPuntaje === null || intentos < datos.mejorPuntaje){
            datos.mejorPuntaje = intentos;
        }

        datos.promedio = (datos.sumaIntentos / datos.partidasFinalizadas).toFixed(2);

        localStorage.setItem("datosAdivinador", JSON.stringify(datos));

        mensaje = "Has acertado! Lo lograste en " + intentos + " intentos.";
        
        mejorText.textContent = datos.mejorPuntaje;
        partidasText.textContent = datos.partidasFinalizadas;
        promedioText.textContent = datos.promedio;

        document.getElementById("numero").disabled = true;   // bloquear input
        probarBtn.disabled = true;    
        document.getElementById("reiniciar").disabled = false; 
        
    }

    mensajeText.textContent = mensaje;
    mostrarEstadisticas();
    actualizar();
    
}

function actualizar(){
    intentosText.textContent = intentos;
    if(datos.mejorPuntaje !== null){
        mejorText.textContent = datos.mejorPuntaje;
    }
}

function mostrarEstadisticas(){
    const lista = document.getElementById("estadisticas");
    lista.innerHTML = ""; // limpiar

    const items = [
        { label: "Intentos (partida actual)", valor: datos.sumaIntentos },
        { label: "Mejor puntaje", valor: datos.mejorPuntaje ?? "-" },
        { label: "Partidas ganadas", valor: datos.partidasFinalizadas },
        { label: "Promedio de intentos", valor: datos.promedio }
    ];

    for (let i = 0; i < items.length; i++) {
        const li = document.createElement("li");
        li.textContent = items[i].label + ": " + items[i].valor;
        lista.appendChild(li);
    }
}