# Flujo de Transferencias Simplificado - Versión 4.0

## Descripción General

La aplicación ha sido reajustada para implementar un sistema de transferencias automático y dinámico integrado directamente en el modal de edición. Este enfoque simplifica la interfaz y garantiza que los movimientos de mercancía entre Almacén y Tienda sean instantáneos y precisos.

## Estructura de Datos Simplificada

Cada producto ahora mantiene un registro simple de movimientos sin campos redundantes:

```javascript
movimientos: {
  tienda: {
    entrada: 50,      // Mercancía recibida (del proveedor o transferencia)
    venta: 0,         // Unidades vendidas
    merma: 0          // Unidades perdidas/dañadas
  },
  almacen: {
    entrada: 100,     // Mercancía recibida (del proveedor)
    venta: 0,         // Unidades vendidas
    merma: 0          // Unidades perdidas/dañadas
  }
}
```

## Cálculo de Saldo

El saldo total se calcula de forma automática y dinámica:

```
Saldo = Entrada - Venta - Merma
```

## Flujo de Transferencia: Almacén → Tienda

### Paso 1: Abrir Modal de Edición
1.  El usuario está en la página de **Almacén**.
2.  Hace clic en el botón "Editar" en la fila del producto.
3.  Se abre el modal de edición.

### Paso 2: Ingresar Cantidad de Transferencia
1.  En el modal, bajo la sección "Transferencia para Tienda", ingresa la cantidad a transferir.
2.  El sistema valida que la cantidad no exceda el saldo actual del producto en Almacén.

### Paso 3: Guardar Cambios - Ejecución Automática
Al hacer clic en "Guardar Cambios", la aplicación ejecuta automáticamente:

1.  **Resta en Almacén:**
    - `movimientos.almacen.entrada -= cantidadTransferida`
    - El saldo de Almacén se recalcula: `Saldo_Almacén = entrada - venta - merma`

2.  **Suma en Tienda:**
    - `movimientos.tienda.entrada += cantidadTransferida`
    - El saldo de Tienda se recalcula: `Saldo_Tienda = entrada - venta - merma`

3.  **Actualización Dinámica:**
    - Ambas tablas (Almacén y Tienda) se actualizan automáticamente en tiempo real.
    - Los cambios se guardan en localStorage.

### Ejemplo Práctico

**Estado Inicial:**
- Almacén: Entrada = 100, Venta = 0, Merma = 0 → **Saldo = 100**
- Tienda: Entrada = 0, Venta = 0, Merma = 0 → **Saldo = 0**

**Transferencia de 30 unidades de Almacén a Tienda:**
- Almacén: Entrada = 70, Venta = 0, Merma = 0 → **Saldo = 70**
- Tienda: Entrada = 30, Venta = 0, Merma = 0 → **Saldo = 30**

## Flujo de Transferencia: Tienda → Almacén

### Paso 1: Abrir Modal de Edición
1.  El usuario está en la página de **Tienda**.
2.  Hace clic en el botón "Editar" en la fila del producto.
3.  Se abre el modal de edición.

### Paso 2: Ingresar Cantidad de Transferencia
1.  En el modal, bajo la sección "Transferencia para Almacén", ingresa la cantidad a transferir.
2.  El sistema valida que la cantidad no exceda el saldo actual del producto en Tienda.

### Paso 3: Guardar Cambios - Ejecución Automática
Al hacer clic en "Guardar Cambios", la aplicación ejecuta automáticamente:

1.  **Resta en Tienda:**
    - `movimientos.tienda.entrada -= cantidadTransferida`
    - El saldo de Tienda se recalcula: `Saldo_Tienda = entrada - venta - merma`

2.  **Suma en Almacén:**
    - `movimientos.almacen.entrada += cantidadTransferida`
    - El saldo de Almacén se recalcula: `Saldo_Almacén = entrada - venta - merma`

3.  **Actualización Dinámica:**
    - Ambas tablas (Almacén y Tienda) se actualizan automáticamente en tiempo real.
    - Los cambios se guardan en localStorage.

### Ejemplo Práctico

**Estado Inicial:**
- Tienda: Entrada = 30, Venta = 10, Merma = 0 → **Saldo = 20**
- Almacén: Entrada = 70, Venta = 0, Merma = 0 → **Saldo = 70**

**Transferencia de 10 unidades de Tienda a Almacén:**
- Tienda: Entrada = 20, Venta = 10, Merma = 0 → **Saldo = 10**
- Almacén: Entrada = 80, Venta = 0, Merma = 0 → **Saldo = 80**

## Validaciones Implementadas

1.  **Stock Insuficiente:** Si intentas transferir más unidades de las disponibles, el sistema muestra un mensaje de error y no realiza la transferencia.
2.  **Cantidad Positiva:** Solo se aceptan números positivos en el campo de transferencia.
3.  **Guardado Automático:** Los cambios se guardan automáticamente en localStorage al hacer clic en "Guardar Cambios".

## Ventajas del Nuevo Sistema

- **Simplicidad:** La interfaz es más limpia y fácil de usar.
- **Automatización:** Las transferencias se ejecutan automáticamente sin pasos adicionales.
- **Integridad de Datos:** Los saldos se recalculan dinámicamente en ambas ubicaciones.
- **Trazabilidad:** Cada movimiento queda registrado en los campos de "Entrada", "Venta" y "Merma".
- **Persistencia:** Los datos se guardan automáticamente en localStorage.

## Campos Visibles en la Tabla

Cada tabla muestra los siguientes campos:
- **Código:** Identificador único del producto.
- **Nombre:** Nombre descriptivo del producto.
- **Unidad:** U (Unidad) o J (Juego).
- **Precio:** Precio unitario del producto.
- **Entrada:** Cantidad total recibida.
- **Venta:** Cantidad total vendida.
- **Mermas:** Cantidad total perdida/dañada.
- **Saldo Total:** Resultado automático del cálculo (Entrada - Venta - Merma).

## Reportes de Impresión

Al imprimir la tabla de cualquier ubicación, se genera automáticamente un **Reporte Completo** que incluye:
- Tabla detallada de productos con todos los movimientos.
- Resumen de movimientos (totales de entrada, venta, merma).
- Resumen financiero con valor total en inventario y dinero por ventas realizadas.
