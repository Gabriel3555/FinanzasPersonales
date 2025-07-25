<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Dashboard</h2>
    <div class="btn-group" role="group">
        <!-- NUEVO FILTRO DE PERÍODO -->
        <select class="form-select form-select-sm" id="filtroPeriodoDashboard" style="width: auto;">
            <option value="todo" selected>Todo el Tiempo</option>
            <option value="mes">Este Mes</option>
            <option value="semana">Esta Semana</option>
            <option value="trimestre">Este Trimestre</option>
            <option value="año">Este Año</option>
        </select>
        <button type="button" class="btn btn-outline-secondary btn-sm" onclick="window.actualizarDashboard()">
            <i class="fas fa-sync-alt"></i> Actualizar
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
                        <small class="text-muted" id="periodoIngresos">Todo el tiempo</small>
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
                        <small class="text-muted" id="periodoGastos">Todo el tiempo</small>
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
                        <small class="text-muted" id="periodoBalance">Todo el tiempo</small>
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
                        <small class="text-muted" id="periodoTransacciones">Este mes</small>
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
                <div class="d-flex align-items-center gap-2">
                    <small class="text-muted" id="totalGastosGrafico">$0.00</small>
                    <small class="text-muted" id="periodoGastosGrafico">Este mes</small>
                </div>
            </div>
            <div class="card-body">
                <canvas id="graficoGastos" height="200"></canvas>
                <div id="noDataGastos" class="text-center text-muted" style="display: none;">
                    <i class="fas fa-chart-pie fa-3x mb-3"></i>
                    <p>No hay gastos en este período</p>
                    <small class="text-muted">Selecciona un período diferente o registra algunas transacciones</small>
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
                <div class="d-flex align-items-center gap-2">
                    <small class="text-muted" id="totalIngresosGrafico">$0.00</small>
                    <small class="text-muted" id="periodoIngresosGrafico">Todo el tiempo</small>
                </div>
            </div>
            <div class="card-body">
                <canvas id="graficoIngresos" height="200"></canvas>
                <div id="noDataIngresos" class="text-center text-muted" style="display: none;">
                    <i class="fas fa-chart-pie fa-3x mb-3"></i>
                    <p>No hay ingresos en este período</p>
                    <small class="text-muted">Selecciona un período diferente o registra algunas transacciones</small>
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
                    <small class="text-muted">Se necesitan al menos 2 meses de datos</small>
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

<script>
// Configurar el filtro de período
document.addEventListener('DOMContentLoaded', function() {
    const filtroPeriodo = document.getElementById('filtroPeriodoDashboard');
    if (filtroPeriodo) {
        // Establecer valor por defecto
        filtroPeriodo.value = 'todo';
        
        filtroPeriodo.addEventListener('change', function() {
            const periodo = this.value;
            
            // Actualizar etiquetas de período
            const etiquetasPeriodo = {
                'semana': 'Esta semana',
                'mes': 'Este mes', 
                'trimestre': 'Este trimestre',
                'año': 'Este año',
                'todo': 'Todo el tiempo'
            };
            
            const etiqueta = etiquetasPeriodo[periodo] || 'Todo el tiempo';
            
            // Actualizar todas las etiquetas de período
            document.querySelectorAll('[id^="periodo"]').forEach(el => {
                el.textContent = etiqueta;
            });
            
            // Actualizar dashboard con el nuevo período
            if (typeof window.actualizarDashboardConPeriodo === 'function') {
                window.actualizarDashboardConPeriodo(periodo);
            } else if (typeof window.actualizarDashboard === 'function') {
                window.actualizarDashboard();
            }
        });
        
        // Disparar evento inicial para establecer las etiquetas correctas
        const eventoInicial = new Event('change');
        filtroPeriodo.dispatchEvent(eventoInicial);
    }
});
</script>
