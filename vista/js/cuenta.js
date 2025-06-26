;(() => {
  // Verificar si estamos en la página de cuentas
  if (!document.getElementById("tablaCuenta")) return

  // Variables globales
  const cuentaActual = null

  // Funciones principales
  function inicializar() {
    // Verificar que la clase Cuenta esté disponible
    if (typeof Cuenta === "undefined") {
      console.error("La clase Cuenta no está definida. Asegúrate de que cl_cuenta.js se carga antes que cuenta.js")
      return
    }

    mostrarCuentas()
    configurarEventListeners()
  }

  function mostrarCuentas() {
    const objData = { mostrarCuenta: "ok" }
    const objTablaCuenta = new Cuenta(objData)
    objTablaCuenta.mostrarCuenta()
  }

  function configurarEventListeners() {
    // Botón agregar cuenta
    const btnAgregarCuenta = document.getElementById("btnAgregarCuenta")
    if (btnAgregarCuenta) {
      btnAgregarCuenta.addEventListener("click", mostrarFormularioNuevo)
    }

    // Botones regresar
    const btnRegresarCuenta = document.getElementById("btnRegresarCuenta")
    if (btnRegresarCuenta) {
      btnRegresarCuenta.addEventListener("click", regresarATabla)
    }

    const btnRegresarEditarCuenta = document.getElementById("btnRegresarEditarCuenta")
    if (btnRegresarEditarCuenta) {
      btnRegresarEditarCuenta.addEventListener("click", regresarATabla)
    }

    // Event delegation para botones dinámicos
    document.addEventListener("click", manejarClicksBotones)

    // Formularios
    configurarFormularios()
  }

  function mostrarFormularioNuevo() {
    document.getElementById("panelTablaCuenta").style.display = "none"
    document.getElementById("panelFormularioCuenta").style.display = "block"

    // Limpiar formulario
    const form = document.getElementById("formCuenta")
    if (form) {
      form.reset()
      form.classList.remove("was-validated")
    }

    // Enfocar primer campo
    const primerCampo = document.getElementById("txt_nombre_cuenta")
    if (primerCampo) {
      setTimeout(() => primerCampo.focus(), 100)
    }
  }

  function mostrarFormularioEditar(cuenta, nombre, tipo) {
    document.getElementById("panelTablaCuenta").style.display = "none"
    document.getElementById("panelFormularioEditarCuenta").style.display = "block"

    // Llenar formulario con datos actuales
    document.getElementById("txt_edit_nombre_cuenta").value = nombre
    document.getElementById("txt_edit_tipo_cuenta").value = tipo
    document.getElementById("btnActualizarCuenta").setAttribute("cuenta", cuenta)

    // Limpiar validaciones
    const form = document.getElementById("formEditarCuenta")
    if (form) {
      form.classList.remove("was-validated")
    }

    // Enfocar primer campo
    const primerCampo = document.getElementById("txt_edit_nombre_cuenta")
    if (primerCampo) {
      setTimeout(() => primerCampo.focus(), 100)
    }
  }

  function regresarATabla() {
    document.getElementById("panelFormularioCuenta").style.display = "none"
    document.getElementById("panelFormularioEditarCuenta").style.display = "none"
    document.getElementById("panelTablaCuenta").style.display = "block"
  }

  function manejarClicksBotones(event) {
    const target = event.target.closest("button")
    if (!target) return

    if (target.id === "btnEditarCuenta") {
      const cuenta = target.getAttribute("cuenta")
      const nombre = target.getAttribute("nombre")
      const tipo = target.getAttribute("tipo")
      mostrarFormularioEditar(cuenta, nombre, tipo)
    }

    if (target.id === "btnEliminarCuenta") {
      const cuenta = target.getAttribute("cuenta")
      confirmarEliminacion(cuenta)
    }
  }

  function confirmarEliminacion(idcuenta) {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        title: "¿Está seguro?",
        text: "Esta acción no se puede deshacer. Si la cuenta tiene transacciones asociadas, no podrá ser eliminada.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          eliminarCuenta(idcuenta)
        }
      })
    } else {
      if (confirm("¿Está seguro de que desea eliminar esta cuenta?")) {
        eliminarCuenta(idcuenta)
      }
    }
  }

  function eliminarCuenta(idcuenta) {
    const objData = {
      eliminarCuenta: "ok",
      idcuenta: idcuenta,
    }

    const objCuenta = new Cuenta(objData)
    objCuenta.eliminarCuenta()
  }

  function configurarFormularios() {
    // Formulario nueva cuenta
    const formCuenta = document.getElementById("formCuenta")
    if (formCuenta) {
      formCuenta.addEventListener("submit", manejarSubmitNuevaCuenta, false)
    }

    // Formulario editar cuenta
    const formEditarCuenta = document.getElementById("formEditarCuenta")
    if (formEditarCuenta) {
      formEditarCuenta.addEventListener("submit", manejarSubmitEditarCuenta, false)
    }

    // Validación en tiempo real
    configurarValidacionTiempoReal()
  }

  function manejarSubmitNuevaCuenta(event) {
    event.preventDefault()

    const form = event.target
    if (!form.checkValidity()) {
      event.stopPropagation()
      form.classList.add("was-validated")
      return
    }

    const nombre = document.getElementById("txt_nombre_cuenta").value.trim()
    const tipo = document.getElementById("txt_tipo_cuenta").value
    const saldo_inicial = Number.parseFloat(document.getElementById("txt_saldo_inicial").value) || 0

    // Validaciones adicionales
    if (!validarDatosCuenta(nombre, tipo, saldo_inicial)) {
      return
    }

    const objData = {
      registrarCuenta: "ok",
      nombre: nombre,
      tipo: tipo,
      saldo_inicial: saldo_inicial,
    }

    const objCuenta = new Cuenta(objData)
    objCuenta.registrarCuenta()
  }

  function manejarSubmitEditarCuenta(event) {
    event.preventDefault()

    const form = event.target
    if (!form.checkValidity()) {
      event.stopPropagation()
      form.classList.add("was-validated")
      return
    }

    const nombre = document.getElementById("txt_edit_nombre_cuenta").value.trim()
    const tipo = document.getElementById("txt_edit_tipo_cuenta").value
    const idcuenta = document.getElementById("btnActualizarCuenta").getAttribute("cuenta")

    // Validaciones adicionales
    if (!validarDatosCuenta(nombre, tipo)) {
      return
    }

    const objData = {
      editarCuenta: "ok",
      idcuenta: idcuenta,
      nombre: nombre,
      tipo: tipo,
    }

    const objCuenta = new Cuenta(objData)
    objCuenta.editarCuenta()
  }

  function validarDatosCuenta(nombre, tipo, saldoInicial = null) {
    if (!nombre || nombre.length < 2) {
      mostrarError("El nombre debe tener al menos 2 caracteres")
      return false
    }

    if (!tipo) {
      mostrarError("Debe seleccionar un tipo de cuenta")
      return false
    }

    if (saldoInicial !== null && (isNaN(saldoInicial) || saldoInicial < 0)) {
      mostrarError("El saldo inicial debe ser un número válido y no negativo")
      return false
    }

    return true
  }

  function mostrarError(mensaje) {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: mensaje,
      })
    } else {
      alert("Error: " + mensaje)
    }
  }

  function configurarValidacionTiempoReal() {
    // Validar nombre en tiempo real
    const camposNombre = document.querySelectorAll('[id*="nombre_cuenta"]')
    camposNombre.forEach((campo) => {
      campo.addEventListener("input", function () {
        const valor = this.value.trim()
        if (valor.length > 0 && valor.length < 2) {
          this.setCustomValidity("El nombre debe tener al menos 2 caracteres")
        } else {
          this.setCustomValidity("")
        }
      })
    })

    // Validar saldo inicial
    const campoSaldo = document.getElementById("txt_saldo_inicial")
    if (campoSaldo) {
      campoSaldo.addEventListener("input", function () {
        const valor = Number.parseFloat(this.value)
        if (this.value && (isNaN(valor) || valor < 0)) {
          this.setCustomValidity("El saldo debe ser un número válido y no negativo")
        } else {
          this.setCustomValidity("")
        }
      })
    }
  }

  // Funciones de utilidad
  function formatearMoneda(monto) {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Number.parseFloat(monto))
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar)
  } else {
    inicializar()
  }

  // Exponer funciones globales si es necesario
  window.CuentaManager = {
    mostrarCuentas,
    formatearMoneda,
  }
})()
