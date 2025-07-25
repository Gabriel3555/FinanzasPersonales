<?php

require_once "conexion.php";

class ReporteModelo{

    static public function mdlObtenerResumenGeneral($idusuario){
        try {
            $stmt = Conexion::conectar()->prepare("
                SELECT 
                    COALESCE(SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END), 0) as ingresos,
                    COALESCE(SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END), 0) as gastos,
                    COALESCE(SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE -monto END), 0) as balance
                FROM transacciones 
                WHERE idusuario = :idusuario
            ");
            
            $stmt->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $stmt->execute();
            
            $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
            
            return array(
                "codigo" => "200",
                "resumen" => array(
                    "ingresos" => floatval($resultado['ingresos']),
                    "gastos" => floatval($resultado['gastos']),
                    "balance" => floatval($resultado['balance'])
                )
            );
            
        } catch (Exception $e) {
            return array("codigo" => "500", "mensaje" => "Error: " . $e->getMessage());
        }
    }

    static public function mdlObtenerGastosPorCategoria($idusuario){
        try {
            $stmt = Conexion::conectar()->prepare("
                SELECT 
                    c.nombre as categoria,
                    COUNT(t.idtransaccion) as cantidad,
                    SUM(t.monto) as total,
                    AVG(t.monto) as promedio
                FROM transacciones t
                INNER JOIN categorias c ON t.idcategoria = c.idcategoria
                WHERE t.idusuario = :idusuario 
                AND t.tipo = 'gasto'
                GROUP BY c.idcategoria, c.nombre
                ORDER BY total DESC
            ");
            
            $stmt->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $stmt->execute();
            
            $gastos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Convertir a números
            foreach($gastos as &$gasto) {
                $gasto['cantidad'] = intval($gasto['cantidad']);
                $gasto['total'] = floatval($gasto['total']);
                $gasto['promedio'] = floatval($gasto['promedio']);
            }
            
            return array(
                "codigo" => "200",
                "gastos" => $gastos
            );
            
        } catch (Exception $e) {
            return array("codigo" => "500", "mensaje" => "Error: " . $e->getMessage());
        }
    }

    static public function mdlObtenerIngresosPorCategoria($idusuario){
        try {
            $stmt = Conexion::conectar()->prepare("
                SELECT 
                    c.nombre as categoria,
                    COUNT(t.idtransaccion) as cantidad,
                    SUM(t.monto) as total,
                    AVG(t.monto) as promedio
                FROM transacciones t
                INNER JOIN categorias c ON t.idcategoria = c.idcategoria
                WHERE t.idusuario = :idusuario 
                AND t.tipo = 'ingreso'
                GROUP BY c.idcategoria, c.nombre
                ORDER BY total DESC
            ");
            
            $stmt->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $stmt->execute();
            
            $ingresos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Convertir a números
            foreach($ingresos as &$ingreso) {
                $ingreso['cantidad'] = intval($ingreso['cantidad']);
                $ingreso['total'] = floatval($ingreso['total']);
                $ingreso['promedio'] = floatval($ingreso['promedio']);
            }
            
            return array(
                "codigo" => "200",
                "ingresos" => $ingresos
            );
            
        } catch (Exception $e) {
            return array("codigo" => "500", "mensaje" => "Error: " . $e->getMessage());
        }
    }

    static public function mdlObtenerEvolucionMensual($idusuario){
        try {
            $stmt = Conexion::conectar()->prepare("
                SELECT 
                    DATE_FORMAT(fecha_transaccion, '%Y-%m') as mes,
                    SUM(CASE WHEN tipo = 'ingreso' THEN monto ELSE 0 END) as ingresos,
                    SUM(CASE WHEN tipo = 'gasto' THEN monto ELSE 0 END) as gastos
                FROM transacciones 
                WHERE idusuario = :idusuario
                GROUP BY DATE_FORMAT(fecha_transaccion, '%Y-%m')
                ORDER BY mes DESC
                LIMIT 12
            ");
            
            $stmt->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $stmt->execute();
            
            $evolucion = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return array(
                "codigo" => "200",
                "evolucion" => $evolucion
            );
            
        } catch (Exception $e) {
            return array("codigo" => "500", "mensaje" => "Error: " . $e->getMessage());
        }
    }

    static public function mdlObtenerSaldosCuentas($idusuario){
        try {
            $stmt = Conexion::conectar()->prepare("
                SELECT 
                    cu.nombre as cuenta,
                    cu.saldo_inicial,
                    COALESCE(SUM(CASE WHEN t.tipo = 'ingreso' THEN t.monto ELSE -t.monto END), 0) as movimientos,
                    (cu.saldo_inicial + COALESCE(SUM(CASE WHEN t.tipo = 'ingreso' THEN t.monto ELSE -t.monto END), 0)) as saldo_actual
                FROM cuentas cu
                LEFT JOIN transacciones t ON cu.idcuenta = t.idcuenta
                WHERE cu.idusuario = :idusuario
                GROUP BY cu.idcuenta, cu.nombre, cu.saldo_inicial
                ORDER BY saldo_actual DESC
            ");
            
            $stmt->bindParam(":idusuario", $idusuario, PDO::PARAM_INT);
            $stmt->execute();
            
            $cuentas = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return array(
                "codigo" => "200",
                "cuentas" => $cuentas
            );
            
        } catch (Exception $e) {
            return array("codigo" => "500", "mensaje" => "Error: " . $e->getMessage());
        }
    }

    static public function mdlObtenerReporteDetallado($idusuario, $fecha_inicio = null, $fecha_fin = null, $idcategoria = null, $idcuenta = null, $tipo = null){
        try {
            $sql = "
                SELECT 
                    t.idtransaccion,
                    t.fecha_transaccion,
                    t.descripcion,
                    t.monto,
                    t.tipo,
                    c.nombre as categoria_nombre,
                    cu.nombre as cuenta_nombre
                FROM transacciones t
                INNER JOIN categorias c ON t.idcategoria = c.idcategoria
                INNER JOIN cuentas cu ON t.idcuenta = cu.idcuenta
                WHERE t.idusuario = :idusuario
            ";
            
            $params = array(":idusuario" => $idusuario);
            
            // Solo aplicar filtros si se proporcionan valores específicos
            if (!empty($fecha_inicio) && $fecha_inicio != '2020-01-01') {
                $sql .= " AND t.fecha_transaccion >= :fecha_inicio";
                $params[":fecha_inicio"] = $fecha_inicio;
            }
            
            if (!empty($fecha_fin) && $fecha_fin != '2030-12-31') {
                $sql .= " AND t.fecha_transaccion <= :fecha_fin";
                $params[":fecha_fin"] = $fecha_fin;
            }
            
            if (!empty($idcategoria)) {
                $sql .= " AND t.idcategoria = :idcategoria";
                $params[":idcategoria"] = $idcategoria;
            }
            
            if (!empty($idcuenta)) {
                $sql .= " AND t.idcuenta = :idcuenta";
                $params[":idcuenta"] = $idcuenta;
            }
            
            if (!empty($tipo)) {
                $sql .= " AND t.tipo = :tipo";
                $params[":tipo"] = $tipo;
            }
            
            $sql .= " ORDER BY t.fecha_transaccion DESC";
            
            $stmt = Conexion::conectar()->prepare($sql);
            
            foreach($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            
            $stmt->execute();
            
            $transacciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Convertir montos a float
            foreach($transacciones as &$transaccion) {
                $transaccion['monto'] = floatval($transaccion['monto']);
            }
            
            return array(
                "codigo" => "200",
                "transacciones" => $transacciones
            );
            
        } catch (Exception $e) {
            return array("codigo" => "500", "mensaje" => "Error: " . $e->getMessage());
        }
    }
}
?>
