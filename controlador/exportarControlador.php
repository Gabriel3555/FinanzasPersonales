<?php

session_start();

// Verificar que el usuario esté logueado
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(array("codigo" => "401", "mensaje" => "Usuario no autenticado"));
    exit();
}

include_once "../modelo/reporteModelo.php";

class ExportarControlador{

    public $idusuario;
    public $formato;
    public $tipo_reporte;
    public $periodo;
    public $fecha_inicio;
    public $fecha_fin;
    public $incluir_graficos;
    
    public function ctrExportarReporte(){
        try {
            $this->idusuario = $_SESSION['usuario_id'];
            
            // Validar formato
            if (!in_array($this->formato, ['pdf', 'excel', 'csv'])) {
                throw new Exception("Formato no válido");
            }
            
            // Obtener datos según el tipo de reporte
            $datos = $this->obtenerDatosReporte();
            
            // Exportar según el formato
            switch($this->formato) {
                case 'pdf':
                    $this->exportarPDF($datos);
                    break;
                case 'excel':
                    $this->exportarExcel($datos);
                    break;
                case 'csv':
                    $this->exportarCSV($datos);
                    break;
            }
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error al exportar: " . $e->getMessage()));
        }
    }
    
    private function obtenerDatosReporte() {
        $datos = array();
        
        switch($this->tipo_reporte) {
            case 'resumen_general':
                $datos['resumen'] = ReporteModelo::mdlObtenerResumenGeneral($this->idusuario, $this->periodo);
                $datos['gastos'] = ReporteModelo::mdlObtenerGastosPorCategoria($this->idusuario, $this->periodo);
                $datos['ingresos'] = ReporteModelo::mdlObtenerIngresosPorCategoria($this->idusuario, $this->periodo);
                break;
                
            case 'detallado':
                $datos['transacciones'] = ReporteModelo::mdlObtenerReporteDetallado(
                    $this->idusuario, 
                    $this->fecha_inicio, 
                    $this->fecha_fin, 
                    null, null, null
                );
                break;
                
            case 'evolucion':
                $datos['evolucion'] = ReporteModelo::mdlObtenerEvolucionMensual($this->idusuario);
                break;
                
            case 'cuentas':
                $datos['cuentas'] = ReporteModelo::mdlObtenerSaldosCuentas($this->idusuario);
                break;
        }
        
        return $datos;
    }
    
    private function exportarPDF($datos) {
        // Usar HTML para generar PDF
        $html = $this->generarHTMLReporte($datos);
        
        // Headers para PDF
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="reporte_finanzas_' . date('Y-m-d') . '.pdf"');
        
        // Generar PDF usando DomPDF o similar
        $this->generarPDFConHTML($html);
    }
    
    private function exportarExcel($datos) {
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment; filename="reporte_finanzas_' . date('Y-m-d') . '.xls"');
        header('Pragma: no-cache');
        header('Expires: 0');
        
        echo $this->generarHTMLTabla($datos);
    }
    
    private function exportarCSV($datos) {
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="reporte_finanzas_' . date('Y-m-d') . '.csv"');
        
        $output = fopen('php://output', 'w');
        
        // BOM para UTF-8
        fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
        
        $this->generarCSV($datos, $output);
        
        fclose($output);
    }
    
    private function generarHTMLReporte($datos) {
        $usuario_nombre = $_SESSION['usuario_nombre'];
        $fecha_reporte = date('d/m/Y H:i:s');
        
        $html = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Reporte Financiero</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2c3e50; padding-bottom: 20px; }
                .section { margin: 20px 0; }
                .section h3 { color: #2c3e50; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }
                table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f8f9fa; font-weight: bold; }
                .text-success { color: #28a745; }
                .text-danger { color: #dc3545; }
                .metric-card { display: inline-block; margin: 10px; padding: 15px; border: 1px solid #ddd; border-radius: 5px; text-align: center; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #6c757d; }
            </style>
        </head>
        <body>
            <div class='header'>
                <h1>Reporte Financiero</h1>
                <p><strong>Usuario:</strong> {$usuario_nombre}</p>
                <p><strong>Fecha de generación:</strong> {$fecha_reporte}</p>
                <p><strong>Período:</strong> " . ucfirst($this->periodo) . "</p>
            </div>
        ";
        
        // Agregar secciones según el tipo de reporte
        if (isset($datos['resumen']) && $datos['resumen']['codigo'] == '200') {
            $resumen = $datos['resumen']['resumen'];
            $html .= "
            <div class='section'>
                <h3>Resumen General</h3>
                <div class='metric-card'>
                    <h4>Total Ingresos</h4>
                    <p class='text-success'>$" . number_format($resumen['ingresos'], 2) . "</p>
                </div>
                <div class='metric-card'>
                    <h4>Total Gastos</h4>
                    <p class='text-danger'>$" . number_format($resumen['gastos'], 2) . "</p>
                </div>
                <div class='metric-card'>
                    <h4>Balance</h4>
                    <p class='" . ($resumen['balance'] >= 0 ? 'text-success' : 'text-danger') . "'>$" . number_format($resumen['balance'], 2) . "</p>
                </div>
            </div>";
        }
        
        // Gastos por categoría
        if (isset($datos['gastos']) && $datos['gastos']['codigo'] == '200' && !empty($datos['gastos']['gastos'])) {
            $html .= "
            <div class='section'>
                <h3>Gastos por Categoría</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Promedio</th>
                        </tr>
                    </thead>
                    <tbody>";
            
            foreach($datos['gastos']['gastos'] as $gasto) {
                $html .= "
                        <tr>
                            <td>{$gasto['categoria']}</td>
                            <td>{$gasto['cantidad']}</td>
                            <td class='text-danger'>$" . number_format($gasto['total'], 2) . "</td>
                            <td>$" . number_format($gasto['promedio'], 2) . "</td>
                        </tr>";
            }
            
            $html .= "
                    </tbody>
                </table>
            </div>";
        }
        
        // Ingresos por categoría
        if (isset($datos['ingresos']) && $datos['ingresos']['codigo'] == '200' && !empty($datos['ingresos']['ingresos'])) {
            $html .= "
            <div class='section'>
                <h3>Ingresos por Categoría</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th>Cantidad</th>
                            <th>Total</th>
                            <th>Promedio</th>
                        </tr>
                    </thead>
                    <tbody>";
            
            foreach($datos['ingresos']['ingresos'] as $ingreso) {
                $html .= "
                        <tr>
                            <td>{$ingreso['categoria']}</td>
                            <td>{$ingreso['cantidad']}</td>
                            <td class='text-success'>$" . number_format($ingreso['total'], 2) . "</td>
                            <td>$" . number_format($ingreso['promedio'], 2) . "</td>
                        </tr>";
            }
            
            $html .= "
                    </tbody>
                </table>
            </div>";
        }
        
        // Transacciones detalladas
        if (isset($datos['transacciones']) && $datos['transacciones']['codigo'] == '200' && !empty($datos['transacciones']['transacciones'])) {
            $html .= "
            <div class='section'>
                <h3>Transacciones Detalladas</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Categoría</th>
                            <th>Cuenta</th>
                            <th>Tipo</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>";
            
            foreach($datos['transacciones']['transacciones'] as $transaccion) {
                $fecha = date('d/m/Y', strtotime($transaccion['fecha_transaccion']));
                $tipo_class = $transaccion['tipo'] == 'ingreso' ? 'text-success' : 'text-danger';
                $monto_signo = $transaccion['tipo'] == 'ingreso' ? '+' : '-';
                
                $html .= "
                        <tr>
                            <td>{$fecha}</td>
                            <td>" . ($transaccion['descripcion'] ?: 'Sin descripción') . "</td>
                            <td>{$transaccion['categoria_nombre']}</td>
                            <td>{$transaccion['cuenta_nombre']}</td>
                            <td>" . ucfirst($transaccion['tipo']) . "</td>
                            <td class='{$tipo_class}'>{$monto_signo}$" . number_format($transaccion['monto'], 2) . "</td>
                        </tr>";
            }
            
            $html .= "
                    </tbody>
                </table>
            </div>";
        }
        
        $html .= "
            <div class='footer'>
                <p>Reporte generado por Sistema de Finanzas Personales</p>
                <p>© " . date('Y') . " - Todos los derechos reservados</p>
            </div>
        </body>
        </html>";
        
        return $html;
    }
    
    private function generarHTMLTabla($datos) {
        $html = $this->generarHTMLReporte($datos);
        return $html;
    }
    
    private function generarCSV($datos, $output) {
        // Encabezado del reporte
        fputcsv($output, array('REPORTE FINANCIERO'));
        fputcsv($output, array('Usuario: ' . $_SESSION['usuario_nombre']));
        fputcsv($output, array('Fecha: ' . date('d/m/Y H:i:s')));
        fputcsv($output, array('Período: ' . ucfirst($this->periodo)));
        fputcsv($output, array(''));
        
        // Resumen general
        if (isset($datos['resumen']) && $datos['resumen']['codigo'] == '200') {
            $resumen = $datos['resumen']['resumen'];
            fputcsv($output, array('RESUMEN GENERAL'));
            fputcsv($output, array('Concepto', 'Monto'));
            fputcsv($output, array('Total Ingresos', '$' . number_format($resumen['ingresos'], 2)));
            fputcsv($output, array('Total Gastos', '$' . number_format($resumen['gastos'], 2)));
            fputcsv($output, array('Balance', '$' . number_format($resumen['balance'], 2)));
            fputcsv($output, array(''));
        }
        
        // Gastos por categoría
        if (isset($datos['gastos']) && $datos['gastos']['codigo'] == '200' && !empty($datos['gastos']['gastos'])) {
            fputcsv($output, array('GASTOS POR CATEGORÍA'));
            fputcsv($output, array('Categoría', 'Cantidad', 'Total', 'Promedio'));
            
            foreach($datos['gastos']['gastos'] as $gasto) {
                fputcsv($output, array(
                    $gasto['categoria'],
                    $gasto['cantidad'],
                    '$' . number_format($gasto['total'], 2),
                    '$' . number_format($gasto['promedio'], 2)
                ));
            }
            fputcsv($output, array(''));
        }
        
        // Ingresos por categoría
        if (isset($datos['ingresos']) && $datos['ingresos']['codigo'] == '200' && !empty($datos['ingresos']['ingresos'])) {
            fputcsv($output, array('INGRESOS POR CATEGORÍA'));
            fputcsv($output, array('Categoría', 'Cantidad', 'Total', 'Promedio'));
            
            foreach($datos['ingresos']['ingresos'] as $ingreso) {
                fputcsv($output, array(
                    $ingreso['categoria'],
                    $ingreso['cantidad'],
                    '$' . number_format($ingreso['total'], 2),
                    '$' . number_format($ingreso['promedio'], 2)
                ));
            }
            fputcsv($output, array(''));
        }
        
        // Transacciones detalladas
        if (isset($datos['transacciones']) && $datos['transacciones']['codigo'] == '200' && !empty($datos['transacciones']['transacciones'])) {
            fputcsv($output, array('TRANSACCIONES DETALLADAS'));
            fputcsv($output, array('Fecha', 'Descripción', 'Categoría', 'Cuenta', 'Tipo', 'Monto'));
            
            foreach($datos['transacciones']['transacciones'] as $transaccion) {
                $fecha = date('d/m/Y', strtotime($transaccion['fecha_transaccion']));
                $monto_signo = $transaccion['tipo'] == 'ingreso' ? '+' : '-';
                
                fputcsv($output, array(
                    $fecha,
                    $transaccion['descripcion'] ?: 'Sin descripción',
                    $transaccion['categoria_nombre'],
                    $transaccion['cuenta_nombre'],
                    ucfirst($transaccion['tipo']),
                    $monto_signo . '$' . number_format($transaccion['monto'], 2)
                ));
            }
        }
    }
    
    private function generarPDFConHTML($html) {
        // Implementación básica sin librerías externas
        // Para una implementación completa, usar DomPDF o similar
        
        // Por ahora, convertir a HTML y dejar que el navegador maneje la conversión
        echo $html;
        
        // Agregar JavaScript para imprimir automáticamente
        echo "
        <script>
            window.onload = function() {
                window.print();
            }
        </script>";
    }
}

try {
    if(isset($_POST["exportarReporte"]) && $_POST["exportarReporte"] == "ok") {
        $objExportar = new ExportarControlador();
        $objExportar->formato = $_POST["formato"];
        $objExportar->tipo_reporte = $_POST["tipo_reporte"];
        $objExportar->periodo = isset($_POST["periodo"]) ? $_POST["periodo"] : "mes";
        $objExportar->fecha_inicio = isset($_POST["fecha_inicio"]) ? $_POST["fecha_inicio"] : null;
        $objExportar->fecha_fin = isset($_POST["fecha_fin"]) ? $_POST["fecha_fin"] : null;
        $objExportar->incluir_graficos = isset($_POST["incluir_graficos"]) ? $_POST["incluir_graficos"] : false;
        $objExportar->ctrExportarReporte();
    } else {
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode(array("codigo" => "400", "mensaje" => "Acción no válida"));
    }
} catch (Exception $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
}
?>
