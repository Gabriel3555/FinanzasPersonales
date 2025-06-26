class Transaccion {
  constructor(objData) {
    this._objData = objData
    this.debug = true
    this.debugLog("🚀 Nueva instancia de Transaccion creada", objData)
  }

  mostrarTransaccion() {
    const objData = new FormData()
    objData.append("mostrarTransaccion", this._objData.mostrarTransaccion)

    this.debugLog("FormData preparado", {
      mostrarTransaccion: this._objData.mostrarTransaccion,
    })

    fetch("controlador/transaccionControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => {
        this.debugLog("Respuesta HTTP recibida", {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then((text) => {
        if (text.trim().startsWith("<")) {
          this.debugError("La respuesta parece ser HTML en lugar de JSON", text.substring(0, 200))
          throw new Error("Respuesta inválida del servidor (HTML recibido)")
        }
        if (text.includes("Fatal error") || text.includes("Warning") || text.includes("Notice")) {
          throw new Error("Error de PHP en el servidor")
        }

        try {
          const response = JSON.parse(text)
          return response
        } catch (e) {
          throw new Error("Respuesta inválida del servidor")
        }
      })
      .then((response) => {
        this.debugLog("Procesando respuesta JSON", response)

        if (response && response["codigo"] == "200") {
          this.debugSuccess("Respuesta exitosa del servidor")
          this.debugearDatosServidor(response)
          this.debugLog("Número de transacciones recibidas:", response["listaTransaccion"]?.length || 0)

          const dataSet = []
          response["listaTransaccion"].forEach((element, index) => {
            this.debugLog(`Procesando transacción ${index + 1}:`, element)

            // Formatear fecha correctamente
            const fecha = this.formatearFecha(element.fecha_transaccion)

            // Descripción
            const descripcion = element.descripcion || "Sin descripción"

            // Categoría
            const categoria = element.categoria_nombre || "Sin categoría"

            // Cuenta
            const cuenta = element.cuenta_nombre || "Sin cuenta"

            // Formatear tipo con badge
            const tipo =
              element.tipo === "ingreso"
                ? '<span class="badge bg-success">Ingreso</span>'
                : '<span class="badge bg-danger">Gasto</span>'

            // Formatear monto con color
            const montoNumerico = Number.parseFloat(element.monto)
            const montoFormateado =
              element.tipo === "ingreso"
                ? `<span class="text-success fw-bold">+$${montoNumerico.toFixed(2)}</span>`
                : `<span class="text-danger fw-bold">-$${montoNumerico.toFixed(2)}</span>`

            // Botones de acción
            const objBotones = `
              <div class="btn-group" role="group">
                <button type="button" class="btn btn-danger btn-sm" 
                        onclick="confirmarEliminacion(${element.idtransaccion})"
                        title="Eliminar transacción">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
                <button type="button" class="btn btn-info btn-sm" 
                        onclick="verDetalles(${element.idtransaccion})"
                        title="Ver detalles">
                  <i class="fas fa-eye"></i> Ver
                </button>
              </div>`

            // Array de datos en el orden correcto de las columnas
            dataSet.push([
              fecha, // Columna 0: Fecha
              descripcion, // Columna 1: Descripción
              categoria, // Columna 2: Categoría
              cuenta, // Columna 3: Cuenta
              tipo, // Columna 4: Tipo
              montoFormateado, // Columna 5: Monto
              objBotones, // Columna 6: Acciones
            ])
          })

          // Verificar dependencias
          const $ = window.$
          const Swal = window.Swal

          if (typeof $ === "undefined") {
            this.debugError("jQuery no está disponible")
            return
          }

          if (typeof $.fn.DataTable === "undefined") {
            this.debugError("DataTables no está disponible")
            return
          }

          this.debugLog("Inicializando DataTable...")

          try {
            // Destruir tabla existente si existe
            if ($.fn.DataTable.isDataTable("#tablaTransaccion")) {
              $("#tablaTransaccion").DataTable().destroy()
              this.debugLog("Tabla anterior destruida")
            }

            // Crear nueva tabla
            const table = $("#tablaTransaccion").DataTable({
              buttons: [
                {
                  extend: "colvis",
                  text: "Columnas",
                  className: "btn btn-secondary btn-sm",
                },
                {
                  extend: "excel",
                  text: "Excel",
                  className: "btn btn-success btn-sm",
                },
                {
                  extend: "pdf",
                  text: "PDF",
                  className: "btn btn-danger btn-sm",
                },
                {
                  extend: "print",
                  text: "Imprimir",
                  className: "btn btn-info btn-sm",
                },
              ],
              dom:
                '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
                '<"row"<"col-sm-12"B>>' +
                '<"row"<"col-sm-12"tr>>' +
                '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
              destroy: true,
              data: dataSet,
              order: [[0, "desc"]], // Ordenar por fecha descendente
              pageLength: 25,
              responsive: true,
              language: {
                url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
              },
              columnDefs: [
                {
                  targets: [6], // Columna de acciones
                  orderable: false,
                  searchable: false,
                  className: "text-center",
                },
                {
                  targets: [0], // Columna de fecha
                  type: "date",
                  className: "text-center",
                },
                {
                  targets: [4, 5], // Tipo y Monto
                  className: "text-center",
                },
              ],
            })

            this.debugSuccess("DataTable inicializado correctamente")

            // Guardar referencia de la tabla para uso posterior
            window.tablaTransaccionInstance = table
          } catch (dtError) {
            this.debugError("Error inicializando DataTable:", dtError)
          }
        } else {
          this.debugError("Respuesta con error del servidor:", response)
          const Swal = window.Swal
          if (typeof Swal !== "undefined") {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response?.mensaje || "Error al cargar las transacciones",
            })
          }
        }
      })
      .catch((error) => {
        this.debugError("Error completo en mostrarTransaccion:", error)
        this.debugError("Stack trace:", error.stack)
      })
  }

  formatearFecha(fechaString) {
    try {
      const fecha = new Date(fechaString)
      return fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    } catch (error) {
      this.debugError("Error formateando fecha:", error)
      return fechaString
    }
  }

  debugearDatosServidor(response) {
    if (this.debug && response["listaTransaccion"] && response["listaTransaccion"].length > 0) {
      const primeraTransaccion = response["listaTransaccion"][0]
      console.log("🔍 ESTRUCTURA DE DATOS DEL SERVIDOR:")
      console.log("📋 Campos disponibles:", Object.keys(primeraTransaccion))
      console.log("📅 fecha_transaccion:", primeraTransaccion.fecha_transaccion)
      console.log("📝 descripcion:", primeraTransaccion.descripcion)
      console.log("🏷️ categoria_nombre:", primeraTransaccion.categoria_nombre)
      console.log("🏦 cuenta_nombre:", primeraTransaccion.cuenta_nombre)
      console.log("📊 tipo:", primeraTransaccion.tipo)
      console.log("💰 monto:", primeraTransaccion.monto)
      console.log("🆔 idtransaccion:", primeraTransaccion.idtransaccion)
    }
  }

  eliminarTransaccion() {
    this.debugLog("Iniciando eliminarTransaccion()", {
      idtransaccion: this._objData.idtransaccion,
    })

    const objData = new FormData()
    objData.append("eliminarTransaccion", this._objData.eliminarTransaccion)
    objData.append("idtransaccion", this._objData.idtransaccion)

    fetch("controlador/transaccionControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => {
        this.debugLog("Respuesta HTTP para eliminar:", {
          status: response.status,
          ok: response.ok,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then((text) => {
        this.debugLog("Respuesta RAW para eliminar:", text)

        try {
          const response = JSON.parse(text)
          this.debugLog("JSON parseado para eliminar:", response)
          return response
        } catch (e) {
          this.debugError("Error parsing JSON en eliminar:", e)
          throw new Error("Respuesta inválida del servidor")
        }
      })
      .then((response) => {
        if (response["codigo"] == "200") {
          this.debugSuccess("Transacción eliminada correctamente")

          // ACTUALIZAR LA TABLA INMEDIATAMENTE
          this.actualizarTablaTransacciones()

          // ACTUALIZAR EL DASHBOARD SI EXISTE
          this.actualizarDashboard()

          const Swal = window.Swal
          if (typeof Swal !== "undefined") {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: response["mensaje"],
              showConfirmButton: false,
              timer: 1500,
            })
          }
        } else {
          this.debugError("Error eliminando transacción:", response)
          const Swal = window.Swal
          if (typeof Swal !== "undefined") {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response["mensaje"],
            })
          }
        }
      })
      .catch((error) => {
        this.debugError("Error completo en eliminarTransaccion:", error)
        const Swal = window.Swal
        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "error",
            title: "Error de conexión",
            text: "No se pudo eliminar la transacción. Intente nuevamente.",
          })
        }
      })
  }

  // NUEVA FUNCIÓN PARA ACTUALIZAR LA TABLA SIN RECARGAR LA PÁGINA
  actualizarTablaTransacciones() {
    this.debugLog("🔄 Actualizando tabla de transacciones...")

    // Crear nueva instancia para mostrar transacciones
    const objMostrar = new Transaccion({ mostrarTransaccion: "ok" })
    objMostrar.mostrarTransaccion()

    this.debugSuccess("✅ Tabla actualizada")
  }

  // NUEVA FUNCIÓN PARA ACTUALIZAR EL DASHBOARD
  actualizarDashboard() {
    this.debugLog("🔄 Actualizando dashboard...")

    // Verificar si existe la función global de actualización del dashboard
    if (typeof window.actualizarDashboard === "function") {
      window.actualizarDashboard()
      this.debugSuccess("✅ Dashboard actualizado")
    } else {
      this.debugLog("⚠️ Función de actualización del dashboard no disponible")
    }
  }

  registrarTransaccion() {
    const objData = new FormData()
    objData.append("registrarTransaccion", this._objData.registrarTransaccion)
    objData.append("idcuenta", this._objData.idcuenta)
    objData.append("idcategoria", this._objData.idcategoria)
    objData.append("tipo", this._objData.tipo)
    objData.append("monto", this._objData.monto)
    objData.append("descripcion", this._objData.descripcion)
    objData.append("fecha_transaccion", this._objData.fecha_transaccion)

    fetch("controlador/transaccionControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => {
        this.debugLog("Respuesta HTTP para registrar:", {
          status: response.status,
          ok: response.ok,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then((text) => {
        this.debugLog("Respuesta RAW para registrar:", text)

        try {
          const response = JSON.parse(text)
          this.debugLog("JSON parseado para registrar:", response)
          return response
        } catch (e) {
          this.debugError("Error parsing JSON en registrar:", e)
          throw new Error("Respuesta inválida del servidor")
        }
      })
      .then((response) => {
        if (response["codigo"] == "200") {
          this.debugSuccess("Transacción registrada correctamente")

          const formulario = document.getElementById("formTransaccion")
          if (formulario) {
            formulario.reset()
          }

          document.getElementById("panelFormularioTransaccion").style.display = "none"
          document.getElementById("panelTablaTransaccion").style.display = "block"

          // ACTUALIZAR LA TABLA INMEDIATAMENTE DESPUÉS DE REGISTRAR
          this.actualizarTablaTransacciones()

          // ACTUALIZAR EL DASHBOARD DESPUÉS DE REGISTRAR
          this.actualizarDashboard()

          const Swal = window.Swal
          if (typeof Swal !== "undefined") {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: response["mensaje"],
              showConfirmButton: false,
              timer: 1500,
            })
          }
        } else {
          this.debugError("Error registrando transacción:", response)
          const Swal = window.Swal
          if (typeof Swal !== "undefined") {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: response["mensaje"],
            })
          }
        }
      })
      .catch((error) => {
        this.debugError("Error completo en registrarTransaccion:", error)
      })
  }

  // Métodos de debug
  debugLog(mensaje, data = null) {
    if (this.debug) {
      console.log(`🔍 [Transaccion] ${mensaje}`, data || "")
    }
  }

  debugError(mensaje, data = null) {
    if (this.debug) {
      console.error(`❌ [Transaccion] ${mensaje}`, data || "")
    }
  }

  debugSuccess(mensaje, data = null) {
    if (this.debug) {
      console.log(`✅ [Transaccion] ${mensaje}`, data || "")
    }
  }

  toggleDebug() {
    this.debug = !this.debug
    console.log(`🔧 Debug mode: ${this.debug ? "ON" : "OFF"}`)
  }

  testConexion() {
    this.debugLog("🧪 Ejecutando test de conexión...")

    const objData = new FormData()
    objData.append("mostrarTransaccion", "ok")

    fetch("controlador/transaccionControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => {
        this.debugLog("🧪 Test - Status:", response.status)
        return response.text()
      })
      .then((text) => {
        this.debugLog("🧪 Test - Respuesta:", text.substring(0, 200))
        try {
          const json = JSON.parse(text)
          this.debugSuccess("🧪 Test - JSON válido:", json)
        } catch (e) {
          this.debugError("🧪 Test - JSON inválido:", e)
        }
      })
      .catch((error) => {
        this.debugError("🧪 Test - Error:", error)
      })
  }
}

// Funciones globales para los botones de acción
function confirmarEliminacion(idtransaccion) {
  console.log("⚠️ Confirmando eliminación de transacción:", idtransaccion)

  const Swal = window.Swal
  if (typeof Swal !== "undefined") {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Esta acción eliminará la transacción y actualizará el saldo de la cuenta.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("✅ Usuario confirmó eliminación")
        eliminarTransaccion(idtransaccion)
      } else {
        console.log("❌ Usuario canceló eliminación")
      }
    })
  } else {
    if (confirm("¿Está seguro de eliminar esta transacción?")) {
      eliminarTransaccion(idtransaccion)
    }
  }
}

function eliminarTransaccion(idtransaccion) {
  console.log("🗑️ Eliminando transacción:", idtransaccion)

  const objData = {
    eliminarTransaccion: "ok",
    idtransaccion: idtransaccion,
  }

  const objTransaccion = new Transaccion(objData)
  objTransaccion.eliminarTransaccion()
}

function verDetalles(idtransaccion) {
  console.log("👁️ Ver detalles de transacción:", idtransaccion)

  const Swal = window.Swal
  if (typeof Swal !== "undefined") {
    Swal.fire({
      title: "Detalles de la transacción",
      text: `ID de transacción: ${idtransaccion}`,
      icon: "info",
      confirmButtonText: "Cerrar",
    })
  } else {
    alert(`Detalles de la transacción ID: ${idtransaccion}`)
  }
}

// Exponer la clase globalmente
window.Transaccion = Transaccion
