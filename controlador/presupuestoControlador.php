<?php

session_start();

// Verificar que el usuario esté logueado
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(array("codigo" => "401", "mensaje" => "Usuario no autenticado"));
    exit();
}

include_once "../modelo/presupuestoModelo.php";

class PresupuestoControlador{
    
    public $idpresupuesto;
    public $idusuario;
    public $idcategoria;
    public $monto_limite;
    public $periodo;
    public $fecha_inicio;
    public $fecha_fin;
    
    public function ctrMostrarPresupuesto(){
        try {
            $objRespuesta = PresupuestoModelo::mdlMostrarPresupuesto($this->idusuario);
            
            // Eliminar posibles duplicados por ID
            if ($objRespuesta["codigo"] == "200") {
                $ids = [];
                $listaUnica = [];
                
                foreach ($objRespuesta["listaPresupuesto"] as $presupuesto) {
                    $id = $presupuesto['idpresupuesto'];
                    if (!in_array($id, $ids)) {
                        $ids[] = $id;
                        $listaUnica[] = $presupuesto;
                    }
                }
                
                $objRespuesta["listaPresupuesto"] = $listaUnica;
            }
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }

    public function ctrEliminarPresupuesto(){
        try {
            if (empty($this->idpresupuesto) || !is_numeric($this->idpresupuesto)) {
                echo json_encode(array("codigo" => "400", "mensaje" => "ID de presupuesto inválido"));
                return;
            }

            $objRespuesta = PresupuestoModelo::mdlEliminarPresupuesto($this->idpresupuesto, $this->idusuario);
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }

    public function ctrAnadirPresupuesto(){
        try {
            // Validar datos de entrada
            if (empty($this->idcategoria) || !is_numeric($this->idcategoria)) {
                echo json_encode(array("codigo" => "400", "mensaje" => "ID de categoría inválido"));
                return;
            }

            if (empty($this->monto_limite) || !is_numeric($this->monto_limite) || $this->monto_limite <= 0) {
                echo json_encode(array("codigo" => "400", "mensaje" => "Monto límite inválido"));
                return;
            }

            if (!in_array($this->periodo, ['semanal', 'mensual', 'anual'])) {
                echo json_encode(array("codigo" => "400", "mensaje" => "Período inválido"));
                return;
            }

            if (empty($this->fecha_inicio) || empty($this->fecha_fin)) {
                echo json_encode(array("codigo" => "400", "mensaje" => "Fechas de inicio y fin requeridas"));
                return;
            }

            $objRespuesta = PresupuestoModelo::mdlCrearPresupuesto(
                $this->idusuario, 
                $this->idcategoria, 
                $this->monto_limite, 
                $this->periodo, 
                $this->fecha_inicio, 
                $this->fecha_fin
            );
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }

    public function ctrEditarPresupuesto(){
        try {
            // Validar datos de entrada
            if (empty($this->idpresupuesto) || !is_numeric($this->idpresupuesto)) {
                echo json_encode(array("codigo" => "400", "mensaje" => "ID de presupuesto inválido"));
                return;
            }

            if (empty($this->idcategoria) || !is_numeric($this->idcategoria)) {
                echo json_encode(array("codigo" => "400", "mensaje" => "ID de categoría inválido"));
                return;
            }

            if (empty($this->monto_limite) || !is_numeric($this->monto_limite) || $this->monto_limite <= 0) {
                echo json_encode(array("codigo" => "400", "mensaje" => "Monto límite inválido"));
                return;
            }

            if (!in_array($this->periodo, ['semanal', 'mensual', 'anual'])) {
                echo json_encode(array("codigo" => "400", "mensaje" => "Período inválido"));
                return;
            }

            $objRespuesta = PresupuestoModelo::mdlEditarPresupuesto(
                $this->idpresupuesto,
                $this->idcategoria, 
                $this->monto_limite, 
                $this->periodo, 
                $this->fecha_inicio, 
                $this->fecha_fin,
                $this->idusuario
            );
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }

    public function ctrObtenerEstadoPresupuestos(){
        try {
            $objRespuesta = PresupuestoModelo::mdlObtenerEstadoPresupuestos($this->idusuario);
            
            header('Content-Type: application/json');
            echo json_encode($objRespuesta);
            
        } catch (Exception $e) {
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
        }
    }
}

try {
    // Limpiar cualquier output previo
    if (ob_get_level()) {
        ob_clean();
    }
    
    if(isset($_POST["mostrarPresupuesto"]) && $_POST["mostrarPresupuesto"] == "ok") {
        $objPresupuesto = new PresupuestoControlador();
        $objPresupuesto->idusuario = $_SESSION['usuario_id'];
        $objPresupuesto->ctrMostrarPresupuesto();
    }
    else if(isset($_POST["eliminarPresupuesto"]) && $_POST["eliminarPresupuesto"] == "ok") {
        $objPresupuesto = new PresupuestoControlador();
        $objPresupuesto->idpresupuesto = $_POST["idpresupuesto"];
        $objPresupuesto->idusuario = $_SESSION['usuario_id'];
        $objPresupuesto->ctrEliminarPresupuesto();
    }
    else if (isset($_POST["registrarPresupuesto"]) && $_POST["registrarPresupuesto"] == "ok"){
        $objPresupuesto = new PresupuestoControlador();
        $objPresupuesto->idusuario = $_SESSION['usuario_id'];
        $objPresupuesto->idcategoria = $_POST["idcategoria"];
        $objPresupuesto->monto_limite = $_POST["monto_limite"];
        $objPresupuesto->periodo = $_POST["periodo"];
        $objPresupuesto->fecha_inicio = $_POST["fecha_inicio"];
        $objPresupuesto->fecha_fin = $_POST["fecha_fin"];
        $objPresupuesto->ctrAnadirPresupuesto();
        
        // DESPUÉS DE CREAR EL PRESUPUESTO, RECARGAR LA LISTA AUTOMÁTICAMENTE
        if (ob_get_level()) {
            ob_clean();
        }
        
        // Obtener la respuesta del registro
        $response = $objPresupuesto->ctrAnadirPresupuesto();
        
        // Si fue exitoso, devolver también la lista actualizada
        if (strpos($response, '"codigo":"200"') !== false) {
            $objPresupuestoLista = new PresupuestoControlador();
            $objPresupuestoLista->idusuario = $_SESSION['usuario_id'];
            $objPresupuestoLista->ctrMostrarPresupuesto();
        }
    }
    else if (isset($_POST["editarPresupuesto"]) && $_POST["editarPresupuesto"] == "ok"){
        $objPresupuesto = new PresupuestoControlador();
        $objPresupuesto->idpresupuesto = $_POST["idpresupuesto"];
        $objPresupuesto->idusuario = $_SESSION['usuario_id'];
        $objPresupuesto->idcategoria = $_POST["idcategoria"];
        $objPresupuesto->monto_limite = $_POST["monto_limite"];
        $objPresupuesto->periodo = $_POST["periodo"];
        $objPresupuesto->fecha_inicio = $_POST["fecha_inicio"];
        $objPresupuesto->fecha_fin = $_POST["fecha_fin"];
        $objPresupuesto->ctrEditarPresupuesto();
    }
    else if (isset($_POST["obtenerEstadoPresupuestos"]) && $_POST["obtenerEstadoPresupuestos"] == "ok"){
        $objPresupuesto = new PresupuestoControlador();
        $objPresupuesto->idusuario = $_SESSION['usuario_id'];
        $objPresupuesto->ctrObtenerEstadoPresupuestos();
    }
    else {
        header('Content-Type: application/json');
        http_response_code(400);
        echo json_encode(array("codigo" => "400", "mensaje" => "Acción no válida"));
    }
    
} catch (Exception $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode(array("codigo" => "500", "mensaje" => "Error interno del servidor: " . $e->getMessage()));
}
?>
