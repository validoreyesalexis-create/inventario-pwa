-- Estructura de Base de Datos Nativa (SQLite)

CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    unidad TEXT,
    precio REAL DEFAULT 0.0,
    stock_tienda INTEGER DEFAULT 0,
    stock_almacen INTEGER DEFAULT 0,
    ultima_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS movimientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto INTEGER,
    tipo_movimiento TEXT, -- ENTRADA, VENTA, TRANSFERENCIA, MERMA, AJUSTE
    origen TEXT, -- TIENDA, ALMACEN, PROVEEDOR
    destino TEXT, -- TIENDA, ALMACEN, CLIENTE
    cantidad INTEGER,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    sincronizado INTEGER DEFAULT 0, -- 0: No, 1: Sí
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- Datos iniciales de prueba
INSERT INTO productos (codigo, nombre, unidad, precio, stock_tienda, stock_almacen) 
VALUES ('001', 'Producto Ejemplo A', 'Unidad', 10.50, 50, 100);

INSERT INTO productos (codigo, nombre, unidad, precio, stock_tienda, stock_almacen) 
VALUES ('002', 'Producto Ejemplo B', 'Caja', 25.00, 20, 80);
