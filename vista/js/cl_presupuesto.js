class Presupuesto {
  constructor(objData) {
    this._objData = objData;
  }

  editarPresupuesto() {
    const self = this;
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("editarPresupuesto", "ok");
        formData.append("idpresupuesto", this._objData.idpresupuesto);
        formData.append("idcategoria", this._objData.idcategoria);
        formData.append("monto_limite", this._objData.monto_limite);
        formData.append("periodo", this._objData.periodo);
        formData.append("fecha_inicio", this._objData.fecha_inicio);
        formData.append("fecha_fin", this._objData.fecha_fin);

        fetch("controlador/presupuestoControlador.php", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(response => {
            if (response.codigo === "200") {
                self.mostrarExito(response.mensaje);
                
                // Limpiar formulario
                const form = document.getElementById("formEditarPresupuesto");
                if (form) {
                    form.reset();
                    form.classList.remove("was-validated");
                }
                
                // Regresar a tabla y actualizar
                document.getElementById("panelFormularioEditarPresupuesto").style.display = "none";
                document.getElementById("panelTablaPresupuesto").style.display = "block";
                self.mostrarPresupuesto();
                resolve(response);
            } else {
                self.mostrarError(response.mensaje);
                reject(response);
            }
        })
        .catch(error => {
            self.mostrarError("Error de conexión: " + error.message);
            reject(error);
        });
    });
}

  // Método para cargar categorías de gasto
  cargarCategoriasGasto() {
    const objData = new FormData();
    objData.append("mostrarCategoria", "ok");

    fetch("controlador/categoriaControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response && response.codigo === "200") {
          this.actualizarSelectsCategorias(response.listaCategoria);
        } else {
          this.mostrarError(response?.mensaje || "Error al cargar categorías");
        }
      })
      .catch((error) => {
        this.mostrarError("Error de conexión: " + error.message);
      });
  }

  // Actualizar los selects de categorías
  actualizarSelectsCategorias(categorias) {
    const selectPrincipal = document.getElementById("txt_categoria_presupuesto");
    const selectEdicion = document.getElementById("txt_edit_categoria_presupuesto");

    const actualizarSelect = (select) => {
      if (!select) return;
      select.innerHTML = '<option value="">Seleccione una categoría...</option>';
      
      categorias
        .filter(cat => cat.tipo === "gasto")
        .forEach(categoria => {
          const option = document.createElement("option");
          option.value = categoria.idcategoria;
          option.textContent = categoria.nombre;
          select.appendChild(option);
        });
    };

    actualizarSelect(selectPrincipal);
    actualizarSelect(selectEdicion);
  }

  // Método para cargar alertas de presupuestos
  cargarAlertas() {
    const objData = new FormData();
    objData.append("obtenerEstadoPresupuestos", "ok");

    fetch("controlador/presupuestoControlador.php", {
      method: "POST",
      body: objData,
    })
      .then((response) => response.json())
      .then((response) => {
        if (response && response.codigo === "200") {
          this.mostrarAlertasEnUI(response.alertas, response.resumen);
        } else {
          this.mostrarError(response?.mensaje || "Error al cargar alertas");
        }
      })
      .catch((error) => {
        this.mostrarError("Error de conexión: " + error.message);
      });
  }

  // Mostrar alertas en la interfaz
  mostrarAlertasEnUI(alertas, resumen) {
    const contenedor = document.getElementById("alertasPresupuestos");
    if (!contenedor) return;

    let html = "";
    
    if (alertas && alertas.length > 0) {
      alertas.forEach(alerta => {
        const tipo = alerta.tipo === "excedido" ? "danger" : "warning";
        const icono = alerta.tipo === "excedido" 
          ? "fas fa-exclamation-triangle" 
          : "fas fa-exclamation-circle";
        
        html += `
          <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
            <i class="${icono} me-2"></i>
            ${alerta.mensaje}
            <small class="d-block mt-1">Gastado: $${alerta.monto_gastado.toFixed(2)} 
            de $${alerta.monto_limite.toFixed(2)} (${alerta.porcentaje.toFixed(1)}%)</small>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          </div>
        `;
      });
    }

    if (resumen) {
      html += `
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-2"></i>
          <strong>Resumen:</strong> 
          ${resumen.total_presupuestos} presupuestos activos -
          <span class="text-success">${resumen.presupuestos_saludables} saludables</span>,
          <span class="text-warning">${resumen.presupuestos_en_alerta} en alerta</span>,
          <span class="text-danger">${resumen.presupuestos_excedidos} excedidos</span>
        </div>
      `;
    }

    contenedor.innerHTML = html;
  }

  // Método para mostrar presupuestos
  mostrarPresupuesto() {
    const formData = new FormData();
    formData.append("mostrarPresupuesto", "ok");

    fetch("controlador/presupuestoControlador.php", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        if (response?.codigo === "200") {
          this.renderizarTabla(response.listaPresupuesto);
        } else {
          this.mostrarError(response?.mensaje || "Error al cargar datos");
        }
      })
      .catch(error => {
        this.mostrarError("Error de conexión: " + error.message);
      });
  }

  // Renderizar tabla de presupuestos
  renderizarTabla(presupuestos) {
    const tbody = document.querySelector("#tablaPresupuesto tbody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (!presupuestos || presupuestos.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted">
            <i class="fas fa-info-circle"></i> No se encontraron presupuestos
          </td>
        </tr>
      `;
      return;
    }

    presupuestos.forEach(p => {
      const fila = document.createElement("tr");
      
      // Calcular valores
      const porcentaje = Math.min(p.porcentaje_usado, 100);
      const color = this.obtenerColorProgreso(porcentaje);
      const estado = this.obtenerEstadoPresupuesto(porcentaje);
      
      fila.innerHTML = `
        <td>
          <div class="categoria-badge">
            <span class="categoria-color" style="background-color:${p.categoria_color}"></span>
            ${p.categoria_nombre}
          </div>
        </td>
        <td>${p.periodo.charAt(0).toUpperCase() + p.periodo.slice(1)}</td>
        <td class="text-center">
          ${new Date(p.fecha_inicio).toLocaleDateString('es-ES')}<br>
          <small class="text-muted">al ${new Date(p.fecha_fin).toLocaleDateString('es-ES')}</small>
        </td>
        <td class="text-end">$${Number(p.monto_limite).toFixed(2)}</td>
        <td class="text-end">$${Number(p.monto_gastado).toFixed(2)}</td>
        <td class="text-end">$${Number(p.monto_restante).toFixed(2)}</td>
        <td>
          <div class="progress">
            <div class="progress-bar bg-${color}" style="width:${porcentaje}%">
              ${porcentaje.toFixed(1)}%
            </div>
          </div>
        </td>
        <td class="text-center">
          <span class="badge bg-${color}">${estado}</span>
        </td>
        <td class="text-center">
          <div class="btn-group">
            <button class="btn btn-sm btn-info btn-editar"
                    data-id="${p.idpresupuesto}"
                    data-categoria="${p.idcategoria}"
                    data-monto="${p.monto_limite}"
                    data-periodo="${p.periodo}"
                    data-inicio="${p.fecha_inicio}"
                    data-fin="${p.fecha_fin}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger btn-eliminar" 
                    data-id="${p.idpresupuesto}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      
      tbody.appendChild(fila);
    });

    // Configurar eventos después de renderizar
    this.configurarEventosTabla();
  }

  obtenerColorProgreso(porcentaje) {
    if (porcentaje >= 100) return "danger";
    if (porcentaje >= 80) return "warning";
    if (porcentaje >= 50) return "info";
    return "success";
  }

  obtenerEstadoPresupuesto(porcentaje) {
    if (porcentaje >= 100) return "Excedido";
    if (porcentaje >= 80) return "Alerta";
    if (porcentaje >= 50) return "Moderado";
    return "Saludable";
  }

  configurarEventosTabla() {
    // Eventos para botones de editar
    document.querySelectorAll(".btn-editar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const categoria = btn.dataset.categoria;
        const monto = btn.dataset.monto;
        const periodo = btn.dataset.periodo;
        const inicio = btn.dataset.inicio;
        const fin = btn.dataset.fin;
        
        this.mostrarFormularioEdicion(id, categoria, monto, periodo, inicio, fin);
      });
    });


    
    // Eventos para botones de eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        this.confirmarEliminacion(id);
      });
    });
  }

  registrarPresupuesto() {
    const self = this; // Guardar referencia al contexto actual
    
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("registrarPresupuesto", "ok");
      formData.append("idcategoria", this._objData.idcategoria);
      formData.append("monto_limite", this._objData.monto_limite);
      formData.append("periodo", this._objData.periodo);
      formData.append("fecha_inicio", this._objData.fecha_inicio);
      formData.append("fecha_fin", this._objData.fecha_fin);

      fetch("controlador/presupuestoControlador.php", {
        method: "POST",
        body: formData,
      })
      .then(response => response.json())
      .then(response => {
        if (response.codigo === "200") {
          // Mostrar éxito
          self.mostrarExito(response.mensaje);
          
          // Limpiar formulario
          const form = document.getElementById("formPresupuesto");
          if (form) {
            form.reset();
            form.classList.remove("was-validated");
          }
          
          // Regresar a tabla y actualizar
          document.getElementById("panelFormularioPresupuesto").style.display = "none";
          document.getElementById("panelTablaPresupuesto").style.display = "block";
          self.mostrarPresupuesto();
          
          resolve(response);
        } else {
          // Manejar errores específicos con HTML
          if (response.mensaje && response.mensaje.includes('<br>')) {
            Swal.fire({
              icon: 'error',
              title: 'Conflicto de presupuestos',
              html: response.mensaje,
              showConfirmButton: true
            });
            reject(response);
          } else {
            self.mostrarError(response.mensaje);
            reject(response);
          }
        }
      })
      .catch(error => {
        self.mostrarError("Error de conexión: " + error.message);
        reject(error);
      });
    });
  }

  mostrarFormularioEdicion(id, categoria, monto, periodo, inicio, fin) {
    document.getElementById("panelTablaPresupuesto").style.display = "none";
    document.getElementById("panelFormularioEditarPresupuesto").style.display = "block";

    document.getElementById("txt_edit_categoria_presupuesto").value = categoria;
    document.getElementById("txt_edit_monto_limite").value = monto;
    document.getElementById("txt_edit_periodo_presupuesto").value = periodo;
    document.getElementById("txt_edit_fecha_inicio").value = inicio;
    document.getElementById("txt_edit_fecha_fin").value = fin;
    
    // Guardar ID para uso posterior
    const btnActualizar = document.getElementById("btnActualizarPresupuesto");
    btnActualizar.dataset.id = id;
  }

  confirmarEliminacion(id) {
    const Swal = window.Swal;
    
    Swal.fire({
      title: '¿Eliminar presupuesto?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const objData = {
          eliminarPresupuesto: "ok",
          idpresupuesto: id
        };
        const objPresupuesto = new Presupuesto(objData);
        objPresupuesto.eliminarPresupuesto();
      }
    });
  }

  eliminarPresupuesto() {
    const formData = new FormData();
    formData.append("eliminarPresupuesto", "ok");
    formData.append("idpresupuesto", this._objData.idpresupuesto);

    fetch("controlador/presupuestoControlador.php", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .then(response => {
        if (response.codigo === "200") {
          this.mostrarExito(response.mensaje);
          this.mostrarPresupuesto();
        } else {
          this.mostrarError(response.mensaje);
        }
      })
      .catch(error => {
        this.mostrarError("Error de conexión: " + error.message);
      });
  }

  // Métodos de utilidad
  mostrarError(mensaje) {
    const Swal = window.Swal;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,
    });
  }

  mostrarExito(mensaje) {
    const Swal = window.Swal;
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: mensaje,
      timer: 2000,
      showConfirmButton: false
    });
  }
}

// Función global para actualizar
window.actualizarPresupuestos = function() {
  const objData = { mostrarPresupuesto: "ok" };
  const presupuesto = new Presupuesto(objData);
  presupuesto.mostrarPresupuesto();
};

// Exponer la clase globalmente
window.Presupuesto = Presupuesto;