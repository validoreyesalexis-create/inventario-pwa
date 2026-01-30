# Pruebas de Integridad del Sistema - Versión 4.0

## Casos de Prueba para Validar la Integridad de Cálculos

### Prueba 1: Transferencia Almacén → Tienda (Básica)

**Objetivo:** Verificar que una transferencia desde Almacén a Tienda actualiza correctamente ambos saldos.

**Datos Iniciales:**
- Producto: "Producto A", Código: "001"
- Almacén: Entrada = 100, Venta = 0, Merma = 0 → Saldo = 100
- Tienda: Entrada = 0, Venta = 0, Merma = 0 → Saldo = 0

**Acción:**
1. Ir a página de Almacén
2. Hacer clic en "Editar" para Producto A
3. En "Transferencia para Tienda", ingresar 30
4. Hacer clic en "Guardar Cambios"

**Resultado Esperado:**
- Almacén: Entrada = 70, Venta = 0, Merma = 0 → Saldo = 70 ✓
- Tienda: Entrada = 30, Venta = 0, Merma = 0 → Saldo = 30 ✓

**Validación:**
- [ ] El saldo de Almacén disminuyó en 30 unidades
- [ ] El saldo de Tienda aumentó en 30 unidades
- [ ] Los cambios se reflejan en ambas tablas
- [ ] Los datos persisten al recargar la página

---

### Prueba 2: Transferencia Tienda → Almacén (Básica)

**Objetivo:** Verificar que una transferencia desde Tienda a Almacén actualiza correctamente ambos saldos.

**Datos Iniciales (después de Prueba 1):**
- Almacén: Saldo = 70
- Tienda: Saldo = 30

**Acción:**
1. Ir a página de Tienda
2. Hacer clic en "Editar" para Producto A
3. En "Transferencia para Almacén", ingresar 10
4. Hacer clic en "Guardar Cambios"

**Resultado Esperado:**
- Almacén: Entrada = 80, Venta = 0, Merma = 0 → Saldo = 80 ✓
- Tienda: Entrada = 20, Venta = 0, Merma = 0 → Saldo = 20 ✓

**Validación:**
- [ ] El saldo de Tienda disminuyó en 10 unidades
- [ ] El saldo de Almacén aumentó en 10 unidades
- [ ] Los cambios se reflejan en ambas tablas
- [ ] Los datos persisten al recargar la página

---

### Prueba 3: Transferencia con Ventas Previas

**Objetivo:** Verificar que las transferencias funcionan correctamente cuando hay ventas registradas.

**Datos Iniciales:**
- Producto: "Producto B", Código: "002"
- Almacén: Entrada = 50, Venta = 5, Merma = 0 → Saldo = 45
- Tienda: Entrada = 20, Venta = 10, Merma = 0 → Saldo = 10

**Acción:**
1. Ir a página de Almacén
2. Hacer clic en "Editar" para Producto B
3. En "Transferencia para Tienda", ingresar 15
4. Hacer clic en "Guardar Cambios"

**Resultado Esperado:**
- Almacén: Entrada = 35, Venta = 5, Merma = 0 → Saldo = 30 ✓
- Tienda: Entrada = 35, Venta = 10, Merma = 0 → Saldo = 25 ✓

**Validación:**
- [ ] El saldo de Almacén disminuyó en 15 unidades (45 - 15 = 30)
- [ ] El saldo de Tienda aumentó en 15 unidades (10 + 15 = 25)
- [ ] Las ventas previas no se modificaron
- [ ] Los cálculos de saldo son correctos

---

### Prueba 4: Validación de Stock Insuficiente

**Objetivo:** Verificar que el sistema rechaza transferencias que exceden el stock disponible.

**Datos Iniciales:**
- Producto: "Producto C", Código: "003"
- Tienda: Entrada = 20, Venta = 5, Merma = 2 → Saldo = 13

**Acción:**
1. Ir a página de Tienda
2. Hacer clic en "Editar" para Producto C
3. En "Transferencia para Almacén", ingresar 20 (más que el saldo disponible)
4. Hacer clic en "Guardar Cambios"

**Resultado Esperado:**
- Se muestra un mensaje de error: "No hay suficiente stock para transferir. Stock disponible: 13"
- Los datos NO se modifican
- Tienda: Saldo sigue siendo 13

**Validación:**
- [ ] El sistema muestra un mensaje de error
- [ ] La transferencia NO se realiza
- [ ] El saldo permanece sin cambios
- [ ] No hay cambios en Almacén

---

### Prueba 5: Transferencia Cero

**Objetivo:** Verificar que el sistema maneja correctamente las transferencias de 0 unidades.

**Datos Iniciales:**
- Producto: "Producto D", Código: "004"
- Almacén: Saldo = 50
- Tienda: Saldo = 10

**Acción:**
1. Ir a página de Almacén
2. Hacer clic en "Editar" para Producto D
3. En "Transferencia para Tienda", dejar en 0
4. Hacer clic en "Guardar Cambios"

**Resultado Esperado:**
- Almacén: Saldo = 50 (sin cambios)
- Tienda: Saldo = 10 (sin cambios)

**Validación:**
- [ ] No se realiza ninguna transferencia
- [ ] Los saldos permanecen sin cambios
- [ ] No hay errores en la consola

---

### Prueba 6: Persistencia de Datos

**Objetivo:** Verificar que los datos se guardan correctamente en localStorage y persisten al recargar.

**Acción:**
1. Realizar una transferencia (Prueba 1)
2. Verificar que los saldos son correctos
3. Recargar la página (F5 o Ctrl+R)
4. Verificar que los saldos siguen siendo correctos

**Resultado Esperado:**
- Los datos se cargan correctamente desde localStorage
- Los saldos son los mismos después de recargar
- No hay pérdida de datos

**Validación:**
- [ ] Los datos persisten después de recargar
- [ ] No hay diferencias en los saldos
- [ ] La aplicación funciona sin errores

---

### Prueba 7: Múltiples Transferencias Consecutivas

**Objetivo:** Verificar que el sistema maneja correctamente múltiples transferencias consecutivas.

**Datos Iniciales:**
- Producto: "Producto E", Código: "005"
- Almacén: Entrada = 100, Venta = 0, Merma = 0 → Saldo = 100
- Tienda: Entrada = 0, Venta = 0, Merma = 0 → Saldo = 0

**Acciones:**
1. Transferencia 1: Almacén → Tienda, 20 unidades
2. Transferencia 2: Tienda → Almacén, 5 unidades
3. Transferencia 3: Almacén → Tienda, 15 unidades

**Resultado Esperado (después de todas las transferencias):**
- Almacén: Entrada = 70, Saldo = 70
- Tienda: Entrada = 30, Saldo = 30

**Validación:**
- [ ] Almacén: 100 - 20 + 5 - 15 = 70 ✓
- [ ] Tienda: 0 + 20 - 5 + 15 = 30 ✓
- [ ] Los saldos son correctos después de cada transferencia
- [ ] No hay acumulación de errores

---

## Checklist de Validación Final

- [ ] Todas las pruebas de transferencia funcionan correctamente
- [ ] Los saldos se calculan correctamente
- [ ] Las validaciones de stock funcionan
- [ ] Los datos persisten en localStorage
- [ ] No hay errores en la consola del navegador
- [ ] Las tablas se actualizan dinámicamente
- [ ] Los reportes de impresión incluyen los datos correctos
- [ ] La exportación/importación de datos funciona

---

**Nota:** Ejecuta estas pruebas en diferentes navegadores (Chrome, Firefox, Safari, Edge) para asegurar compatibilidad total.
