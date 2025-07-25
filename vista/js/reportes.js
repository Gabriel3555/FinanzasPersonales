// Variables globales para reportes
let datosReportes = {};

// Inicializar reportes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    actualizarReportes();
});

function actualizarReportes() {
    // Cargar todos los datos SIN filtros
    cargarResumenGeneral();
    cargarGastosPorCategoria();
    cargarIngresosPorCategoria();
    cargarTodasLasTransacciones();
}

function cargarResumenGeneral() {
    const objData = new FormData();
    objData.append("obtenerResumenGeneral", "ok");
    
    fetch("controlador/reporteControlador.php", {
        method: "POST",
        body: objData,
    })
    .then(response => response.json())
    .then(response => {
        if (response && response.codigo == "200") {
            const resumen = response.resumen;
            
            document.getElementById('reporteIngresos').textContent = '$' + resumen.ingresos.toFixed(2);
            document.getElementById('reporteGastos').textContent = '$' + resumen.gastos.toFixed(2);
            document.getElementById('reporteBalance').textContent = '$' + resumen.balance.toFixed(2);
            
            // Calcular tasa de ahorro
            const tasaAhorro = resumen.ingresos > 0 ? (resumen.balance / resumen.ingresos) * 100 : 0;
            document.getElementById('reporteTasaAhorro').textContent = tasaAhorro.toFixed(1) + '%';
            
            // Aplicar colores al balance
            const balanceElement = document.getElementById('reporteBalance');
            balanceElement.className = balanceElement.className.replace(/text-(success|danger)/g, '');
            balanceElement.classList.add(resumen.balance >= 0 ? 'text-success' : 'text-danger');
        }
    })
    .catch(error => {});
}

function cargarGastosPorCategoria() {
    const objData = new FormData();
    objData.append("obtenerGastosPorCategoria", "ok");
    
    fetch("controlador/reporteControlador.php", {
        method: "POST",
        body: objData,
    })
    .then(response => response.json())
    .then(response => {
        if (response && response.codigo == "200") {
            datosReportes.gastos = response.gastos;
            // CORRECCIÓN: Llamar a la función para actualizar el gráfico
            actualizarGraficoGastos(response.gastos);
            actualizarTablaCategorias();
            actualizarGraficoComparativo();
        }
    })
    .catch(error => {});
}

function cargarIngresosPorCategoria() {
    const objData = new FormData();
    objData.append("obtenerIngresosPorCategoria", "ok");
    
    fetch("controlador/reporteControlador.php", {
        method: "POST",
        body: objData,
    })
    .then(response => response.json())
    .then(response => {
        if (response && response.codigo == "200") {
            datosReportes.ingresos = response.ingresos;
            actualizarTablaCategorias();
            actualizarGraficoComparativo();
        }
    })
    .catch(error => {});
}

function cargarTodasLasTransacciones() {
    const objData = new FormData();
    objData.append("obtenerReporteDetallado", "ok");
    
    fetch("controlador/reporteControlador.php", {
        method: "POST",
        body: objData,
    })
    .then(response => response.json())
    .then(response => {
        if (response && response.codigo == "200") {
            actualizarTablaTransacciones(response.transacciones);
            document.getElementById('contadorTransacciones').textContent = response.transacciones.length + ' transacciones';
        }
    })
    .catch(error => {});
}

function actualizarTablaTransacciones(transacciones) {
    const tabla = document.getElementById('tablaTransaccionesReporte');
    if (!tabla) return;
    
    const tbody = tabla.querySelector('tbody');
    if (!tbody) return;
    
    if (!transacciones || transacciones.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-3">
                    <i class="fas fa-info-circle me-2"></i>No hay transacciones registradas
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    // Mostrar las últimas 100 transacciones ordenadas por fecha
    transacciones
        .sort((a, b) => new Date(b.fecha_transaccion) - new Date(a.fecha_transaccion))
        .slice(0, 100)
        .forEach(transaccion => {
            const fecha = new Date(transaccion.fecha_transaccion).toLocaleDateString('es-ES');
            const descripcion = transaccion.descripcion || 'Sin descripción';
            const categoria = transaccion.categoria_nombre || 'Sin categoría';
            const cuenta = transaccion.cuenta_nombre || 'Sin cuenta';
            
            const tipoClass = transaccion.tipo === 'ingreso' ? 'success' : 'danger';
            const tipoIcon = transaccion.tipo === 'ingreso' ? 'arrow-up' : 'arrow-down';
            
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td><small class="text-muted">${fecha}</small></td>
                <td>${descripcion}</td>
                <td><small>${categoria}</small></td>
                <td><small>${cuenta}</small></td>
                <td>
                    <span class="badge bg-${tipoClass}">
                        <i class="fas fa-${tipoIcon} me-1"></i> ${transaccion.tipo}
                    </span>
                </td>
                <td class="text-end">
                    <span class="text-${tipoClass} fw-bold">
                        $${parseFloat(transaccion.monto).toFixed(2)}
                    </span>
                </td>
            `;
            tbody.appendChild(fila);
        });
}

function actualizarGraficoGastos(gastos) {
    const canvas = document.getElementById('graficoDistribucionGastos');
    const noDataDiv = document.getElementById('noDataDistribucion');
    
    if (!canvas) return;
    
    if (!gastos || gastos.length === 0) {
        canvas.style.display = 'none';
        if (noDataDiv) noDataDiv.style.display = 'block';
        return;
    }
    
    canvas.style.display = 'block';
    if (noDataDiv) noDataDiv.style.display = 'none';
    
    // Destruir gráfico existente si existe
    if (window.graficoGastosInstance) {
        window.graficoGastosInstance.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    const labels = gastos.map(g => g.categoria);
    const data = gastos.map(g => g.total);
    const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#17a2b8', '#6f42c1', '#e83e8c', '#20c997'];
    
    window.graficoGastosInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: { size: 11 }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function actualizarGraficoComparativo() {
    const canvas = document.getElementById('graficoComparativo');
    const noDataDiv = document.getElementById('noDataComparativo');

    if (!canvas) return;

    const sinGastos = !datosReportes.gastos || datosReportes.gastos.length === 0;
    const sinIngresos = !datosReportes.ingresos || datosReportes.ingresos.length === 0;

    if (sinGastos && sinIngresos) {
        canvas.style.display = 'none';
        if (noDataDiv) noDataDiv.style.display = 'block';
        return;
    }

    canvas.style.display = 'block';
    if (noDataDiv) noDataDiv.style.display = 'none';

    // Destruir gráfico existente si existe
    if (window.graficoComparativoInstance) {
        try {
            window.graficoComparativoInstance.destroy();
        } catch (e) {}
    }

    const ctx = canvas.getContext('2d');

    // Calcular totales
    const totalGastos = sinGastos ? 0 : datosReportes.gastos.reduce((sum, g) => sum + g.total, 0);
    const totalIngresos = sinIngresos ? 0 : datosReportes.ingresos.reduce((sum, i) => sum + i.total, 0);

    window.graficoComparativoInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ingresos', 'Gastos'],
            datasets: [{
                data: [totalIngresos, totalGastos],
                backgroundColor: ['#28a745', '#dc3545'],
                borderWidth: 2,
                borderColor: ['#1e7e34', '#c82333']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            return `${context.label}: $${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

function actualizarTablaCategorias() {
    const tabla = document.getElementById('tablaCategorias');
    if (!tabla) return;
    
    const tbody = tabla.querySelector('tbody');
    if (!tbody) return;
    
    // Combinar datos de gastos e ingresos
    let todasCategorias = [];
    
    if (datosReportes.gastos) {
        todasCategorias = todasCategorias.concat(datosReportes.gastos.map(g => ({...g, tipo: 'gasto'})));
    }
    
    if (datosReportes.ingresos) {
        todasCategorias = todasCategorias.concat(datosReportes.ingresos.map(i => ({...i, tipo: 'ingreso'})));
    }
    
    if (todasCategorias.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-3">
                    <i class="fas fa-info-circle me-2"></i>No hay datos para mostrar
                </td>
            </tr>
        `;
        return;
    }
    
    const totalGeneral = todasCategorias.reduce((sum, cat) => sum + cat.total, 0);
    
    tbody.innerHTML = '';
    
    todasCategorias.sort((a, b) => b.total - a.total).forEach(categoria => {
        const porcentaje = totalGeneral > 0 ? (categoria.total / totalGeneral) * 100 : 0;
        const tipoClass = categoria.tipo === 'ingreso' ? 'success' : 'danger';
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${categoria.categoria}</td>
            <td><span class="badge bg-${tipoClass}">${categoria.tipo}</span></td>
            <td class="text-end">$${categoria.total.toFixed(2)}</td>
            <td class="text-center">${categoria.cantidad}</td>
            <td class="text-end">$${categoria.promedio.toFixed(2)}</td>
            <td class="text-center">${porcentaje.toFixed(1)}%</td>
        `;
        tbody.appendChild(fila);
    });
}

function exportarReporte(formato) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'controlador/exportarControlador.php';
    form.target = '_blank';
    
    const campos = {
        'exportarReporte': 'ok',
        'formato': formato,
        'tipo_reporte': 'resumen_general',
        'periodo': 'todo'
    };
    
    for (const [key, value] of Object.entries(campos)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
    }
    
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
}