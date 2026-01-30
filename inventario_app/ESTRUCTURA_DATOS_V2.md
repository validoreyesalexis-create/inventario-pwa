# Estructura de Datos Evolucionada - Aplicación Inventario v2.0

## Cambios Principales

La aplicación ha evolucionado para soportar más de 1000 productos con una gestión completa de movimientos y edición manual de todos los campos. La nueva estructura permite una mayor flexibilidad y control sobre los datos.

## Modelo de Datos Actualizado

### Objeto Producto (Estructura Principal)

```javascript
{
  id: 1,                          // ID único (autoincrementable)
  codigo: "001",                  // Código de barras o SKU (único)
  nombre: "Producto A",           // Nombre descriptivo
  unidad: "U" | "J",              // U = Unidad, J = Juego
  precio: 10.00,                  // Precio de venta
  movimientos: {
    tienda: {
      entrada: 50,                // Cantidad recibida de proveedor o almacén
      venta: 0,                   // Cantidad vendida en tienda
      merma: 0,                   // Cantidad perdida/dañada en tienda
      transf_in: 0,               // Cantidad recibida desde almacén
      transf_out: 0               // Cantidad enviada a almacén
    },
    almacen: {
      entrada: 100,               // Cantidad recibida del proveedor
      venta: 0,                   // Cantidad vendida desde almacén
      merma: 0,                   // Cantidad perdida/dañada en almacén
      transf_in: 0,               // Cantidad recibida desde tienda
      transf_out: 0               // Cantidad enviada a tienda
    }
  }
}
```

## Cálculo Automático de Saldos

El saldo total para cada ubicación se calcula de la siguiente manera:

```
Saldo = Entrada + Transf_In - Venta - Merma - Transf_Out
```

**Ejemplo:**
- Tienda: 50 (entrada) + 0 (transf_in) - 0 (venta) - 0 (merma) - 0 (transf_out) = **50 unidades**
- Almacén: 100 (entrada) + 0 (transf_in) - 0 (venta) - 0 (merma) - 0 (transf_out) = **100 unidades**

## Tipos de Movimientos

| Movimiento | Ubicación | Efecto | Descripción |
| :--- | :--- | :--- | :--- |
| **Entrada** | Tienda/Almacén | +Cantidad | Recepción de mercancía del proveedor o transferencia interna. |
| **Venta** | Tienda/Almacén | -Cantidad | Venta realizada al cliente. |
| **Merma** | Tienda/Almacén | -Cantidad | Producto perdido, dañado o descartado. |
| **Transf_Out** | Tienda/Almacén | -Cantidad | Producto enviado a otra ubicación. |
| **Transf_In** | Tienda/Almacén | +Cantidad | Producto recibido de otra ubicación. |

## Funciones de CRUD Implementadas

### Crear (Create)
- **Botón:** "Agregar Producto"
- **Modal:** Permite ingresar código, nombre, unidad (U/J), precio y movimientos iniciales de almacén y tienda.
- **Validación:** Código único, campos requeridos.

### Leer (Read)
- **Renderizado:** Las tablas se actualizan automáticamente mostrando todos los productos con sus movimientos acumulados.
- **Visualización:** Cada columna muestra el acumulado de cada tipo de movimiento (Entrada, Venta, Transf., Merma).

### Actualizar (Update)
- **Botón:** "Editar" en cada fila
- **Modal:** Permite modificar todos los campos del producto y todos los movimientos (entrada, venta, merma, transferencias).
- **Recálculo:** El saldo total se recalcula automáticamente.

### Borrar (Delete)
- **Pendiente:** Implementar botón de eliminar con confirmación.

## Optimización para Grandes Volúmenes

Para soportar más de 1000 productos sin perder fluidez:

1. **Renderizado Eficiente:** Las tablas se regeneran solo cuando es necesario.
2. **Almacenamiento Local:** Los datos se guardan en la memoria del navegador (localStorage) o en una base de datos local (IndexedDB).
3. **Paginación (Futura):** Se puede implementar paginación para mostrar 50-100 productos por página.
4. **Búsqueda y Filtrado (Futuro):** Permitir buscar por código o nombre para acceder rápidamente a productos específicos.

## Sincronización de Datos

Los movimientos editados se pueden sincronizar con otros dispositivos a través de la API de sincronización. Cada cambio se registra con una marca de tiempo para resolver conflictos.
