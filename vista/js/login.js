;(() => {
  // Verificar si estamos en la página de login
  if (!document.getElementById("formLogin")) return

  // Variables globales
  let modalRegistro = null

  // Inicializar cuando el DOM esté listo
  function inicializar() {
    configurarEventListeners()
    inicializarModal()
  }

  function configurarEventListeners() {
    // Formulario de login
    const formLogin = document.getElementById("formLogin")
    if (formLogin) {
      formLogin.addEventListener("submit", manejarLogin)
    }

    // Formulario de registro
    const formRegistro = document.getElementById("formRegistro")
    if (formRegistro) {
      formRegistro.addEventListener("submit", manejarRegistro)
    }

    // Botón mostrar registro
    const btnMostrarRegistro = document.getElementById("btnMostrarRegistro")
    if (btnMostrarRegistro) {
      btnMostrarRegistro.addEventListener("click", mostrarModalRegistro)
    }

    // Validación de confirmación de contraseña
    const passwordConfirmar = document.getElementById("txt_password_confirmar")
    if (passwordConfirmar) {
      passwordConfirmar.addEventListener("input", validarConfirmacionPassword)
    }
  }

  function inicializarModal() {
    const modalElement = document.getElementById("modalRegistro")
    if (modalElement && window.bootstrap) {
      modalRegistro = new bootstrap.Modal(modalElement)
    }
  }

  function manejarLogin(event) {
    event.preventDefault()

    const form = event.target
    if (!form.checkValidity()) {
      event.stopPropagation()
      form.classList.add("was-validated")
      return
    }

    const email = document.getElementById("txt_email_login").value.trim()
    const password = document.getElementById("txt_password_login").value

    // Validaciones adicionales
    if (!validarEmail(email)) {
      mostrarError("Por favor ingrese un email válido")
      return
    }

    if (password.length < 6) {
      mostrarError("La contraseña debe tener al menos 6 caracteres")
      return
    }

    // Realizar login
    realizarLogin(email, password)
  }

  function realizarLogin(email, password) {
    const objData = new FormData()
    objData.append("login", "ok")
    objData.append("email", email)
    objData.append("password", password)

    // Mostrar loading
    const btnSubmit = document.querySelector("#formLogin button[type='submit']")
    const textoOriginal = btnSubmit.textContent
    btnSubmit.disabled = true
    btnSubmit.textContent = "Iniciando sesión..."

    fetch("controlador/usuarioControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error:", error)
        throw new Error("Error de conexión")
      })
      .then((response) => {
        if (response.codigo == "200") {
          mostrarExito("¡Bienvenido! Redirigiendo...")
          setTimeout(() => {
            window.location.href = "index.php"
          }, 1500)
        } else {
          mostrarError(response.mensaje || "Credenciales incorrectas")
        }
      })
      .catch((error) => {
        console.error("Error en login:", error)
        mostrarError("Error al iniciar sesión. Intente nuevamente.")
      })
      .finally(() => {
        // Restaurar botón
        btnSubmit.disabled = false
        btnSubmit.textContent = textoOriginal
      })
  }

  function manejarRegistro(event) {
    event.preventDefault()

    const form = event.target
    if (!form.checkValidity()) {
      event.stopPropagation()
      form.classList.add("was-validated")
      return
    }

    const documento = document.getElementById("txt_documento_registro").value.trim()
    const email = document.getElementById("txt_email_registro").value.trim()
    const nombre = document.getElementById("txt_nombre_registro").value.trim()
    const apellido = document.getElementById("txt_apellido_registro").value.trim()
    const password = document.getElementById("txt_password_registro").value
    const passwordConfirmar = document.getElementById("txt_password_confirmar").value

    // Validaciones adicionales
    if (!validarDatosRegistro(documento, email, nombre, apellido, password, passwordConfirmar)) {
      return
    }

    // Realizar registro
    realizarRegistro(documento, email, nombre, apellido, password)
  }

  function validarDatosRegistro(documento, email, nombre, apellido, password, passwordConfirmar) {
    if (documento.length < 5) {
      mostrarError("El documento debe tener al menos 5 caracteres")
      return false
    }

    if (!validarEmail(email)) {
      mostrarError("Por favor ingrese un email válido")
      return false
    }

    if (nombre.length < 2) {
      mostrarError("El nombre debe tener al menos 2 caracteres")
      return false
    }

    if (apellido.length < 2) {
      mostrarError("El apellido debe tener al menos 2 caracteres")
      return false
    }

    if (password.length < 6) {
      mostrarError("La contraseña debe tener al menos 6 caracteres")
      return false
    }

    if (password !== passwordConfirmar) {
      mostrarError("Las contraseñas no coinciden")
      return false
    }

    return true
  }

  function realizarRegistro(documento, email, nombre, apellido, password) {
    const objData = new FormData()
    objData.append("registrarUsuario", "ok")
    objData.append("documento", documento)
    objData.append("email", email)
    objData.append("nombre", nombre)
    objData.append("apellido", apellido)
    objData.append("password", password)

    // Mostrar loading
    const btnSubmit = document.querySelector("#formRegistro button[type='submit']")
    const textoOriginal = btnSubmit.textContent
    btnSubmit.disabled = true
    btnSubmit.textContent = "Creando cuenta..."

    fetch("controlador/usuarioControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error:", error)
        throw new Error("Error de conexión")
      })
      .then((response) => {
        if (response.codigo == "200") {
          mostrarExito("¡Cuenta creada exitosamente!")

          // Limpiar formulario
          document.getElementById("formRegistro").reset()
          document.getElementById("formRegistro").classList.remove("was-validated")

          // Cerrar modal
          if (modalRegistro) {
            modalRegistro.hide()
          }

          // Opcional: Auto-login después del registro
          setTimeout(() => {
            document.getElementById("txt_email_login").value = email
            document.getElementById("txt_email_login").focus()
          }, 500)
        } else {
          mostrarError(response.mensaje || "Error al crear la cuenta")
        }
      })
      .catch((error) => {
        console.error("Error en registro:", error)
        mostrarError("Error al crear la cuenta. Intente nuevamente.")
      })
      .finally(() => {
        // Restaurar botón
        btnSubmit.disabled = false
        btnSubmit.textContent = textoOriginal
      })
  }

  function mostrarModalRegistro(event) {
    event.preventDefault()
    if (modalRegistro) {
      modalRegistro.show()
    }
  }

  function validarConfirmacionPassword() {
    const password = document.getElementById("txt_password_registro").value
    const passwordConfirmar = document.getElementById("txt_password_confirmar").value
    const campo = document.getElementById("txt_password_confirmar")

    if (passwordConfirmar && password !== passwordConfirmar) {
      campo.setCustomValidity("Las contraseñas no coinciden")
    } else {
      campo.setCustomValidity("")
    }
  }

  function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  function mostrarError(mensaje) {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensaje,
        confirmButtonColor: "#2c3e50",
      })
    } else {
      alert("Error: " + mensaje)
    }
  }

  function mostrarExito(mensaje) {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: mensaje,
        confirmButtonColor: "#2c3e50",
        timer: 2000,
        showConfirmButton: false,
      })
    } else {
      alert(mensaje)
    }
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar)
  } else {
    inicializar()
  }

  // Exponer funciones globales si es necesario
  window.LoginManager = {
    validarEmail,
    mostrarError,
    mostrarExito,
  }
})()
