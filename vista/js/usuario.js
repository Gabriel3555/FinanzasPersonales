;(() => {
  // Verificar si estamos en la página de usuarios
  if (!document.getElementById("tablaUsuario")) return

  // Inicializar
  function inicializar() {
    mostrarUsuarios()
    configurarEventListeners()
  }

  function mostrarUsuarios() {
    const objData = { mostrarUsuario: "ok" }
    const objTablaUsuario = new Usuario(objData)
    objTablaUsuario.mostrarUsuario()
  }

  function configurarEventListeners() {
    // Botón agregar usuario
    const btnAgregarUsuario = document.getElementById("btnAgregarUsuario")
    if (btnAgregarUsuario) {
      btnAgregarUsuario.addEventListener("click", mostrarFormularioNuevo)
    }

    // Botones regresar
    const btnRegresarUsuario = document.getElementById("btnRegresarUsuario")
    if (btnRegresarUsuario) {
      btnRegresarUsuario.addEventListener("click", regresarATabla)
    }

    const btnRegresarEditarUsuario = document.getElementById("btnRegresarEditarUsuario")
    if (btnRegresarEditarUsuario) {
      btnRegresarEditarUsuario.addEventListener("click", regresarATabla)
    }

    // Event delegation para botones dinámicos
    document.addEventListener("click", manejarClicksBotones)

    // Formularios
    configurarFormularios()
  }

  function mostrarFormularioNuevo() {
    document.getElementById("panelTablaUsuario").style.display = "none"
    document.getElementById("panelFormularioUsuario").style.display = "block"

    // Limpiar formulario
    const form = document.getElementById("formUsuario")
    if (form) {
      form.reset()
      form.classList.remove("was-validated")
    }
  }

  function mostrarFormularioEditar(usuario, documento, nombre, apellido, email) {
    document.getElementById("panelTablaUsuario").style.display = "none"
    document.getElementById("panelFormularioEditarUsuario").style.display = "block"

    // Llenar formulario con datos actuales
    document.getElementById("txt_edit_documento_usuario").value = documento
    document.getElementById("txt_edit_nombre_usuario").value = nombre
    document.getElementById("txt_edit_apellido_usuario").value = apellido
    document.getElementById("txt_edit_email_usuario").value = email
    document.getElementById("btnActualizarUsuario").setAttribute("usuario", usuario)

    // Limpiar validaciones
    const form = document.getElementById("formEditarUsuario")
    if (form) {
      form.classList.remove("was-validated")
    }
  }

  function regresarATabla() {
    document.getElementById("panelFormularioUsuario").style.display = "none"
    document.getElementById("panelFormularioEditarUsuario").style.display = "none"
    document.getElementById("panelTablaUsuario").style.display = "block"
  }

  function manejarClicksBotones(event) {
    const target = event.target.closest("button")
    if (!target) return

    if (target.id === "btnEditarUsuario") {
      const usuario = target.getAttribute("usuario")
      const documento = target.getAttribute("documento")
      const nombre = target.getAttribute("nombre")
      const apellido = target.getAttribute("apellido")
      const email = target.getAttribute("email")
      mostrarFormularioEditar(usuario, documento, nombre, apellido, email)
    }

    if (target.id === "btnEliminarUsuario") {
      const usuario = target.getAttribute("usuario")
      confirmarEliminacion(usuario)
    }
  }

  function confirmarEliminacion(idusuario) {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarUsuario(idusuario)
      }
    })
  }

  function eliminarUsuario(idusuario) {
    const objData = {
      eliminarUsuario: "ok",
      idusuario: idusuario,
    }

    const objUsuario = new Usuario(objData)
    objUsuario.eliminarUsuario()
  }

  function configurarFormularios() {
    // Formulario nuevo usuario
    const formsUsuario = document.querySelectorAll("#formUsuario")
    Array.from(formsUsuario).forEach((form) => {
      form.addEventListener("submit", manejarSubmitNuevoUsuario, false)
    })

    // Formulario editar usuario
    const formsEditarUsuario = document.querySelectorAll("#formEditarUsuario")
    Array.from(formsEditarUsuario).forEach((form) => {
      form.addEventListener("submit", manejarSubmitEditarUsuario, false)
    })
  }

  function manejarSubmitNuevoUsuario(event) {
    event.preventDefault()

    const form = event.target
    if (!form.checkValidity()) {
      event.stopPropagation()
      form.classList.add("was-validated")
      return
    }

    const documento = document.getElementById("txt_documento_usuario").value.trim()
    const nombre = document.getElementById("txt_nombre_usuario").value.trim()
    const apellido = document.getElementById("txt_apellido_usuario").value.trim()
    const email = document.getElementById("txt_email_usuario").value.trim()
    const password = document.getElementById("txt_password_usuario").value

    const objData = {
      registrarUsuario: "ok",
      documento: documento,
      nombre: nombre,
      apellido: apellido,
      email: email,
      password: password,
    }

    const objUsuario = new Usuario(objData)
    objUsuario.registarUsuario()
  }

  function manejarSubmitEditarUsuario(event) {
    event.preventDefault()

    const form = event.target
    if (!form.checkValidity()) {
      event.stopPropagation()
      form.classList.add("was-validated")
      return
    }

    const documento = document.getElementById("txt_edit_documento_usuario").value.trim()
    const nombre = document.getElementById("txt_edit_nombre_usuario").value.trim()
    const apellido = document.getElementById("txt_edit_apellido_usuario").value.trim()
    const email = document.getElementById("txt_edit_email_usuario").value.trim()
    const idUsuario = document.getElementById("btnActualizarUsuario").getAttribute("usuario")

    const objData = {
      editarUsuario: "ok",
      idUsuario: idUsuario,
      documento: documento,
      nombre: nombre,
      apellido: apellido,
      email: email,
    }

    const objUsuario = new Usuario(objData)
    objUsuario.editarUsuario()
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar)
  } else {
    inicializar()
  }
})()
