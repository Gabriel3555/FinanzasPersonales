;(() => {


  // Verificar si estamos en la página de presupuestos
  const esPaginaPresupuestos =
    document.getElementById("tablaPresupuesto") ||
    document.querySelector(".presupuestos") ||
    document.querySelector("[data-page='presupuestos']") ||
    document.querySelector("#presupuestos") ||
    window.location.pathname.includes("presupuesto") ||
    window.location.href.includes("presupuesto") ||
    document.title.toLowerCase().includes("presupuesto") ||
    document.querySelector("h1, h2, h3")?.textContent?.toLowerCase().includes("presupuesto")

  if (!esPaginaPresupuestos) {
    return
  }

  // Variables globales
  let presupuestoInstance = null
  const Presupuesto = window.Presupuesto // Declare the Presupuesto variable

  function inicializar() {

    // Verificar dependencias
    if (typeof Presupuesto === "undefined") {
      return
    }

    mostrarPresupuestos()
    cargarCategoriasGasto()
    cargarAlertas()
    configurarEventListeners()
    configurarValidacionesFechas()
  }

  function mostrarPresupuestos() {
    const objData = { mostrarPresupuesto: "ok" }
    presupuestoInstance = new Presupuesto(objData)
    presupuestoInstance.mostrarPresupuesto()
  }

  function cargarCategoriasGasto() {

    if (presupuestoInstance) {
      presupuestoInstance.cargarCategoriasGasto()
    } else {
      const objData = { mostrarPresupuesto: "ok" }
      const tempInstance = new Presupuesto(objData)
      tempInstance.cargarCategoriasGasto()
    }
  }

  function cargarAlertas() {

    if (presupuestoInstance) {
      presupuestoInstance.cargarAlertas()
    } else {
      const objData = { mostrarPresupuesto: "ok" }
      const tempInstance = new Presupuesto(objData)
      tempInstance.cargarAlertas()
    }
  }

  function configurarEventListeners() {


    // Botón agregar presupuesto
    const btnAgregarPresupuesto = document.getElementById("btnAgregarPresupuesto")
    if (btnAgregarPresupuesto) {
      btnAgregarPresupuesto.addEventListener("click", mostrarFormularioNuevo)
    }

    // Botones regresar
    const btnRegresarPresupuesto = document.getElementById("btnRegresarPresupuesto")
    if (btnRegresarPresupuesto) {
      btnRegresarPresupuesto.addEventListener("click", regresarATabla)
    }

    const btnRegresarEditarPresupuesto = document.getElementById("btnRegresarEditarPresupuesto")
    if (btnRegresarEditarPresupuesto) {
      btnRegresarEditarPresupuesto.addEventListener("click", regresarATabla)
    }

    // Formularios
    configurarFormularios()

    // Cambio de período para calcular fechas automáticamente
    const periodoPrincipal = document.getElementById("txt_periodo_presupuesto")
    if (periodoPrincipal) {
      periodoPrincipal.addEventListener("change", calcularFechasPorPeriodo)
    }

    const periodoEditar = document.getElementById("txt_edit_periodo_presupuesto")
    if (periodoEditar) {
      periodoEditar.addEventListener("change", calcularFechasPorPeriodoEditar)
    }
  }

  function mostrarFormularioNuevo() {

    document.getElementById("panelTablaPresupuesto").style.display = "none"
    document.getElementById("panelFormularioPresupuesto").style.display = "block"

    // Limpiar formulario
    const form = document.getElementById("formPresupuesto")
    if (form) {
      form.reset()
      form.classList.remove("was-validated")
    }

    // Establecer fecha actual como inicio
    const fechaInicio = document.getElementById("txt_fecha_inicio")
    if (fechaInicio) {
      fechaInicio.value = new Date().toISOString().split("T")[0]
    }

    // Recargar categorías
    cargarCategoriasGasto()
  }

  function regresarATabla() {
    console.log("↩️ Regresando a tabla")
    document.getElementById("panelFormularioPresupuesto").style.display = "none"
    document.getElementById("panelFormularioEditarPresupuesto").style.display = "none"
    document.getElementById("panelTablaPresupuesto").style.display = "block"
  }

  function configurarFormularios() {
    // Formulario nuevo presupuesto
    const formPresupuesto = document.getElementById("formPresupuesto")
    if (formPresupuesto) {
      formPresupuesto.addEventListener("submit", manejarSubmitNuevoPresupuesto, false)
    }

    // Formulario editar presupuesto
    const formEditarPresupuesto = document.getElementById("formEditarPresupuesto")
    if (formEditarPresupuesto) {
      formEditarPresupuesto.addEventListener("submit", manejarSubmitEditarPresupuesto, false)
    }
  }

function manejarSubmitNuevoPresupuesto(event) {
    event.preventDefault();
    
    const form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }
    
    // Obtener valores del formulario
    const idcategoria = document.getElementById('txt_categoria_presupuesto').value;
    const monto_limite = parseFloat(document.getElementById('txt_monto_limite').value);
    const periodo = document.getElementById('txt_periodo_presupuesto').value;
    const fecha_inicio = document.getElementById('txt_fecha_inicio').value;
    const fecha_fin = document.getElementById('txt_fecha_fin').value;
    
    // Validación adicional de fechas
    if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
        const Swal = window.Swal;
        if (Swal) {
            Swal.fire({
                icon: 'error',
                title: 'Error en fechas',
                text: 'La fecha de inicio debe ser anterior a la fecha de fin',
            });
        } else {
            alert('La fecha de inicio debe ser anterior a la fecha de fin');
        }
        return;
    }
    
    // Crear objeto de datos
    const objData = {
        registrarPresupuesto: "ok",
        idcategoria: idcategoria,
        monto_limite: monto_limite,
        periodo: periodo,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin
    };
    
    // Crear instancia y registrar presupuesto
    const objPresupuesto = new Presupuesto(objData);
    objPresupuesto.registrarPresupuesto().catch(() => {
        // El error ya se maneja dentro del método registrarPresupuesto
    });
  }

function manejarSubmitEditarPresupuesto(event) {
    event.preventDefault();

    const form = event.target;
    if (!form.checkValidity()) {
        event.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    // Obtener valores del formulario
    const idcategoria = document.getElementById('txt_edit_categoria_presupuesto').value;
    const monto_limite = parseFloat(document.getElementById('txt_edit_monto_limite').value);
    const periodo = document.getElementById('txt_edit_periodo_presupuesto').value;
    const fecha_inicio = document.getElementById('txt_edit_fecha_inicio').value;
    const fecha_fin = document.getElementById('txt_edit_fecha_fin').value;
    const idpresupuesto = document.getElementById('btnActualizarPresupuesto').getAttribute('data-id');
    
    // Validación adicional de fechas
    if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
        const Swal = window.Swal;
        if (Swal) {
            Swal.fire({
                icon: 'error',
                title: 'Error en fechas',
                text: 'La fecha de inicio debe ser anterior a la fecha de fin',
            });
        } else {
            alert('La fecha de inicio debe ser anterior a la fecha de fin');
        }
        return;
    }

    // Crear objeto de datos
    const objData = {
        editarPresupuesto: "ok",
        idpresupuesto: idpresupuesto,
        idcategoria: idcategoria,
        monto_limite: monto_limite,
        periodo: periodo,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin
    };

    // Crear instancia y editar presupuesto
    const objPresupuesto = new Presupuesto(objData);
    objPresupuesto.editarPresupuesto().catch(() => {
        // El error ya se maneja dentro del método editarPresupuesto
    });
}

  function validarDatosPresupuesto(datos) {
    if (!datos.idcategoria) {
      mostrarError("Debe seleccionar una categoría")
      return false
    }

    if (isNaN(datos.monto_limite) || datos.monto_limite <= 0) {
      mostrarError("El monto límite debe ser mayor a 0")
      return false
    }

    if (!datos.periodo) {
      mostrarError("Debe seleccionar un período")
      return false
    }

    if (!datos.fecha_inicio || !datos.fecha_fin) {
      mostrarError("Debe seleccionar fechas de inicio y fin")
      return false
    }

    if (new Date(datos.fecha_inicio) >= new Date(datos.fecha_fin)) {
      mostrarError("La fecha de inicio debe ser anterior a la fecha de fin")
      return false
    }

    return true
  }

  function calcularFechasPorPeriodo() {
    const periodo = document.getElementById("txt_periodo_presupuesto").value
    const fechaInicio = document.getElementById("txt_fecha_inicio").value

    if (!periodo || !fechaInicio) return

    const inicio = new Date(fechaInicio)
    const fin = new Date(inicio)

    switch (periodo) {
      case "semanal":
        fin.setDate(inicio.getDate() + 6)
        break
      case "mensual":
        fin.setMonth(inicio.getMonth() + 1)
        fin.setDate(fin.getDate() - 1)
        break
      case "anual":
        fin.setFullYear(inicio.getFullYear() + 1)
        fin.setDate(fin.getDate() - 1)
        break
    }

    document.getElementById("txt_fecha_fin").value = fin.toISOString().split("T")[0]
  }

  function calcularFechasPorPeriodoEditar() {
    const periodo = document.getElementById("txt_edit_periodo_presupuesto").value
    const fechaInicio = document.getElementById("txt_edit_fecha_inicio").value

    if (!periodo || !fechaInicio) return

    const inicio = new Date(fechaInicio)
    const fin = new Date(inicio)

    switch (periodo) {
      case "semanal":
        fin.setDate(inicio.getDate() + 6)
        break
      case "mensual":
        fin.setMonth(inicio.getMonth() + 1)
        fin.setDate(fin.getDate() - 1)
        break
      case "anual":
        fin.setFullYear(inicio.getFullYear() + 1)
        fin.setDate(fin.getDate() - 1)
        break
    }

    document.getElementById("txt_edit_fecha_fin").value = fin.toISOString().split("T")[0]
  }

  function configurarValidacionesFechas() {
    // Validación de fecha de inicio
    const fechaInicio = document.getElementById("txt_fecha_inicio")
    if (fechaInicio) {
      fechaInicio.addEventListener("change", calcularFechasPorPeriodo)
    }

    const fechaInicioEdit = document.getElementById("txt_edit_fecha_inicio")
    if (fechaInicioEdit) {
      fechaInicioEdit.addEventListener("change", calcularFechasPorPeriodoEditar)
    }
  }

  function mostrarError(mensaje) {
    const Swal = window.Swal
    if (typeof Swal !== "undefined") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensaje,
      })
    } else {
      alert("Error: " + mensaje)
    }
  }

  // Función global para actualizar presupuestos
  window.actualizarPresupuestos = () => {

    mostrarPresupuestos()
    cargarAlertas()
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar)
  } else {
    setTimeout(inicializar, 100)
  }

  // Debug global
  window.PresupuestoDebug = {
    mostrar: mostrarPresupuestos,
    alertas: cargarAlertas,
    categorias: cargarCategoriasGasto,
    actualizar: () => window.actualizarPresupuestos(),
  }


})()
