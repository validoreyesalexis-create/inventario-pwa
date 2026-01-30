# Guía de Sincronización de Datos entre Dispositivos

Para que tu aplicación transmita la red de datos y se actualice en otros dispositivos, utilizaremos una arquitectura de **Sincronización Híbrida**.

## 1. Componentes Necesarios
1.  **Base de Datos Local (SQLite):** Almacena los datos en el teléfono o PC para que funcione sin internet.
2.  **API de Sincronización (Backend):** Un pequeño servidor (puedes usar uno gratuito como *Supabase* o *Firebase*) que actúe como puente.
3.  **Lógica de Intercambio:** El botón "Sincronizar" realizará las siguientes acciones:

## 2. Proceso de Sincronización (Paso a Paso)

### A. Envío de Cambios Locales (Push)
La aplicación busca en la tabla `movimientos` todos los registros donde `sincronizado = 0`.
```javascript
// Ejemplo de lógica de envío
const movimientosPendientes = db.query("SELECT * FROM movimientos WHERE sincronizado = 0");
enviarAlServidor(movimientosPendientes);
```

### B. Recepción de Cambios Externos (Pull)
La aplicación solicita al servidor todos los movimientos ocurridos después de su última fecha de sincronización.
```javascript
const ultimaSincro = localStorage.getItem('ultima_sincro');
const nuevosMovimientos = solicitarAlServidor(ultimaSincro);
aplicarCambiosLocales(nuevosMovimientos);
```

### C. Resolución de Conflictos
Si dos dispositivos modifican el mismo producto al mismo tiempo, el sistema comparará la `fecha_hora`. El movimiento con la fecha más reciente será el que determine el saldo final.

## 3. Herramienta Recomendada para Sincronización Gratuita
Te recomiendo usar **Supabase**. Es una alternativa gratuita a Firebase que te da una base de datos real y te permite sincronizar datos entre Android y Windows de forma muy sencilla usando JavaScript.

- **Ventaja:** No necesitas programar el servidor, Supabase te da la base de datos y la API lista para usar.
- **Costo:** Gratis para proyectos pequeños/medianos.
