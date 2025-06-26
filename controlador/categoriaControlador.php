<?php

session_start();
include_once "../modelo/categoriaModelo.php";

class CategoriaControlador{

    public $idcategoria;
    public $idusuario;
    public $nombre;
    public $tipo;
    public $color;
    public $icono;
    
    public function ctrMostrarCategoria(){
        $objRespuesta = CategoriaModelo::mdlMostrarCategoria($this->idusuario);
        echo json_encode($objRespuesta);
    }

    public function ctrEliminarCategoria(){
        $objRespuesta = CategoriaModelo::mdlEliminarCategoria($this->idcategoria, $this->idusuario);
        echo json_encode($objRespuesta);
    }

    public function ctrAnadirCategoria(){
        $objRespuesta = CategoriaModelo::mdlCrearCategoria($this->idusuario, $this->nombre, $this->tipo, $this->color, $this->icono);
        echo json_encode($objRespuesta);
    }

    public function ctrEditarCategoria(){
        $objRespuesta = CategoriaModelo::mdlEditarCategoria($this->idcategoria, $this->nombre, $this->tipo, $this->color, $this->icono, $this->idusuario);
        echo json_encode($objRespuesta);
    }
}

if(isset($_POST["mostrarCategoria"]) == "ok") {
    $objCategoria = new CategoriaControlador();
    $objCategoria->idusuario = $_SESSION['usuario_id'];
    $objCategoria->ctrMostrarCategoria();
}

if(isset($_POST["eliminarCategoria"]) == "ok") {
    $objCategoria = new CategoriaControlador();
    $objCategoria->idcategoria = $_POST["idcategoria"];
    $objCategoria->idusuario = $_SESSION['usuario_id'];
    $objCategoria->ctrEliminarCategoria();
}

if (isset($_POST["registrarCategoria"]) == "ok"){
    $objCategoria = new CategoriaControlador();
    $objCategoria->idusuario = $_SESSION['usuario_id'];
    $objCategoria->nombre = $_POST["nombre"];
    $objCategoria->tipo = $_POST["tipo"];
    $objCategoria->color = $_POST["color"];
    $objCategoria->icono = $_POST["icono"];
    $objCategoria->ctrAnadirCategoria();
}

if (isset($_POST["editarCategoria"]) == "ok"){
    $objCategoria = new CategoriaControlador();
    $objCategoria->idcategoria = $_POST["idcategoria"];
    $objCategoria->nombre = $_POST["nombre"];
    $objCategoria->tipo = $_POST["tipo"];
    $objCategoria->color = $_POST["color"];
    $objCategoria->icono = $_POST["icono"];
    $objCategoria->idusuario = $_SESSION['usuario_id'];
    $objCategoria->ctrEditarCategoria();
}
