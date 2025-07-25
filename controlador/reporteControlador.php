<?php

session_start();

// Verificar que el usuario esté logueado
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(array("codigo" => "401", "mensaje" => "Usuario no autenticado"));
    exit();
}

include_once "../modelo/reporteModelo.php";

class ReporteControlador{

    public $idusuario;
    public $periodo;
    public $fecha_inicio;
    public $fecha_fin;
    public $idcategoria;
    public $idcuenta;
    public $tipo;
    
    public function ctrObtenerResumenGeneral(){
        try {
            // Ignorar período completamente
            $this->idusuario = $_SESSION['usuario_id'];
            $objRespuesta = ReporteModelo::mdlObtenerResumenGeneral($this->idusuario);
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }

    public function ctrObtenerGastosPorCategoria(){
        try {
            // Ignorar período completamente
            $this->idusuario = $_SESSION['usuario_id'];
            $objRespuesta = ReporteModelo::mdlObtenerGastosPorCategoria($this->idusuario);
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }

    public function ctrObtenerIngresosPorCategoria(){
        try {
            // Ignorar período completamente
            $this->idusuario = $_SESSION['usuario_id'];
            $objRespuesta = ReporteModelo::mdlObtenerIngresosPorCategoria($this->idusuario);
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }

    public function ctrObtenerEvolucionMensual(){
        try {
            $this->idusuario = $_SESSION['usuario_id'];
            $objRespuesta = ReporteModelo::mdlObtenerEvolucionMensual($this->idusuario);
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }

    public function ctrObtenerSaldosCuentas(){
        try {
            $this->idusuario = $_SESSION['usuario_id'];
            $objRespuesta = ReporteModelo::mdlObtenerSaldosCuentas($this->idusuario);
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }

    public function ctrObtenerReporteDetallado(){
        try {
            $this->idusuario = $_SESSION['usuario_id'];
            $objRespuesta = ReporteModelo::mdlObtenerReporteDetallado(
                $this->idusuario, 
                $this->fecha_inicio, 
                $this->fecha_fin, 
                $this->idcategoria, 
                $this->idcuenta, 
                $this->tipo
            );
            
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
    if (ob_get_level()) {
        ob_clean();
    }
    
    $objReporte = new ReporteControlador();
    
    if(isset($_POST["obtenerResumenGeneral"]) && $_POST["obtenerResumenGeneral"] == "ok") {
        $objReporte->ctrObtenerResumenGeneral();
    }
    else if(isset($_POST["obtenerGastosPorCategoria"]) && $_POST["obtenerGastosPorCategoria"] == "ok") {
        $objReporte->ctrObtenerGastosPorCategoria();
    }
    else if(isset($_POST["obtenerIngresosPorCategoria"]) && $_POST["obtenerIngresosPorCategoria"] == "ok") {
        $objReporte->ctrObtenerIngresosPorCategoria();
    }
    else if(isset($_POST["obtenerEvolucionMensual"]) && $_POST["obtenerEvolucionMensual"] == "ok") {
        $objReporte->ctrObtenerEvolucionMensual();
    }
    else if(isset($_POST["obtenerSaldosCuentas"]) && $_POST["obtenerSaldosCuentas"] == "ok") {
        $objReporte->ctrObtenerSaldosCuentas();
    }
    else if(isset($_POST["obtenerReporteDetallado"]) && $_POST["obtenerReporteDetallado"] == "ok") {
        $objReporte->fecha_inicio = isset($_POST["fecha_inicio"]) ? $_POST["fecha_inicio"] : null;
        $objReporte->fecha_fin = isset($_POST["fecha_fin"]) ? $_POST["fecha_fin"] : null;
        $objReporte->idcategoria = isset($_POST["idcategoria"]) ? $_POST["idcategoria"] : null;
        $objReporte->idcuenta = isset($_POST["idcuenta"]) ? $_POST["idcuenta"] : null;
        $objReporte->tipo = isset($_POST["tipo"]) ? $_POST["tipo"] : null;
        $objReporte->ctrObtenerReporteDetallado();
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
