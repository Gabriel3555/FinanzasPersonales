;(() => {
  console.log("🚀 INICIANDO MÓDULO DE TRANSACCIONES MEJORADO")

  // Verificar dependencias al inicio
  const dependenciasIniciales = {
    jQuery: typeof window.jQuery !== "undefined",
    Swal: typeof window.Swal !== "undefined",
    DataTables: typeof window.jQuery?.fn?.DataTable !== "undefined",
  }

  console.log("📋 Estado de dependencias iniciales:", dependenciasIniciales)

  // Verificar si estamos en la página de transacciones de forma más flexible
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

  if (!esPaginaTransacciones) {
    console.log("❌ No estamos en la página de transacciones")
    return
  }

  console.log("✅ Página de transacciones detectada")

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

    console.log("📋 Estado de dependencias:", dependencias)
    return dependencias
  }

  function inicializar() {
    console.log("🔧 Inicializando módulo de transacciones...")

    // Actualizar referencias a las clases
    actualizarReferencias()

    mostrarTransacciones()
    configurarEventListeners()

    // Intentar cargar selectores con retry
    cargarSelectoresConReintento()

    console.log("✅ Módulo de transacciones inicializado")
  }

  function actualizarReferencias() {
    $ = window.jQuery
    Swal = window.Swal
    Transaccion = window.Transaccion
    Cuenta = window.Cuenta
    Categoria = window.Categoria
  }

  function mostrarTransacciones() {
    console.log("📊 Cargando transacciones...")

    actualizarReferencias()

    if (typeof Transaccion !== "undefined") {
      const objData = { mostrarTransaccion: "ok" }
      const objTablaTransaccion = new Transaccion(objData)
      objTablaTransaccion.mostrarTransaccion()
    } else {
      console.error("❌ Clase Transaccion no disponible")
    }
  }

  function configurarEventListeners() {
    console.log("🎯 Configurando event listeners...")

    // Botón agregar transacción
    const btnAgregarTransaccion = document.getElementById("btnAgregarTransaccion")
    if (btnAgregarTransaccion) {
      btnAgregarTransaccion.addEventListener("click", mostrarFormularioNuevo)
      console.log("✅ Event listener agregado a btnAgregarTransaccion")
    }

    // Botón regresar
    const btnRegresarTransaccion = document.getElementById("btnRegresarTransaccion")
    if (btnRegresarTransaccion) {
      btnRegresarTransaccion.addEventListener("click", regresarATabla)
      console.log("✅ Event listener agregado a btnRegresarTransaccion")
    }

    // Formularios
    configurarFormularios()

    // Cambio de tipo de transacción
    const tipoTransaccion = document.getElementById("txt_tipo_transaccion")
    if (tipoTransaccion) {
      tipoTransaccion.addEventListener("change", manejarCambioTipo)
      console.log("✅ Event listener agregado a txt_tipo_transaccion")
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
      console.log("✅ Formulario limpiado")
    }

    // Establecer fecha actual
    const fechaInput = document.getElementById("txt_fecha_transaccion")
    if (fechaInput) {
      fechaInput.value = new Date().toISOString().split("T")[0]
      console.log("✅ Fecha actual establecida:", fechaInput.value)
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
    console.log("📋 Configurando formularios...")

    const formTransaccion = document.getElementById("formTransaccion")
    if (formTransaccion) {
      formTransaccion.addEventListener("submit", manejarSubmitTransaccion, false)
      console.log("✅ Event listener agregado a formulario")
    }
  }

  function manejarSubmitTransaccion(event) {
    console.log("📤 Submit de formulario de transacción")
    event.preventDefault()

    const form = event.target
    if (!form.checkValidity()) {
      console.log("❌ Formulario no válido")
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

    console.log("📊 Datos del formulario:", datos)

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
    } else {
      console.error("❌ Clase Transaccion no disponible para registrar")
      mostrarError("Error: No se puede procesar la transacción en este momento")
    }
  }

  function validarDatosTransaccion(idcuenta, idcategoria, tipo, monto, fecha) {
    console.log("✅ Validando datos de transacción...")

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

    console.log("✅ Validación exitosa")
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
    console.log(`🔄 Intento ${intento} de cargar selectores...`)

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
      } else {
        console.error("❌ No se pudieron cargar las clases después de varios intentos")
        cargarSelectoresAlternativo()
      }
    }
  }

  function cargarSelectores() {
    console.log("📋 Cargando selectores...")

    // Cargar cuentas
    if (typeof Cuenta !== "undefined") {
      try {
        const objCuenta = new Cuenta({ mostrarCuenta: "ok" })
        objCuenta.cargarSelectCuentas()
        console.log("✅ Cargando cuentas...")
      } catch (error) {
        console.error("❌ Error al cargar cuentas:", error)
      }
    } else {
      console.error("❌ Clase Cuenta no disponible")
      cargarCuentasAlternativo()
    }

    // Cargar categorías
    if (typeof Categoria !== "undefined") {
      try {
        const objCategoria = new Categoria({ mostrarCategoria: "ok" })
        objCategoria.cargarSelectCategorias()
        console.log("✅ Cargando categorías...")
      } catch (error) {
        console.error("❌ Error al cargar categorías:", error)
        cargarCategoriasAlternativo()
      }
    } else {
      console.error("❌ Clase Categoria no disponible")
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
        console.error("❌ Error al cargar categorías alternativo:", error)
      })
      .then((response) => {
        if (response && response["codigo"] == "200") {
          const selectCategoria = document.getElementById("txt_categoria")

          if (selectCategoria) {
            selectCategoria.innerHTML = '<option value="">Seleccione una categoría...</option>'

            console.log(`✅ Cargando ${response["listaCategoria"].length} categorías (método alternativo)`)

            response["listaCategoria"].forEach((element) => {
              const option = document.createElement("option")
              option.value = element.idcategoria
              option.textContent = element.nombre + " (" + element.tipo + ")"
              option.setAttribute("data-tipo", element.tipo)
              selectCategoria.appendChild(option)
            })

            console.log("✅ Categorías cargadas exitosamente con método alternativo")
          } else {
            console.warn("⚠️ No se encontró el elemento select de categorías")
          }
        } else {
          console.error("❌ Error en la respuesta del servidor:", response)
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
        console.error("❌ Error al cargar cuentas alternativo:", error)
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
          console.log("✅ Cargando categorías por tipo:", tipo)
        } else {
          objCategoria.cargarSelectCategorias()
          console.log("✅ Cargando todas las categorías")
        }
      } catch (error) {
        console.error("❌ Error al manejar cambio de tipo:", error)
        cargarCategoriasPorTipoAlternativo(tipo)
      }
    } else {
      console.error("❌ Clase Categoria no disponible, usando método alternativo")
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
        console.error("❌ Error al cargar categorías por tipo alternativo:", error)
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

            console.log(`✅ Se cargaron ${categoriasEncontradas} categorías (método alternativo)`)

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
    console.log("🔄 Actualizando tabla desde función global...")
    mostrarTransacciones()
  }

  // Inicializar cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializar)
    console.log("⏳ Esperando DOMContentLoaded...")
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
      } else {
        console.error("❌ Clase Transaccion no disponible para test")
      }
    },
    verificarDependencias,
    cargarSelectores: cargarSelectoresConReintento,
    cargarCategoriasAlternativo,
    cargarCuentasAlternativo,
  }

  console.log("💡 Debug disponible en: window.TransaccionDebug")
  console.log("💡 Función global: window.actualizarTablaTransacciones()")
})()
