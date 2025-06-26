<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Dashboard</h2>
    <div class="btn-group" role="group">
        <button type="button" class="btn btn-outline-secondary btn-sm" onclick="window.actualizarDashboard()">
            <i class="fas fa-sync-alt"></i> Actualizar
        </button>
        <button type="button" class="btn btn-outline-secondary btn-sm" onclick="window.DashboardDebug.mostrarDatos()">
            <i class="fas fa-info-circle"></i> Debug
        </button>
    </div>
</div>

<!-- Tarjetas de Resumen Mejoradas -->
<div class="row mb-4">
    <div class="col-md-3 mb-3">
        <div class="card border-success">
            <div class="card-body metric-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="metric-label">Total Ingresos</div>
                        <div class="metric-value text-success" id="totalIngresos">$0.00</div>
                    </div>
                    <div class="text-success">
                        <i class="fas fa-arrow-up fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-3 mb-3">
        <div class="card border-danger">
            <div class="card-body metric-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="metric-label">Total Gastos</div>
                        <div class="metric-value text-danger" id="totalGastos">$0.00</div>
                    </div>
                    <div class="text-danger">
                        <i class="fas fa-arrow-down fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-3 mb-3">
        <div class="card border-primary">
            <div class="card-body metric-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="metric-label">Balance</div>
                        <div class="metric-value" id="balance">$0.00</div>
                    </div>
                    <div class="text-primary">
                        <i class="fas fa-balance-scale fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-3 mb-3">
        <div class="card border-info">
            <div class="card-body metric-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <div class="metric-label">Transacciones</div>
                        <div class="metric-value text-info" id="totalTransacciones">0</div>
                    </div>
                    <div class="text-info">
                        <i class="fas fa-exchange-alt fa-2x"></i>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Gráficos Mejorados -->
<div class="row mb-4">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                    <i class="fas fa-chart-pie text-danger"></i> Gastos por Categoría
                </h6>
                <small class="text-muted" id="totalGastosGrafico">$0.00</small>
            </div>
            <div class="card-body">
                <canvas id="graficoGastos" height="200"></canvas>
                <div id="noDataGastos" class="text-center text-muted" style="display: none;">
                    <i class="fas fa-chart-pie fa-3x mb-3"></i>
                    <p>No hay gastos en este período</p>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                    <i class="fas fa-chart-pie text-success"></i> Ingresos por Categoría
                </h6>
                <small class="text-muted" id="totalIngresosGrafico">$0.00</small>
            </div>
            <div class="card-body">
                <canvas id="graficoIngresos" height="200"></canvas>
                <div id="noDataIngresos" class="text-center text-muted" style="display: none;">
                    <i class="fas fa-chart-pie fa-3x mb-3"></i>
                    <p>No hay ingresos en este período</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Evolución Mensual -->
<div class="row mb-4">
    <div class="col-md-12">
        <div class="card">
            <div class="card-header">
                <h6 class="mb-0">
                    <i class="fas fa-chart-line text-primary"></i> Evolución Mensual
                </h6>
            </div>
            <div class="card-body">
                <canvas id="graficoEvolucion" height="100"></canvas>
                <div id="noDataEvolucion" class="text-center text-muted" style="display: none;">
                    <i class="fas fa-chart-line fa-3x mb-3"></i>
                    <p>No hay suficientes datos para mostrar la evolución</p>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Últimas Transacciones Mejoradas -->
<div class="card">
    <div class="card-header d-flex justify-content-between align-items-center">
        <h6 class="mb-0">
            <i class="fas fa-history"></i> Últimas Transacciones
        </h6>
        <a href="?ruta=transacciones" class="btn btn-outline-primary btn-sm">
            Ver todas <i class="fas fa-arrow-right"></i>
        </a>
    </div>
    <div class="card-body">
        <div class="table-responsive">
            <table class="table table-sm table-hover" id="tablaUltimasTransacciones">
                <thead>
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
