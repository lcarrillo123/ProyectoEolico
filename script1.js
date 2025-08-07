// Mostrar secciones según el menú
document.querySelectorAll('#menu a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const id = this.getAttribute('href').substring(1);
        document.querySelectorAll('.seccion').forEach(sec => sec.classList.add('oculto'));
        const destino = document.getElementById(id);
        if (destino) destino.classList.remove('oculto');
    });
});

// Validación del formulario
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (!nombre || !correo || !mensaje) {
        document.getElementById('mensajeForm').textContent = 'Todos los campos son obligatorios.';
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        document.getElementById('mensajeForm').textContent = 'Correo inválido.';
        return;
    }

    document.getElementById('mensajeForm').textContent = 'Mensaje enviado con éxito.';
    this.reset();
});

// Calculadora de consumo
function calcularConsumo() {
    const mensual = parseFloat(document.getElementById('consumoMensual').value);
    if (isNaN(mensual)) {
        document.getElementById('resultadoConsumo').textContent = 'Ingrese un valor válido.';
        return;
    }
    const anual = mensual * 12;
    document.getElementById('resultadoConsumo').textContent = `Consumo anual: ${anual} kWh`;
}

// Procesar CSV
let datosCSV = [];

function procesarCSV() {
    const file = document.getElementById('archivoCSV').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const lines = e.target.result.split('\n');
        datosCSV = lines.map(line => line.split(','));
        mostrarTabla(datosCSV);
    };
    reader.readAsText(file);
}

function mostrarTabla(data) {
    const tabla = document.getElementById('tablaCSV');
    tabla.innerHTML = '';
    data.forEach((row, i) => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement(i === 0 ? 'th' : 'td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tabla.appendChild(tr);
    });
}

// Gráficos con Chart.js
let graficoActual = null;

function mostrarGrafico(tipo) {
    const ctx = document.getElementById('graficoCanvas').getContext('2d');

    if (graficoActual) graficoActual.destroy();

    if (!datosCSV.length) {
        alert('Primero carga un archivo CSV.');
        return;
    }

    const labels = datosCSV.slice(1).map(row => row[0]);
    const valores = datosCSV.slice(1).map(row => parseFloat(row[1]));

    let config;

    switch (tipo) {
        case 'torta':
            config = {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: valores,
                        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff']
                    }]
                }
            };
            break;
        case 'linea':
            config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Línea',
                        data: valores,
                        borderColor: '#36a2eb',
                        fill: false
                    }]
                }
            };
            break;
        case 'barras':
            config = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Barras',
                        data: valores,
                        backgroundColor: '#4bc0c0'
                    }]
                }
            };
            break;
    }

    graficoActual = new Chart(ctx, config);
}