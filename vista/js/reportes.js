;(() => {
  console.log("🚀 INICIANDO REPORTES")

  // Verificar si estamos en la página de reportes
  const esPaginaReportes =
    document.querySelector(".reportes") ||
    document.querySelector("[data-page='reportes']") ||
    document.querySelector("#reportes") ||
    document.querySelector(".main-reportes") ||
    document.querySelector("#resumenEjecutivo") ||
    document.querySelector("#graficasReportes") ||
    window.location.pathname.includes("reporte") ||
    window.location.href.includes("reporte") ||
    document.title.toLowerCase().includes("reporte") ||
    document.querySelector("h1, h2, h3")?.textContent?.toLowerCase().includes("reporte")

  if (!esPaginaReportes) {
    return
  }

  class ReportesSimple {
    constructor() {
      this.datosCompletos = {
        transacciones: [],
        cuentas: [],
        categorias: [],
        estadisticas: {},
      }
      this.elementosEncontrados = {}
      this.graficas = {}
    }

    async inicializar() {
      try {
        this.detectarElementos()
        await this.cargarDatosCompletos()
        this.calcularEstadisticas()
        this.actualizarInterfaz()
        this.inicializarGraficas()
        this.cargarAnalisis()
      } catch (error) {
        console.error("❌ Error inicializando reportes:", error)
      }
    }

    detectarElementos() {
      const selectoresMetricas = [
        { key: "ingresos", selectors: ["#reporteIngresos"] },
        { key: "gastos", selectors: ["#reporteGastos"] },
        { key: "balance", selectors: ["#reporteBalance"] },
        { key: "tasaAhorro", selectors: ["#reporteTasaAhorro"] },
      ]

      selectoresMetricas.forEach(({ key, selectors }) => {
        for (const selector of selectors) {
          const elemento = document.querySelector(selector)
          if (elemento) {
            this.elementosEncontrados[key] = elemento
            break
          }
        }
      })

      const canvasSelectors = [
        { key: "distribucionGastos", selector: "#graficoDistribucionGastos" },
        { key: "tendencia", selector: "#graficoTendencia" },
      ]

      canvasSelectors.forEach(({ key, selector }) => {
        const elemento = document.querySelector(selector)
        if (elemento) {
          this.elementosEncontrados[key] = elemento
        }
      })
    }

    async cargarDatosCompletos() {
      try {
        const transacciones = await this.obtenerTransacciones()
        this.datosCompletos.transacciones = transacciones

        const cuentas = await this.obtenerCuentas()
        this.datosCompletos.cuentas = cuentas

        const categorias = await this.obtenerCategorias()
        this.datosCompletos.categorias = categorias
      } catch (error) {
        console.error("❌ Error cargando datos:", error)
      }
    }

    async obtenerTransacciones() {
      const objData = new FormData()
      objData.append("mostrarTransaccion", "ok")

      try {
        const response = await fetch("controlador/transaccionControlador.php", {
          method: "POST",
          body: objData,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const text = await response.text()

        if (text.trim().startsWith("<") || text.includes("Fatal error")) {
          return []
        }

        const data = JSON.parse(text)

        if (data.codigo === "200" && data.listaTransaccion) {
          return data.listaTransaccion
        } else {
          return []
        }
      } catch (error) {
        console.error("❌ Error obteniendo transacciones:", error)
        return []
      }
    }

    async obtenerCuentas() {
      const objData = new FormData()
      objData.append("mostrarCuenta", "ok")

      try {
        const response = await fetch("controlador/cuentaControlador.php", {
          method: "POST",
          body: objData,
        })

        const text = await response.text()
        const data = JSON.parse(text)

        if (data.codigo === "200" && data.listaCuenta) {
          // Debug temporal para ver la estructura de datos
          console.log("📊 Estructura de cuenta:", data.listaCuenta[0])
          return data.listaCuenta
        } else {
          return []
        }
      } catch (error) {
        console.error("❌ Error obteniendo cuentas:", error)
        return []
      }
    }

    async obtenerCategorias() {
      const objData = new FormData()
      objData.append("mostrarCategoria", "ok")

      try {
        const response = await fetch("controlador/categoriaControlador.php", {
          method: "POST",
          body: objData,
        })

        const text = await response.text()
        const data = JSON.parse(text)

        if (data.codigo === "200" && data.listaCategoria) {
          return data.listaCategoria
        } else {
          return []
        }
      } catch (error) {
        console.error("❌ Error obteniendo categorías:", error)
        return []
      }
    }

    calcularEstadisticas() {
      const transacciones = this.datosCompletos.transacciones

      let totalIngresos = 0
      let totalGastos = 0
      const ingresosPorCategoria = {}
      const gastosPorCategoria = {}
      const transaccionesPorMes = {}
      const analisisPorCuenta = {}
      const analisisPorCategoria = {}

      if (transacciones && transacciones.length > 0) {
        transacciones.forEach((transaccion) => {
          const monto = Number.parseFloat(transaccion.monto) || 0
          const tipo = transaccion.tipo
          const categoria = transaccion.categoria_nombre || "Sin categoría"
          const cuenta = transaccion.cuenta_nombre || "Sin cuenta"
          const fecha = new Date(transaccion.fecha_transaccion)
          const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`

          // Totales generales
          if (tipo === "ingreso") {
            totalIngresos += monto
            ingresosPorCategoria[categoria] = (ingresosPorCategoria[categoria] || 0) + monto
          } else if (tipo === "gasto") {
            totalGastos += monto
            gastosPorCategoria[categoria] = (gastosPorCategoria[categoria] || 0) + monto
          }

          // Análisis por cuenta
          if (!analisisPorCuenta[cuenta]) {
            analisisPorCuenta[cuenta] = {
              ingresos: 0,
              gastos: 0,
              transacciones: 0,
            }
          }

          if (tipo === "ingreso") {
            analisisPorCuenta[cuenta].ingresos += monto
          } else if (tipo === "gasto") {
            analisisPorCuenta[cuenta].gastos += monto
          }
          analisisPorCuenta[cuenta].transacciones++

          // Análisis por categoría
          if (!analisisPorCategoria[categoria]) {
            analisisPorCategoria[categoria] = {
              tipo: tipo,
              monto: 0,
              transacciones: 0,
            }
          }
          analisisPorCategoria[categoria].monto += monto
          analisisPorCategoria[categoria].transacciones++

          // Transacciones por mes
          if (!transaccionesPorMes[mesAno]) {
            transaccionesPorMes[mesAno] = { ingresos: 0, gastos: 0 }
          }

          if (tipo === "ingreso") {
            transaccionesPorMes[mesAno].ingresos += monto
          } else if (tipo === "gasto") {
            transaccionesPorMes[mesAno].gastos += monto
          }
        })
      }

      const balance = totalIngresos - totalGastos
      const tasaAhorro = totalIngresos > 0 ? ((balance / totalIngresos) * 100).toFixed(1) : 0

      this.datosCompletos.estadisticas = {
        totalIngresos,
        totalGastos,
        balance,
        tasaAhorro,
        transaccionesCount: transacciones ? transacciones.length : 0,
        ingresosPorCategoria,
        gastosPorCategoria,
        transaccionesPorMes,
        analisisPorCuenta,
        analisisPorCategoria,
      }
    }

    actualizarInterfaz() {
      const stats = this.datosCompletos.estadisticas

      this.actualizarElemento("ingresos", stats.totalIngresos, "currency")
      this.actualizarElemento("gastos", stats.totalGastos, "currency")
      this.actualizarElemento("balance", stats.balance, "currency")
      this.actualizarElemento("tasaAhorro", stats.tasaAhorro, "percentage")
    }

    actualizarElemento(key, valor, tipo) {
      const elemento = this.elementosEncontrados[key]
      if (elemento) {
        let textoMostrar = ""

        switch (tipo) {
          case "currency":
            textoMostrar = `$${valor.toFixed(2)}`
            break
          case "percentage":
            textoMostrar = `${valor}%`
            break
          default:
            textoMostrar = valor.toString()
        }

        elemento.textContent = textoMostrar

        if (key === "balance") {
          elemento.className = elemento.className.replace(/text-(success|danger)/g, "")
          elemento.classList.add(valor >= 0 ? "text-success" : "text-danger")
        }
      }
    }

    inicializarGraficas() {
      if (typeof window.Chart === "undefined") {
        return
      }

      Object.values(this.graficas).forEach((grafica) => {
        if (grafica) grafica.destroy()
      })

      this.crearGraficaDistribucionGastos()
      this.crearGraficaTendencia()
    }

    crearGraficaDistribucionGastos() {
      const canvas = this.elementosEncontrados.distribucionGastos
      const noDataDiv = document.getElementById("noDataDistribucion")

      if (!canvas) return

      const datos = this.datosCompletos.estadisticas.gastosPorCategoria
      const labels = Object.keys(datos)
      const values = Object.values(datos)

      if (labels.length === 0) {
        canvas.style.display = "none"
        if (noDataDiv) noDataDiv.style.display = "block"
        return
      }

      canvas.style.display = "block"
      if (noDataDiv) noDataDiv.style.display = "none"

      const ctx = canvas.getContext("2d")
      this.graficas.distribucion = new window.Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: ["#dc3545", "#fd7e14", "#ffc107", "#28a745", "#17a2b8", "#6f42c1", "#e83e8c", "#20c997"],
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                boxWidth: 12,
                font: { size: 11 },
              },
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const value = context.parsed
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  return `${context.label}: $${value.toFixed(2)} (${percentage}%)`
                },
              },
            },
          },
        },
      })
    }

    crearGraficaTendencia() {
      const canvas = this.elementosEncontrados.tendencia
      const noDataDiv = document.getElementById("noDataTendencia")

      if (!canvas) return

      const datos = this.datosCompletos.estadisticas.transaccionesPorMes
      const meses = Object.keys(datos).sort()

      if (meses.length < 1) {
        canvas.style.display = "none"
        if (noDataDiv) noDataDiv.style.display = "block"
        return
      }

      canvas.style.display = "block"
      if (noDataDiv) noDataDiv.style.display = "none"

      const ingresos = meses.map((mes) => datos[mes].ingresos)
      const gastos = meses.map((mes) => datos[mes].gastos)
      const balance = meses.map((mes) => datos[mes].ingresos - datos[mes].gastos)

      const ctx = canvas.getContext("2d")
      this.graficas.tendencia = new window.Chart(ctx, {
        type: "line",
        data: {
          labels: meses.map((mes) => {
            const [año, mesNum] = mes.split("-")
            const fecha = new Date(año, mesNum - 1)
            return fecha.toLocaleDateString("es-ES", { month: "short", year: "numeric" })
          }),
          datasets: [
            {
              label: "Ingresos",
              data: ingresos,
              borderColor: "#28a745",
              backgroundColor: "rgba(40, 167, 69, 0.1)",
              tension: 0.4,
              fill: false,
            },
            {
              label: "Gastos",
              data: gastos,
              borderColor: "#dc3545",
              backgroundColor: "rgba(220, 53, 69, 0.1)",
              tension: 0.4,
              fill: false,
            },
            {
              label: "Balance",
              data: balance,
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0.1)",
              tension: 0.4,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top" },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: (value) => "$" + value.toFixed(0) },
            },
          },
        },
      })
    }

    cargarAnalisis() {
      this.cargarAnalisisCategorias()
      this.cargarAnalisisCuentas()
      this.cargarTransaccionesDetalladas()
    }

    cargarAnalisisCategorias() {
      const tabla = document.getElementById("tablaCategorias")
      if (!tabla) return

      const tbody = tabla.querySelector("tbody")
      if (!tbody) return

      const analisis = this.datosCompletos.estadisticas.analisisPorCategoria
      const totalGeneral = this.datosCompletos.estadisticas.totalIngresos + this.datosCompletos.estadisticas.totalGastos

      if (Object.keys(analisis).length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted">
              <i class="fas fa-info-circle"></i> No hay datos para mostrar
            </td>
          </tr>
        `
        return
      }

      tbody.innerHTML = ""

      Object.entries(analisis)
        .sort(([, a], [, b]) => b.monto - a.monto)
        .forEach(([categoria, datos]) => {
          const promedio = datos.monto / datos.transacciones
          const porcentaje = totalGeneral > 0 ? ((datos.monto / totalGeneral) * 100).toFixed(1) : 0
          const tipoClass = datos.tipo === "ingreso" ? "success" : "danger"

          const fila = document.createElement("tr")
          fila.innerHTML = `
            <td>${categoria}</td>
            <td>
              <span class="badge bg-${tipoClass}">
                ${datos.tipo}
              </span>
            </td>
            <td class="text-end fw-bold">$${datos.monto.toFixed(2)}</td>
            <td class="text-center">${datos.transacciones}</td>
            <td class="text-end">$${promedio.toFixed(2)}</td>
            <td class="text-center">
              <span class="badge bg-secondary">${porcentaje}%</span>
            </td>
          `
          tbody.appendChild(fila)
        })
    }

    cargarAnalisisCuentas() {
      const tabla = document.getElementById("tablaCuentas")
      if (!tabla) return

      const tbody = tabla.querySelector("tbody")
      if (!tbody) return

      const analisis = this.datosCompletos.estadisticas.analisisPorCuenta
      const cuentas = this.datosCompletos.cuentas

      if (Object.keys(analisis).length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted">
              <i class="fas fa-info-circle"></i> No hay datos para mostrar
            </td>
          </tr>
        `
        return
      }

      tbody.innerHTML = ""

      Object.entries(analisis).forEach(([nombreCuenta, datos]) => {
        const cuenta = cuentas.find((c) => c.nombre === nombreCuenta)

        // Intentar múltiples campos para el saldo
        let saldoActual = 0
        if (cuenta) {
          // Probar diferentes nombres de campo
          const posiblesSaldos = [cuenta.saldo, cuenta.saldo_actual, cuenta.balance, cuenta.monto, cuenta.cantidad]

          for (const saldo of posiblesSaldos) {
            if (saldo !== undefined && saldo !== null) {
              const saldoLimpio = saldo.toString().replace(/[^0-9.-]/g, "")
              const saldoNumerico = Number.parseFloat(saldoLimpio)
              if (!isNaN(saldoNumerico)) {
                saldoActual = saldoNumerico
                break
              }
            }
          }
        }

        const movimientoNeto = datos.ingresos - datos.gastos

        const fila = document.createElement("tr")
        fila.innerHTML = `
          <td>${nombreCuenta}</td>
          <td class="text-end fw-bold">$${saldoActual.toFixed(2)}</td>
          <td class="text-end text-success">$${datos.ingresos.toFixed(2)}</td>
          <td class="text-end text-danger">$${datos.gastos.toFixed(2)}</td>
          <td class="text-center">${datos.transacciones}</td>
          <td class="text-end">
            <span class="fw-bold ${movimientoNeto >= 0 ? "text-success" : "text-danger"}">
              ${movimientoNeto >= 0 ? "+" : ""}$${movimientoNeto.toFixed(2)}
            </span>
          </td>
        `
        tbody.appendChild(fila)
      })
    }

    cargarTransaccionesDetalladas() {
      const tabla = document.getElementById("tablaTransaccionesReporte")
      if (!tabla) return

      const tbody = tabla.querySelector("tbody")
      if (!tbody) return

      const contador = document.getElementById("contadorTransacciones")
      const transacciones = this.datosCompletos.transacciones
        .sort((a, b) => new Date(b.fecha_transaccion) - new Date(a.fecha_transaccion))
        .slice(0, 50)

      if (contador) {
        contador.textContent = `${this.datosCompletos.transacciones.length} transacciones`
      }

      if (transacciones.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted">
              <i class="fas fa-info-circle"></i> No hay transacciones para mostrar
            </td>
          </tr>
        `
        return
      }

      tbody.innerHTML = ""

      transacciones.forEach((transaccion) => {
        const fecha = new Date(transaccion.fecha_transaccion).toLocaleDateString("es-ES")
        const descripcion = transaccion.descripcion || "Sin descripción"
        const categoria = transaccion.categoria_nombre || "Sin categoría"
        const cuenta = transaccion.cuenta_nombre || "Sin cuenta"

        const tipoClass = transaccion.tipo === "ingreso" ? "success" : "danger"
        const tipoIcon = transaccion.tipo === "ingreso" ? "arrow-up" : "arrow-down"
        const montoSigno = transaccion.tipo === "ingreso" ? "+" : "-"

        const fila = document.createElement("tr")
        fila.innerHTML = `
          <td><small>${fecha}</small></td>
          <td>${descripcion}</td>
          <td><small>${categoria}</small></td>
          <td><small>${cuenta}</small></td>
          <td>
            <span class="badge bg-${tipoClass}">
              <i class="fas fa-${tipoIcon}"></i> ${transaccion.tipo}
            </span>
          </td>
          <td class="text-end">
            <span class="text-${tipoClass} fw-bold">
              ${montoSigno}$${Number.parseFloat(transaccion.monto).toFixed(2)}
            </span>
          </td>
        `
        tbody.appendChild(fila)
      })
    }

    // NUEVAS FUNCIONES DE EXPORTACIÓN

    exportarExcel() {
      try {
        console.log("📊 Exportando a Excel...")

        // Crear datos para Excel
        const datosExcel = this.prepararDatosParaExportacion()

        // Crear workbook
        const wb = XLSX.utils.book_new()

        // Hoja 1: Resumen Ejecutivo
        const wsResumen = XLSX.utils.aoa_to_sheet([
          ["REPORTE FINANCIERO"],
          ["Fecha de generación:", new Date().toLocaleDateString("es-ES")],
          [""],
          ["RESUMEN EJECUTIVO"],
          ["Total Ingresos", `$${this.datosCompletos.estadisticas.totalIngresos.toFixed(2)}`],
          ["Total Gastos", `$${this.datosCompletos.estadisticas.totalGastos.toFixed(2)}`],
          ["Balance Neto", `$${this.datosCompletos.estadisticas.balance.toFixed(2)}`],
          ["Tasa de Ahorro", `${this.datosCompletos.estadisticas.tasaAhorro}%`],
          ["Total Transacciones", this.datosCompletos.estadisticas.transaccionesCount],
        ])

        XLSX.utils.book_append_sheet(wb, wsResumen, "Resumen")

        // Hoja 2: Análisis por Categorías
        const datosCategorias = [["Categoría", "Tipo", "Monto Total", "Transacciones", "Promedio", "% del Total"]]

        const totalGeneral =
          this.datosCompletos.estadisticas.totalIngresos + this.datosCompletos.estadisticas.totalGastos

        Object.entries(this.datosCompletos.estadisticas.analisisPorCategoria)
          .sort(([, a], [, b]) => b.monto - a.monto)
          .forEach(([categoria, datos]) => {
            const promedio = datos.monto / datos.transacciones
            const porcentaje = totalGeneral > 0 ? ((datos.monto / totalGeneral) * 100).toFixed(1) : 0

            datosCategorias.push([
              categoria,
              datos.tipo,
              datos.monto.toFixed(2),
              datos.transacciones,
              promedio.toFixed(2),
              `${porcentaje}%`,
            ])
          })

        const wsCategorias = XLSX.utils.aoa_to_sheet(datosCategorias)
        XLSX.utils.book_append_sheet(wb, wsCategorias, "Categorías")

        // Hoja 3: Análisis por Cuentas
        const datosCuentas = [
          ["Cuenta", "Saldo Actual", "Total Ingresos", "Total Gastos", "Transacciones", "Movimiento Neto"],
        ]

        Object.entries(this.datosCompletos.estadisticas.analisisPorCuenta).forEach(([nombreCuenta, datos]) => {
          const cuenta = this.datosCompletos.cuentas.find((c) => c.nombre === nombreCuenta)
          let saldoActual = 0

          if (cuenta) {
            const posiblesSaldos = [cuenta.saldo, cuenta.saldo_actual, cuenta.balance, cuenta.monto, cuenta.cantidad]
            for (const saldo of posiblesSaldos) {
              if (saldo !== undefined && saldo !== null) {
                const saldoLimpio = saldo.toString().replace(/[^0-9.-]/g, "")
                const saldoNumerico = Number.parseFloat(saldoLimpio)
                if (!isNaN(saldoNumerico)) {
                  saldoActual = saldoNumerico
                  break
                }
              }
            }
          }

          const movimientoNeto = datos.ingresos - datos.gastos

          datosCuentas.push([
            nombreCuenta,
            saldoActual.toFixed(2),
            datos.ingresos.toFixed(2),
            datos.gastos.toFixed(2),
            datos.transacciones,
            movimientoNeto.toFixed(2),
          ])
        })

        const wsCuentas = XLSX.utils.aoa_to_sheet(datosCuentas)
        XLSX.utils.book_append_sheet(wb, wsCuentas, "Cuentas")

        // Hoja 4: Transacciones Detalladas
        const datosTransacciones = [["Fecha", "Descripción", "Categoría", "Cuenta", "Tipo", "Monto"]]

        this.datosCompletos.transacciones
          .sort((a, b) => new Date(b.fecha_transaccion) - new Date(a.fecha_transaccion))
          .forEach((transaccion) => {
            const fecha = new Date(transaccion.fecha_transaccion).toLocaleDateString("es-ES")
            const descripcion = transaccion.descripcion || "Sin descripción"
            const categoria = transaccion.categoria_nombre || "Sin categoría"
            const cuenta = transaccion.cuenta_nombre || "Sin cuenta"
            const monto = Number.parseFloat(transaccion.monto).toFixed(2)

            datosTransacciones.push([fecha, descripcion, categoria, cuenta, transaccion.tipo, monto])
          })

        const wsTransacciones = XLSX.utils.aoa_to_sheet(datosTransacciones)
        XLSX.utils.book_append_sheet(wb, wsTransacciones, "Transacciones")

        // Descargar archivo
        const fechaHoy = new Date().toISOString().split("T")[0]
        const nombreArchivo = `reporte-financiero-${fechaHoy}.xlsx`

        XLSX.writeFile(wb, nombreArchivo)

        // Mostrar mensaje de éxito
        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "success",
            title: "Excel Exportado",
            text: `El archivo ${nombreArchivo} se ha descargado correctamente`,
            timer: 3000,
            showConfirmButton: false,
          })
        } else {
          alert(`Excel exportado: ${nombreArchivo}`)
        }

        console.log("✅ Excel exportado exitosamente")
      } catch (error) {
        console.error("❌ Error exportando Excel:", error)

        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo exportar el archivo Excel. Asegúrate de que la librería XLSX esté cargada.",
          })
        } else {
          alert("Error exportando Excel. Verifica que la librería XLSX esté disponible.")
        }
      }
    }

    exportarPDF() {
      try {
        console.log("📄 Exportando a PDF...")

        // Verificar múltiples formas de acceso a jsPDF
        let jsPDF = null

        if (typeof window.jsPDF !== "undefined") {
          jsPDF = window.jsPDF
        } else if (typeof window.jspdf !== "undefined") {
          jsPDF = window.jspdf.jsPDF
        } else if (typeof jspdf !== "undefined") {
          jsPDF = jspdf.jsPDF
        }

        if (!jsPDF) {
          throw new Error("jsPDF no está disponible en ninguna forma")
        }

        console.log("✅ jsPDF encontrado:", typeof jsPDF)

        const doc = new jsPDF()

        // Configuración
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        let yPosition = 20

        // Función helper para agregar texto
        const addText = (text, x, y, options = {}) => {
          if (options.fontSize) doc.setFontSize(options.fontSize)
          if (options.fontStyle) doc.setFont(undefined, options.fontStyle)
          doc.text(text, x, y)
          return y + (options.lineHeight || 10)
        }

        // Función helper para nueva página si es necesario
        const checkNewPage = (requiredSpace = 20) => {
          if (yPosition + requiredSpace > pageHeight - 20) {
            doc.addPage()
            yPosition = 20
          }
        }

        // Título principal
        doc.setFontSize(20)
        doc.setFont(undefined, "bold")
        yPosition = addText("REPORTE FINANCIERO", pageWidth / 2, yPosition, { fontSize: 20, fontStyle: "bold" })
        yPosition += 5

        // Fecha
        doc.setFontSize(12)
        doc.setFont(undefined, "normal")
        yPosition = addText(
          `Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`,
          pageWidth / 2,
          yPosition,
          {
            fontSize: 12,
          },
        )
        yPosition += 15

        // Resumen Ejecutivo
        checkNewPage(60)
        doc.setFontSize(16)
        doc.setFont(undefined, "bold")
        yPosition = addText("RESUMEN EJECUTIVO", 20, yPosition, { fontSize: 16, fontStyle: "bold" })
        yPosition += 10

        doc.setFontSize(12)
        doc.setFont(undefined, "normal")

        const stats = this.datosCompletos.estadisticas
        yPosition = addText(`Total Ingresos: $${stats.totalIngresos.toFixed(2)}`, 20, yPosition)
        yPosition = addText(`Total Gastos: $${stats.totalGastos.toFixed(2)}`, 20, yPosition)
        yPosition = addText(`Balance Neto: $${stats.balance.toFixed(2)}`, 20, yPosition)
        yPosition = addText(`Tasa de Ahorro: ${stats.tasaAhorro}%`, 20, yPosition)
        yPosition = addText(`Total Transacciones: ${stats.transaccionesCount}`, 20, yPosition)
        yPosition += 15

        // Análisis por Categorías
        checkNewPage(80)
        doc.setFontSize(14)
        doc.setFont(undefined, "bold")
        yPosition = addText("ANÁLISIS POR CATEGORÍAS", 20, yPosition, { fontSize: 14, fontStyle: "bold" })
        yPosition += 10

        doc.setFontSize(10)
        doc.setFont(undefined, "normal")

        // Encabezados de tabla
        const headers = ["Categoría", "Tipo", "Monto", "Trans.", "Promedio", "%"]
        let xPos = 20
        const colWidths = [40, 25, 30, 20, 30, 20]

        headers.forEach((header, index) => {
          doc.setFont(undefined, "bold")
          doc.text(header, xPos, yPosition)
          xPos += colWidths[index]
        })
        yPosition += 8

        // Datos de categorías
        const totalGeneral = stats.totalIngresos + stats.totalGastos

        Object.entries(stats.analisisPorCategoria)
          .sort(([, a], [, b]) => b.monto - a.monto)
          .slice(0, 15) // Limitar a 15 categorías para que quepa en PDF
          .forEach(([categoria, datos]) => {
            checkNewPage(10)

            const promedio = datos.monto / datos.transacciones
            const porcentaje = totalGeneral > 0 ? ((datos.monto / totalGeneral) * 100).toFixed(1) : 0

            xPos = 20
            doc.setFont(undefined, "normal")

            const rowData = [
              categoria.substring(0, 15), // Truncar si es muy largo
              datos.tipo,
              `$${datos.monto.toFixed(0)}`,
              datos.transacciones.toString(),
              `$${promedio.toFixed(0)}`,
              `${porcentaje}%`,
            ]

            rowData.forEach((data, index) => {
              doc.text(data, xPos, yPosition)
              xPos += colWidths[index]
            })
            yPosition += 6
          })

        yPosition += 15

        // Análisis por Cuentas
        checkNewPage(60)
        doc.setFontSize(14)
        doc.setFont(undefined, "bold")
        yPosition = addText("ANÁLISIS POR CUENTAS", 20, yPosition, { fontSize: 14, fontStyle: "bold" })
        yPosition += 10

        doc.setFontSize(10)
        doc.setFont(undefined, "normal")

        Object.entries(stats.analisisPorCuenta).forEach(([nombreCuenta, datos]) => {
          checkNewPage(15)

          const cuenta = this.datosCompletos.cuentas.find((c) => c.nombre === nombreCuenta)
          let saldoActual = 0

          if (cuenta) {
            const posiblesSaldos = [cuenta.saldo, cuenta.saldo_actual, cuenta.balance, cuenta.monto, cuenta.cantidad]
            for (const saldo of posiblesSaldos) {
              if (saldo !== undefined && saldo !== null) {
                const saldoLimpio = saldo.toString().replace(/[^0-9.-]/g, "")
                const saldoNumerico = Number.parseFloat(saldoLimpio)
                if (!isNaN(saldoNumerico)) {
                  saldoActual = saldoNumerico
                  break
                }
              }
            }
          }

          const movimientoNeto = datos.ingresos - datos.gastos

          yPosition = addText(`${nombreCuenta}:`, 20, yPosition, { fontStyle: "bold" })
          yPosition = addText(
            `  Saldo: $${saldoActual.toFixed(2)} | Ingresos: $${datos.ingresos.toFixed(2)} | Gastos: $${datos.gastos.toFixed(2)}`,
            25,
            yPosition,
          )
          yPosition = addText(
            `  Transacciones: ${datos.transacciones} | Movimiento Neto: $${movimientoNeto.toFixed(2)}`,
            25,
            yPosition,
          )
          yPosition += 5
        })

        // Pie de página
        doc.setFontSize(8)
        doc.setFont(undefined, "italic")
        doc.text("Generado por Sistema de Finanzas Personales", pageWidth / 2, pageHeight - 10)

        // Descargar PDF
        const fechaHoy = new Date().toISOString().split("T")[0]
        const nombreArchivo = `reporte-financiero-${fechaHoy}.pdf`

        doc.save(nombreArchivo)

        // Mostrar mensaje de éxito
        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "success",
            title: "PDF Exportado",
            text: `El archivo ${nombreArchivo} se ha descargado correctamente`,
            timer: 3000,
            showConfirmButton: false,
          })
        } else {
          alert(`PDF exportado: ${nombreArchivo}`)
        }

        console.log("✅ PDF exportado exitosamente")
      } catch (error) {
        console.error("❌ Error exportando PDF:", error)

        if (typeof Swal !== "undefined") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo exportar el archivo PDF. Asegúrate de que la librería jsPDF esté cargada.",
          })
        } else {
          alert("Error exportando PDF. Verifica que la librería jsPDF esté disponible.")
        }
      }
    }

    prepararDatosParaExportacion() {
      return {
        resumen: this.datosCompletos.estadisticas,
        categorias: this.datosCompletos.estadisticas.analisisPorCategoria,
        cuentas: this.datosCompletos.estadisticas.analisisPorCuenta,
        transacciones: this.datosCompletos.transacciones,
      }
    }

    async actualizarReportes() {
      try {
        await this.cargarDatosCompletos()
        this.calcularEstadisticas()
        this.actualizarInterfaz()
        this.inicializarGraficas()
        this.cargarAnalisis()
      } catch (error) {
        console.error("❌ Error actualizando reportes:", error)
      }
    }

    verificarLibrerias() {
      const estado = {
        xlsx: typeof XLSX !== "undefined",
        jsPDF:
          typeof window.jsPDF !== "undefined" || typeof window.jspdf !== "undefined" || typeof jspdf !== "undefined",
      }

      console.log("📚 Estado de librerías:", estado)
      return estado
    }
  }

  // Instancia global
  let reportesInstance = null

  function inicializarReportes() {
    reportesInstance = new ReportesSimple()
    reportesInstance.inicializar()
  }

  window.actualizarReportes = () => {
    if (reportesInstance) {
      reportesInstance.actualizarReportes()
    } else {
      inicializarReportes()
    }
  }

  // Inicializar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarReportes)
  } else {
    setTimeout(inicializarReportes, 100)
  }

  // Debug simplificado
  window.ReportesDebug = {
    datos: () => reportesInstance?.datosCompletos || {},
    actualizar: () => window.actualizarReportes(),
    exportarExcel: () => reportesInstance?.exportarExcel(),
    exportarPDF: () => reportesInstance?.exportarPDF(),
    testConexion: () => {
      if (reportesInstance) {
        reportesInstance.obtenerTransacciones().then((data) => {
          console.log("🧪 Test transacciones:", data)
        })
      }
    },
  }

  console.log("✅ Reportes cargado")
})()
