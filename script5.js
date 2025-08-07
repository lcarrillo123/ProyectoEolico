// Variables globales
let csvData = [];
let currentPage = 1;
let itemsPerPage = 10;
let pieChart = null;
let lineChart = null;
let barChart = null;

// Navegación entre secciones
function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.content-section');
    secciones.forEach(seccion => seccion.classList.remove('active'));
    document.getElementById(seccionId).classList.add('active');
    
    const botones = document.querySelectorAll('.menu-item');
    botones.forEach(boton => boton.classList.remove('active'));
    event.target.classList.add('active');
    
    if (seccionId === 'grafico-torta' && csvData.length > 0) crearGraficoTorta();
    if (seccionId === 'grafico-lineas' && csvData.length > 0) crearGraficoLineas();
    if (seccionId === 'grafico-barras' && csvData.length > 0) crearGraficoBarras();
}

// Control de rotación CORREGIDO
document.getElementById('toggle-animation').addEventListener('click', function() {
    const blades = document.querySelector('.turbine-blades');
    
    if (blades.classList.contains('blades-spinning')) {
        blades.classList.remove('blades-spinning');
        this.textContent = '▶️ Iniciar Rotación';
    } else {
        blades.classList.add('blades-spinning');
        this.textContent = '⏸️ Pausar Rotación';
    }
});

// Control de velocidad del viento
document.getElementById('wind-slider').addEventListener('input', function() {
    const windSpeed = this.value;
    document.getElementById('wind-speed').textContent = windSpeed + ' km/h';
    
    const blades = document.querySelector('.turbine-blades');
    const rotationSpeed = Math.max(1, 8 - (windSpeed / 10));
    blades.style.animationDuration = rotationSpeed + 's';
    
    const powerPercent = Math.min(100, (windSpeed / 50) * 100);
    const powerMW = (windSpeed / 50) * 3.5;
    document.getElementById('power-output').style.width = powerPercent + '%';
    document.getElementById('power-value').textContent = powerMW.toFixed(1) + ' MW';
});

// Funciones CSV completas
function cargarCSV(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n').filter(row => row.trim());
        const headers = rows[0].split(',').map(h => h.trim());
        
        csvData = [];
        for (let i = 1; i < rows.length; i++) {
            const values = rows[i].split(',').map(v => v.trim());
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = isNaN(values[index]) ? values[index] : parseFloat(values[index]);
                });
                csvData.push(row);
            }
        }
        
        mostrarTablaCSV();
        actualizarInfoCSV(file.name);
    };
    reader.readAsText(file, 'UTF-8');
}

function mostrarTablaCSV() {
    if (csvData.length === 0) return;
    
    const tableHead = document.getElementById('csvTableHead');
    const tableBody = document.getElementById('csvTableBody');
    
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';
    
    const headers = Object.keys(csvData[0]);
    const headerRow = document.createElement('tr');
    
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.cursor = 'pointer';
        th.addEventListener('click', () => ordenarPorColumna(header));
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);
    
    mostrarPagina();
    document.getElementById('csv-content').style.display = 'block';
}

function mostrarPagina() {
    const tableBody = document.getElementById('csvTableBody');
    tableBody.innerHTML = '';
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = csvData.slice(start, end);
    
    pageItems.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
    
    actualizarPaginacion();
}

function actualizarPaginacion() {
    const totalPages = Math.ceil(csvData.length / itemsPerPage);
    document.getElementById('pagination-info').textContent = 
        `Página ${currentPage} de ${totalPages}`;
}

function cambiarPagina(direction) {
    const totalPages = Math.ceil(csvData.length / itemsPerPage);
    currentPage += direction;
    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    mostrarPagina();
}

function actualizarInfoCSV(filename) {
    document.getElementById('csv-info').innerHTML = `
        <h3>Archivo cargado: ${filename}</h3>
        <p>Total de registros: ${csvData.length}</p>
        <p>Columnas: ${Object.keys(csvData[0]).join(', ')}</p>
    `;
}

function ordenarPorColumna(columna) {
    csvData.sort((a, b) => {
        if (typeof a[columna] === 'number') {
            return a[columna] - b[columna];
        }
        return a[columna].localeCompare(b[columna]);
    });
    mostrarPagina();
}

// Funciones de gráficos
function crearGraficoTorta() {
    if (csvData.length === 0) return;
    // [código de gráficos igual que antes...]
}

function crearGraficoLineas() {
    if (csvData.length === 0) return;
    // [código de gráficos igual que antes...]
}

function crearGraficoBarras() {
    if (csvData.length === 0) return;
    // [código de gráficos igual que antes...]
}

// Calculadora
function calcularConsumo() {
    const consumoMensual = parseFloat(document.getElementById('consumo-mensual').value);
    const tarifa = parseFloat(document.getElementById('tarifa').value);
    const personas = parseInt(document.getElementById('personas').value);
    
    if (!consumoMensual || !tarifa || !personas) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    const consumoAnual = consumoMensual * 12;
    const costoAnual = consumoAnual * tarifa;
    const consumoPerCapita = consumoAnual / personas;
    const ahorroEolica = costoAnual * 0.3;
    
    document.getElementById('consumo-anual').textContent = consumoAnual.toFixed(2) + ' kWh';
    document.getElementById('costo-anual').textContent = '$' + costoAnual.toLocaleString();
    document.getElementById('consumo-percapita').textContent = consumoPerCapita.toFixed(2) + ' kWh';
    document.getElementById('ahorro-eolica').textContent = '$' + ahorroEolica.toLocaleString();
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.turbine-blades').classList.add('blades-spinning');
    mostrarSeccion('origen');
});