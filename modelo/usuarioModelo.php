<?php

include_once "conexion.php";

class UsuarioModelo{
    
    public static function mdlMostrarUsuario(){
        $message = array();
        
        try {
            $objRespuesta = Conexion::conectar()->prepare("SELECT idusuario, documento, nombre, apellido, email, fecha_registro, estado FROM usuarios WHERE estado = 1");
            $objRespuesta->execute();
            $listaUsuario = $objRespuesta->fetchAll();
            $objRespuesta = null;
            
            $message = array("codigo"=>"200", "listaUsuario"=>$listaUsuario);
        } catch (Exception $e) {
            $message = array("codigo"=>"400", "mensaje"=>$e->getMessage());
        }

        return $message;
    }

    public static function mdlCrearUsuario($documento, $nombre, $apellido, $email, $password){
        $mensaje = array();

        try {
            // Verificar si el usuario ya existe
            $verificar = Conexion::conectar()->prepare("SELECT COUNT(*) as total FROM usuarios WHERE documento = :documento OR email = :email");
            $verificar->bindParam(":documento", $documento);
            $verificar->bindParam(":email", $email);
            $verificar->execute();
            $existe = $verificar->fetch();

            if($existe['total'] > 0){
                $mensaje = array("codigo" => "401", "mensaje" => "El documento o email ya están registrados.");
                return $mensaje;
            }

            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            
            $objRespuesta = Conexion::conectar()->prepare("INSERT INTO usuarios (documento, nombre, apellido, email, password) VALUES (:documento, :nombre, :apellido, :email, :password)");
            $objRespuesta->bindParam(":documento", $documento);
            $objRespuesta->bindParam(":nombre", $nombre);
            $objRespuesta->bindParam(":apellido", $apellido);
            $objRespuesta->bindParam(":email", $email);
            $objRespuesta->bindParam(":password", $passwordHash);

            if ($objRespuesta->execute()) {
                $mensaje = array("codigo" => "200", "mensaje" => "Usuario creado correctamente.");
            } else {
                $mensaje = array("codigo" => "401", "mensaje" => "Error al crear el usuario.");
            }
            $objRespuesta = null;
        } catch (Exception $e) {
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }

        return $mensaje;
    }

    public static function mdlEditarUsuario($documento, $nombre, $apellido, $email, $idusuario){
        $mensaje = array();

        try {
            $objRespuesta = Conexion::conectar()->prepare("UPDATE usuarios SET documento=:documento, nombre=:nombre, apellido=:apellido, email=:email WHERE idusuario=:idusuario");
            $objRespuesta->bindParam(":documento", $documento);
            $objRespuesta->bindParam(":nombre", $nombre);
            $objRespuesta->bindParam(":apellido", $apellido);
            $objRespuesta->bindParam(":email", $email);
            $objRespuesta->bindParam(":idusuario", $idusuario);
            
            if ($objRespuesta->execute()) {
                $mensaje = array("codigo" => "200", "mensaje" => "Usuario actualizado correctamente.");
            } else {
                $mensaje = array("codigo" => "401", "mensaje" => "Error al actualizar el usuario.");
            }
            $objRespuesta = null;
        } catch (Exception $e) {
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }
        return $mensaje;
    }

    public static function mdlEliminarUsuario($idusuario){
        $message = array();

        try {
            $objRespuesta = Conexion::conectar()->prepare("UPDATE usuarios SET estado = 0 WHERE idusuario = :idusuario");
            $objRespuesta->bindParam(":idusuario", $idusuario);
            if($objRespuesta->execute()){
                $message = array("codigo"=>"200", "mensaje"=>"El usuario fue eliminado correctamente");
            } else {
                $message = array("codigo"=>"401", "mensaje"=>"El usuario no se pudo eliminar");
            }
        } catch (Exception $e) {
            $message = array("codigo"=>"401", "mensaje"=>$e->getMessage());
        }

        return $message;
    }

    public static function mdlLogin($email, $password){
        $mensaje = array();

        try {
            $objRespuesta = Conexion::conectar()->prepare("SELECT * FROM usuarios WHERE email = :email AND estado = 1");
            $objRespuesta->bindParam(":email", $email);
            $objRespuesta->execute();
            $usuario = $objRespuesta->fetch();

            if($usuario && password_verify($password, $usuario['password'])){
                session_start();
                $_SESSION['usuario_id'] = $usuario['idusuario'];
                $_SESSION['usuario_nombre'] = $usuario['nombre'] . ' ' . $usuario['apellido'];
                $_SESSION['usuario_email'] = $usuario['email'];
                
                $mensaje = array("codigo" => "200", "mensaje" => "Login exitoso", "usuario" => $usuario);
            } else {
                $mensaje = array("codigo" => "401", "mensaje" => "Credenciales incorrectas");
            }
            $objRespuesta = null;
        } catch (Exception $e) {
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }

        return $mensaje;
    }
}
