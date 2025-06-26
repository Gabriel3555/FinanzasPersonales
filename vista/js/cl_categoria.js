class Categoria {
  constructor(objData) {
    this._objData = objData
  }

  mostrarCategoria() {
    const objData = new FormData()
    objData.append("mostrarCategoria", this._objData.mostrarCategoria)

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

          const tablaCategoria = window.$("#tablaCategoria") // Declare the $ variable
          if (window.$.fn.DataTable.isDataTable(tablaCategoria)) {
            tablaCategoria.DataTable().destroy()
          }

          tablaCategoria.DataTable({
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
          console.log("error")
        }
      })
  }

  eliminarCategoria() {
    const objData = new FormData()
    objData.append("eliminarCategoria", this._objData.eliminarCategoria)
    objData.append("idcategoria", this._objData.idcategoria)

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
          this.mostrarCategoria()
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

  registrarCategoria() {
    const objData = new FormData()
    objData.append("registrarCategoria", this._objData.registrarCategoria)
    objData.append("nombre", this._objData.nombre)
    objData.append("tipo", this._objData.tipo)
    objData.append("color", this._objData.color)
    objData.append("icono", this._objData.icono)

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

          this.mostrarCategoria()

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
    objData.append("editarCategoria", this._objData.editarCategoria)
    objData.append("idcategoria", this._objData.idcategoria)
    objData.append("nombre", this._objData.nombre)
    objData.append("tipo", this._objData.tipo)
    objData.append("color", this._objData.color)
    objData.append("icono", this._objData.icono)

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

          this.mostrarCategoria()

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

  // Mejorar la función cargarSelectCategorias para mejor depuración
  cargarSelectCategorias() {
    console.log("🔄 Cargando todas las categorías")

    const objData = new FormData()
    objData.append("mostrarCategoria", "ok")

    fetch("controlador/categoriaControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("❌ Error al cargar categorías:", error)
      })
      .then((response) => {
        if (response && response["codigo"] == "200") {
          const selectCategoria = document.getElementById("txt_categoria")
          const selectFiltroCategoria = document.getElementById("filtro_categoria")

          if (selectCategoria) {
            selectCategoria.innerHTML = '<option value="">Seleccione una categoría...</option>'

            console.log(`✅ Cargando ${response["listaCategoria"].length} categorías en el select`)

            response["listaCategoria"].forEach((element) => {
              const option = document.createElement("option")
              option.value = element.idcategoria
              option.textContent = element.nombre + " (" + element.tipo + ")"
              option.setAttribute("data-tipo", element.tipo)
              selectCategoria.appendChild(option)
            })
          } else {
            console.warn("⚠️ No se encontró el elemento select de categorías")
          }

          if (selectFiltroCategoria) {
            selectFiltroCategoria.innerHTML = '<option value="">Todas</option>'
            response["listaCategoria"].forEach((element) => {
              const option = document.createElement("option")
              option.value = element.idcategoria
              option.textContent = element.nombre + " (" + element.tipo + ")"
              selectFiltroCategoria.appendChild(option)
            })
          }
        } else {
          console.error("❌ Error en la respuesta del servidor:", response)
        }
      })
  }

  // Mejorar la función cargarSelectCategoriasPorTipo para asegurar que funcione correctamente
  cargarSelectCategoriasPorTipo(tipo) {
    console.log("🔄 Cargando categorías por tipo:", tipo)

    const objData = new FormData()
    objData.append("mostrarCategoria", "ok")

    fetch("controlador/categoriaControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("❌ Error al cargar categorías por tipo:", error)
      })
      .then((response) => {
        if (response && response["codigo"] == "200") {
          const selectCategoria = document.getElementById("txt_categoria")
          if (selectCategoria) {
            // Limpiar el select
            selectCategoria.innerHTML = '<option value="">Seleccione una categoría...</option>'

            // Contador para verificar si se encontraron categorías
            let categoriasEncontradas = 0

            // Filtrar y agregar categorías del tipo seleccionado
            response["listaCategoria"].forEach((element) => {
              if (element.tipo === tipo) {
                categoriasEncontradas++
                const option = document.createElement("option")
                option.value = element.idcategoria
                option.textContent = element.nombre
                selectCategoria.appendChild(option)
              }
            })

            console.log(`✅ Se encontraron ${categoriasEncontradas} categorías de tipo "${tipo}"`)

            // Si no hay categorías del tipo seleccionado, mostrar mensaje
            if (categoriasEncontradas === 0) {
              const option = document.createElement("option")
              option.value = ""
              option.textContent = `No hay categorías de tipo "${tipo}"`
              option.disabled = true
              selectCategoria.appendChild(option)

              console.warn(`⚠️ No se encontraron categorías de tipo "${tipo}"`)
            }
          } else {
            console.error("❌ No se encontró el elemento select de categorías")
          }
        } else {
          console.error("❌ Error en la respuesta del servidor:", response)
        }
      })
  }
}

// Exponer la clase globalmente para que otros módulos puedan usarla
window.Categoria = Categoria

// Verificar que se expuso correctamente
if (typeof window.Categoria !== "undefined") {
  console.log("✅ Clase Categoria expuesta globalmente")
} else {
  console.error("❌ Error al exponer la clase Categoria")
}
