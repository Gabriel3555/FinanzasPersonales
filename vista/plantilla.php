<?php
session_start();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finanzas Personales</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- DataTables CSS -->
    <link href="https://cdn.datatables.net/1.13.6/css/dataTables.bootstrap5.min.css" rel="stylesheet">
    <link href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.bootstrap5.min.css" rel="stylesheet">
    <!-- SweetAlert2 -->
    <link href="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.27/dist/sweetalert2.min.css" rel="stylesheet">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">

    <style>
        :root {
            --primary-color: #2c3e50;
            --secondary-color: #95a5a6;
            --light-gray: #f8f9fa;
            --medium-gray: #6c757d;
            --dark-gray: #495057;
            --border-color: #dee2e6;
        }
        
        body {
            background-color: #ffffff;
            color: var(--dark-gray);
        }
        
        .sidebar {
            min-height: 100vh;
            background-color: var(--light-gray);
            border-right: 1px solid var(--border-color);
        }
        
        .nav-link {
            color: var(--medium-gray) !important;
            padding: 0.75rem 1rem;
            border-radius: 0.25rem;
            margin-bottom: 0.25rem;
            text-decoration: none;
        }
        
        .nav-link:hover, .nav-link.active {
            color: var(--primary-color) !important;
            background-color: #e9ecef;
        }
        
        .card {
            border: 1px solid var(--border-color);
            border-radius: 0.375rem;
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        }
        
        .main-content {
            background-color: #ffffff;
            min-height: 100vh;
        }
        
        .btn-primary {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
        }
        
        .btn-primary:hover {
            background-color: #34495e;
            border-color: #34495e;
        }
        
        .btn-secondary {
            background-color: var(--secondary-color);
            border-color: var(--secondary-color);
        }
        
        .btn-outline-secondary {
            color: var(--medium-gray);
            border-color: var(--border-color);
        }
        
        .btn-outline-secondary:hover {
            background-color: var(--light-gray);
            border-color: var(--border-color);
            color: var(--dark-gray);
        }
        
        .btn-outline-secondary.active {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            color: white;
        }
        
        .text-muted {
            color: var(--medium-gray) !important;
        }
        
        .badge {
            background-color: var(--secondary-color) !important;
            color: white;
        }
        
        .table th {
            background-color: var(--light-gray);
            color: var(--dark-gray);
            border-color: var(--border-color);
        }
        
        .card-header {
            background-color: var(--light-gray);
            border-bottom: 1px solid var(--border-color);
        }
        
        h1, h2, h3, h4, h5, h6 {
            color: var(--primary-color);
        }
        
        .metric-card {
            text-align: center;
            padding: 1.5rem;
        }
        
        .metric-value {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--primary-color);
        }
        
        .metric-label {
            color: var(--medium-gray);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
        }
    </style>
</head>
<body>

<?php if(!isset($_SESSION['usuario_id'])): ?>
    <!-- Página de Login -->
    <?php include_once "vista/modulos/login.php"; ?>
<?php else: ?>
    <!-- Dashboard Principal -->
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <nav class="col-md-3 col-lg-2 d-md-block sidebar">
                <div class="position-sticky pt-3">
                    <div class="text-center mb-4">
                        <h5>Finanzas Personales</h5>
                        <small class="text-muted">Hola, <?php echo $_SESSION['usuario_nombre']; ?></small>
                    </div>
                    
                    <ul class="nav flex-column">
                        <li class="nav-item">
                            <a class="nav-link" href="?ruta=dashboard">Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="?ruta=transacciones">Transacciones</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="?ruta=cuentas">Cuentas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="?ruta=categorias">Categorías</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="?ruta=reportes">Reportes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="vista/modulos/logout.php">Cerrar Sesión</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <!-- Main content -->
            <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
                <div class="pt-3">
                    <?php
                    if (isset($_GET["ruta"])) {
                        if (
                            $_GET["ruta"] == "dashboard" ||
                            $_GET["ruta"] == "transacciones" ||
                            $_GET["ruta"] == "cuentas" ||
                            $_GET["ruta"] == "categorias" ||
                            $_GET["ruta"] == "reportes" ||
                            $_GET["ruta"] == "usuarios"
                        ) {
                            include_once "vista/modulos/" . $_GET["ruta"] . ".php";
                        } else {
                            include_once "vista/modulos/404.php";
                        }
                    } else {
                        include_once "vista/modulos/dashboard.php";
                    }
                    ?>
                </div>
            </main>
        </div>
    </div>
<?php endif; ?>

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<!-- DataTables JS -->
<script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.6/js/dataTables.bootstrap5.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.bootstrap5.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/vfs_fonts.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.html5.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.print.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/buttons.colVis.min.js"></script>
<!-- SweetAlert2 -->
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.7.27/dist/sweetalert2.all.min.js"></script>

<!-- Scripts personalizados -->
<?php if(isset($_SESSION['usuario_id'])): ?>
    <!-- Cargar primero las clases -->
    <script src="vista/js/cl_usuario.js"></script>
    <script src="vista/js/cl_cuenta.js"></script>
    <script src="vista/js/cl_categoria.js"></script>
    <script src="vista/js/cl_transaccion.js"></script>
    
    <!-- Luego cargar los scripts que usan las clases -->
    <script src="vista/js/usuario.js"></script>
    <script src="vista/js/cuenta.js"></script>
    <script src="vista/js/categoria.js"></script>
    <script src="vista/js/transaccion.js"></script>
    <script src="vista/js/dashboard.js"></script>
    <script src="vista/js/reportes.js"></script>
<?php else: ?>
    <script src="vista/js/login.js"></script>
<?php endif; ?>

</body>
</html>
