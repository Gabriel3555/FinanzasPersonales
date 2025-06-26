;(() => {
  // Verificar si estamos en la página de categorías de forma más flexible
  const esPaginaCategorias =
    document.getElementById("tablaCategoria") ||
    document.querySelector(".tabla-categorias") ||
    document.querySelector("[data-page='categorias']") ||
    document.querySelector("#categorias") ||
    document.querySelector(".main-categorias") ||
    document.querySelector(".content-categorias") ||
    document.querySelector("#formCategoria") ||
    document.querySelector("#btnAgregarCategoria") ||
    window.location.pathname.includes("categoria") ||
    window.location.href.includes("categoria") ||
    document.title.toLowerCase().includes("categoria") ||
    document.querySelector("h1, h2, h3")?.textContent?.toLowerCase().includes("categoria")

  if (!esPaginaCategorias) {
    console.log("❌ No estamos en la página de categorías")
    return
  }

  console.log("✅ Página de categorías detectada")

  // Definir la clase Categoria primero
  class Categoria {
    constructor(data) {
      this.data = data
    }

    mostrarCategoria() {
      const objData = new FormData()
      objData.append("mostrarCategoria", this.data.mostrarCategoria)

      fetch("controlador/categoriaControlador.php", {
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
            response["listaCategoria"].forEach((element) => {
              let objBotones = '<div class="btn-group" role="group">'
              objBotones +=
                '<button id="btnEditarCategoria" type="button" class="btn btn-info btn-sm" categoria="' +
                element.idcategoria +
                '" nombre="' +
                element.nombre +
                '" tipo="' +
                element.tipo +
                '" color="' +
                element.color +
                '" icono="' +
                element.icono +
                '"><i class="fas fa-edit"></i> Editar</button>'
              objBotones +=
                '<button id="btnEliminarCategoria" type="button" class="btn btn-danger btn-sm" categoria="' +
                element.idcategoria +
                '"><i class="fas fa-trash"></i> Eliminar</button>'
              objBotones += "</div>"

              const fechaCreacion = new Date(element.fecha_creacion).toLocaleDateString("es-ES")
              const tipoFormateado = element.tipo.charAt(0).toUpperCase() + element.tipo.slice(1)
              const colorMuestra =
                '<div style="width: 20px; height: 20px; background-color: ' +
                element.color +
                '; border-radius: 50%; display: inline-block; margin-right: 8px;"></div>' +
                element.color

              // Orden correcto: Nombre, Tipo, Color, Fecha Creación, Acciones
              dataSet.push([element.nombre, tipoFormateado, colorMuestra, fechaCreacion, objBotones])
            })

            // Accessing jQuery with the $ alias requires jQuery to be loaded.
            // Assuming jQuery is loaded, the following code should work.
            // If jQuery is not loaded, you'll need to include it in your project.
            const jQuery = window.jQuery
            if (typeof jQuery !== "undefined") {
              jQuery("#tablaCategoria").DataTable({
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
                columnDefs: [
                  {
                    targets: [4], // Columna de acciones
                    orderable: false,
                    searchable: false,
                    className: "text-center",
                  },
                  {
                    targets: [2], // Columna de color
                    className: "text-center",
                  },
                  {
                    targets: [3], // Columna de fecha
                    className: "text-center",
                  },
                ],
                language: {
                  url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json",
                },
              })
            } else {
              console.error("jQuery is not loaded. Please include jQuery in your project.")
            }
          } else {
            console.log("error")
          }
        })
    }

    registrarCategoria() {
      const objData = new FormData()
      objData.append("registrarCategoria", this.data.registrarCategoria)
      objData.append("nombre", this.data.nombre)
      objData.append("tipo", this.data.tipo)
      objData.append("color", this.data.color)
      objData.append("icono", this.data.icono)

      fetch("controlador/categoriaControlador.php", {
        method: "POST",
        body: objData,
      })
        .then((response) => response.json())
        .catch((error) => {
          console.log(error)
        })
        .then((response) => {
          if (response["codigo"] == "200") {
            const formulario = document.getElementById("formCategoria")
            formulario.reset()

            document.getElementById("panelFormularioCategoria").style.display = "none"
            document.getElementById("panelTablaCategoria").style.display = "block"

            // Recargar tabla
            mostrarCategoria()

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

    editarCategoria() {
      const objData = new FormData()
      objData.append("editarCategoria", this.data.editarCategoria)
      objData.append("idcategoria", this.data.idcategoria)
      objData.append("nombre", this.data.nombre)
      objData.append("tipo", this.data.tipo)
      objData.append("color", this.data.color)
      objData.append("icono", this.data.icono)

      fetch("controlador/categoriaControlador.php", {
        method: "POST",
        body: objData,
      })
        .then((response) => response.json())
        .catch((error) => {
          console.log(error)
        })
        .then((response) => {
          if (response["codigo"] == "200") {
            const formulario = document.getElementById("formEditarCategoria")
            formulario.reset()

            document.getElementById("panelFormularioEditarCategoria").style.display = "none"
            document.getElementById("panelTablaCategoria").style.display = "block"

            // Recargar tabla
            mostrarCategoria()

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

    eliminarCategoria() {
      const objData = new FormData()
      objData.append("eliminarCategoria", this.data.eliminarCategoria)
      objData.append("idcategoria", this.data.idcategoria)

      fetch("controlador/categoriaControlador.php", {
        method: "POST",
        body: objData,
      })
        .then((response) => response.json())
        .catch((error) => {
          console.log(error)
        })
        .then((response) => {
          if (response["codigo"] == "200") {
            // Recargar tabla
            mostrarCategoria()

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
  }

  // Función para mostrar categorías
  function mostrarCategoria() {
    const objData = { mostrarCategoria: "ok" }
    const objTablaCategoria = new Categoria(objData)
    objTablaCategoria.mostrarCategoria()
  }

  // Inicializar la tabla al cargar la página
  mostrarCategoria()

  // Event Listeners
  const btnAgregarCategoria = document.getElementById("btnAgregarCategoria")
  btnAgregarCategoria.addEventListener("click", () => {
    document.getElementById("panelTablaCategoria").style.display = "none"
    document.getElementById("panelFormularioCategoria").style.display = "block"

    // Limpiar formulario
    const form = document.getElementById("formCategoria")
    if (form) {
      form.reset()
      form.classList.remove("was-validated")
    }
  })

  const btnRegresar = document.getElementById("btnRegresarCategoria")
  btnRegresar.addEventListener("click", () => {
    document.getElementById("panelFormularioCategoria").style.display = "none"
    document.getElementById("panelTablaCategoria").style.display = "block"
  })

  document.getElementById("btnRegresarEditarCategoria").addEventListener("click", () => {
    document.getElementById("panelFormularioEditarCategoria").style.display = "none"
    document.getElementById("panelTablaCategoria").style.display = "block"
  })

  // Editar categoría
  document.getElementById("tablaCategoria").addEventListener("click", (event) => {
    if (event.target.closest("#btnEditarCategoria")) {
      const btn = event.target.closest("#btnEditarCategoria")
      document.getElementById("panelTablaCategoria").style.display = "none"
      document.getElementById("panelFormularioEditarCategoria").style.display = "block"

      const nombre = btn.getAttribute("nombre")
      document.getElementById("txt_edit_nombre_categoria").value = nombre

      const tipo = btn.getAttribute("tipo")
      document.getElementById("txt_edit_tipo_categoria").value = tipo

      const color = btn.getAttribute("color")
      document.getElementById("txt_edit_color_categoria").value = color

      const icono = btn.getAttribute("icono")
      document.getElementById("txt_edit_icono_categoria").value = icono

      const idcategoria = btn.getAttribute("categoria")
      document.getElementById("btnActualizarCategoria").setAttribute("categoria", idcategoria)
    }
  })

  // Eliminar categoría
  document.getElementById("tablaCategoria").addEventListener("click", (event) => {
    if (event.target.closest("#btnEliminarCategoria")) {
      const btn = event.target.closest("#btnEliminarCategoria")

      window.Swal.fire({
        title: "¿Está usted seguro?",
        text: "Si confirma esta opción no podrá recuperar el registro!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          const idcategoria = btn.getAttribute("categoria")
          const objData = {
            eliminarCategoria: "ok",
            idcategoria: idcategoria,
          }

          const objCategoria = new Categoria(objData)
          objCategoria.eliminarCategoria()
        }
      })
    }
  })

  // Validación en tiempo real
  const nombreCategoria = document.getElementById("txt_nombre_categoria")
  if (nombreCategoria) {
    nombreCategoria.addEventListener("input", function () {
      const valor = this.value.trim()
      if (valor.length > 0 && valor.length < 2) {
        this.setCustomValidity("El nombre debe tener al menos 2 caracteres")
      } else {
        this.setCustomValidity("")
      }
    })
  }

  const nombreEditCategoria = document.getElementById("txt_edit_nombre_categoria")
  if (nombreEditCategoria) {
    nombreEditCategoria.addEventListener("input", function () {
      const valor = this.value.trim()
      if (valor.length > 0 && valor.length < 2) {
        this.setCustomValidity("El nombre debe tener al menos 2 caracteres")
      } else {
        this.setCustomValidity("")
      }
    })
  }

  // Preview del color seleccionado
  const colorCategoria = document.getElementById("txt_color_categoria")
  if (colorCategoria) {
    colorCategoria.addEventListener("change", function () {
      this.style.borderColor = this.value
    })
  }

  const colorEditCategoria = document.getElementById("txt_edit_color_categoria")
  if (colorEditCategoria) {
    colorEditCategoria.addEventListener("change", function () {
      this.style.borderColor = this.value
    })
  }

  // Validación formulario nueva categoría
  const formsCategoria = document.querySelectorAll("#formCategoria")

  Array.from(formsCategoria).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault()
        if (!form.checkValidity()) {
          event.stopPropagation()
          form.classList.add("was-validated")
        } else {
          const nombre = document.getElementById("txt_nombre_categoria").value
          const tipo = document.getElementById("txt_tipo_categoria").value
          const color = document.getElementById("txt_color_categoria").value
          const icono = document.getElementById("txt_icono_categoria").value

          const objData = {
            registrarCategoria: "ok",
            nombre: nombre,
            tipo: tipo,
            color: color,
            icono: icono,
          }

          const objCategoria = new Categoria(objData)
          objCategoria.registrarCategoria()
        }
      },
      false,
    )
  })

  // Validación formulario editar categoría
  const formsEditarCategoria = document.querySelectorAll("#formEditarCategoria")

  Array.from(formsEditarCategoria).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault()
        if (!form.checkValidity()) {
          event.stopPropagation()
          form.classList.add("was-validated")
        } else {
          const nombre = document.getElementById("txt_edit_nombre_categoria").value
          const tipo = document.getElementById("txt_edit_tipo_categoria").value
          const color = document.getElementById("txt_edit_color_categoria").value
          const icono = document.getElementById("txt_edit_icono_categoria").value
          const idcategoria = document.getElementById("btnActualizarCategoria").getAttribute("categoria")

          const objData = {
            editarCategoria: "ok",
            idcategoria: idcategoria,
            nombre: nombre,
            tipo: tipo,
            color: color,
            icono: icono,
          }

          const objCategoria = new Categoria(objData)
          objCategoria.editarCategoria()
        }
      },
      false,
    )
  })

  // Exponer la clase globalmente para que otros módulos puedan usarla
  window.Categoria = Categoria

  // Debug global simple
  if (!window.FinanzasDebug) {
    window.FinanzasDebug = {}
  }

  window.FinanzasDebug.detectarPagina = () => {
    const info = {
      url: window.location.href,
      pathname: window.location.pathname,
      title: document.title,
      elementos: {
        tablaCategoria: !!document.getElementById("tablaCategoria"),
        tablaTransaccion: !!document.getElementById("tablaTransaccion"),
        dashboard: !!document.querySelector(".dashboard, #dashboard-container"),
      },
      dependencias: {
        jQuery: typeof window.jQuery !== "undefined",
        Swal: typeof window.Swal !== "undefined",
        DataTables: typeof window.jQuery?.fn?.DataTable !== "undefined",
        Categoria: typeof window.Categoria !== "undefined",
        Transaccion: typeof window.Transaccion !== "undefined",
      },
    }

    console.log("🔍 INFORMACIÓN DEL SISTEMA:", info)
    return info
  }

  console.log("💡 Debug disponible en: window.FinanzasDebug.detectarPagina()")
})()
