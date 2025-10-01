<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$archivo = 'turnero_data.json';
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch($action){
    case 'cargar':
        cargarDatos();
        break;
    case 'guardar':
        guardarDatos();
        break;
    default:
        echo json_encode(['success' => false, 'message'=> 'accion no valida']);
        break;
}

function cargarDatos(){
    global $archivo;

    if (file_exists($archivo)){
        $contenido = file_get_contents($archivo);
        $datos = json_decode($contenido, true);
        if(!is_array($datos)){
            $datos = [];
        }
        // Devolver valores por defecto si no existen
        $li = isset($datos['limite_inferior']) ? intval($datos['limite_inferior']) : 1;
        $ls = isset($datos['limite_superior']) ? intval($datos['limite_superior']) : 100;
        $nums = isset($datos['numeros']) && is_array($datos['numeros']) ? array_map('intval', $datos['numeros']) : [];

        echo json_encode([
            'success' => true,
            'data' => [
                'limite_inferior' => $li,
                'limite_superior' => $ls,
                'numeros' => $nums
            ]
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => [
                'limite_inferior' => 1,
                'limite_superior' => 100,
                'numeros' => []
            ]
        ]);
    }
}

function guardarDatos(){
    global $archivo;
    $input = file_get_contents('php://input');
    $datos = json_decode($input, true);

    if($datos === null || !is_array($datos)){
        echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
        return;
    }

    // Validar límites
    if(!isset($datos['limite_inferior']) || !isset($datos['limite_superior'])){
        echo json_encode(['success' => false, 'message' => 'Faltan límites']);
        return;
    }
    $li = intval($datos['limite_inferior']);
    $ls = intval($datos['limite_superior']);
    if($li >= $ls){
        echo json_encode(['success' => false, 'message' => 'El límite inferior debe ser menor que el superior']);
        return;
    }

    // Numeros puede no venir (entonces lo guardamos vacío) o venir como array
    $numeros = [];
    if (isset($datos['numeros']) && is_array($datos['numeros'])) {
        $numeros = array_map('intval', $datos['numeros']);
    }

    $toSave = [
        'limite_inferior' => $li,
        'limite_superior' => $ls,
        'numeros' => $numeros
    ];

    $resultado = file_put_contents($archivo, json_encode($toSave, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    if($resultado === false){
        echo json_encode(['success' => false, 'message' => 'Error al guardar datos en el servidor']);
    } else {
        echo json_encode(['success' => true, 'message' => 'Datos guardados correctamente']);
    }
}
?>
