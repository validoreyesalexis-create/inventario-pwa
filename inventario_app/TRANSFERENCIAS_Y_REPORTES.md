# Sistema de Transferencias y Reportes - Versión 3.0

## 1. Transferencias Automáticas Bidireccionales

La aplicación ahora implementa un sistema simplificado de transferencias entre Almacén y Tienda que garantiza la integridad de los datos y evita duplicaciones.

### Flujo de Transferencia desde Almacén a Tienda

1.  El usuario está en la página de **Almacén** y ve un botón "Transferir" en cada fila de producto.
2.  Al hacer clic, se abre un modal que solicita la cantidad a transferir.
3.  La aplicación valida que hay suficiente stock en Almacén.
4.  **Automáticamente:**
    *   Se **resta** la cantidad del campo "Transferencia" del Almacén.
    *   Se **suma** la cantidad al campo "Entrada" de la Tienda.
    *   El saldo total se recalcula automáticamente en ambas ubicaciones.

### Flujo de Transferencia desde Tienda a Almacén

1.  El usuario está en la página de **Tienda** y ve un botón "Transferir" en cada fila de producto.
2.  Al hacer clic, se abre un modal que solicita la cantidad a transferir.
3.  La aplicación valida que hay suficiente stock en Tienda.
4.  **Automáticamente:**
    *   Se **resta** la cantidad del campo "Transferencia" de la Tienda.
    *   Se **suma** la cantidad al campo "Entrada" del Almacén.
    *   El saldo total se recalcula automáticamente en ambas ubicaciones.

## 2. Estructura de Datos Simplificada

La nueva estructura elimina la complejidad de transferencias bidireccionales redundantes:

```javascript
movimientos: {
  tienda: {
    entrada: 50,      // Recepción de mercancía (del proveedor o almacén)
    venta: 0,         // Cantidad vendida
    merma: 0,         // Cantidad perdida/dañada
    transf: 0         // Cantidad transferida a almacén
  },
  almacen: {
    entrada: 100,     // Recepción de mercancía (del proveedor)
    venta: 0,         // Cantidad vendida
    merma: 0,         // Cantidad perdida/dañada
    transf: 0         // Cantidad transferida a tienda
  }
}
```

### Cálculo de Saldo

```
Saldo = Entrada + Transf (recibida) - Venta - Merma - Transf (enviada)
```

**Nota:** El campo `transf` representa la cantidad enviada a la otra ubicación. Cuando se transfiere desde Almacén a Tienda:
- Almacén: `transf` aumenta (cantidad enviada)
- Tienda: `entrada` aumenta (cantidad recibida)

## 3. Sistema de Reportes Mejorado

Al imprimir la tabla de cualquier ubicación, se genera automáticamente un **Reporte Completo** que incluye:

### Sección 1: Detalle de Productos
Una tabla con todos los productos y sus movimientos:
- Código, Nombre, Unidad, Precio
- Entrada, Venta, Transferencia, Merma
- Saldo Total
- **Valor Total** (Saldo × Precio)

### Sección 2: Resumen Financiero
- **Dinero por Ventas Realizadas:** Cantidad de unidades vendidas × Precio promedio
- **Valor Total en Inventario:** Suma de (Saldo × Precio) para todos los productos
- **Cantidad Total de Productos:** Total de unidades en stock

### Sección 3: Resumen de Movimientos
- Total de Entradas
- Total de Ventas
- Total de Transferencias
- Total de Mermas
- Saldo Final

## 4. Ejemplo Práctico

### Escenario Inicial
- **Producto A** en Almacén: 100 unidades, Precio: $10
- **Producto A** en Tienda: 0 unidades

### Paso 1: Transferir 30 unidades de Almacén a Tienda
- Almacén: transf = 30 → Saldo = 100 - 30 = **70 unidades**
- Tienda: entrada = 30 → Saldo = 30 = **30 unidades**

### Paso 2: Vender 10 unidades en Tienda
- Tienda: venta = 10 → Saldo = 30 - 10 = **20 unidades**
- Almacén: Sin cambios → Saldo = **70 unidades**

### Reporte de Tienda
- Entrada: 30
- Venta: 10
- Transferencia: 0
- Merma: 0
- Saldo: 20
- Valor Total: 20 × $10 = $200

## 5. Validaciones Implementadas

1.  **Stock Insuficiente:** No permite transferir más unidades de las disponibles.
2.  **Campos Requeridos:** Todos los campos de producto son obligatorios.
3.  **Valores Positivos:** Los movimientos solo aceptan números positivos.
4.  **Guardado Automático:** Los cambios se guardan en localStorage al modificar cualquier dato.

## 6. Exportación e Importación

- **Exportar:** Descarga un archivo JSON con todos los productos y sus movimientos.
- **Importar:** Carga un archivo JSON previamente exportado, permitiendo sincronización manual entre dispositivos.
