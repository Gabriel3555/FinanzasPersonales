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
            $objRespuesta = ReporteModelo::mdlObtenerResumenGeneral($this->idusuario, $this->periodo);
            
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
            $objRespuesta = ReporteModelo::mdlObtenerGastosPorCategoria($this->idusuario, $this->periodo);
            
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
            $objRespuesta = ReporteModelo::mdlObtenerIngresosPorCategoria($this->idusuario, $this->periodo);
            
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
    
    if(isset($_POST["obtenerResumenGeneral"]) && $_POST["obtenerResumenGeneral"] == "ok") {
        $objReporte = new ReporteControlador();
        $objReporte->idusuario = $_SESSION['usuario_id'];
        $objReporte->periodo = isset($_POST["periodo"]) ? $_POST["periodo"] : "mes";
        $objReporte->ctrObtenerResumenGeneral();
    }
    else if(isset($_POST["obtenerGastosPorCategoria"]) && $_POST["obtenerGastosPorCategoria"] == "ok") {
        $objReporte = new ReporteControlador();
        $objReporte->idusuario = $_SESSION['usuario_id'];
        $objReporte->periodo = isset($_POST["periodo"]) ? $_POST["periodo"] : "mes";
        $objReporte->ctrObtenerGastosPorCategoria();
    }
    else if(isset($_POST["obtenerIngresosPorCategoria"]) && $_POST["obtenerIngresosPorCategoria"] == "ok") {
        $objReporte = new ReporteControlador();
        $objReporte->idusuario = $_SESSION['usuario_id'];
        $objReporte->periodo = isset($_POST["periodo"]) ? $_POST["periodo"] : "mes";
        $objReporte->ctrObtenerIngresosPorCategoria();
    }
    else if(isset($_POST["obtenerEvolucionMensual"]) && $_POST["obtenerEvolucionMensual"] == "ok") {
        $objReporte = new ReporteControlador();
        $objReporte->idusuario = $_SESSION['usuario_id'];
        $objReporte->ctrObtenerEvolucionMensual();
    }
    else if(isset($_POST["obtenerSaldosCuentas"]) && $_POST["obtenerSaldosCuentas"] == "ok") {
        $objReporte = new ReporteControlador();
        $objReporte->idusuario = $_SESSION['usuario_id'];
        $objReporte->ctrObtenerSaldosCuentas();
    }
    else if(isset($_POST["obtenerReporteDetallado"]) && $_POST["obtenerReporteDetallado"] == "ok") {
        $objReporte = new ReporteControlador();
        $objReporte->idusuario = $_SESSION['usuario_id'];
        $objReporte->fecha_inicio = $_POST["fecha_inicio"];
        $objReporte->fecha_fin = $_POST["fecha_fin"];
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
