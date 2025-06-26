<div class="container-fluid vh-100" style="background-color: var(--light-gray);">
    <div class="row h-100 justify-content-center align-items-center">
        <div class="col-md-6 col-lg-4">
            <div class="card">
                <div class="card-body p-4">
                    <div class="text-center mb-4">
                        <h2>Finanzas Personales</h2>
                        <p class="text-muted">Iniciar Sesión</p>
                    </div>
                    
                    <form id="formLogin" novalidate>
                        <div class="mb-3">
                            <label for="txt_email_login" class="form-label">Email</label>
                            <input type="email" class="form-control" id="txt_email_login" required>
                            <div class="invalid-feedback">
                                Por favor ingrese un email válido.
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label for="txt_password_login" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" id="txt_password_login" required>
                            <div class="invalid-feedback">
                                Por favor ingrese su contraseña.
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary w-100 mb-3">
                            Iniciar Sesión
                        </button>
                    </form>
                    
                    <div class="text-center">
                        <p class="mb-0">¿No tienes cuenta? 
                            <a href="#" id="btnMostrarRegistro">Regístrate aquí</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal de Registro -->
<div class="modal fade" id="modalRegistro" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Crear Cuenta</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="formRegistro" novalidate>
                    <div class="mb-3">
                        <label for="txt_documento_registro" class="form-label">Documento</label>
                        <input type="text" class="form-control" id="txt_documento_registro" required>
                    </div>
                    <div class="mb-3">
                        <label for="txt_email_registro" class="form-label">Email</label>
                        <input type="email" class="form-control" id="txt_email_registro" required>
                    </div>
                    <div class="mb-3">
                        <label for="txt_nombre_registro" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="txt_nombre_registro" required>
                    </div>
                    <div class="mb-3">
                        <label for="txt_apellido_registro" class="form-label">Apellido</label>
                        <input type="text" class="form-control" id="txt_apellido_registro" required>
                    </div>
                    <div class="mb-3">
                        <label for="txt_password_registro" class="form-label">Contraseña</label>
                        <input type="password" class="form-control" id="txt_password_registro" required minlength="6">
                    </div>
                    <div class="mb-3">
                        <label for="txt_password_confirmar" class="form-label">Confirmar Contraseña</label>
                        <input type="password" class="form-control" id="txt_password_confirmar" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">
                        Crear Cuenta
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>
