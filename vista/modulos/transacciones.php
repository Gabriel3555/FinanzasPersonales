<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Transacciones</h2>
    <button type="button" class="btn btn-primary" id="btnAgregarTransaccion">
        Nueva Transacción
    </button>
</div>

<!-- Panel Tabla Transacciones -->
<div id="panelTablaTransaccion">
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-striped table-hover" id="tablaTransaccion">
                    <thead class="table-dark">
                        <tr>
                            <th>Fecha</th>
                            <th>Descripción</th>
                            <th>Categoría</th>
                            <th>Cuenta</th>
                            <th>Tipo</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Los datos se cargan dinámicamente -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Panel Formulario Nueva Transacción -->
<div id="panelFormularioTransaccion" style="display: none;">
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">Nueva Transacción</h5>
        </div>
        <div class="card-body">
            <form id="formTransaccion" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_tipo_transaccion" class="form-label">Tipo *</label>
                        <select class="form-select" id="txt_tipo_transaccion" required>
                            <option value="">Seleccione...</option>
                            <option value="ingreso">Ingreso</option>
                            <option value="gasto">Gasto</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione el tipo de transacción.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_monto" class="form-label">Monto *</label>
                        <input type="number" class="form-control" id="txt_monto" step="0.01" min="0.01" required>
                        <div class="invalid-feedback">
                            Por favor ingrese un monto válido.
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_cuenta" class="form-label">Cuenta *</label>
                        <select class="form-select" id="txt_cuenta" required>
                            <option value="">Seleccione una cuenta...</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione una cuenta.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_categoria" class="form-label">Categoría *</label>
                        <select class="form-select" id="txt_categoria" required>
                            <option value="">Seleccione una categoría...</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione una categoría.
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_fecha_transaccion" class="form-label">Fecha *</label>
                        <input type="date" class="form-control" id="txt_fecha_transaccion" required>
                        <div class="invalid-feedback">
                            Por favor seleccione una fecha.
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="txt_descripcion" class="form-label">Descripción</label>
                    <textarea class="form-control" id="txt_descripcion" rows="3" placeholder="Descripción opcional de la transacción"></textarea>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">
                        Guardar
                    </button>
                    <button type="button" class="btn btn-secondary" id="btnRegresarTransaccion">
                        Regresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
