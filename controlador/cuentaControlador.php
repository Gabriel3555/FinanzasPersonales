<?php

session_start();
include_once "../modelo/cuentaModelo.php";

class CuentaControlador{

    public $idcuenta;
    public $idusuario;
    public $nombre;
    public $tipo;
    public $saldo_inicial;
    
    public function ctrMostrarCuenta(){
        $objRespuesta = CuentaModelo::mdlMostrarCuenta($this->idusuario);
        echo json_encode($objRespuesta);
    }

    public function ctrEliminarCuenta(){
        $objRespuesta = CuentaModelo::mdlEliminarCuenta($this->idcuenta, $this->idusuario);
        echo json_encode($objRespuesta);
    }

    public function ctrAnadirCuenta(){
        $objRespuesta = CuentaModelo::mdlCrearCuenta($this->idusuario, $this->nombre, $this->tipo, $this->saldo_inicial);
        echo json_encode($objRespuesta);
    }

    public function ctrEditarCuenta(){
        $objRespuesta = CuentaModelo::mdlEditarCuenta($this->idcuenta, $this->nombre, $this->tipo, $this->idusuario);
        echo json_encode($objRespuesta);
    }
}

if(isset($_POST["mostrarCuenta"]) == "ok") {
    $objCuenta = new CuentaControlador();
    $objCuenta->idusuario = $_SESSION['usuario_id'];
    $objCuenta->ctrMostrarCuenta();
}

if(isset($_POST["eliminarCuenta"]) == "ok") {
    $objCuenta = new CuentaControlador();
    $objCuenta->idcuenta = $_POST["idcuenta"];
    $objCuenta->idusuario = $_SESSION['usuario_id'];
    $objCuenta->ctrEliminarCuenta();
}

if (isset($_POST["registrarCuenta"]) == "ok"){
    $objCuenta = new CuentaControlador();
    $objCuenta->idusuario = $_SESSION['usuario_id'];
    $objCuenta->nombre = $_POST["nombre"];
    $objCuenta->tipo = $_POST["tipo"];
    $objCuenta->saldo_inicial = $_POST["saldo_inicial"];
    $objCuenta->ctrAnadirCuenta();
}

if (isset($_POST["editarCuenta"]) == "ok"){
    $objCuenta = new CuentaControlador();
    $objCuenta->idcuenta = $_POST["idcuenta"];
    $objCuenta->nombre = $_POST["nombre"];
    $objCuenta->tipo = $_POST["tipo"];
    $objCuenta->idusuario = $_SESSION['usuario_id'];
    $objCuenta->ctrEditarCuenta();
}
