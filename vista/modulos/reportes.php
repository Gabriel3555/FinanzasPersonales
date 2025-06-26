<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fas fa-chart-bar"></i> Reportes Financieros</h2>
    <div class="btn-group" role="group">
        <button type="button" class="btn btn-outline-secondary btn-sm" onclick="window.actualizarReportes()">
            <i class="fas fa-sync-alt"></i> Actualizar
        </button>
    </div>
</div>

<!-- Resumen Ejecutivo -->
<div class="row mb-4" id="resumenEjecutivo">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0"><i class="fas fa-clipboard-list"></i> Resumen Ejecutivo</h6>
                <div class="btn-group btn-group-sm">
                    <button type="button" class="btn btn-outline-success" onclick="window.ReportesDebug.exportarExcel()">
                        <i class="fas fa-file-excel"></i> Excel
                    </button>
                    <button type="button" class="btn btn-outline-danger" onclick="window.ReportesDebug.exportarPDF()">
                        <i class="fas fa-file-pdf"></i> PDF
                    </button>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <div class="metric-card text-center">
                            <div class="metric-icon text-success">
                                <i class="fas fa-arrow-up fa-2x"></i>
                            </div>
                            <div class="metric-info">
                                <div class="metric-label">Total Ingresos</div>
                                <div class="metric-value text-success" id="reporteIngresos">$0.00</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="metric-card text-center">
                            <div class="metric-icon text-danger">
                                <i class="fas fa-arrow-down fa-2x"></i>
                            </div>
                            <div class="metric-info">
                                <div class="metric-label">Total Gastos</div>
                                <div class="metric-value text-danger" id="reporteGastos">$0.00</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="metric-card text-center">
                            <div class="metric-icon text-primary">
                                <i class="fas fa-balance-scale fa-2x"></i>
                            </div>
                            <div class="metric-info">
                                <div class="metric-label">Balance Neto</div>
                                <div class="metric-value" id="reporteBalance">$0.00</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="metric-card text-center">
                            <div class="metric-icon text-info">
                                <i class="fas fa-percentage fa-2x"></i>
                            </div>
                            <div class="metric-info">
                                <div class="metric-label">Tasa de Ahorro</div>
                                <div class="metric-value text-info" id="reporteTasaAhorro">0%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Gráficas de Reportes -->
<div class="row mb-4" id="graficasReportes">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0"><i class="fas fa-chart-pie"></i> Distribución de Gastos</h6>
            </div>
            <div class="card-body">
                <canvas id="graficoDistribucionGastos" height="250"></canvas>
                <div id="noDataDistribucion" class="text-center text-muted" style="display: none;">
                    <i class="fas fa-chart-pie fa-3x mb-3"></i>
                    <p>No hay datos para mostrar</p>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0"><i class="fas fa-chart-line"></i> Tendencia Temporal</h6>
            </div>
            <div class="card-body">
                <canvas id="graficoTendencia" height="250"></canvas>
                <div id="noDataTendencia" class="text-center text-muted" style="display: none;">
                    <i class="fas fa-chart-line fa-3x mb-3"></i>
                    <p>No hay suficientes datos para mostrar tendencia</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Análisis por Categorías -->
<div class="row mb-4" id="analisisCategorias">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0"><i class="fas fa-tags"></i> Análisis por Categorías</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover" id="tablaCategorias">
                        <thead class="table-dark">
                            <tr>
                                <th>Categoría</th>
                                <th>Tipo</th>
                                <th class="text-end">Monto Total</th>
                                <th class="text-center">Transacciones</th>
                                <th class="text-end">Promedio</th>
                                <th class="text-center">% del Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="6" class="text-center text-muted">
                                    <i class="fas fa-spinner fa-spin"></i> Cargando análisis...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Análisis por Cuentas -->
<div class="row mb-4" id="analisisCuentas">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0"><i class="fas fa-university"></i> Análisis por Cuentas</h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover" id="tablaCuentas">
                        <thead class="table-dark">
                            <tr>
                                <th>Cuenta</th>
                                <th class="text-end">Saldo Actual</th>
                                <th class="text-end">Total Ingresos</th>
                                <th class="text-end">Total Gastos</th>
                                <th class="text-center">Transacciones</th>
                                <th class="text-end">Movimiento Neto</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="6" class="text-center text-muted">
                                    <i class="fas fa-spinner fa-spin"></i> Cargando análisis...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Transacciones Detalladas -->
<div class="row mb-4" id="transaccionesDetalladas">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0"><i class="fas fa-list"></i> Transacciones del Período</h6>
                <span class="badge bg-primary" id="contadorTransacciones">0 transacciones</span>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm table-hover" id="tablaTransaccionesReporte">
                        <thead class="table-dark">
                            <tr>
                                <th>Fecha</th>
                                <th>Descripción</th>
                                <th>Categoría</th>
                                <th>Cuenta</th>
                                <th>Tipo</th>
                                <th class="text-end">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="6" class="text-center text-muted">
                                    <i class="fas fa-spinner fa-spin"></i> Cargando transacciones...
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Scripts para exportación -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<style>
.metric-card {
    padding: 1rem;
    border-radius: 8px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 1px solid #dee2e6;
    margin-bottom: 1rem;
}

.metric-icon {
    margin-bottom: 0.5rem;
}

.metric-label {
    font-size: 0.875rem;
    color: #6c757d;
    margin-bottom: 0.25rem;
}

.metric-value {
    font-size: 1.5rem;
    font-weight: bold;
}

.table th {
    border-top: none;
    font-weight: 600;
    font-size: 0.875rem;
}

.table td {
    vertical-align: middle;
    font-size: 0.875rem;
}

.badge {
    font-size: 0.75rem;
}
</style>
