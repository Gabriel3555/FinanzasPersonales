class Cuenta {
  constructor(objData) {
    this._objData = objData
  }

  mostrarCuenta() {
    const objData = new FormData()
    objData.append("mostrarCuenta", this._objData.mostrarCuenta)

    fetch("controlador/cuentaControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error)
      })
      .then((response) => {
        if (response["codigo"] == "200") {
          const dataSet = []
          response["listaCuenta"].forEach((element) => {
            let objBotones = '<div class="btn-group" role="group">'
            objBotones +=
              '<button id="btnEditarCuenta" type="button" class="btn btn-info btn-sm" cuenta="' +
              element.idcuenta +
              '" nombre="' +
              element.nombre +
              '" tipo="' +
              element.tipo +
              '"><i class="bi bi-pen"></i></button>'
            objBotones +=
              '<button id="btnEliminarCuenta" type="button" class="btn btn-danger btn-sm" cuenta="' +
              element.idcuenta +
              '"><i class="bi bi-x"></i></button>'
            objBotones += "</div>"

            const fechaCreacion = new Date(element.fecha_creacion).toLocaleDateString()
            const tipoFormateado = element.tipo.charAt(0).toUpperCase() + element.tipo.slice(1)
            const saldoInicial = "$" + Number.parseFloat(element.saldo_inicial).toFixed(2)
            const saldoActual = "$" + Number.parseFloat(element.saldo_actual).toFixed(2)

            dataSet.push([element.nombre, tipoFormateado, saldoInicial, saldoActual, fechaCreacion, objBotones])
          })

          $(document).ready(() => {
            $("#tablaCuenta").DataTable({
              buttons: [
                {
                  extend: "colvis",
                  text: "Columnas",
                },
                "excel",
                "pdf",
                "print",
              ],
              dom: "Bfrtip",
              responsive: true,
              destroy: true,
              data: dataSet,
              language: {
                url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
              },
            })
          })
        } else {
          console.log("error")
        }
      })
  }

  eliminarCuenta() {
    const objData = new FormData()
    objData.append("eliminarCuenta", this._objData.eliminarCuenta)
    objData.append("idcuenta", this._objData.idcuenta)

    fetch("controlador/cuentaControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error)
      })
      .then((response) => {
        if (response["codigo"] == "200") {
          this.mostrarCuenta()
          window.Swal.fire({
            position: "top-end",
            icon: "success",
            title: response["mensaje"],
            showConfirmButton: false,
            timer: 1500,
          })
        } else {
          window.Swal.fire({
            icon: "error",
            title: "Error",
            text: response["mensaje"],
          })
        }
      })
  }

  registrarCuenta() {
    const objData = new FormData()
    objData.append("registrarCuenta", this._objData.registrarCuenta)
    objData.append("nombre", this._objData.nombre)
    objData.append("tipo", this._objData.tipo)
    objData.append("saldo_inicial", this._objData.saldo_inicial)

    fetch("controlador/cuentaControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error)
      })
      .then((response) => {
        if (response["codigo"] == "200") {
          const formulario = document.getElementById("formCuenta")
          formulario.reset()

          document.getElementById("panelFormularioCuenta").style.display = "none"
          document.getElementById("panelTablaCuenta").style.display = "block"

          this.mostrarCuenta()

          window.Swal.fire({
            position: "top-end",
            icon: "success",
            title: response["mensaje"],
            showConfirmButton: false,
            timer: 1500,
          })
        } else {
          window.Swal.fire({
            icon: "error",
            title: "Error",
            text: response["mensaje"],
          })
        }
      })
  }

  editarCuenta() {
    const objData = new FormData()
    objData.append("editarCuenta", this._objData.editarCuenta)
    objData.append("idcuenta", this._objData.idcuenta)
    objData.append("nombre", this._objData.nombre)
    objData.append("tipo", this._objData.tipo)

    fetch("controlador/cuentaControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error)
      })
      .then((response) => {
        if (response["codigo"] == "200") {
          const formulario = document.getElementById("formEditarCuenta")
          formulario.reset()

          document.getElementById("panelFormularioEditarCuenta").style.display = "none"
          document.getElementById("panelTablaCuenta").style.display = "block"

          this.mostrarCuenta()

          window.Swal.fire({
            position: "top-end",
            icon: "success",
            title: response["mensaje"],
            showConfirmButton: false,
            timer: 1500,
          })
        } else {
          window.Swal.fire({
            icon: "error",
            title: "Error",
            text: response["mensaje"],
          })
        }
      })
  }

  cargarSelectCuentas() {
    const objData = new FormData()
    objData.append("mostrarCuenta", "ok")

    fetch("controlador/cuentaControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error)
      })
      .then((response) => {
        if (response["codigo"] == "200") {
          const selectCuenta = document.getElementById("txt_cuenta")
          if (selectCuenta) {
            selectCuenta.innerHTML = '<option value="">Seleccione una cuenta...</option>'
            response["listaCuenta"].forEach((element) => {
              const option = document.createElement("option")
              option.value = element.idcuenta
              option.textContent =
                element.nombre + " (" + element.tipo + ") - $" + Number.parseFloat(element.saldo_actual).toFixed(2)
              selectCuenta.appendChild(option)
            })
          }
        }
      })
  }
}

// Exponer la clase globalmente
window.Cuenta = Cuenta
  