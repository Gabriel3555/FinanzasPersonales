<div class="d-flex justify-content-between align-items-center mb-4">
    <h2>Usuarios</h2>
    <button type="button" class="btn btn-primary" id="btnAgregarUsuario">
        Nuevo Usuario
    </button>
</div>

<!-- Panel Tabla Usuarios -->
<div id="panelTablaUsuario">
    <div class="card">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table" id="tablaUsuario">
                    <thead>
                        <tr>
                            <th>Documento</th>
                            <th>Nombre Completo</th>
                            <th>Email</th>
                            <th>Fecha Registro</th>
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

<!-- Panel Formulario Nuevo Usuario -->
<div id="panelFormularioUsuario" style="display: none;">
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">Nuevo Usuario</h5>
        </div>
        <div class="card-body">
            <form id="formUsuario" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_documento_usuario" class="form-label">Documento *</label>
                        <input type="text" class="form-control" id="txt_documento_usuario" required>
                        <div class="invalid-feedback">
                            Por favor ingrese el documento.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_email_usuario" class="form-label">Email *</label>
                        <input type="email" class="form-control" id="txt_email_usuario" required>
                        <div class="invalid-feedback">
                            Por favor ingrese un email válido.
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_nombre_usuario" class="form-label">Nombre *</label>
                        <input type="text" class="form-control" id="txt_nombre_usuario" required>
                        <div class="invalid-feedback">
                            Por favor ingrese el nombre.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_apellido_usuario" class="form-label">Apellido *</label>
                        <input type="text" class="form-control" id="txt_apellido_usuario" required>
                        <div class="invalid-feedback">
                            Por favor ingrese el apellido.
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_password_usuario" class="form-label">Contraseña *</label>
                        <input type="password" class="form-control" id="txt_password_usuario" required minlength="6">
                        <div class="invalid-feedback">
                            La contraseña debe tener al menos 6 caracteres.
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">
                        Guardar
                    </button>
                    <button type="button" class="btn btn-secondary" id="btnRegresarUsuario">
                        Regresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Panel Formulario Editar Usuario -->
<div id="panelFormularioEditarUsuario" style="display: none;">
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">Editar Usuario</h5>
        </div>
        <div class="card-body">
            <form id="formEditarUsuario" novalidate>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_edit_documento_usuario" class="form-label">Documento *</label>
                        <input type="text" class="form-control" id="txt_edit_documento_usuario" required>
                        <div class="invalid-feedback">
                            Por favor ingrese el documento.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_edit_email_usuario" class="form-label">Email *</label>
                        <input type="email" class="form-control" id="txt_edit_email_usuario" required>
                        <div class="invalid-feedback">
                            Por favor ingrese un email válido.
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="txt_edit_nombre_usuario" class="form-label">Nombre *</label>
                        <input type="text" class="form-control" id="txt_edit_nombre_usuario" required>
                        <div class="invalid-feedback">
                            Por favor ingrese el nombre.
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="txt_edit_apellido_usuario" class="form-label">Apellido *</label>
                        <input type="text" class="form-control" id="txt_edit_apellido_usuario" required>
                        <div class="invalid-feedback">
                            Por favor ingrese el apellido.
                        </div>
                    </div>
                </div>

                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary" id="btnActualizarUsuario">
                        Actualizar
                    </button>
                    <button type="button" class="btn btn-secondary" id="btnRegresarEditarUsuario">
                        Regresar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
