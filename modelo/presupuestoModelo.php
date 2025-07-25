<?php

include_once "conexion.php";

class PresupuestoModelo{
    
    public static function mdlMostrarPresupuesto($idusuario){
        $message = array();
        
        try {
            $conexion = Conexion::conectar();
            
            // Consulta optimizada para mostrar un único registro por presupuesto
            $objRespuesta = $conexion->prepare("
                SELECT 
                    MAX(p.idpresupuesto) as idpresupuesto,
                    p.idcategoria,
                    MAX(p.monto_limite) as monto_limite,
                    MAX(p.periodo) as periodo,
                    MAX(p.fecha_inicio) as fecha_inicio,
                    MAX(p.fecha_fin) as fecha_fin,
                    c.nombre as categoria_nombre,
                    c.color as categoria_color,
                    c.icono as categoria_icono,
                    (
                        SELECT COALESCE(SUM(t.monto), 0) 
                        FROM transacciones t 
                        WHERE t.idcategoria = p.idcategoria 
                            AND t.tipo = 'gasto' 
                            AND t.estado = 1 
                            AND t.fecha_transaccion BETWEEN p.fecha_inicio AND p.fecha_fin
                            AND t.idusuario = p.idusuario
                    ) as monto_gastado_real
                FROM presupuestos p 
                INNER JOIN categorias c ON p.idcategoria = c.idcategoria 
                WHERE p.idusuario = :idusuario AND p.estado = 1 
                GROUP BY p.idcategoria, p.fecha_inicio, p.fecha_fin
                ORDER BY MAX(p.fecha_inicio) DESC
            ");
            
            $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $objRespuesta->execute();
            $listaPresupuesto = $objRespuesta->fetchAll(PDO::FETCH_ASSOC);
            
            // Calcular porcentajes y estados
            foreach($listaPresupuesto as &$presupuesto) {
                $presupuesto['monto_limite'] = floatval($presupuesto['monto_limite']);
                $presupuesto['monto_gastado'] = floatval($presupuesto['monto_gastado_real']);
                $presupuesto['porcentaje_usado'] = $presupuesto['monto_limite'] > 0 ? 
                    ($presupuesto['monto_gastado'] / $presupuesto['monto_limite']) * 100 : 0;
                $presupuesto['monto_restante'] = $presupuesto['monto_limite'] - $presupuesto['monto_gastado'];
                
                // Determinar estado del presupuesto
                if ($presupuesto['porcentaje_usado'] >= 100) {
                    $presupuesto['estado_presupuesto'] = 'excedido';
                    $presupuesto['estado_color'] = 'danger';
                } elseif ($presupuesto['porcentaje_usado'] >= 80) {
                    $presupuesto['estado_presupuesto'] = 'alerta';
                    $presupuesto['estado_color'] = 'warning';
                } elseif ($presupuesto['porcentaje_usado'] >= 50) {
                    $presupuesto['estado_presupuesto'] = 'moderado';
                    $presupuesto['estado_color'] = 'info';
                } else {
                    $presupuesto['estado_presupuesto'] = 'saludable';
                    $presupuesto['estado_color'] = 'success';
                }
                
                // Verificar si está activo
                $hoy = date('Y-m-d');
                $presupuesto['activo'] = ($hoy >= $presupuesto['fecha_inicio'] && $hoy <= $presupuesto['fecha_fin']);
            }
            
            $objRespuesta = null;
            $message = array("codigo"=>"200", "listaPresupuesto"=>$listaPresupuesto);
            
        } catch (Exception $e) {
            $message = array("codigo"=>"500", "mensaje"=>"Error: " . $e->getMessage());
        }

        return $message;
    }

    public static function mdlCrearPresupuesto($idusuario, $idcategoria, $monto_limite, $periodo, $fecha_inicio, $fecha_fin) {
        $mensaje = array();

        try {
            $conexion = Conexion::conectar();
            
            // 1. Verificar que la categoría existe y es de tipo gasto
            $verificarCategoria = $conexion->prepare("
                SELECT idcategoria, tipo 
                FROM categorias 
                WHERE idcategoria = :idcategoria 
                AND idusuario = :idusuario 
                AND estado = 1
            ");
            $verificarCategoria->bindParam(":idcategoria", $idcategoria, PDO::PARAM_INT);
            $verificarCategoria->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $verificarCategoria->execute();
            $categoria = $verificarCategoria->fetch(PDO::FETCH_ASSOC);
            
            if (!$categoria) {
                return array("codigo" => "400", "mensaje" => "La categoría seleccionada no existe o no pertenece a este usuario");
            }
            
            if ($categoria['tipo'] !== 'gasto') {
                return array("codigo" => "400", "mensaje" => "Solo se pueden crear presupuestos para categorías de tipo gasto");
            }

            // 2. Insertar el nuevo presupuesto
            $objRespuesta = $conexion->prepare("
                INSERT INTO presupuestos 
                    (idusuario, idcategoria, monto_limite, periodo, fecha_inicio, fecha_fin) 
                VALUES 
                    (:idusuario, :idcategoria, :monto_limite, :periodo, :fecha_inicio, :fecha_fin)
            ");
            
            $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $objRespuesta->bindParam(":idcategoria", $idcategoria, PDO::PARAM_INT);
            $objRespuesta->bindParam(":monto_limite", $monto_limite);
            $objRespuesta->bindParam(":periodo", $periodo);
            $objRespuesta->bindParam(":fecha_inicio", $fecha_inicio);
            $objRespuesta->bindParam(":fecha_fin", $fecha_fin);

            if ($objRespuesta->execute()) {
                $mensaje = array(
                    "codigo" => "200", 
                    "mensaje" => "Presupuesto creado correctamente",
                    "idpresupuesto" => $conexion->lastInsertId()
                );
            } else {
                $errorInfo = $objRespuesta->errorInfo();
                $mensaje = array(
                    "codigo" => "401", 
                    "mensaje" => "Error al crear el presupuesto: " . $errorInfo[2]
                );
            }
        } catch (Exception $e) {
            $mensaje = array(
                "codigo" => "500", 
                "mensaje" => "Error en el servidor: " . $e->getMessage()
            );
        }
        
        return $mensaje;
    }

    public static function mdlEditarPresupuesto($idpresupuesto, $idcategoria, $monto_limite, $periodo, $fecha_inicio, $fecha_fin, $idusuario){
    $mensaje = array();

    try {
        $conexion = Conexion::conectar();
        
        // 1. Eliminar el presupuesto anterior
        $eliminarAnterior = $conexion->prepare("
            UPDATE presupuestos SET estado = 0 
            WHERE idpresupuesto = :idpresupuesto
        ");
        $eliminarAnterior->bindParam(":idpresupuesto", $idpresupuesto, PDO::PARAM_INT);
        $eliminarAnterior->execute();

        // 2. Crear el nuevo presupuesto
        $objRespuesta = $conexion->prepare("
            INSERT INTO presupuestos 
                (idusuario, idcategoria, monto_limite, periodo, fecha_inicio, fecha_fin) 
            VALUES 
                (:idusuario, :idcategoria, :monto_limite, :periodo, :fecha_inicio, :fecha_fin)
        ");
        
        $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
        $objRespuesta->bindParam(":idcategoria", $idcategoria, PDO::PARAM_INT);
        $objRespuesta->bindParam(":monto_limite", $monto_limite);
        $objRespuesta->bindParam(":periodo", $periodo);
        $objRespuesta->bindParam(":fecha_inicio", $fecha_inicio);
        $objRespuesta->bindParam(":fecha_fin", $fecha_fin);

        if ($objRespuesta->execute()) {
            $mensaje = array(
                "codigo" => "200", 
                "mensaje" => "Presupuesto actualizado correctamente",
                "idpresupuesto" => $conexion->lastInsertId()
            );
        } else {
            $errorInfo = $objRespuesta->errorInfo();
            $mensaje = array(
                "codigo" => "401", 
                "mensaje" => "Error al actualizar el presupuesto: " . $errorInfo[2]
            );
        }
    } catch (Exception $e) {
        $mensaje = array(
            "codigo" => "500", 
            "mensaje" => "Error en el servidor: " . $e->getMessage()
        );
    }
    
    return $mensaje;
}

    public static function mdlEliminarPresupuesto($idpresupuesto, $idusuario){
        $message = array();

        try {
            $conexion = Conexion::conectar();
            
            // Verificar que el presupuesto pertenece al usuario
            $verificar = $conexion->prepare("
                SELECT idpresupuesto FROM presupuestos 
                WHERE idpresupuesto = :idpresupuesto AND idusuario = :idusuario AND estado = 1
            ");
            $verificar->bindParam(":idpresupuesto", $idpresupuesto, PDO::PARAM_INT);
            $verificar->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $verificar->execute();
            
            if($verificar->rowCount() === 0){
                $message = array("codigo"=>"401", "mensaje"=>"El presupuesto no existe o no tiene permisos para eliminarlo");
                return $message;
            }

            $objRespuesta = $conexion->prepare("
                UPDATE presupuestos SET estado = 0 
                WHERE idpresupuesto = :idpresupuesto AND idusuario = :idusuario
            ");
            $objRespuesta->bindParam(":idpresupuesto", $idpresupuesto, PDO::PARAM_INT);
            $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            
            if($objRespuesta->execute()){
                $message = array("codigo"=>"200", "mensaje"=>"El presupuesto fue eliminado correctamente");
            } else {
                $message = array("codigo"=>"401", "mensaje"=>"El presupuesto no se pudo eliminar");
            }
            
        } catch (Exception $e) {
            $message = array("codigo"=>"401", "mensaje"=>$e->getMessage());
        }

        return $message;
    }

    public static function mdlObtenerEstadoPresupuestos($idusuario){
        $message = array();
        
        try {
            $conexion = Conexion::conectar();
            
            // Obtener presupuestos activos (que incluyan la fecha actual)
            $hoy = date('Y-m-d');
            
            $objRespuesta = $conexion->prepare("
                SELECT 
                    MAX(p.idpresupuesto) as idpresupuesto,
                    p.idcategoria,
                    MAX(p.monto_limite) as monto_limite,
                    MAX(p.periodo) as periodo,
                    MAX(p.fecha_inicio) as fecha_inicio,
                    MAX(p.fecha_fin) as fecha_fin,
                    c.nombre as categoria_nombre,
                    c.color as categoria_color,
                    (
                        SELECT COALESCE(SUM(t.monto), 0) 
                        FROM transacciones t 
                        WHERE t.idcategoria = p.idcategoria 
                            AND t.tipo = 'gasto' 
                            AND t.estado = 1 
                            AND t.fecha_transaccion BETWEEN p.fecha_inicio AND p.fecha_fin
                            AND t.idusuario = p.idusuario
                    ) as monto_gastado_real
                FROM presupuestos p 
                INNER JOIN categorias c ON p.idcategoria = c.idcategoria 
                WHERE p.idusuario = :idusuario 
                    AND p.estado = 1 
                    AND :hoy BETWEEN p.fecha_inicio AND p.fecha_fin
                GROUP BY p.idcategoria, p.fecha_inicio, p.fecha_fin
                ORDER BY MAX(p.fecha_inicio) DESC
            ");
            
            $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $objRespuesta->bindParam(":hoy", $hoy);
            $objRespuesta->execute();
            $presupuestosActivos = $objRespuesta->fetchAll(PDO::FETCH_ASSOC);
            
            $alertas = array();
            $resumen = array(
                'total_presupuestos' => count($presupuestosActivos),
                'presupuestos_excedidos' => 0,
                'presupuestos_en_alerta' => 0,
                'presupuestos_saludables' => 0
            );
            
            foreach($presupuestosActivos as $presupuesto) {
                $monto_limite = floatval($presupuesto['monto_limite']);
                $monto_gastado = floatval($presupuesto['monto_gastado_real']);
                $porcentaje_usado = $monto_limite > 0 ? ($monto_gastado / $monto_limite) * 100 : 0;
                
                if ($porcentaje_usado >= 100) {
                    $resumen['presupuestos_excedidos']++;
                    $alertas[] = array(
                        'tipo' => 'excedido',
                        'categoria' => $presupuesto['categoria_nombre'],
                        'porcentaje' => $porcentaje_usado,
                        'monto_limite' => $monto_limite,
                        'monto_gastado' => $monto_gastado,
                        'mensaje' => "Presupuesto excedido en " . $presupuesto['categoria_nombre']
                    );
                } elseif ($porcentaje_usado >= 80) {
                    $resumen['presupuestos_en_alerta']++;
                    $alertas[] = array(
                        'tipo' => 'alerta',
                        'categoria' => $presupuesto['categoria_nombre'],
                        'porcentaje' => $porcentaje_usado,
                        'monto_limite' => $monto_limite,
                        'monto_gastado' => $monto_gastado,
                        'mensaje' => "Presupuesto en alerta en " . $presupuesto['categoria_nombre'] . " (" . round($porcentaje_usado, 1) . "%)"
                    );
                } else {
                    $resumen['presupuestos_saludables']++;
                }
            }
            
            $message = array(
                "codigo" => "200", 
                "resumen" => $resumen,
                "alertas" => $alertas,
                "presupuestos_activos" => $presupuestosActivos
            );
            
        } catch (Exception $e) {
            $message = array("codigo"=>"500", "mensaje"=>"Error: " . $e->getMessage());
        }

        return $message;
    }
}
?>