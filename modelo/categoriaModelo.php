<?php

include_once "conexion.php";

class CategoriaModelo{
    
    public static function mdlMostrarCategoria($idusuario){
        $message = array();
        
        try {
            $objRespuesta = Conexion::conectar()->prepare("SELECT * FROM categorias WHERE idusuario = :idusuario AND estado = 1 ORDER BY tipo, nombre");
            $objRespuesta->bindParam(":idusuario", $idusuario);
            $objRespuesta->execute();
            $listaCategoria = $objRespuesta->fetchAll();
            $objRespuesta = null;
            
            $message = array("codigo"=>"200", "listaCategoria"=>$listaCategoria);
        } catch (Exception $e) {
            $message = array("codigo"=>"400", "mensaje"=>$e->getMessage());
        }

        return $message;
    }

    public static function mdlCrearCategoria($idusuario, $nombre, $tipo, $color, $icono){
        $mensaje = array();

        try {
            $objRespuesta = Conexion::conectar()->prepare("
                INSERT INTO categorias (idusuario, nombre, tipo, color, icono) 
                VALUES (:idusuario, :nombre, :tipo, :color, :icono)
            ");
            $objRespuesta->bindParam(":idusuario", $idusuario);
            $objRespuesta->bindParam(":nombre", $nombre);
            $objRespuesta->bindParam(":tipo", $tipo);
            $objRespuesta->bindParam(":color", $color);
            $objRespuesta->bindParam(":icono", $icono);

            if ($objRespuesta->execute()) {
                $mensaje = array("codigo" => "200", "mensaje" => "Categoría creada correctamente.");
            } else {
                $mensaje = array("codigo" => "401", "mensaje" => "Error al crear la categoría.");
            }
            $objRespuesta = null;
        } catch (Exception $e) {
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }

        return $mensaje;
    }

    public static function mdlEditarCategoria($idcategoria, $nombre, $tipo, $color, $icono, $idusuario){
        $mensaje = array();

        try {
            $objRespuesta = Conexion::conectar()->prepare("
                UPDATE categorias SET nombre=:nombre, tipo=:tipo, color=:color, icono=:icono 
                WHERE idcategoria=:idcategoria AND idusuario=:idusuario
            ");
            $objRespuesta->bindParam(":nombre", $nombre);
            $objRespuesta->bindParam(":tipo", $tipo);
            $objRespuesta->bindParam(":color", $color);
            $objRespuesta->bindParam(":icono", $icono);
            $objRespuesta->bindParam(":idcategoria", $idcategoria);
            $objRespuesta->bindParam(":idusuario", $idusuario);
            
            if ($objRespuesta->execute()) {
                $mensaje = array("codigo" => "200", "mensaje" => "Categoría actualizada correctamente.");
            } else {
                $mensaje = array("codigo" => "401", "mensaje" => "Error al actualizar la categoría.");
            }
            $objRespuesta = null;
        } catch (Exception $e) {
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }
        return $mensaje;
    }

    public static function mdlEliminarCategoria($idcategoria, $idusuario){
        $message = array();

        try {
            // Verificar si tiene transacciones
            $verificar = Conexion::conectar()->prepare("SELECT COUNT(*) as total FROM transacciones WHERE idcategoria = :idcategoria AND estado = 1");
            $verificar->bindParam(":idcategoria", $idcategoria);
            $verificar->execute();
            $tiene_transacciones = $verificar->fetch();

            if($tiene_transacciones['total'] > 0){
                $message = array("codigo"=>"401", "mensaje"=>"No se puede eliminar la categoría porque tiene transacciones asociadas");
                return $message;
            }

            $objRespuesta = Conexion::conectar()->prepare("UPDATE categorias SET estado = 0 WHERE idcategoria = :idcategoria AND idusuario = :idusuario");
            $objRespuesta->bindParam(":idcategoria", $idcategoria);
            $objRespuesta->bindParam(":idusuario", $idusuario);
            
            if($objRespuesta->execute()){
                $message = array("codigo"=>"200", "mensaje"=>"La categoría fue eliminada correctamente");
            } else {
                $message = array("codigo"=>"401", "mensaje"=>"La categoría no se pudo eliminar");
            }
        } catch (Exception $e) {
            $message = array("codigo"=>"401", "mensaje"=>$e->getMessage());
        }

        return $message;
    }
}
