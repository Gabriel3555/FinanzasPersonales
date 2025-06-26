<?php

include_once "../modelo/usuarioModelo.php";

class UsuarioControlador{

    public $idusuario;
    public $documento;
    public $nombre;
    public $apellido;
    public $email;
    public $password;
    
    public function ctrMostrarUsuario(){
        $objRespuesta = UsuarioModelo::mdlMostrarUsuario();
        echo json_encode($objRespuesta);
    }

    public function ctrEliminarUsuario(){
        $objRespuesta = UsuarioModelo::mdlEliminarUsuario($this->idusuario);
        echo json_encode($objRespuesta);
    }

    public function ctrAnadirUsuario(){
        $objRespuesta = UsuarioModelo::mdlCrearUsuario($this->documento, $this->nombre, $this->apellido, $this->email, $this->password);
        echo json_encode($objRespuesta);
    }

    public function ctrEditarUsuario(){
        $objRespuesta = UsuarioModelo::mdlEditarUsuario($this->documento, $this->nombre, $this->apellido, $this->email, $this->idusuario);
        echo json_encode($objRespuesta);
    }

    public function ctrLogin(){
        $objRespuesta = UsuarioModelo::mdlLogin($this->email, $this->password);
        echo json_encode($objRespuesta);
    }
}

if(isset($_POST["mostrarUsuario"]) == "ok") {
    $objUsuario = new UsuarioControlador();
    $objUsuario->ctrMostrarUsuario();
}

if(isset($_POST["eliminarUsuario"]) == "ok") {
    $objUsuario = new UsuarioControlador();
    $objUsuario->idusuario = $_POST["idusuario"];
    $objUsuario->ctrEliminarUsuario();
}

if (isset($_POST["registrarUsuario"]) == "ok"){
    $objUsuarios = new UsuarioControlador();
    $objUsuarios->documento = $_POST["documento"];
    $objUsuarios->nombre = $_POST["nombre"];
    $objUsuarios->apellido = $_POST["apellido"];    
    $objUsuarios->email = $_POST["email"];
    $objUsuarios->password = $_POST["password"];
    $objUsuarios->ctrAnadirUsuario();
}

if (isset($_POST["editarUsuario"]) == "ok"){
    $objUsuarios = new UsuarioControlador();
    $objUsuarios->documento = $_POST["documento"];
    $objUsuarios->nombre = $_POST["nombre"];
    $objUsuarios->apellido = $_POST["apellido"];
    $objUsuarios->email = $_POST["email"];
    $objUsuarios->idusuario = $_POST["idusuario"];
    $objUsuarios->ctrEditarUsuario();
}

if (isset($_POST["login"]) == "ok"){
    $objUsuarios = new UsuarioControlador();
    $objUsuarios->email = $_POST["email"];
    $objUsuarios->password = $_POST["password"];
    $objUsuarios->ctrLogin();
}
