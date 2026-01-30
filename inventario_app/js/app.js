// Estructura de datos con ajustes para transferencias
let productos = loadProductsFromStorage();
let nextId = loadNextIdFromStorage();

// Si no hay productos guardados, usar datos de ejemplo
if (productos.length === 0) {
    productos = [
        { 
            id: 1, codigo: '001', nombre: 'Producto A', unidad: 'U', precio: 10.00, 
            movimientos: {
                tienda: { entrada: 50, venta: 0, merma: 0, ajuste_transf: 0 },
                almacen: { entrada: 100, venta: 0, merma: 0, ajuste_transf: 0 }
            }
        },
        { 
            id: 2, codigo: '002', nombre: 'Producto B', unidad: 'J', precio: 25.50, 
            movimientos: {
                tienda: { entrada: 20, venta: 0, merma: 0, ajuste_transf: 0 },
                almacen: { entrada: 80, venta: 0, merma: 0, ajuste_transf: 0 }
            }
        }
    ];
    nextId = 3;
    saveProductsToStorage(productos);
    saveNextIdToStorage(nextId);
}

// --- Funciones de Interfaz ---

function switchPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`page-${page}`).classList.add('active');
    document.getElementById(`btn-${page}`).classList.add('active');
    document.getElementById(`search-${page}`).value = '';
    renderTables();
}

function calculateStock(p, location) {
    const mov = p.movimientos[location];
    let stock = mov.entrada + mov.ajuste_transf - mov.venta - mov.merma;
    return stock;
}

function renderTables() {
    const bodyTienda = document.getElementById('body-tienda');
    const bodyAlmacen = document.getElementById('body-almacen');
    
    bodyTienda.innerHTML = '';
    bodyAlmacen.innerHTML = '';

    productos.forEach(p => {
        const stockTienda = calculateStock(p, 'tienda');
        const stockAlmacen = calculateStock(p, 'almacen');

        // Fila Tienda
        const rowT = document.createElement('tr');
        rowT.setAttribute('data-codigo', p.codigo.toLowerCase());
        rowT.setAttribute('data-nombre', p.nombre.toLowerCase());
        rowT.innerHTML = `
            <td>${p.codigo}</td>
            <td>${p.nombre}</td>
            <td>${p.unidad}</td>
            <td>$${p.precio.toFixed(2)}</td>
            <td>${p.movimientos.tienda.entrada}</td>
            <td>${p.movimientos.tienda.venta}</td>
            <td>${p.movimientos.tienda.merma}</td>
            <td style="font-weight:bold; color:${stockTienda < 0 ? 'red' : '#27ae60'}">${stockTienda}</td>
            <td>
                <button class="btn-edit" onclick="openEditModal(${p.id}, 'tienda')">Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})">Eliminar</button>
            </td>
        `;
        bodyTienda.appendChild(rowT);

        // Fila Almacén
        const rowA = document.createElement('tr');
        rowA.setAttribute('data-codigo', p.codigo.toLowerCase());
        rowA.setAttribute('data-nombre', p.nombre.toLowerCase());
        rowA.innerHTML = `
            <td>${p.codigo}</td>
            <td>${p.nombre}</td>
            <td>${p.unidad}</td>
            <td>$${p.precio.toFixed(2)}</td>
            <td>${p.movimientos.almacen.entrada}</td>
            <td>${p.movimientos.almacen.venta}</td>
            <td>${p.movimientos.almacen.merma}</td>
            <td style="font-weight:bold; color:${stockAlmacen < 0 ? 'red' : '#2980b9'}">${stockAlmacen}</td>
            <td>
                <button class="btn-edit" onclick="openEditModal(${p.id}, 'almacen')">Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${p.id})">Eliminar</button>
            </td>
        `;
        bodyAlmacen.appendChild(rowA);
    });
}

// --- Función de Búsqueda ---

function filterTable(location) {
    const searchInput = document.getElementById(`search-${location}`).value.toLowerCase();
    const tableBody = document.getElementById(`body-${location}`);
    const rows = tableBody.getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const codigo = row.getAttribute('data-codigo');
        const nombre = row.getAttribute('data-nombre');
        
        if (codigo.includes(searchInput) || nombre.includes(searchInput)) {
            row.classList.remove('hidden-row');
        } else {
            row.classList.add('hidden-row');
        }
    });
}

// --- Funciones de CRUD ---

function openProductModal(mode, id = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    
    title.textContent = 'Agregar Nuevo Producto';
    form.reset();
    document.getElementById('product-id').value = '';
    
    modal.style.display = 'block';
    
    form.onsubmit = function(e) {
        e.preventDefault();
        saveProduct();
    };
}

function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

function saveProduct() {
    const codigo = document.getElementById('codigo').value;
    const nombre = document.getElementById('nombre').value;
    const unidad = document.getElementById('unidad').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const movAlmacenEntrada = parseInt(document.getElementById('mov_almacen_entrada').value) || 0;
    const movTiendaEntrada = parseInt(document.getElementById('mov_tienda_entrada').value) || 0;

    const newProduct = {
        id: nextId++,
        codigo: codigo,
        nombre: nombre,
        unidad: unidad,
        precio: precio,
        movimientos: {
            tienda: { entrada: movTiendaEntrada, venta: 0, merma: 0, ajuste_transf: 0 },
            almacen: { entrada: movAlmacenEntrada, venta: 0, merma: 0, ajuste_transf: 0 }
        }
    };

    productos.push(newProduct);
    saveProductsToStorage(productos);
    saveNextIdToStorage(nextId);
    closeProductModal();
    renderTables();
}

function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
        productos = productos.filter(p => p.id !== id);
        saveProductsToStorage(productos);
        renderTables();
    }
}

function openEditModal(id, location) {
    const p = productos.find(x => x.id === id);
    if (!p) return;

    const locationName = location === 'tienda' ? 'Tienda' : 'Almacén';
    const otherLocation = location === 'tienda' ? 'almacen' : 'tienda';
    const otherLocationName = otherLocation === 'tienda' ? 'Tienda' : 'Almacén';

    document.getElementById('edit-product-id').value = id;
    document.getElementById('edit-location').value = location;
    document.getElementById('edit-codigo').value = p.codigo;
    document.getElementById('edit-nombre').value = p.nombre;
    document.getElementById('edit-unidad').value = p.unidad;
    document.getElementById('edit-precio').value = p.precio;

    // Movimientos de la ubicación actual
    document.getElementById('edit-mov-entrada').value = p.movimientos[location].entrada;
    document.getElementById('edit-mov-venta').value = p.movimientos[location].venta;
    document.getElementById('edit-mov-merma').value = p.movimientos[location].merma;
    document.getElementById('edit-transfer-cantidad').value = 0;

    // Actualizar títulos
    document.getElementById('edit-location-title').textContent = `Movimientos de ${locationName}`;
    document.getElementById('edit-transfer-title').textContent = `Transferencia para ${otherLocationName}`;
    
    const currentStock = calculateStock(p, location);
    document.getElementById('edit-transfer-info').textContent = `Stock actual: ${currentStock} unidades`;

    document.getElementById('edit-modal').style.display = 'block';
    
    document.getElementById('edit-form').onsubmit = function(e) {
        e.preventDefault();
        saveEdit(id, location);
    };
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

function saveEdit(id, location) {
    const p = productos.find(x => x.id === id);
    if (!p) return;

    const otherLocation = location === 'tienda' ? 'almacen' : 'tienda';

    // Actualizar datos del producto
    p.codigo = document.getElementById('edit-codigo').value;
    p.nombre = document.getElementById('edit-nombre').value;
    p.unidad = document.getElementById('edit-unidad').value;
    p.precio = parseFloat(document.getElementById('edit-precio').value);

    // Actualizar movimientos de la ubicación actual
    p.movimientos[location].entrada = parseInt(document.getElementById('edit-mov-entrada').value) || 0;
    p.movimientos[location].venta = parseInt(document.getElementById('edit-mov-venta').value) || 0;
    p.movimientos[location].merma = parseInt(document.getElementById('edit-mov-merma').value) || 0;

    // Procesar transferencia automática (sin afectar entradas del origen)
    const transferCantidad = parseInt(document.getElementById('edit-transfer-cantidad').value) || 0;
    
    if (transferCantidad > 0) {
        const currentStock = calculateStock(p, location);
        
        if (transferCantidad > currentStock) {
            alert(`No hay suficiente stock para transferir. Stock disponible: ${currentStock}`);
            return;
        }

        // Restar del saldo total del origen (usando ajuste_transf)
        p.movimientos[location].ajuste_transf -= transferCantidad;
        
        // Sumar a la otra ubicación como entrada
        p.movimientos[otherLocation].entrada += transferCantidad;
    }

    saveProductsToStorage(productos);
    closeEditModal();
    renderTables();
}

// --- Funciones de Reporte e Impresión ---

function generateReport(location) {
    let html = `
        <div class="report-container">
            <div class="report-title">
                Reporte de Inventario - ${location === 'tienda' ? 'TIENDA' : 'ALMACÉN'}
            </div>
            <div class="report-section">
                <h3>Detalle de Productos</h3>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Unidad</th>
                            <th>Precio</th>
                            <th>Entrada</th>
                            <th>Venta</th>
                            <th>Merma</th>
                            <th>Saldo</th>
                            <th>Valor Total</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    let totalEntrada = 0, totalVenta = 0, totalMerma = 0, totalSaldo = 0, totalValor = 0;

    productos.forEach(p => {
        const mov = p.movimientos[location];
        const stock = calculateStock(p, location);
        const valorTotal = stock * p.precio;

        totalEntrada += mov.entrada;
        totalVenta += mov.venta;
        totalMerma += mov.merma;
        totalSaldo += stock;
        totalValor += valorTotal;

        html += `
            <tr>
                <td>${p.codigo}</td>
                <td>${p.nombre}</td>
                <td>${p.unidad}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${mov.entrada}</td>
                <td>${mov.venta}</td>
                <td>${mov.merma}</td>
                <td>${stock}</td>
                <td>$${valorTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    // Calcular dinero por ventas
    let dineroPorVentas = 0;
    productos.forEach(p => {
        dineroPorVentas += p.movimientos[location].venta * p.precio;
    });

    html += `
                    </tbody>
                    <tfoot>
                        <tr style="font-weight: bold; background-color: #ecf0f1;">
                            <td colspan="4">TOTALES</td>
                            <td>${totalEntrada}</td>
                            <td>${totalVenta}</td>
                            <td>${totalMerma}</td>
                            <td>${totalSaldo}</td>
                            <td>$${totalValor.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div class="report-section">
                <h3>Resumen Financiero</h3>
                <div class="summary-box">
                    <p><strong>Dinero por Ventas Realizadas:</strong> $${dineroPorVentas.toFixed(2)}</p>
                    <p><strong>Valor Total en Inventario:</strong> $${totalValor.toFixed(2)}</p>
                    <p><strong>Cantidad Total de Productos:</strong> ${totalSaldo} unidades</p>
                </div>
            </div>

            <div class="report-section">
                <h3>Resumen de Movimientos</h3>
                <div class="summary-box">
                    <p><strong>Total Entradas:</strong> ${totalEntrada} unidades</p>
                    <p><strong>Total Ventas:</strong> ${totalVenta} unidades</p>
                    <p><strong>Total Mermas:</strong> ${totalMerma} unidades</p>
                    <p><strong>Saldo Final:</strong> ${totalSaldo} unidades</p>
                </div>
            </div>
        </div>
    `;

    return html;
}

function printTable(location) {
    const reportHTML = generateReport(location);
    const printArea = document.getElementById('print-area');
    
    // Obtener la tabla actual
    const tableId = location === 'tienda' ? 'table-tienda' : 'table-almacen';
    const table = document.getElementById(tableId);
    
    printArea.innerHTML = `
        <h2 style="text-align: center;">${location === 'tienda' ? 'INVENTARIO TIENDA' : 'INVENTARIO ALMACÉN'}</h2>
        ${table.outerHTML}
        ${reportHTML}
    `;
    
    window.print();
}

// --- Funciones de Utilidad ---

function syncData() {
    alert("Iniciando sincronización de red de datos...\\nActualizando tablas en otros dispositivos...");
    console.log("Datos sincronizados:", productos);
}

function exportData() {
    exportProductsToJSON(productos);
}

function importData(event) {
    const file = event.target.files[0];
    if (file) {
        importProductsFromJSON(file, function(importedProducts) {
            productos = importedProducts;
            nextId = Math.max(...productos.map(p => p.id)) + 1;
            saveNextIdToStorage(nextId);
            renderTables();
        });
    }
}

// Guardar cambios automáticamente
window.addEventListener('beforeunload', function() {
    saveProductsToStorage(productos);
    saveNextIdToStorage(nextId);
});

// Inicializar
renderTables();
