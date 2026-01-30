# Lógica de Transferencia Refinada - Versión 5.0

## El Problema
En versiones anteriores, al transferir mercancía, se restaba de la columna "Entrada" del origen. Esto causaba confusión ya que se perdía el registro de cuánta mercancía entró originalmente del proveedor.

## La Solución (v5.0)
Hemos implementado un campo interno de `ajuste_transf` que permite restar del saldo total sin alterar la columna visual de "Entrada".

### Fórmula de Saldo Total
```
Saldo = Entrada + Ajuste_Transferencia - Venta - Merma
```

### Comportamiento de Transferencia (Ejemplo: Almacén → Tienda)

1.  **En Almacén (Origen):**
    - La columna **Entrada** NO cambia.
    - El valor de la transferencia se resta del campo interno `ajuste_transf`.
    - El **Saldo Total** disminuye automáticamente.
    - *Resultado:* Mantienes el registro de entrada original pero el stock disponible es correcto.

2.  **En Tienda (Destino):**
    - La columna **Entrada** AUMENTA con la cantidad recibida.
    - El **Saldo Total** aumenta automáticamente.
    - *Resultado:* La transferencia se trata como una nueva entrada de mercancía para la tienda.

## Ventajas Técnicas
- **Integridad Histórica:** Siempre sabrás cuánto compraste originalmente al proveedor.
- **Claridad Visual:** Las tablas reflejan el stock real sin "trucos" en las columnas de entrada.
- **Consistencia:** El sistema de reportes e impresión utiliza estas mismas fórmulas para garantizar que el arqueo de caja y el valor del inventario sean exactos.
