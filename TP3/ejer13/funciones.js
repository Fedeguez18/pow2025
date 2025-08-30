var N1="";
var N2="";
var OP="";
var R="";

function preencher(numero){
    var aux = document.getElementById("visor").value;
    if(aux == "0"){
        document.getElementById("visor").value = numero;
    }else{
        document.getElementById("visor").value = aux + numero;
    }
}

function zerar(){
    document.getElementById("visor").value = "0";
    N1="";
    OP="";
}

function backspace(){

}

function masMenos(){}
function punto(){}
function operacion(op){}
function porcentaje(){}
function calcular(){}