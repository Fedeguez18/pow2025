var N1 = "";
var N2 = "";
var OP = "";
var R = "";
var EXPR = ""; // cadena para mostrar la operación completa

// Helpers para leer/mostrar con coma como separador decimal
function getVisorRaw() {
    return document.getElementById("visor").value;
}
function getVisorNumber() {
    var s = getVisorRaw().toString().trim();
    if (s === "" || s === "Error") return 0;
    s = s.replace(",", "."); // aceptar coma como separador
    return parseFloat(s) || 0;
}
function formatNumberDisplay(n) {
    if (n === "Error") return "Error";
    // evita notación exponencial y convierte a cadena normal
    var s = (typeof n === "number") ? String(n) : String(Number(n));
    // elimina ceros innecesarios: "7.560000" -> "7.56"
    if (s.indexOf(".") !== -1) {
        s = parseFloat(s).toString();
    }
    return s.replace(".", ",");
}
function setVisorNumber(n) {
    if (n === "Error") {
        document.getElementById("visor").value = "Error";
        return;
    }
    document.getElementById("visor").value = formatNumberDisplay(n);
}

function preencher(numero) {
    var aux = getVisorRaw();
    // si el visor muestra la expresión (contiene espacio) o "0", reemplazo
    if (aux === "0" || aux.indexOf(" ") !== -1 || aux === "Error") {
        document.getElementById("visor").value = numero;
    } else {
        document.getElementById("visor").value = aux + numero;
    }
}

function zerar() {
    document.getElementById("visor").value = "0";
    N1 = "";
    OP = "";
    N2 = "";
    EXPR = "";
}

function backspace() {
    var v = getVisorRaw();
    if (v.length > 1 && v !== "Error") {
        document.getElementById("visor").value = v.slice(0, -1);
    } else {
        document.getElementById("visor").value = "0";
    }
}

function masMenos() {
    var auxNum = getVisorNumber();
    if (auxNum !== 0 || getVisorRaw().indexOf(",") !== -1) {
        setVisorNumber(auxNum * -1);
    }
}

function punto() {
    var v = getVisorRaw();
    // usar coma como separador visual
    if (v.indexOf(",") === -1) {
        document.getElementById("visor").value = (v === "0" || v.indexOf(" ") !== -1) ? "0," : v + ",";
    }
}

function operacion(op) {
    // si no hay N1, guardo primer operando y preparo para el segundo
    if (N1 === "") {
        OP = op;
        N1 = getVisorNumber();
        document.getElementById("visor").value = "0";
        EXPR = ""; // limpio
    } else {
        // ya había una operación pendiente: tomo N2 actual, muestro la operación completa
        N2 = getVisorNumber();
        // guardo la expresión para mostrarla y para calcular después (mostrar con coma)
        EXPR = formatNumberDisplay(N1) + " " + OP + " " + formatNumberDisplay(N2);
        document.getElementById("visor").value = EXPR;
        // actualizo OP al nuevo operador pulsado para una posible cadena de operaciones
        OP = op;
        // Nota: no calculo aún; el usuario debe pulsar '=' para ejecutar calcular()
    }
}

function porcentaje() {
    var v = getVisorNumber();
    var res = v / 100;
    // muestro con coma sin romper la lógica interna (seguimos usando getVisorNumber para parsear)
    setVisorNumber(res);
}

function calcular() {
    // si no hay N1 u OP no hay operación
    if (N1 === "" || OP === "") return;

    // si N2 no está definida (usuario no presionó operacion dos veces), la tomo del visor
    if (N2 === "" && EXPR === "") {
        N2 = getVisorNumber();
    }

    var resultado = 0;
    switch (OP) {
        case "+":
            resultado = N1 + Number(N2);
            break;
        case "-":
            resultado = N1 - Number(N2);
            break;
        case "*":
        case "x":
        case "X":
            resultado = N1 * Number(N2);
            break;
        case "/":
        case "÷":
            resultado = Number(N2) === 0 ? "Error" : N1 / Number(N2);
            break;
        default:
            return;
    }

    // muestro resultado (con coma) y reinicio estado para seguir operando con el resultado
    setVisorNumber(resultado);
    N1 = (typeof resultado === "number") ? resultado : "";
    N2 = "";
    OP = "";
    EXPR = "";
}