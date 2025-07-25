-- BASE DE DATOS
CREATE DATABASE IF NOT EXISTS finanzas_personales;
USE finanzas_personales;

-- 1. USUARIOS
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

-- 2. CUENTAS (efectivo, tarjeta, banco)
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

-- 3. CATEGORÍAS PERSONALIZABLES
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

-- 4. TRANSACCIONES (ingresos y gastos)
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

-- 5. PRESUPUESTOS POR CATEGORÍA Y ALERTAS
CREATE TABLE presupuestos (
    idpresupuesto INT AUTO_INCREMENT PRIMARY KEY,
    idusuario INT NOT NULL,
    idcategoria INT NOT NULL,
    monto_limite DECIMAL(10,2) NOT NULL,
    periodo ENUM('semanal', 'mensual', 'anual') NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    monto_gastado DECIMAL(10,2) DEFAULT 0.00,
    alerta_enviada TINYINT DEFAULT 0, -- 0=no, 1=sí
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado TINYINT DEFAULT 1,
    FOREIGN KEY (idusuario) REFERENCES usuarios(idusuario) ON DELETE CASCADE,
    FOREIGN KEY (idcategoria) REFERENCES categorias(idcategoria) ON DELETE CASCADE
);

-- 6. HISTORIAL DE MOVIMIENTOS PRESUPUESTARIOS
CREATE TABLE movimientos_presupuesto (
    idmovimiento INT AUTO_INCREMENT PRIMARY KEY,
    idpresupuesto INT NOT NULL,
    idtransaccion INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idpresupuesto) REFERENCES presupuestos(idpresupuesto) ON DELETE CASCADE,
    FOREIGN KEY (idtransaccion) REFERENCES transacciones(idtransaccion) ON DELETE CASCADE
);

-- 7. LOG DE EXPORTACIONES (PDF, CSV)
CREATE TABLE exportaciones (
    idexportacion INT AUTO_INCREMENT PRIMARY KEY,
    idusuario INT NOT NULL,
    tipo ENUM('PDF', 'CSV') NOT NULL,
    rango_inicio DATE NOT NULL,
    rango_fin DATE NOT NULL,
    fecha_exportacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (idusuario) REFERENCES usuarios(idusuario) ON DELETE CASCADE
);
