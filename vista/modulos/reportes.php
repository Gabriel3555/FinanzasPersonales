<?php
// vista/modulos/reportes.php
?>

<div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="fas fa-chart-bar me-2"></i>Reportes Financieros</h2>
        <div>
            <button type="button" class="btn btn-outline-secondary btn-sm" onclick="actualizarReportes()">
                <i class="fas fa-sync-alt me-1"></i> Actualizar
            </button>
        </div>
    </div>

    <!-- Resumen Ejecutivo -->
    <div class="row mb-4" id="resumenEjecutivo">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0"><i class="fas fa-clipboard-list me-2"></i>Resumen General</h6>
                    <div class="btn-group btn-group-sm">
                        <button type="button" class="btn btn-outline-success" onclick="exportarReporte('excel')">
                            <i class="fas fa-file-excel me-1"></i> Excel
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="exportarReporte('pdf')">
                            <i class="fas fa-file-pdf me-1"></i> PDF
                        </button>
                        <button type="button" class="btn btn-outline-info" onclick="exportarReporte('csv')">
                            <i class="fas fa-file-csv me-1"></i> CSV
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
                    <h6 class="mb-0"><i class="fas fa-chart-pie me-2"></i>Distribución de Gastos</h6>
                </div>
                <div class="card-body">
                    <canvas id="graficoDistribucionGastos" height="250"></canvas>
                    <div id="noDataDistribucion" class="text-center text-muted py-4" style="display: none;">
                        <i class="fas fa-chart-pie fa-3x mb-3 text-secondary"></i>
                        <p class="mb-1">No hay datos para mostrar</p>
                        <small class="text-muted">Registra algunas transacciones para ver el gráfico</small>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h6 class="mb-0"><i class="fas fa-chart-bar me-2"></i>Ingresos vs Gastos</h6>
                </div>
                <div class="card-body">
                    <canvas id="graficoComparativo" height="250"></canvas>
                    <div id="noDataComparativo" class="text-center text-muted py-4" style="display: none;">
                        <i class="fas fa-chart-bar fa-3x mb-3 text-secondary"></i>
                        <p class="mb-1">No hay datos para comparar</p>
                        <small class="text-muted">Registra transacciones para ver la comparación</small>
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
                    <h6 class="mb-0"><i class="fas fa-tags me-2"></i>Análisis por Categorías</h6>
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
                                    <td colspan="6" class="text-center text-muted py-3">
                                        <i class="fas fa-spinner fa-spin me-2"></i>Cargando análisis...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Transacciones Recientes -->
    <div class="row mb-4" id="transaccionesRecientes">
        <div class="col-md-12">
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h6 class="mb-0"><i class="fas fa-list me-2"></i>Todas las Transacciones</h6>
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
                                    <td colspan="6" class="text-center text-muted py-3">
                                        <i class="fas fa-spinner fa-spin me-2"></i>Cargando transacciones...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>