class Transaccion {
  constructor(objData) {
    this._objData = objData
  }

  mostrarTransaccion() {
    const objData = new FormData()
    objData.append("mostrarTransaccion", this._objData.mostrarTransaccion)

    fetch("controlador/transaccionControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then((text) => {
        if (text.trim().startsWith("<")) {
          throw new Error("Respuesta inválida del servidor (HTML recibido)")
        }
        if (text.includes("Fatal error") || text.includes("Warning") || text.includes("Notice")) {
          throw new Error("Error de PHP en el servidor")
        }

        const response = JSON.parse(text)
        return response
      })
      .then((response) => {
        if (response && response["codigo"] == "200") {
          const dataSet = []
          response["listaTransaccion"].forEach((element) => {
            const fecha = this.formatearFecha(element.fecha_transaccion)
            const descripcion = element.descripcion || "Sin descripción"
            const categoria = element.categoria_nombre || "Sin categoría"
            const cuenta = element.cuenta_nombre || "Sin cuenta"
            const tipo = element.tipo === "ingreso"
              ? '<span class="badge bg-success">Ingreso</span>'
              : '<span class="badge bg-danger">Gasto</span>'

            const montoNumerico = Number.parseFloat(element.monto)
            const montoFormateado = element.tipo === "ingreso"
              ? `<span class="text-success fw-bold">+$${montoNumerico.toFixed(2)}</span>`
              : `<span class="text-danger fw-bold">-$${montoNumerico.toFixed(2)}</span>`

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

            dataSet.push([
              fecha,
              descripcion,
              categoria,
              cuenta,
              tipo,
              montoFormateado,
              objBotones,
            ])
          })

          const $ = window.$
          if (typeof $ === "undefined" || typeof $.fn.DataTable === "undefined") {
            return
          }

          if ($.fn.DataTable.isDataTable("#tablaTransaccion")) {
            $("#tablaTransaccion").DataTable().destroy()
          }

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
            dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
                 '<"row"<"col-sm-12"B>>' +
                 '<"row"<"col-sm-12"tr>>' +
                 '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
            destroy: true,
            data: dataSet,
            order: [[0, "desc"]],
            pageLength: 25,
            responsive: true,
            language: {
              url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
            },
            columnDefs: [
              {
                targets: [6],
                orderable: false,
                searchable: false,
                className: "text-center",
              },
              {
                targets: [0],
                type: "date",
                className: "text-center",
              },
              {
                targets: [4, 5],
                className: "text-center",
              },
            ],
          })

          window.tablaTransaccionInstance = table
        } else {
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
        console.error("Error:", error)
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
      return fechaString
    }
  }

  eliminarTransaccion() {
    const objData = new FormData()
    objData.append("eliminarTransaccion", this._objData.eliminarTransaccion)
    objData.append("idtransaccion", this._objData.idtransaccion)

    fetch("controlador/transaccionControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then((text) => {
        const response = JSON.parse(text)
        return response
      })
      .then((response) => {
        if (response["codigo"] == "200") {
          this.actualizarTablaTransacciones()
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

  actualizarTablaTransacciones() {
    const objMostrar = new Transaccion({ mostrarTransaccion: "ok" })
    objMostrar.mostrarTransaccion()
  }

  actualizarDashboard() {
    if (typeof window.actualizarDashboard === "function") {
      window.actualizarDashboard()
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
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        return response.text()
      })
      .then((text) => {
        const response = JSON.parse(text)
        return response
      })
      .then((response) => {
        if (response["codigo"] == "200") {
          const formulario = document.getElementById("formTransaccion")
          if (formulario) {
            formulario.reset()
          }

          document.getElementById("panelFormularioTransaccion").style.display = "none"
          document.getElementById("panelTablaTransaccion").style.display = "block"

          this.actualizarTablaTransacciones()
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
        console.error("Error:", error)
      })
  }
}

function confirmarEliminacion(idtransaccion) {
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
        eliminarTransaccion(idtransaccion)
      }
    })
  } else {
    if (confirm("¿Está seguro de eliminar esta transacción?")) {
      eliminarTransaccion(idtransaccion)
    }
  }
}

function eliminarTransaccion(idtransaccion) {
  const objData = {
    eliminarTransaccion: "ok",
    idtransaccion: idtransaccion,
  }

  const objTransaccion = new Transaccion(objData)
  objTransaccion.eliminarTransaccion()
}

function verDetalles(idtransaccion) {
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

window.Transaccion = Transaccion