<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Cuentas</h2>
    <button type="button" class="btn btn-primary" id="btnAgregarCuenta">
        Nueva Cuenta
    </button>
</div>

<!-- Panel Tabla Cuentas -->
<div id="panelTablaCuenta">
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table" id="tablaCuenta">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Saldo Inicial</th>
                            <th>Saldo Actual</th>
                            <th>Fecha Creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Panel Formulario Nueva Cuenta -->
<div id="panelFormularioCuenta" style="display: none;">
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">Nueva Cuenta</h5>
        </div>
        <div class="card-body">
            <form id="formCuenta" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_nombre_cuenta" class="form-label">Nombre *</label>
                        <input type="text" class="form-control" id="txt_nombre_cuenta" required>
                        <div class="invalid-feedback">
                            Por favor ingrese el nombre de la cuenta.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_tipo_cuenta" class="form-label">Tipo *</label>
                        <select class="form-select" id="txt_tipo_cuenta" required>
                            <option value="">Seleccione...</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="banco">Banco</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione el tipo de cuenta.
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_saldo_inicial" class="form-label">Saldo Inicial *</label>
                        <input type="number" class="form-control" id="txt_saldo_inicial" step="0.01" min="0" required>
                        <div class="invalid-feedback">
                            Por favor ingrese el saldo inicial.
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">
                        Guardar
                    </button>
                    <button type="button" class="btn btn-secondary" id="btnRegresarCuenta">
                        Regresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Panel Formulario Editar Cuenta -->
<div id="panelFormularioEditarCuenta" style="display: none;">
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">Editar Cuenta</h5>
        </div>
        <div class="card-body">
            <form id="formEditarCuenta" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_edit_nombre_cuenta" class="form-label">Nombre *</label>
                        <input type="text" class="form-control" id="txt_edit_nombre_cuenta" required>
                        <div class="invalid-feedback">
                            Por favor ingrese el nombre de la cuenta.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_edit_tipo_cuenta" class="form-label">Tipo *</label>
                        <select class="form-select" id="txt_edit_tipo_cuenta" required>
                            <option value="">Seleccione...</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="banco">Banco</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione el tipo de cuenta.
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary" id="btnActualizarCuenta">
                        Actualizar
                    </button>
                    <button type="button" class="btn btn-secondary" id="btnRegresarEditarCuenta">
                        Regresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
