;(() => {
  const dependenciasIniciales = {
    jQuery: typeof window.jQuery !== "undefined",
    Swal: typeof window.Swal !== "undefined",
    DataTables: typeof window.jQuery?.fn?.DataTable !== "undefined",
  }

  const esPaginaTransacciones =
    document.getElementById("tablaTransaccion") ||
    document.querySelector(".tabla-transacciones") ||
    document.querySelector("[data-page='transacciones']") ||
    document.querySelector("#transacciones") ||
    document.querySelector(".main-transacciones") ||
    document.querySelector(".content-transacciones") ||
    document.querySelector("#formTransaccion") ||
    document.querySelector("#btnAgregarTransaccion") ||
    window.location.pathname.includes("transaccion") ||
    window.location.href.includes("transaccion") ||
    document.title.toLowerCase().includes("transaccion") ||
    document.querySelector("h1, h2, h3")?.textContent?.toLowerCase().includes("transaccion")

  // Variables globales
  let $ = window.jQuery
  let Swal = window.Swal
  let Transaccion = window.Transaccion
  let Cuenta = window.Cuenta
  let Categoria = window.Categoria

  function verificarDependencias() {
    const dependencias = {
      jQuery: typeof $ !== "undefined",
      Swal: typeof Swal !== "undefined",
      Transaccion: typeof Transaccion !== "undefined",
      Cuenta: typeof Cuenta !== "undefined",
      Categoria: typeof Categoria !== "undefined",
      DataTables: typeof $?.fn?.DataTable !== "undefined",
    }
    return dependencias
  }

  function inicializar() {
    actualizarReferencias()
    mostrarTransacciones()
    configurarEventListeners()
    cargarSelectoresConReintento()
  }

  function actualizarReferencias() {
    $ = window.jQuery
    Swal = window.Swal
    Transaccion = window.Transaccion
    Cuenta = window.Cuenta
    Categoria = window.Categoria
  }

  function mostrarTransacciones() {


    actualizarReferencias()

    if (typeof Transaccion !== "undefined") {
      const objData = { mostrarTransaccion: "ok" }
      const objTablaTransaccion = new Transaccion(objData)
      objTablaTransaccion.mostrarTransaccion()
    } 
  }

  function configurarEventListeners() {


    // Botón agregar transacción
    const btnAgregarTransaccion = document.getElementById("btnAgregarTransaccion")
    if (btnAgregarTransaccion) {
      btnAgregarTransaccion.addEventListener("click", mostrarFormularioNuevo)

    }

    // Botón regresar
    const btnRegresarTransaccion = document.getElementById("btnRegresarTransaccion")
    if (btnRegresarTransaccion) {
      btnRegresarTransaccion.addEventListener("click", regresarATabla)

    }

    // Formularios
    configurarFormularios()

    // Cambio de tipo de transacción
    const tipoTransaccion = document.getElementById("txt_tipo_transaccion")
    if (tipoTransaccion) {
      tipoTransaccion.addEventListener("change", manejarCambioTipo)

    }
  }

  function mostrarFormularioNuevo() {
    console.log("📝 Mostrando formulario nuevo")
    document.getElementById("panelTablaTransaccion").style.display = "none"
    document.getElementById("panelFormularioTransaccion").style.display = "block"

    // Limpiar formulario
    const form = document.getElementById("formTransaccion")
    if (form) {
      form.reset()
      form.classList.remove("was-validated")

    }

    // Establecer fecha actual
    const fechaInput = document.getElementById("txt_fecha_transaccion")
    if (fechaInput) {
      fechaInput.value = new Date().toISOString().split("T")[0]

    }

    // Cargar selectores con reintento
    setTimeout(() => {
      cargarSelectoresConReintento()
    }, 100)
  }

  function regresarATabla() {
    console.log("↩️ Regresando a tabla")
    document.getElementById("panelFormularioTransaccion").style.display = "none"
    document.getElementById("panelTablaTransaccion").style.display = "block"
  }

  function configurarFormularios() {

    const formTransaccion = document.getElementById("formTransaccion")
    if (formTransaccion) {
      formTransaccion.addEventListener("submit", manejarSubmitTransaccion, false)
    }
  }

  function manejarSubmitTransaccion(event) {
    console.log("📤 Submit de formulario de transacción")
    event.preventDefault()

    const form = event.target
    if (!form.checkValidity()) {
  
      event.stopPropagation()
      form.classList.add("was-validated")
      return
    }

    const datos = {
      idcuenta: document.getElementById("txt_cuenta").value,
      idcategoria: document.getElementById("txt_categoria").value,
      tipo: document.getElementById("txt_tipo_transaccion").value,
      monto: Number.parseFloat(document.getElementById("txt_monto").value),
      descripcion: document.getElementById("txt_descripcion").value.trim(),
      fecha_transaccion: document.getElementById("txt_fecha_transaccion").value,
    }



    // Validaciones adicionales
    if (!validarDatosTransaccion(datos.idcuenta, datos.idcategoria, datos.tipo, datos.monto, datos.fecha_transaccion)) {
      return
    }

    const objData = {
      registrarTransaccion: "ok",
      ...datos,
    }

    actualizarReferencias()

    if (typeof Transaccion !== "undefined") {
      console.log("📤 Enviando datos:", objData)
      const objTransaccion = new Transaccion(objData)
      objTransaccion.registrarTransaccion()
    } 
  }

  function validarDatosTransaccion(idcuenta, idcategoria, tipo, monto, fecha) {


    if (!idcuenta) {
      mostrarError("Debe seleccionar una cuenta")
      return false
    }

    if (!idcategoria) {
      mostrarError("Debe seleccionar una categoría")
      return false
    }

    if (!tipo) {
      mostrarError("Debe seleccionar el tipo de transacción")
      return false
    }

    if (isNaN(monto) || monto <= 0) {
      mostrarError("El monto debe ser un número mayor a 0")
      return false
    }

    if (!fecha) {
      mostrarError("Debe seleccionar una fecha")
      return false
    }


    return true
  }

  function mostrarError(mensaje) {
    console.error("🚨 Error:", mensaje)

    actualizarReferencias()

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

  function cargarSelectoresConReintento(intento = 1, maxIntentos = 3) {

    actualizarReferencias()

    const dependencias = verificarDependencias()

    if (dependencias.Cuenta && dependencias.Categoria) {
      cargarSelectores()
    } else {
      console.warn(`⚠️ Dependencias no disponibles en intento ${intento}:`, {
        Cuenta: dependencias.Cuenta,
        Categoria: dependencias.Categoria,
      })

      if (intento < maxIntentos) {
        setTimeout(() => {
          cargarSelectoresConReintento(intento + 1, maxIntentos)
        }, 500 * intento) // Incrementar el delay con cada intento
      }
    }
  }

  function cargarSelectores() {

    // Cargar cuentas
    if (typeof Cuenta !== "undefined") {
      try {
        const objCuenta = new Cuenta({ mostrarCuenta: "ok" })
        objCuenta.cargarSelectCuentas()
      } catch (error) {
      }
    } else {
      cargarCuentasAlternativo()
    }

    // Cargar categorías
    if (typeof Categoria !== "undefined") {
      try {
        const objCategoria = new Categoria({ mostrarCategoria: "ok" })
        objCategoria.cargarSelectCategorias()

      } catch (error) {

        cargarCategoriasAlternativo()
      }
    } else {

      cargarCategoriasAlternativo()
    }
  }

  // Implementación alternativa para cargar categorías si la clase no está disponible
  function cargarCategoriasAlternativo() {
    console.log("🔄 Cargando categorías con método alternativo...")

    const objData = new FormData()
    objData.append("mostrarCategoria", "ok")

    fetch("controlador/categoriaControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .catch((error) => {

      })
      .then((response) => {
        if (response && response["codigo"] == "200") {
          const selectCategoria = document.getElementById("txt_categoria")

          if (selectCategoria) {
            selectCategoria.innerHTML = '<option value="">Seleccione una categoría...</option>'

            response["listaCategoria"].forEach((element) => {
              const option = document.createElement("option")
              option.value = element.idcategoria
              option.textContent = element.nombre + " (" + element.tipo + ")"
              option.setAttribute("data-tipo", element.tipo)
              selectCategoria.appendChild(option)
            })


          } 
        }
      })
  }

  // Implementación alternativa para cargar cuentas
  function cargarCuentasAlternativo() {
    console.log("🔄 Cargando cuentas con método alternativo...")

    const objData = new FormData()
    objData.append("mostrarCuenta", "ok")

    fetch("controlador/cuentaControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .catch((error) => {

      })
      .then((response) => {
        if (response && response["codigo"] == "200") {
          const selectCuenta = document.getElementById("txt_cuenta")

          if (selectCuenta) {
            selectCuenta.innerHTML = '<option value="">Seleccione una cuenta...</option>'

            console.log(`✅ Cargando ${response["listaCuenta"].length} cuentas (método alternativo)`)

            response["listaCuenta"].forEach((element) => {
              const option = document.createElement("option")
              option.value = element.idcuenta
              option.textContent = element.nombre + " - $" + Number.parseFloat(element.saldo).toFixed(2)
              selectCuenta.appendChild(option)
            })

            console.log("✅ Cuentas cargadas exitosamente con método alternativo")
          }
        }
      })
  }

  function cargarSelectoresAlternativo() {
    console.log("🔄 Usando métodos alternativos para cargar selectores...")
    cargarCategoriasAlternativo()
    cargarCuentasAlternativo()
  }

  function manejarCambioTipo() {
    const tipo = document.getElementById("txt_tipo_transaccion").value
    console.log("🔄 Cambio de tipo de transacción:", tipo)

    actualizarReferencias()

    if (typeof Categoria !== "undefined") {
      try {
        const objCategoria = new Categoria({ mostrarCategoria: "ok" })

        if (tipo) {
          objCategoria.cargarSelectCategoriasPorTipo(tipo)

        } else {
          objCategoria.cargarSelectCategorias()

        }
      } catch (error) {

        cargarCategoriasPorTipoAlternativo(tipo)
      }
    } else {
      cargarCategoriasPorTipoAlternativo(tipo)
    }
  }

  function cargarCategoriasPorTipoAlternativo(tipo) {
    console.log("🔄 Cargando categorías por tipo con método alternativo:", tipo)

    const objData = new FormData()
    objData.append("mostrarCategoria", "ok")

    fetch("controlador/categoriaControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .catch((error) => {
      })
      .then((response) => {
        if (response && response["codigo"] == "200") {
          const selectCategoria = document.getElementById("txt_categoria")
          if (selectCategoria) {
            selectCategoria.innerHTML = '<option value="">Seleccione una categoría...</option>'

            let categoriasEncontradas = 0

            if (tipo) {
              // Filtrar por tipo
              response["listaCategoria"].forEach((element) => {
                if (element.tipo === tipo) {
                  categoriasEncontradas++
                  const option = document.createElement("option")
                  option.value = element.idcategoria
                  option.textContent = element.nombre
                  selectCategoria.appendChild(option)
                }
              })
            } else {
              // Cargar todas
              response["listaCategoria"].forEach((element) => {
                categoriasEncontradas++
                const option = document.createElement("option")
                option.value = element.idcategoria
                option.textContent = element.nombre + " (" + element.tipo + ")"
                selectCategoria.appendChild(option)
              })
            }



            if (categoriasEncontradas === 0 && tipo) {
              const option = document.createElement("option")
              option.value = ""
              option.textContent = `No hay categorías de tipo "${tipo}"`
              option.disabled = true
              selectCategoria.appendChild(option)
            }
          }
        }
      })
  }

  // FUNCIÓN GLOBAL PARA ACTUALIZAR LA TABLA DESDE CUALQUIER LUGAR
  window.actualizarTablaTransacciones = () => {

    mostrarTransacciones()
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar)

  } else {
    // Si el DOM ya está listo, esperar un poco para que se carguen las clases
    setTimeout(inicializar, 100)
  }

  // Exponer funciones para debug manual
  window.TransaccionDebug = {
    mostrarTransacciones,
    actualizarTabla: () => {
      console.log("🔄 Actualizando tabla manualmente...")
      mostrarTransacciones()
    },
    testConexion: () => {
      actualizarReferencias()
      if (typeof Transaccion !== "undefined") {
        const obj = new Transaccion({ mostrarTransaccion: "ok" })
        obj.testConexion()
      } 
    },
    verificarDependencias,
    cargarSelectores: cargarSelectoresConReintento,
    cargarCategoriasAlternativo,
    cargarCuentasAlternativo,
  }
})()
