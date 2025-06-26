<?php

include_once "conexion.php";

class ReporteModelo{
    
    public static function mdlObtenerResumenGeneral($idusuario, $periodo = 'mes'){
        $message = array();
        
        try {
            $conexion = Conexion::conectar();
            
            // Determinar condición de fecha
            $fechaCondicion = self::obtenerCondicionFecha($periodo);
            
            // Obtener totales por tipo
            $objRespuesta = $conexion->prepare("
                SELECT 
                    t.tipo,
                    SUM(t.monto) as total,
                    COUNT(t.idtransaccion) as cantidad
                FROM transacciones t 
                WHERE t.idusuario = :idusuario AND t.estado = 1 $fechaCondicion
                GROUP BY t.tipo
            ");
            
            $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $objRespuesta->execute();
            $totales = $objRespuesta->fetchAll(PDO::FETCH_ASSOC);
            
            // Procesar resultados
            $resumen = array(
                'ingresos' => 0,
                'gastos' => 0,
                'balance' => 0,
                'total_transacciones' => 0,
                'periodo' => $periodo
            );
            
            foreach($totales as $total) {
                if($total['tipo'] == 'ingreso') {
                    $resumen['ingresos'] = floatval($total['total']);
                } else {
                    $resumen['gastos'] = floatval($total['total']);
                }
                $resumen['total_transacciones'] += intval($total['cantidad']);
            }
            
            $resumen['balance'] = $resumen['ingresos'] - $resumen['gastos'];
            
            $message = array("codigo"=>"200", "resumen"=>$resumen);
            
        } catch (Exception $e) {
            $message = array("codigo"=>"500", "mensaje"=>"Error: " . $e->getMessage());
        }

        return $message;
    }

    public static function mdlObtenerGastosPorCategoria($idusuario, $periodo = 'mes'){
        $message = array();
        
        try {
            $conexion = Conexion::conectar();
            $fechaCondicion = self::obtenerCondicionFecha($periodo);
            
            $objRespuesta = $conexion->prepare("
                SELECT 
                    cat.nombre as categoria,
                    cat.color,
                    cat.icono,
                    SUM(t.monto) as total,
                    COUNT(t.idtransaccion) as cantidad,
                    AVG(t.monto) as promedio
                FROM transacciones t 
                INNER JOIN categorias cat ON t.idcategoria = cat.idcategoria 
                WHERE t.idusuario = :idusuario AND t.estado = 1 AND t.tipo = 'gasto' $fechaCondicion
                GROUP BY cat.idcategoria, cat.nombre, cat.color, cat.icono
                ORDER BY total DESC
            ");
            
            $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $objRespuesta->execute();
            $gastos = $objRespuesta->fetchAll(PDO::FETCH_ASSOC);
            
            // Convertir valores a float
            foreach($gastos as &$gasto) {
                $gasto['total'] = floatval($gasto['total']);
                $gasto['promedio'] = floatval($gasto['promedio']);
                $gasto['cantidad'] = intval($gasto['cantidad']);
            }
            
            $message = array("codigo"=>"200", "gastos"=>$gastos, "periodo"=>$periodo);
            
        } catch (Exception $e) {
            $message = array("codigo"=>"500", "mensaje"=>"Error: " . $e->getMessage());
        }

        return $message;
    }

    public static function mdlObtenerIngresosPorCategoria($idusuario, $periodo = 'mes'){
        $message = array();
        
        try {
            $conexion = Conexion::conectar();
            $fechaCondicion = self::obtenerCondicionFecha($periodo);
            
            $objRespuesta = $conexion->prepare("
                SELECT 
                    cat.nombre as categoria,
                    cat.color,
                    cat.icono,
                    SUM(t.monto) as total,
                    COUNT(t.idtransaccion) as cantidad,
                    AVG(t.monto) as promedio
                FROM transacciones t 
                INNER JOIN categorias cat ON t.idcategoria = cat.idcategoria 
                WHERE t.idusuario = :idusuario AND t.estado = 1 AND t.tipo = 'ingreso' $fechaCondicion
                GROUP BY cat.idcategoria, cat.nombre, cat.color, cat.icono
                ORDER BY total DESC
            ");
            
            $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $objRespuesta->execute();
            $ingresos = $objRespuesta->fetchAll(PDO::FETCH_ASSOC);
            
            // Convertir valores a float
            foreach($ingresos as &$ingreso) {
                $ingreso['total'] = floatval($ingreso['total']);
                $ingreso['promedio'] = floatval($ingreso['promedio']);
                $ingreso['cantidad'] = intval($ingreso['cantidad']);
            }
            
            $message = array("codigo"=>"200", "ingresos"=>$ingresos, "periodo"=>$periodo);
            
        } catch (Exception $e) {
            $message = array("codigo"=>"500", "mensaje"=>"Error: " . $e->getMessage());
        }

        return $message;
    }

    public static function mdlObtenerEvolucionMensual($idusuario){
        $message = array();
        
        try {
            $conexion = Conexion::conectar();
            
            $objRespuesta = $conexion->prepare("
                SELECT 
                    YEAR(t.fecha_transaccion) as año,
                    MONTH(t.fecha_transaccion) as mes,
                    MONTHNAME(t.fecha_transaccion) as nombre_mes,
                    t.tipo,
                    SUM(t.monto) as total
                FROM transacciones t 
                WHERE t.idusuario = :idusuario AND t.estado = 1 
                    AND t.fecha_transaccion >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                GROUP BY YEAR(t.fecha_transaccion), MONTH(t.fecha_transaccion), t.tipo
                ORDER BY año DESC, mes DESC
            ");
            
            $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $objRespuesta->execute();
            $evolucion = $objRespuesta->fetchAll(PDO::FETCH_ASSOC);
            
            // Procesar datos para el gráfico
            $meses = array();
            foreach($evolucion as $dato) {
                $clave = $dato['año'] . '-' . str_pad($dato['mes'], 2, '0', STR_PAD_LEFT);
                if(!isset($meses[$clave])) {
                    $meses[$clave] = array(
                        'periodo' => $dato['nombre_mes'] . ' ' . $dato['año'],
                        'ingresos' => 0,
                        'gastos' => 0,
                        'balance' => 0
                    );
                }
                
                if($dato['tipo'] == 'ingreso') {
                    $meses[$clave]['ingresos'] = floatval($dato['total']);
                } else {
                    $meses[$clave]['gastos'] = floatval($dato['total']);
                }
                
                $meses[$clave]['balance'] = $meses[$clave]['ingresos'] - $meses[$clave]['gastos'];
            }
            
            // Ordenar por fecha
            ksort($meses);
            $evolucion_procesada = array_values($meses);
            
            $message = array("codigo"=>"200", "evolucion"=>$evolucion_procesada);
            
        } catch (Exception $e) {
            $message = array("codigo"=>"500", "mensaje"=>"Error: " . $e->getMessage());
        }

        return $message;
    }

    public static function mdlObtenerSaldosCuentas($idusuario){
        $message = array();
        
        try {
            $conexion = Conexion::conectar();
            
            $objRespuesta = $conexion->prepare("
                SELECT 
                    c.nombre,
                    c.tipo,
                    c.saldo_inicial,
                    c.saldo_actual,
                    (c.saldo_actual - c.saldo_inicial) as diferencia,
                    COUNT(t.idtransaccion) as total_transacciones
                FROM cuentas c 
                LEFT JOIN transacciones t ON c.idcuenta = t.idcuenta AND t.estado = 1
                WHERE c.idusuario = :idusuario AND c.estado = 1
                GROUP BY c.idcuenta, c.nombre, c.tipo, c.saldo_inicial, c.saldo_actual
                ORDER BY c.saldo_actual DESC
            ");
            
            $objRespuesta->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $objRespuesta->execute();
            $cuentas = $objRespuesta->fetchAll(PDO::FETCH_ASSOC);
            
            // Convertir valores a float
            foreach($cuentas as &$cuenta) {
                $cuenta['saldo_inicial'] = floatval($cuenta['saldo_inicial']);
                $cuenta['saldo_actual'] = floatval($cuenta['saldo_actual']);
                $cuenta['diferencia'] = floatval($cuenta['diferencia']);
                $cuenta['total_transacciones'] = intval($cuenta['total_transacciones']);
            }
            
            $message = array("codigo"=>"200", "cuentas"=>$cuentas);
            
        } catch (Exception $e) {
            $message = array("codigo"=>"500", "mensaje"=>"Error: " . $e->getMessage());
        }

        return $message;
    }

    public static function mdlObtenerReporteDetallado($idusuario, $fecha_inicio, $fecha_fin, $idcategoria = null, $idcuenta = null, $tipo = null){
        $message = array();
        
        try {
            $conexion = Conexion::conectar();
            
            // Construir condiciones WHERE
            $condiciones = array("t.idusuario = :idusuario", "t.estado = 1");
            $parametros = array(':idusuario' => $idusuario);
            
            if($fecha_inicio) {
                $condiciones[] = "t.fecha_transaccion >= :fecha_inicio";
                $parametros[':fecha_inicio'] = $fecha_inicio;
            }
            
            if($fecha_fin) {
                $condiciones[] = "t.fecha_transaccion <= :fecha_fin";
                $parametros[':fecha_fin'] = $fecha_fin;
            }
            
            if($idcategoria) {
                $condiciones[] = "t.idcategoria = :idcategoria";
                $parametros[':idcategoria'] = $idcategoria;
            }
            
            if($idcuenta) {
                $condiciones[] = "t.idcuenta = :idcuenta";
                $parametros[':idcuenta'] = $idcuenta;
            }
            
            if($tipo) {
                $condiciones[] = "t.tipo = :tipo";
                $parametros[':tipo'] = $tipo;
            }
            
            $whereClause = implode(' AND ', $condiciones);
            
            $sql = "
                SELECT 
                    t.*,
                    c.nombre as cuenta_nombre,
                    cat.nombre as categoria_nombre,
                    cat.color as categoria_color,
                    cat.icono as categoria_icono
                FROM transacciones t 
                INNER JOIN cuentas c ON t.idcuenta = c.idcuenta 
                INNER JOIN categorias cat ON t.idcategoria = cat.idcategoria 
                WHERE $whereClause
                ORDER BY t.fecha_transaccion DESC, t.fecha_registro DESC
            ";
            
            $objRespuesta = $conexion->prepare($sql);
            
            foreach($parametros as $param => $valor) {
                $objRespuesta->bindValue($param, $valor);
            }
            
            $objRespuesta->execute();
            $transacciones = $objRespuesta->fetchAll(PDO::FETCH_ASSOC);
            
            // Calcular totales
            $totales = array(
                'total_ingresos' => 0,
                'total_gastos' => 0,
                'balance' => 0,
                'cantidad_transacciones' => count($transacciones)
            );
            
            foreach($transacciones as &$transaccion) {
                $transaccion['monto'] = floatval($transaccion['monto']);
                
                if($transaccion['tipo'] == 'ingreso') {
                    $totales['total_ingresos'] += $transaccion['monto'];
                } else {
                    $totales['total_gastos'] += $transaccion['monto'];
                }
            }
            
            $totales['balance'] = $totales['total_ingresos'] - $totales['total_gastos'];
            
            $message = array(
                "codigo"=>"200", 
                "transacciones"=>$transacciones,
                "totales"=>$totales,
                "filtros"=>array(
                    "fecha_inicio"=>$fecha_inicio,
                    "fecha_fin"=>$fecha_fin,
                    "idcategoria"=>$idcategoria,
                    "idcuenta"=>$idcuenta,
                    "tipo"=>$tipo
                )
            );
            
        } catch (Exception $e) {
            $message = array("codigo"=>"500", "mensaje"=>"Error: " . $e->getMessage());
        }

        return $message;
    }

    private static function obtenerCondicionFecha($periodo) {
        switch($periodo) {
            case 'semana':
                return "AND t.fecha_transaccion >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
            case 'mes':
                return "AND MONTH(t.fecha_transaccion) = MONTH(CURDATE()) AND YEAR(t.fecha_transaccion) = YEAR(CURDATE())";
            case 'año':
                return "AND YEAR(t.fecha_transaccion) = YEAR(CURDATE())";
            case 'trimestre':
                return "AND t.fecha_transaccion >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)";
            default:
                return "AND MONTH(t.fecha_transaccion) = MONTH(CURDATE()) AND YEAR(t.fecha_transaccion) = YEAR(CURDATE())";
        }
    }
}
?>
