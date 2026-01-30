// Módulo de Almacenamiento Persistente
// Permite guardar y cargar los productos desde localStorage

const STORAGE_KEY = 'inventario_productos';
const NEXT_ID_KEY = 'inventario_next_id';

/**
 * Guarda los productos en localStorage
 * @param {Array} productos - Array de productos
 */
function saveProductsToStorage(productos) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(productos));
        console.log('Productos guardados en localStorage');
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
        alert('Error al guardar los datos. Verifica el espacio disponible.');
    }
}

/**
 * Carga los productos desde localStorage
 * @returns {Array} Array de productos o array vacío si no hay datos
 */
function loadProductsFromStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error al cargar de localStorage:', error);
        return [];
    }
}

/**
 * Guarda el siguiente ID disponible
 * @param {Number} nextId - Siguiente ID a usar
 */
function saveNextIdToStorage(nextId) {
    try {
        localStorage.setItem(NEXT_ID_KEY, nextId.toString());
    } catch (error) {
        console.error('Error al guardar nextId:', error);
    }
}

/**
 * Carga el siguiente ID disponible
 * @returns {Number} Siguiente ID o 1 si no hay datos
 */
function loadNextIdFromStorage() {
    try {
        const data = localStorage.getItem(NEXT_ID_KEY);
        return data ? parseInt(data) : 1;
    } catch (error) {
        console.error('Error al cargar nextId:', error);
        return 1;
    }
}

/**
 * Exporta los productos a un archivo JSON
 * @param {Array} productos - Array de productos
 */
function exportProductsToJSON(productos) {
    const dataStr = JSON.stringify(productos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventario_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Importa productos desde un archivo JSON
 * @param {File} file - Archivo JSON
 * @param {Function} callback - Función a ejecutar después de importar
 */
function importProductsFromJSON(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const productos = JSON.parse(e.target.result);
            if (Array.isArray(productos)) {
                saveProductsToStorage(productos);
                callback(productos);
                alert('Productos importados correctamente');
            } else {
                alert('Formato de archivo inválido');
            }
        } catch (error) {
            console.error('Error al importar:', error);
            alert('Error al importar el archivo');
        }
    };
    reader.readAsText(file);
}

/**
 * Limpia todos los datos del almacenamiento
 */
function clearStorage() {
    if (confirm('¿Estás seguro de que deseas borrar todos los datos? Esta acción no se puede deshacer.')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(NEXT_ID_KEY);
        console.log('Almacenamiento limpiado');
    }
}
