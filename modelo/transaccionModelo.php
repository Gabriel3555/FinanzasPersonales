<?php

include_once "conexion.php";

class TransaccionModelo{
    
    public static function mdlMostrarTransaccion($idusuario){
        $message = array();
        
        try {
            // Verificar que el usuario existe
            if (empty($idusuario)) {
                return array("codigo"=>"400", "mensaje"=>"ID de usuario requerido");
            }

            $conexion = Conexion::conectar();
            $objRespuesta = $conexion->prepare("
                SELECT t.*, c.nombre as cuenta_nombre, cat.nombre as categoria_nombre, cat.color as categoria_color
                FROM transacciones t 
                INNER JOIN cuentas c ON t.idcuenta = c.idcuenta 
                INNER JOIN categorias cat ON t.idcategoria = cat.idcategoria 
                WHERE t.idusuario = :idusuario AND t.estado = 1 
                ORDER BY t.fecha_transaccion DESC, t.fecha_registro DESC
            ");
            
            if (!$objRespuesta) {
                return array("codigo"=>"500", "mensaje"=>"Error al preparar la consulta");
            }

            $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            
            if (!$objRespuesta->execute()) {
                return array("codigo"=>"500", "mensaje"=>"Error al ejecutar la consulta");
            }

            $listaTransaccion = $objRespuesta->fetchAll(PDO::FETCH_ASSOC);
            $objRespuesta = null;
            
            $message = array("codigo"=>"200", "listaTransaccion"=>$listaTransaccion);
        } catch (PDOException $e) {
            $message = array("codigo"=>"500", "mensaje"=>"Error de base de datos: " . $e->getMessage());
        } catch (Exception $e) {
            $message = array("codigo"=>"500", "mensaje"=>"Error interno: " . $e->getMessage());
        }

        return $message;
    }

    public static function mdlCrearTransaccion($idusuario, $idcuenta, $idcategoria, $tipo, $monto, $descripcion, $fecha_transaccion){
        $mensaje = array();
        $conexion = null;
        $transactionStarted = false;

        try {
            $conexion = Conexion::conectar();
            
            // Verificar que la conexión es válida
            if (!$conexion instanceof PDO) {
                return array("codigo" => "500", "mensaje" => "Error de conexión a la base de datos");
            }

            // Log para debug
            error_log("Iniciando creación de transacción para usuario: $idusuario");
            error_log("Datos: cuenta=$idcuenta, categoria=$idcategoria, tipo=$tipo, monto=$monto");

            // Verificar que la cuenta pertenece al usuario ANTES de iniciar transacción
            $verificarCuenta = $conexion->prepare("SELECT idcuenta, saldo_actual FROM cuentas WHERE idcuenta = :idcuenta AND idusuario = :idusuario AND estado = 1");
            $verificarCuenta->bindParam(":idcuenta", $idcuenta, PDO::PARAM_INT);
            $verificarCuenta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $verificarCuenta->execute();
            $cuenta = $verificarCuenta->fetch(PDO::FETCH_ASSOC);
            
            if (!$cuenta) {
                return array("codigo" => "400", "mensaje" => "La cuenta seleccionada no es válida o no pertenece al usuario");
            }

            // Verificar que la categoría pertenece al usuario ANTES de iniciar transacción
            $verificarCategoria = $conexion->prepare("SELECT idcategoria FROM categorias WHERE idcategoria = :idcategoria AND idusuario = :idusuario AND estado = 1");
            $verificarCategoria->bindParam(":idcategoria", $idcategoria, PDO::PARAM_INT);
            $verificarCategoria->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $verificarCategoria->execute();
            
            if ($verificarCategoria->rowCount() === 0) {
                return array("codigo" => "400", "mensaje" => "La categoría seleccionada no es válida o no pertenece al usuario");
            }

            // Verificar saldo suficiente para gastos
            if ($tipo === 'gasto' && $cuenta['saldo_actual'] < $monto) {
                return array("codigo" => "400", "mensaje" => "Saldo insuficiente en la cuenta seleccionada");
            }

            // AHORA SÍ iniciar transacción (después de todas las validaciones)
            $conexion->beginTransaction();
            $transactionStarted = true;
            error_log("Transacción iniciada correctamente");

            // Insertar transacción
            $objRespuesta = $conexion->prepare("
                INSERT INTO transacciones (idusuario, idcuenta, idcategoria, tipo, monto, descripcion, fecha_transaccion) 
                VALUES (:idusuario, :idcuenta, :idcategoria, :tipo, :monto, :descripcion, :fecha_transaccion)
            ");
            
            $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $objRespuesta->bindParam(":idcuenta", $idcuenta, PDO::PARAM_INT);
            $objRespuesta->bindParam(":idcategoria", $idcategoria, PDO::PARAM_INT);
            $objRespuesta->bindParam(":tipo", $tipo, PDO::PARAM_STR);
            $objRespuesta->bindParam(":monto", $monto, PDO::PARAM_STR);
            $objRespuesta->bindParam(":descripcion", $descripcion, PDO::PARAM_STR);
            $objRespuesta->bindParam(":fecha_transaccion", $fecha_transaccion, PDO::PARAM_STR);

            if (!$objRespuesta->execute()) {
                throw new Exception("Error al insertar la transacción en la base de datos");
            }

            error_log("Transacción insertada correctamente");

            // Actualizar saldo de la cuenta
            if($tipo == 'ingreso'){
                $updateSaldo = $conexion->prepare("UPDATE cuentas SET saldo_actual = saldo_actual + :monto WHERE idcuenta = :idcuenta");
            } else {
                $updateSaldo = $conexion->prepare("UPDATE cuentas SET saldo_actual = saldo_actual - :monto WHERE idcuenta = :idcuenta");
            }
            
            $updateSaldo->bindParam(":monto", $monto, PDO::PARAM_STR);
            $updateSaldo->bindParam(":idcuenta", $idcuenta, PDO::PARAM_INT);
            
            if (!$updateSaldo->execute()) {
                throw new Exception("Error al actualizar el saldo de la cuenta");
            }

            error_log("Saldo actualizado correctamente");

            // Confirmar transacción
            $conexion->commit();
            $transactionStarted = false;
            error_log("Transacción confirmada exitosamente");
            
            $mensaje = array("codigo" => "200", "mensaje" => "Transacción registrada correctamente.");
            
        } catch (PDOException $e) {
            error_log("PDOException en mdlCrearTransaccion: " . $e->getMessage());
            error_log("PDO Error Info: " . print_r($e->errorInfo, true));
            
            // Rollback solo si hay una transacción activa
            if ($conexion && $transactionStarted && $conexion->inTransaction()) {
                try {
                    $conexion->rollback();
                    error_log("Rollback ejecutado correctamente");
                } catch (PDOException $rollbackError) {
                    error_log("Error en rollback: " . $rollbackError->getMessage());
                }
            }
            $mensaje = array("codigo" => "500", "mensaje" => "Error de base de datos: " . $e->getMessage());
            
        } catch (Exception $e) {
            error_log("Exception en mdlCrearTransaccion: " . $e->getMessage());
            
            // Rollback solo si hay una transacción activa
            if ($conexion && $transactionStarted && $conexion->inTransaction()) {
                try {
                    $conexion->rollback();
                    error_log("Rollback ejecutado correctamente");
                } catch (PDOException $rollbackError) {
                    error_log("Error en rollback: " . $rollbackError->getMessage());
                }
            }
            $mensaje = array("codigo" => "500", "mensaje" => "Error interno: " . $e->getMessage());
        }

        return $mensaje;
    }

    public static function mdlEliminarTransaccion($idtransaccion, $idusuario){
        $message = array();
        $conexion = null;
        $transactionStarted = false;

        try {
            $conexion = Conexion::conectar();
            
            // Verificar que la conexión es válida
            if (!$conexion instanceof PDO) {
                return array("codigo" => "500", "mensaje" => "Error de conexión a la base de datos");
            }

            // Obtener datos de la transacción antes de eliminar (ANTES de iniciar transacción)
            $obtenerTransaccion = $conexion->prepare("SELECT * FROM transacciones WHERE idtransaccion = :idtransaccion AND idusuario = :idusuario AND estado = 1");
            $obtenerTransaccion->bindParam(":idtransaccion", $idtransaccion, PDO::PARAM_INT);
            $obtenerTransaccion->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $obtenerTransaccion->execute();
            $transaccion = $obtenerTransaccion->fetch(PDO::FETCH_ASSOC);

            if(!$transaccion){
                return array("codigo"=>"400", "mensaje"=>"Transacción no encontrada o no autorizada");
            }

            // AHORA SÍ iniciar transacción
            $conexion->beginTransaction();
            $transactionStarted = true;

            // Revertir el saldo de la cuenta
            if($transaccion['tipo'] == 'ingreso'){
                $updateSaldo = $conexion->prepare("UPDATE cuentas SET saldo_actual = saldo_actual - :monto WHERE idcuenta = :idcuenta");
            } else {
                $updateSaldo = $conexion->prepare("UPDATE cuentas SET saldo_actual = saldo_actual + :monto WHERE idcuenta = :idcuenta");
            }
            
            $updateSaldo->bindParam(":monto", $transaccion['monto'], PDO::PARAM_STR);
            $updateSaldo->bindParam(":idcuenta", $transaccion['idcuenta'], PDO::PARAM_INT);
            
            if (!$updateSaldo->execute()) {
                throw new Exception("Error al actualizar el saldo de la cuenta");
            }

            // Eliminar transacción (soft delete)
            $objRespuesta = $conexion->prepare("UPDATE transacciones SET estado = 0 WHERE idtransaccion = :idtransaccion");
            $objRespuesta->bindParam(":idtransaccion", $idtransaccion, PDO::PARAM_INT);
            
            if(!$objRespuesta->execute()){
                throw new Exception("Error al eliminar la transacción");
            }

            // Confirmar transacción
            $conexion->commit();
            $transactionStarted = false;
            $message = array("codigo"=>"200", "mensaje"=>"La transacción fue eliminada correctamente");
            
        } catch (PDOException $e) {
            // Rollback solo si hay una transacción activa
            if ($conexion && $transactionStarted && $conexion->inTransaction()) {
                try {
                    $conexion->rollback();
                } catch (PDOException $rollbackError) {
                    error_log("Error en rollback: " . $rollbackError->getMessage());
                }
            }
            $message = array("codigo"=>"500", "mensaje"=>"Error de base de datos: " . $e->getMessage());
        } catch (Exception $e) {
            // Rollback solo si hay una transacción activa
            if ($conexion && $transactionStarted && $conexion->inTransaction()) {
                try {
                    $conexion->rollback();
                } catch (PDOException $rollbackError) {
                    error_log("Error en rollback: " . $rollbackError->getMessage());
                }
            }
            $message = array("codigo"=>"500", "mensaje"=>"Error interno: " . $e->getMessage());
        }

        return $message;
    }

    public static function mdlObtenerResumen($idusuario, $periodo = 'mes'){
        $message = array();
        
        try {
            $conexion = Conexion::conectar();
            
            $fechaCondicion = "";
            switch($periodo){
                case 'semana':
                    $fechaCondicion = "AND t.fecha_transaccion >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
                    break;
                case 'mes':
                    $fechaCondicion = "AND MONTH(t.fecha_transaccion) = MONTH(CURDATE()) AND YEAR(t.fecha_transaccion) = YEAR(CURDATE())";
                    break;
                case 'año':
                    $fechaCondicion = "AND YEAR(t.fecha_transaccion) = YEAR(CURDATE())";
                    break;
                default:
                    $fechaCondicion = "AND MONTH(t.fecha_transaccion) = MONTH(CURDATE()) AND YEAR(t.fecha_transaccion) = YEAR(CURDATE())";
                    break;
            }

            $objRespuesta = $conexion->prepare("
                SELECT 
                    t.tipo,
                    cat.nombre as categoria,
                    cat.color,
                    SUM(t.monto) as total,
                    COUNT(t.idtransaccion) as cantidad
                FROM transacciones t 
                INNER JOIN categorias cat ON t.idcategoria = cat.idcategoria 
                WHERE t.idusuario = :idusuario AND t.estado = 1 $fechaCondicion
                GROUP BY t.tipo, cat.idcategoria, cat.nombre, cat.color
                ORDER BY total DESC
            ");
            
            $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $objRespuesta->execute();
            $resumen = $objRespuesta->fetchAll(PDO::FETCH_ASSOC);
            
            $message = array("codigo"=>"200", "resumen"=>$resumen, "periodo"=>$periodo);
            
        } catch (PDOException $e) {
            $message = array("codigo"=>"500", "mensaje"=>"Error de base de datos: " . $e->getMessage());
        } catch (Exception $e) {
            $message = array("codigo"=>"500", "mensaje"=>"Error interno: " . $e->getMessage());
        }

        return $message;
    }
}
?>
