-- Base de datos para el sistema de finanzas personales
CREATE DATABASE IF NOT EXISTS finanzas_personales;
USE finanzas_personales;

-- Tabla de usuarios
CREATE TABLE usuarios (
    idusuario INT AUTO_INCREMENT PRIMARY KEY,
    documento VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TINYINT DEFAULT 1
);

-- INSERTA UN USUARIO CON ID 1

-- Tabla de cuentas
CREATE TABLE cuentas (
    idcuenta INT AUTO_INCREMENT PRIMARY KEY,
    idusuario INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('efectivo', 'tarjeta', 'banco') NOT NULL,
    saldo_inicial DECIMAL(10,2) DEFAULT 0.00,
    saldo_actual DECIMAL(10,2) DEFAULT 0.00,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TINYINT DEFAULT 1,
    FOREIGN KEY (idusuario) REFERENCES usuarios(idusuario) ON DELETE CASCADE
);

-- Tabla de categorías
CREATE TABLE categorias (
    idcategoria INT AUTO_INCREMENT PRIMARY KEY,
    idusuario INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('ingreso', 'gasto') NOT NULL,
    color VARCHAR(7) DEFAULT '#007bff',
    icono VARCHAR(50) DEFAULT 'fas fa-circle',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TINYINT DEFAULT 1,
    FOREIGN KEY (idusuario) REFERENCES usuarios(idusuario) ON DELETE CASCADE
);

-- Tabla de transacciones
CREATE TABLE transacciones (
    idtransaccion INT AUTO_INCREMENT PRIMARY KEY,
    idusuario INT NOT NULL,
    idcuenta INT NOT NULL,
    idcategoria INT NOT NULL,
    tipo ENUM('ingreso', 'gasto') NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    descripcion TEXT,
    fecha_transaccion DATE NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TINYINT DEFAULT 1,
    FOREIGN KEY (idusuario) REFERENCES usuarios(idusuario) ON DELETE CASCADE,
    FOREIGN KEY (idcuenta) REFERENCES cuentas(idcuenta) ON DELETE CASCADE,
    FOREIGN KEY (idcategoria) REFERENCES categorias(idcategoria) ON DELETE CASCADE
);

-- Tabla de presupuestos
CREATE TABLE presupuestos (
    idpresupuesto INT AUTO_INCREMENT PRIMARY KEY,
    idusuario INT NOT NULL,
    idcategoria INT NOT NULL,
    monto_limite DECIMAL(10,2) NOT NULL,
    periodo ENUM('semanal', 'mensual', 'anual') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    monto_gastado DECIMAL(10,2) DEFAULT 0.00,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TINYINT DEFAULT 1,
    FOREIGN KEY (idusuario) REFERENCES usuarios(idusuario) ON DELETE CASCADE,
    FOREIGN KEY (idcategoria) REFERENCES categorias(idcategoria) ON DELETE CASCADE
);

/* === 1. USUARIOS ========================================================= */
INSERT INTO usuarios
    (idusuario, documento, nombre, apellido, email, password)
VALUES
    (1, '0912345678', 'Juan',  'Pérez',  'juan.perez@example.com',  SHA2('Password123',256)),
    (2, '1022334455', 'Laura', 'García', 'laura.garcia@example.com', SHA2('Password123',256));

/* === 2. CUENTAS ========================================================== */
INSERT INTO cuentas
    (idusuario, nombre, tipo, saldo_inicial, saldo_actual)
VALUES
    (1, 'Billetera',          'efectivo', 200.00, 350.00),
    (1, 'Cuenta Corriente',   'banco',    800.00, 650.00),
    (1, 'Tarjeta Crédito',    'tarjeta',    0.00, -75.00),
    (2, 'Cuenta Nómina',      'banco',   1200.00, 980.00);

/* === 3. CATEGORÍAS ======================================================= */
INSERT INTO categorias
    (idusuario, nombre, tipo, color, icono)
VALUES
    -- Ingresos (usuario 1)
    (1, 'Salario',       'ingreso', '#28a745', 'fas fa-money-bill'),
    (1, 'Freelance',     'ingreso', '#17a2b8', 'fas fa-laptop-code'),
    -- Gastos   (usuario 1)
    (1, 'Alimentación',  'gasto',   '#dc3545', 'fas fa-utensils'),
    (1, 'Transporte',    'gasto',   '#ffc107', 'fas fa-bus'),
    (1, 'Ocio',          'gasto',   '#6f42c1', 'fas fa-film'),
    -- Ingresos y gastos (usuario 2)
    (2, 'Salario',       'ingreso', '#28a745', 'fas fa-money-bill'),
    (2, 'Supermercado',  'gasto',   '#dc3545', 'fas fa-shopping-cart');

/* === 4. TRANSACCIONES ==================================================== */
INSERT INTO transacciones
    (idusuario, idcuenta, idcategoria, tipo, monto, descripcion, fecha_transaccion)
VALUES
    /* Usuario 1 ----------------------------------------------------------- */
    (1, 2, 1, 'ingreso', 1500.00, 'Salario mensual',        '2025-06-01'),
    (1, 1, 3, 'gasto',    55.50,  'Cena con amigos',        '2025-06-05'),
    (1, 3, 5, 'gasto',    25.00,  'Entradas de cine',       '2025-06-07'),
    (1, 2, 2, 'ingreso',  400.00, 'Proyecto freelance web', '2025-06-10'),
    (1, 1, 4, 'gasto',    18.00,  'Taxi aeropuerto',        '2025-06-15'),
    /* Usuario 2 ----------------------------------------------------------- */
    (2, 4, 6, 'ingreso', 1800.00, 'Salario mensual',        '2025-06-01'),
    (2, 4, 7, 'gasto',   120.75,  'Compra quincenal super', '2025-06-08');

/* === 5. PRESUPUESTOS ===================================================== */
INSERT INTO presupuestos
    (idusuario, idcategoria, monto_limite, periodo, fecha_inicio, fecha_fin)
VALUES
    -- Usuario 1: Control mensual de alimentación
    (1, 3, 300.00, 'mensual', '2025-06-01', '2025-06-30'),
    -- Usuario 1: Transporte semanal
    (1, 4, 60.00,  'semanal', '2025-06-10', '2025-06-16'),
    -- Usuario 2: Supermercado mensual
    (2, 7, 500.00, 'mensual', '2025-06-01', '2025-06-30');
