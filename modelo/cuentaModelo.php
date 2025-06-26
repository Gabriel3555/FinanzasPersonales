<?php

include_once "conexion.php";

class CuentaModelo{
    
    public static function mdlMostrarCuenta($idusuario){
        $message = array();
        
        try {
            $objRespuesta = Conexion::conectar()->prepare("SELECT * FROM cuentas WHERE idusuario = :idusuario AND estado = 1 ORDER BY nombre");
            $objRespuesta->bindParam(":idusuario", $idusuario);
            $objRespuesta->execute();
            $listaCuenta = $objRespuesta->fetchAll();
            $objRespuesta = null;
            
            $message = array("codigo"=>"200", "listaCuenta"=>$listaCuenta);
        } catch (Exception $e) {
            $message = array("codigo"=>"400", "mensaje"=>$e->getMessage());
        }

        return $message;
    }

    public static function mdlCrearCuenta($idusuario, $nombre, $tipo, $saldo_inicial){
        $mensaje = array();

        try {
            $objRespuesta = Conexion::conectar()->prepare("
                INSERT INTO cuentas (idusuario, nombre, tipo, saldo_inicial, saldo_actual) 
                VALUES (:idusuario, :nombre, :tipo, :saldo_inicial, :saldo_actual)
            ");
            $objRespuesta->bindParam(":idusuario", $idusuario);
            $objRespuesta->bindParam(":nombre", $nombre);
            $objRespuesta->bindParam(":tipo", $tipo);
            $objRespuesta->bindParam(":saldo_inicial", $saldo_inicial);
            $objRespuesta->bindParam(":saldo_actual", $saldo_inicial);

            if ($objRespuesta->execute()) {
                $mensaje = array("codigo" => "200", "mensaje" => "Cuenta creada correctamente.");
            } else {
                $mensaje = array("codigo" => "401", "mensaje" => "Error al crear la cuenta.");
            }
            $objRespuesta = null;
        } catch (Exception $e) {
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }

        return $mensaje;
    }

    public static function mdlEditarCuenta($idcuenta, $nombre, $tipo, $idusuario){
        $mensaje = array();

        try {
            $objRespuesta = Conexion::conectar()->prepare("UPDATE cuentas SET nombre=:nombre, tipo=:tipo WHERE idcuenta=:idcuenta AND idusuario=:idusuario");
            $objRespuesta->bindParam(":nombre", $nombre);
            $objRespuesta->bindParam(":tipo", $tipo);
            $objRespuesta->bindParam(":idcuenta", $idcuenta);
            $objRespuesta->bindParam(":idusuario", $idusuario);
            
            if ($objRespuesta->execute()) {
                $mensaje = array("codigo" => "200", "mensaje" => "Cuenta actualizada correctamente.");
            } else {
                $mensaje = array("codigo" => "401", "mensaje" => "Error al actualizar la cuenta.");
            }
            $objRespuesta = null;
        } catch (Exception $e) {
            $mensaje = array("codigo" => "401", "mensaje" => $e->getMessage());
        }
        return $mensaje;
    }

    public static function mdlEliminarCuenta($idcuenta, $idusuario){
        $message = array();

        try {
            // Verificar si tiene transacciones
            $verificar = Conexion::conectar()->prepare("SELECT COUNT(*) as total FROM transacciones WHERE idcuenta = :idcuenta AND estado = 1");
            $verificar->bindParam(":idcuenta", $idcuenta);
            $verificar->execute();
            $tiene_transacciones = $verificar->fetch();

            if($tiene_transacciones['total'] > 0){
                $message = array("codigo"=>"401", "mensaje"=>"No se puede eliminar la cuenta porque tiene transacciones asociadas");
                return $message;
            }

            $objRespuesta = Conexion::conectar()->prepare("UPDATE cuentas SET estado = 0 WHERE idcuenta = :idcuenta AND idusuario = :idusuario");
            $objRespuesta->bindParam(":idcuenta", $idcuenta);
            $objRespuesta->bindParam(":idusuario", $idusuario);
            
            if($objRespuesta->execute()){
                $message = array("codigo"=>"200", "mensaje"=>"La cuenta fue eliminada correctamente");
            } else {
                $message = array("codigo"=>"401", "mensaje"=>"La cuenta no se pudo eliminar");
            }
        } catch (Exception $e) {
            $message = array("codigo"=>"401", "mensaje"=>$e->getMessage());
        }

        return $message;
    }
}
