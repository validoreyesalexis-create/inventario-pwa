// Estructura de datos inicial
let inventory = JSON.parse(localStorage.getItem('myInventory')) || [
    { code: '001', name: 'Taza Blanca', price: 10, almacen: { stock: 100, entries: 0, outT1: 0, outT2: 0, outOther: 0, waste: 0 }, t1: { stock: 0, entries: 0, inAlm: 0, inT2: 0, outAlm: 0, outSale: 0, outT2: 0, outOther: 0, waste: 0 }, t2: { stock: 0, entries: 0, inAlm: 0, inT1: 0, outAlm: 0, outSale: 0, outT1: 0, outOther: 0, waste: 0 } },
    { code: '002', name: 'Plato Cerámica', price: 15, almacen: { stock: 50, entries: 0, outT1: 0, outT2: 0, outOther: 0, waste: 0 }, t1: { stock: 0, entries: 0, inAlm: 0, inT2: 0, outAlm: 0, outSale: 0, outT2: 0, outOther: 0, waste: 0 }, t2: { stock: 0, entries: 0, inAlm: 0, inT1: 0, outAlm: 0, outSale: 0, outT1: 0, outOther: 0, waste: 0 } }
];

let currentTab = 'almacen';

// Guardado automático
function saveData() {
    localStorage.setItem('myInventory', JSON.stringify(inventory));
    renderTable();
}

// Cambiar de pestaña
function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    document.getElementById('current-view-title').innerText = tab.toUpperCase();
    renderTable();
}

// Lógica de Sincronización Automática
function updateValue(code, field, value, page) {
    const p = inventory.find(i => i.code === code);
    const val = parseFloat(value) || 0;
    
    p[page][field] = val;

    // Sincronización Bidireccional
    if (page === 'almacen') {
        if (field === 'outT1') p.t1.inAlm = val;
        if (field === 'outT2') p.t2.inAlm = val;
    } else if (page === 't1') {
        if (field === 'outAlm') p.almacen.entries = val; // Ejemplo de retorno
        if (field === 'outT2') p.t2.inT1 = val;
    } else if (page === 't2') {
        if (field === 'outAlm') p.almacen.entries = val;
        if (field === 'outT1') p.t1.inT2 = val;
    }

    saveData();
}

function renderTable() {
    const table = document.getElementById('inventory-table');
    let html = '';

    if (currentTab === 'almacen') {
        html = `<tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Saldo Inicial</th><th class="col-entry">Entradas</th><th class="col-exit">Salida T1</th><th class="col-exit">Salida T2</th><th class="col-exit">Mermas</th><th class="col-final">Saldo Final</th><th class="col-final">Valor Total</th><th>Acción</th></tr>`;
        inventory.forEach(p => {
            const finalStock = p.almacen.stock + p.almacen.entries - (p.almacen.outT1 + p.almacen.outT2 + p.almacen.outOther + p.almacen.waste);
            html += `<tr>
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td>$${p.price}</td>
                <td><input type="number" class="editable-input" value="${p.almacen.stock}" onchange="updateValue('${p.code}', 'stock', this.value, 'almacen')"></td>
                <td class="col-entry"><input type="number" class="editable-input" value="${p.almacen.entries}" onchange="updateValue('${p.code}', 'entries', this.value, 'almacen')"></td>
                <td class="col-exit"><input type="number" class="editable-input" value="${p.almacen.outT1}" onchange="updateValue('${p.code}', 'outT1', this.value, 'almacen')"></td>
                <td class="col-exit"><input type="number" class="editable-input" value="${p.almacen.outT2}" onchange="updateValue('${p.code}', 'outT2', this.value, 'almacen')"></td>
                <td class="col-exit"><input type="number" class="editable-input" value="${p.almacen.waste}" onchange="updateValue('${p.code}', 'waste', this.value, 'almacen')"></td>
                <td class="col-final">${finalStock}</td>
                <td class="col-final">$${(finalStock * p.price).toFixed(2)}</td>
                <td><button class="btn-delete" onclick="deleteProduct('${p.code}')">🗑</button></td>
            </tr>`;
        });
    } else {
        // Render para Tiendas (T1 y T2 comparten estructura similar)
        const t = currentTab; 
        html = `<tr><th>Código</th><th>Nombre</th><th>Precio</th><th>Saldo Inicial</th><th class="col-entry">Entrada Alm.</th><th class="col-exit">Salida Venta</th><th class="col-exit">Mermas</th><th class="col-final">Saldo Final</th><th class="col-final">Valor Final</th><th>Acción</th></tr>`;
        inventory.forEach(p => {
            const finalStock = p[t].stock + p[t].entries + p[t].inAlm + p[t].inT2 + p[t].inT1 - (p[t].outAlm + p[t].outSale + p[t].outT2 + p[t].outT1 + p[t].outOther + p[t].waste);
            html += `<tr>
                <td>${p.code}</td>
                <td>${p.name}</td>
                <td>$${p.price}</td>
                <td><input type="number" class="editable-input" value="${p[t].stock}" onchange="updateValue('${p.code}', 'stock', this.value, '${t}')"></td>
                <td class="col-entry">${p[t].inAlm || 0}</td>
                <td class="col-exit"><input type="number" class="editable-input" value="${p[t].outSale}" onchange="updateValue('${p.code}', 'outSale', this.value, '${t}')"></td>
                <td class="col-exit"><input type="number" class="editable-input" value="${p[t].waste}" onchange="updateValue('${p.code}', 'waste', this.value, '${t}')"></td>
                <td class="col-final">${finalStock}</td>
                <td class="col-final">$${(finalStock * p.price).toFixed(2)}</td>
                <td><button class="btn-delete" onclick="deleteProduct('${p.code}')">🗑</button></td>
            </tr>`;
        });
    }
    table.innerHTML = html;
    calculateSummary();
}

function calculateSummary() {
    let totalQty = 0;
    let totalVal = 0;
    inventory.forEach(p => {
        const stock = p[currentTab].stock + (p[currentTab].entries || 0) + (p[currentTab].inAlm || 0) - (p[currentTab].outSale || 0 + p[currentTab].waste || 0);
        totalQty += stock;
        totalVal += (stock * p.price);
    });
    document.getElementById('total-qty').innerText = totalQty;
    document.getElementById('total-value').innerText = `$${totalVal.toFixed(2)}`;
}

// Añadir Producto
document.getElementById('product-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newP = {
        code: document.getElementById('p-code').value,
        name: document.getElementById('p-name').value,
        price: parseFloat(document.getElementById('p-price').value),
        almacen: { stock: parseInt(document.getElementById('p-stock').value), entries: 0, outT1: 0, outT2: 0, outOther: 0, waste: 0 },
        t1: { stock: 0, entries: 0, inAlm: 0, inT2: 0, outAlm: 0, outSale: 0, outT2: 0, outOther: 0, waste: 0 },
        t2: { stock: 0, entries: 0, inAlm: 0, inT1: 0, outAlm: 0, outSale: 0, outT1: 0, outOther: 0, waste: 0 }
    };
    inventory.push(newP);
    saveData();
    e.target.reset();
});

function deleteProduct(code) {
    inventory = inventory.filter(p => p.code !== code);
    saveData();
}

function filterTable() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const rows = document.querySelectorAll('#inventory-table tr:not(:first-child)');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}

// Inicio
renderTable();