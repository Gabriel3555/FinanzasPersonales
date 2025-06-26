<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Categorías</h2>
    <button type="button" class="btn btn-primary" id="btnAgregarCategoria">
        Nueva Categoría
    </button>
</div>

<!-- Panel Tabla Categorías -->
<div id="panelTablaCategoria">
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table" id="tablaCategoria">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Color</th>
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

<!-- Panel Formulario Nueva Categoría -->
<div id="panelFormularioCategoria" style="display: none;">
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">Nueva Categoría</h5>
        </div>
        <div class="card-body">
            <form id="formCategoria" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_nombre_categoria" class="form-label">Nombre *</label>
                        <input type="text" class="form-control" id="txt_nombre_categoria" required>
                        <div class="invalid-feedback">
                            Por favor ingrese el nombre de la categoría.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_tipo_categoria" class="form-label">Tipo *</label>
                        <select class="form-select" id="txt_tipo_categoria" required>
                            <option value="">Seleccione...</option>
                            <option value="ingreso">Ingreso</option>
                            <option value="gasto">Gasto</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione el tipo de categoría.
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_color_categoria" class="form-label">Color *</label>
                        <input type="color" class="form-control form-control-color" id="txt_color_categoria" value="#007bff" required>
                        <div class="invalid-feedback">
                            Por favor seleccione un color.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_icono_categoria" class="form-label">Icono</label>
                        <select class="form-select" id="txt_icono_categoria" required>
                            <option value="">Seleccione un icono...</option>
                            <option value="fas fa-money-bill-wave">💰 Dinero</option>
                            <option value="fas fa-laptop">💻 Trabajo</option>
                            <option value="fas fa-chart-line">📈 Inversiones</option>
                            <option value="fas fa-utensils">🍽️ Alimentación</option>
                            <option value="fas fa-car">🚗 Transporte</option>
                            <option value="fas fa-gamepad">🎮 Entretenimiento</option>
                            <option value="fas fa-home">🏠 Servicios</option>
                            <option value="fas fa-heartbeat">❤️ Salud</option>
                            <option value="fas fa-graduation-cap">🎓 Educación</option>
                            <option value="fas fa-shopping-cart">🛒 Compras</option>
                            <option value="fas fa-plane">✈️ Viajes</option>
                            <option value="fas fa-gift">🎁 Regalos</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione un icono.
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">
                        Guardar
                    </button>
                    <button type="button" class="btn btn-secondary" id="btnRegresarCategoria">
                        Regresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Panel Formulario Editar Categoría -->
<div id="panelFormularioEditarCategoria" style="display: none;">
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">Editar Categoría</h5>
        </div>
        <div class="card-body">
            <form id="formEditarCategoria" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_edit_nombre_categoria" class="form-label">Nombre *</label>
                        <input type="text" class="form-control" id="txt_edit_nombre_categoria" required>
                        <div class="invalid-feedback">
                            Por favor ingrese el nombre de la categoría.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_edit_tipo_categoria" class="form-label">Tipo *</label>
                        <select class="form-select" id="txt_edit_tipo_categoria" required>
                            <option value="">Seleccione...</option>
                            <option value="ingreso">Ingreso</option>
                            <option value="gasto">Gasto</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione el tipo de categoría.
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_edit_color_categoria" class="form-label">Color *</label>
                        <input type="color" class="form-control form-control-color" id="txt_edit_color_categoria" required>
                        <div class="invalid-feedback">
                            Por favor seleccione un color.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_edit_icono_categoria" class="form-label">Icono</label>
                        <select class="form-select" id="txt_edit_icono_categoria" required>
                            <option value="">Seleccione un icono...</option>
                            <option value="fas fa-money-bill-wave">💰 Dinero</option>
                            <option value="fas fa-laptop">💻 Trabajo</option>
                            <option value="fas fa-chart-line">📈 Inversiones</option>
                            <option value="fas fa-utensils">🍽️ Alimentación</option>
                            <option value="fas fa-car">🚗 Transporte</option>
                            <option value="fas fa-gamepad">🎮 Entretenimiento</option>
                            <option value="fas fa-home">🏠 Servicios</option>
                            <option value="fas fa-heartbeat">❤️ Salud</option>
                            <option value="fas fa-graduation-cap">🎓 Educación</option>
                            <option value="fas fa-shopping-cart">🛒 Compras</option>
                            <option value="fas fa-plane">✈️ Viajes</option>
                            <option value="fas fa-gift">🎁 Regalos</option>
                        </select>
                        <div class="invalid-feedback">
                            Por favor seleccione un icono.
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary" id="btnActualizarCategoria">
                        Actualizar
                    </button>
                    <button type="button" class="btn btn-secondary" id="btnRegresarEditarCategoria">
                        Regresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
