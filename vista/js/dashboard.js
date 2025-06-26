;(() => {
  console.log("🚀 INICIANDO DASHBOARD MEJORADO")

  // Verificar si estamos en la página del dashboard
  const esPaginaDashboard =
    document.querySelector(".dashboard") ||
    document.querySelector("[data-page='dashboard']") ||
    document.querySelector("#dashboard") ||
    window.location.pathname.includes("dashboard") ||
    window.location.href.includes("dashboard") ||
    document.title.toLowerCase().includes("dashboard") ||
    true // Cargar siempre como fallback

  if (!esPaginaDashboard) {
    console.log("❌ No estamos en la página del dashboard")
    return
  }

  console.log("✅ Página del dashboard detectada")

  class DashboardMejorado {
    constructor() {
      this.debug = true
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
      console.log("🔧 Inicializando dashboard mejorado...")

      try {
        // Detectar elementos disponibles
        this.detectarElementos()

        // Configurar event listeners básicos (sin filtros)
        // this.configurarEventListeners()

        // Cargar datos
        await this.cargarDatosCompletos()

        // Calcular estadísticas
        this.calcularEstadisticas()

        // Actualizar interfaz
        this.actualizarInterfaz()

        // Inicializar gráficas
        this.inicializarGraficas()

        // Cargar últimas transacciones
        this.cargarUltimasTransacciones()

        console.log("✅ Dashboard mejorado inicializado correctamente")
      } catch (error) {
        console.error("❌ Error inicializando dashboard:", error)
      }
    }

    detectarElementos() {
      console.log("🔍 Detectando elementos disponibles...")

      // Elementos de métricas
      const selectoresEstadisticas = [
        { key: "ingresos", selectors: ["#totalIngresos"] },
        { key: "gastos", selectors: ["#totalGastos"] },
        { key: "balance", selectors: ["#balance"] },
        { key: "transacciones", selectors: ["#totalTransacciones"] },
      ]

      selectoresEstadisticas.forEach(({ key, selectors }) => {
        for (const selector of selectors) {
          const elemento = document.querySelector(selector)
          if (elemento) {
            this.elementosEncontrados[key] = elemento
            console.log(`✅ Encontrado elemento ${key}:`, selector)
            break
          }
        }
      })

      // Canvas para gráficas
      const canvasSelectors = [
        { key: "graficoIngresos", selector: "#graficoIngresos" },
        { key: "graficoGastos", selector: "#graficoGastos" },
        { key: "graficoEvolucion", selector: "#graficoEvolucion" },
      ]

      canvasSelectors.forEach(({ key, selector }) => {
        const elemento = document.querySelector(selector)
        if (elemento) {
          this.elementosEncontrados[key] = elemento
          console.log(`✅ Encontrado canvas ${key}:`, selector)
        }
      })

      console.log("📋 Elementos detectados:", Object.keys(this.elementosEncontrados))
    }

    async cargarDatosCompletos() {
      console.log("📊 Cargando datos...")

      try {
        // Cargar transacciones
        const transacciones = await this.obtenerTransacciones()
        this.datosCompletos.transacciones = transacciones

        // Cargar cuentas
        const cuentas = await this.obtenerCuentas()
        this.datosCompletos.cuentas = cuentas

        // Cargar categorías
        const categorias = await this.obtenerCategorias()
        this.datosCompletos.categorias = categorias

        console.log("✅ Datos cargados:", {
          transacciones: this.datosCompletos.transacciones.length,
          cuentas: this.datosCompletos.cuentas.length,
          categorias: this.datosCompletos.categorias.length,
        })
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
          console.warn("⚠️ Error del servidor en transacciones")
          return []
        }

        const data = JSON.parse(text)

        if (data.codigo === "200" && data.listaTransaccion) {
          console.log(`✅ ${data.listaTransaccion.length} transacciones obtenidas`)
          return data.listaTransaccion
        } else {
          console.log("ℹ️ No se encontraron transacciones")
          return []
        }
      } catch (error) {
        console.log("ℹ️ No se pudieron cargar transacciones:", error.message)
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
          console.log(`✅ ${data.listaCuenta.length} cuentas obtenidas`)
          return data.listaCuenta
        } else {
          return []
        }
      } catch (error) {
        console.log("ℹ️ No se pudieron cargar cuentas:", error.message)
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
          console.log(`✅ ${data.listaCategoria.length} categorías obtenidas`)
          return data.listaCategoria
        } else {
          return []
        }
      } catch (error) {
        console.log("ℹ️ No se pudieron cargar categorías:", error.message)
        return []
      }
    }

    calcularEstadisticas() {
      console.log("📊 Calculando estadísticas...")

      const transacciones = this.datosCompletos.transacciones

      let totalIngresos = 0
      let totalGastos = 0
      const ingresosPorCategoria = {}
      const gastosPorCategoria = {}
      const transaccionesPorMes = {}

      if (transacciones && transacciones.length > 0) {
        transacciones.forEach((transaccion) => {
          const monto = Number.parseFloat(transaccion.monto) || 0
          const tipo = transaccion.tipo
          const categoria = transaccion.categoria_nombre || "Sin categoría"
          const fecha = new Date(transaccion.fecha_transaccion)
          const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}`

          // Totales por tipo
          if (tipo === "ingreso") {
            totalIngresos += monto
            ingresosPorCategoria[categoria] = (ingresosPorCategoria[categoria] || 0) + monto
          } else if (tipo === "gasto") {
            totalGastos += monto
            gastosPorCategoria[categoria] = (gastosPorCategoria[categoria] || 0) + monto
          }

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

      this.datosCompletos.estadisticas = {
        totalIngresos,
        totalGastos,
        balance: totalIngresos - totalGastos,
        transaccionesCount: transacciones ? transacciones.length : 0,
        ingresosPorCategoria,
        gastosPorCategoria,
        transaccionesPorMes,
      }

      console.log("✅ Estadísticas calculadas:", this.datosCompletos.estadisticas)
    }

    actualizarInterfaz() {
      console.log("🎨 Actualizando interfaz...")

      const stats = this.datosCompletos.estadisticas

      // Actualizar métricas principales
      this.actualizarElemento("ingresos", stats.totalIngresos, "currency")
      this.actualizarElemento("gastos", stats.totalGastos, "currency")
      this.actualizarElemento("balance", stats.balance, "currency")
      this.actualizarElemento("transacciones", stats.transaccionesCount, "number")

      // Actualizar totales en gráficas
      const totalIngresosGrafico = document.getElementById("totalIngresosGrafico")
      const totalGastosGrafico = document.getElementById("totalGastosGrafico")

      if (totalIngresosGrafico) totalIngresosGrafico.textContent = `$${stats.totalIngresos.toFixed(2)}`
      if (totalGastosGrafico) totalGastosGrafico.textContent = `$${stats.totalGastos.toFixed(2)}`

      console.log("✅ Interfaz actualizada")
    }

    actualizarElemento(key, valor, tipo) {
      const elemento = this.elementosEncontrados[key]
      if (elemento) {
        let textoMostrar = ""

        if (tipo === "currency") {
          textoMostrar = `$${valor.toFixed(2)}`
        } else {
          textoMostrar = valor.toString()
        }

        elemento.textContent = textoMostrar

        // Agregar clases de color si es apropiado
        if (key === "balance") {
          elemento.className = elemento.className.replace(/text-(success|danger)/g, "")
          elemento.classList.add(valor >= 0 ? "text-success" : "text-danger")
        }

        console.log(`✅ Actualizado ${key}: ${textoMostrar}`)
      }
    }

    inicializarGraficas() {
      console.log("📈 Inicializando gráficas...")

      if (typeof window.Chart === "undefined") {
        console.log("ℹ️ Chart.js no disponible")
        return
      }

      this.crearGraficaIngresos()
      this.crearGraficaGastos()
      this.crearGraficaEvolucion()
    }

    actualizarGraficas() {
      console.log("📈 Actualizando gráficas...")

      // Destruir gráficas existentes
      Object.values(this.graficas).forEach((grafica) => {
        if (grafica) grafica.destroy()
      })

      // Recrear gráficas
      this.inicializarGraficas()
    }

    crearGraficaIngresos() {
      const canvas = this.elementosEncontrados.graficoIngresos
      const noDataDiv = document.getElementById("noDataIngresos")

      if (!canvas) return

      const datos = this.datosCompletos.estadisticas.ingresosPorCategoria
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
      this.graficas.ingresos = new window.Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: ["#28a745", "#17a2b8", "#ffc107", "#fd7e14", "#6f42c1", "#e83e8c", "#20c997", "#6610f2"],
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

      console.log("✅ Gráfica de ingresos creada")
    }

    crearGraficaGastos() {
      const canvas = this.elementosEncontrados.graficoGastos
      const noDataDiv = document.getElementById("noDataGastos")

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
      this.graficas.gastos = new window.Chart(ctx, {
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

      console.log("✅ Gráfica de gastos creada")
    }

    crearGraficaEvolucion() {
      const canvas = this.elementosEncontrados.graficoEvolucion
      const noDataDiv = document.getElementById("noDataEvolucion")

      if (!canvas) return

      const datos = this.datosCompletos.estadisticas.transaccionesPorMes
      const meses = Object.keys(datos).sort()

      if (meses.length < 2) {
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
      this.graficas.evolucion = new window.Chart(ctx, {
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

      console.log("✅ Gráfica de evolución creada")
    }

    cargarUltimasTransacciones() {
      console.log("📋 Cargando últimas transacciones...")

      const tabla = document.getElementById("tablaUltimasTransacciones")
      if (!tabla) return

      const tbody = tabla.querySelector("tbody")
      if (!tbody) return

      const transacciones = this.datosCompletos.transacciones
        .sort((a, b) => new Date(b.fecha_transaccion) - new Date(a.fecha_transaccion))
        .slice(0, 10) // Últimas 10 transacciones

      if (transacciones.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="text-center text-muted">
              <i class="fas fa-info-circle"></i> No hay transacciones recientes
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

      console.log("✅ Últimas transacciones cargadas")
    }

    async actualizarDashboard() {
      console.log("🔄 Actualizando dashboard...")

      try {
        await this.cargarDatosCompletos()
        this.calcularEstadisticas()
        this.actualizarInterfaz()
        this.actualizarGraficas()
        this.cargarUltimasTransacciones()
        console.log("✅ Dashboard actualizado")
      } catch (error) {
        console.error("❌ Error actualizando:", error)
      }
    }
  }

  // Instancia global
  let dashboardInstance = null

  // Función de inicialización
  function inicializarDashboard() {
    console.log("🚀 Inicializando dashboard mejorado...")
    dashboardInstance = new DashboardMejorado()
    dashboardInstance.inicializar()
  }

  // Función global de actualización
  window.actualizarDashboard = () => {
    if (dashboardInstance) {
      dashboardInstance.actualizarDashboard()
    } else {
      inicializarDashboard()
    }
  }

  // Inicializar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inicializarDashboard)
  } else {
    setTimeout(inicializarDashboard, 100)
  }

  // Debug global mejorado
  window.DashboardDebug = {
    instancia: () => dashboardInstance,
    elementos: () => dashboardInstance?.elementosEncontrados || {},
    datos: () => dashboardInstance?.datosCompletos || {},
    actualizar: () => window.actualizarDashboard(),
    mostrarDatos: () => {
      console.table(dashboardInstance?.datosCompletos.estadisticas || {})
      console.log("📊 Datos completos:", dashboardInstance?.datosCompletos || {})
    },
  }

  console.log("💡 Dashboard mejorado cargado")
  console.log("💡 Debug: window.DashboardDebug")
})()
