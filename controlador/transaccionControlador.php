<?php

session_start();

// Configuración de errores para producción
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Verificar que el usuario esté logueado
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(array("codigo" => "401", "mensaje" => "Usuario no autenticado"));
    exit();
}

include_once "../modelo/transaccionModelo.php";

class TransaccionControlador{

    public $idtransaccion;
    public $idusuario;
    public $idcuenta;
    public $idcategoria;
    public $tipo;
    public $monto;
    public $descripcion;
    public $fecha_transaccion;
    public $periodo;
    
    public function ctrMostrarTransaccion(){
        try {
            $objRespuesta = TransaccionModelo::mdlMostrarTransaccion($this->idusuario);
            
            // Asegurar que la respuesta sea JSON válido
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }

    public function ctrEliminarTransaccion(){
        try {
            // Validar datos de entrada
            if (empty($this->idtransaccion) || !is_numeric($this->idtransaccion)) {
                echo json_encode(array("codigo" => "400", "mensaje" => "ID de transacción inválido"));
                return;
            }

            $objRespuesta = TransaccionModelo::mdlEliminarTransaccion($this->idtransaccion, $this->idusuario);
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }

    public function ctrAnadirTransaccion(){
        try {
            // Validar datos de entrada
            if (empty($this->idcuenta) || !is_numeric($this->idcuenta)) {
                echo json_encode(array("codigo" => "400", "mensaje" => "ID de cuenta inválido"));
                return;
            }

            if (empty($this->idcategoria) || !is_numeric($this->idcategoria)) {
                echo json_encode(array("codigo" => "400", "mensaje" => "ID de categoría inválido"));
                return;
            }

            if (!in_array($this->tipo, ['ingreso', 'gasto'])) {
                echo json_encode(array("codigo" => "400", "mensaje" => "Tipo de transacción inválido"));
                return;
            }

            if (empty($this->monto) || !is_numeric($this->monto) || $this->monto <= 0) {
                echo json_encode(array("codigo" => "400", "mensaje" => "Monto inválido"));
                return;
            }

            if (empty($this->fecha_transaccion)) {
                echo json_encode(array("codigo" => "400", "mensaje" => "Fecha de transacción requerida"));
                return;
            }

            $objRespuesta = TransaccionModelo::mdlCrearTransaccion(
                $this->idusuario, 
                $this->idcuenta, 
                $this->idcategoria, 
                $this->tipo, 
                $this->monto, 
                $this->descripcion, 
                $this->fecha_transaccion
            );
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }

    public function ctrObtenerResumen(){
        try {
            $objRespuesta = TransaccionModelo::mdlObtenerResumen($this->idusuario, $this->periodo);
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }
}

try {
    // Limpiar cualquier output previo
    ob_clean();
    
    if(isset($_POST["mostrarTransaccion"]) && $_POST["mostrarTransaccion"] == "ok") {
        $objTransaccion = new TransaccionControlador();
        $objTransaccion->idusuario = $_SESSION['usuario_id'];
        $objTransaccion->ctrMostrarTransaccion();
    }
    else if(isset($_POST["eliminarTransaccion"]) && $_POST["eliminarTransaccion"] == "ok") {
        $objTransaccion = new TransaccionControlador();
        $objTransaccion->idtransaccion = $_POST["idtransaccion"];
        $objTransaccion->idusuario = $_SESSION['usuario_id'];
        $objTransaccion->ctrEliminarTransaccion();
    }
    else if (isset($_POST["registrarTransaccion"]) && $_POST["registrarTransaccion"] == "ok"){
        $objTransaccion = new TransaccionControlador();
        $objTransaccion->idusuario = $_SESSION['usuario_id'];
        $objTransaccion->idcuenta = $_POST["idcuenta"];
        $objTransaccion->idcategoria = $_POST["idcategoria"];
        $objTransaccion->tipo = $_POST["tipo"];
        $objTransaccion->monto = $_POST["monto"];
        $objTransaccion->descripcion = $_POST["descripcion"];
        $objTransaccion->fecha_transaccion = $_POST["fecha_transaccion"];
        $objTransaccion->ctrAnadirTransaccion();
    }
    else if (isset($_POST["obtenerResumen"]) && $_POST["obtenerResumen"] == "ok"){
        $objTransaccion = new TransaccionControlador();
        $objTransaccion->idusuario = $_SESSION['usuario_id'];
        $objTransaccion->periodo = isset($_POST["periodo"]) ? $_POST["periodo"] : "mes";
        $objTransaccion->ctrObtenerResumen();
    }
    else {
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode(array("codigo" => "400", "mensaje" => "Acción no válida"));
    }
    
} catch (Exception $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
}
?>
