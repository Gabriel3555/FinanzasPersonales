<div class="d-flex justify-content-between align-items-center mb-4">
    <h2><i class="fas fa-chart-pie"></i> Presupuestos</h2>
    <div class="btn-group" role="group">
        <button type="button" class="btn btn-primary" id="btnAgregarPresupuesto">
            <i class="fas fa-plus"></i> Nuevo Presupuesto
        </button>
        <button type="button" class="btn btn-outline-secondary btn-sm" onclick="window.actualizarPresupuestos()">
            <i class="fas fa-sync-alt"></i> Actualizar
        </button>
    </div>
</div>

<!-- Panel Tabla Presupuestos -->
<div id="panelTablaPresupuesto">
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-striped table-hover" id="tablaPresupuesto">
                    <thead class="table-dark">
                        <tr>
                            <th>Categoría</th>
                            <th>Período</th>
                            <th>Fechas</th>
                            <th>Límite</th>
                            <th>Gastado</th>
                            <th>Restante</th>
                            <th>Progreso</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="9" class="text-center text-muted">
                                <i class="fas fa-spinner fa-spin"></i> Cargando presupuestos...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Panel Formulario Nuevo Presupuesto -->
<div id="panelFormularioPresupuesto" style="display: none;">
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0"><i class="fas fa-plus"></i> Nuevo Presupuesto</h5>
        </div>
        <div class="card-body">
            <form id="formPresupuesto" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_categoria_presupuesto" class="form-label">Categoría de Gasto *</label>
                        <select class="form-select" id="txt_categoria_presupuesto" required>
                            <option value="">Seleccione una categoría...</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione una categoría de gasto.
                        </div>
                        <small class="form-text text-muted">Solo se muestran categorías de tipo "gasto"</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_monto_limite" class="form-label">Monto Límite *</label>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control" id="txt_monto_limite" step="0.01" min="0.01" required>
                        </div>
                        <div class="invalid-feedback">
                            Por favor ingrese un monto límite válido.
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="txt_periodo_presupuesto" class="form-label">Período *</label>
                        <select class="form-select" id="txt_periodo_presupuesto" required>
                            <option value="">Seleccione...</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensual">Mensual</option>
                            <option value="anual">Anual</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione un período.
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="txt_fecha_inicio" class="form-label">Fecha Inicio *</label>
                        <input type="date" class="form-control" id="txt_fecha_inicio" required>
                        <div class="invalid-feedback">
                            Por favor seleccione la fecha de inicio.
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="txt_fecha_fin" class="form-label">Fecha Fin *</label>
                        <input type="date" class="form-control" id="txt_fecha_fin" required>
                        <div class="invalid-feedback">
                            Por favor seleccione la fecha de fin.
                        </div>
                    </div>
                </div>

                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i>
                    <strong>Información:</strong> El presupuesto controlará los gastos de la categoría seleccionada durante el período especificado.
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">
                        <i class="fas fa-save"></i> Guardar
                    </button>
                    <button type="button" class="btn btn-secondary" id="btnRegresarPresupuesto">
                        <i class="fas fa-arrow-left"></i> Regresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Panel Formulario Editar Presupuesto -->
<div id="panelFormularioEditarPresupuesto" style="display: none;">
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0"><i class="fas fa-edit"></i> Editar Presupuesto</h5>
        </div>
        <div class="card-body">
            <form id="formEditarPresupuesto" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_edit_categoria_presupuesto" class="form-label">Categoría de Gasto *</label>
                        <select class="form-select" id="txt_edit_categoria_presupuesto" required>
                            <option value="">Seleccione una categoría...</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione una categoría de gasto.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_edit_monto_limite" class="form-label">Monto Límite *</label>
                        <div class="input-group">
                            <span class="input-group-text">$</span>
                            <input type="number" class="form-control" id="txt_edit_monto_limite" step="0.01" min="0.01" required>
                        </div>
                        <div class="invalid-feedback">
                            Por favor ingrese un monto límite válido.
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label for="txt_edit_periodo_presupuesto" class="form-label">Período *</label>
                        <select class="form-select" id="txt_edit_periodo_presupuesto" required>
                            <option value="">Seleccione...</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensual">Mensual</option>
                            <option value="anual">Anual</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione un período.
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="txt_edit_fecha_inicio" class="form-label">Fecha Inicio *</label>
                        <input type="date" class="form-control" id="txt_edit_fecha_inicio" required>
                        <div class="invalid-feedback">
                            Por favor seleccione la fecha de inicio.
                        </div>
                    </div>
                    <div class="col-md-4 mb-3">
                        <label for="txt_edit_fecha_fin" class="form-label">Fecha Fin *</label>
                        <input type="date" class="form-control" id="txt_edit_fecha_fin" required>
                        <div class="invalid-feedback">
                            Por favor seleccione la fecha de fin.
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary" id="btnActualizarPresupuesto">
                        <i class="fas fa-save"></i> Actualizar
                    </button>
                    <button type="button" class="btn btn-secondary" id="btnRegresarEditarPresupuesto">
                        <i class="fas fa-arrow-left"></i> Regresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<style>
.progress {
    height: 20px;
}

.progress-bar {
    font-size: 12px;
    line-height: 20px;
}

.badge-estado {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
}

.categoria-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.categoria-color {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    display: inline-block;
}

.alert-presupuesto {
    border-left: 4px solid;
    padding-left: 1rem;
}

.alert-presupuesto.excedido {
    border-left-color: #dc3545;
    background-color: #f8d7da;
    color: #721c24;
}

.alert-presupuesto.alerta {
    border-left-color: #ffc107;
    background-color: #fff3cd;
    color: #856404;
}

.metric-small {
    font-size: 0.875rem;
    color: #6c757d;
}
</style>
