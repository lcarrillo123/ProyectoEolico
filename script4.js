// Variables globales para la turbina
let isRotating = true;
let rotationSpeed = 4; // segundos por vuelta completa

// Control de rotación de la turbina
document.getElementById('toggle-animation').addEventListener('click', function() {
    const rotor = document.querySelector('.turbine-rotor');
    isRotating = !isRotating;
    
    if (isRotating) {
        rotor.classList.add('rotating');
        this.textContent = '⏸️ Pausar Rotación';
    } else {
        rotor.classList.remove('rotating');
        this.textContent = '▶️ Iniciar Rotación';
    }
});

// Control de velocidad del viento
document.getElementById('wind-slider').addEventListener('input', function() {
    const windSpeed = this.value;
    document.getElementById('wind-speed').textContent = windSpeed + ' km/h';
    
    // Ajustar velocidad de rotación según viento
    const rotor = document.querySelector('.turbine-rotor');
    rotationSpeed = Math.max(1, 8 - (windSpeed / 10));
    rotor.style.animationDuration = rotationSpeed + 's';
    
    // Ajustar potencia generada
    const powerPercent = Math.min(100, (windSpeed / 50) * 100);
    const powerMW = (windSpeed / 50) * 3.5; // 3.5MW máximo
    document.getElementById('power-output').style.width = powerPercent + '%';
    document.getElementById('power-value').textContent = powerMW.toFixed(1) + ' MW';
});

// Interactividad con las partes de la turbina
document.querySelectorAll('[data-part]').forEach(part => {
    part.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const partName = this.getAttribute('data-part');
        const infoPanel = document.getElementById('info-panel');
        
        // Obtener información específica
        let info = '';
        switch(partName) {
            case 'tower':
                info = `
                    <h3>🏗️ Torre de Soporte</h3>
                    <p><strong>Altura:</strong> 80-120 metros</p>
                    <p><strong>Material:</strong> Acero reforzado con recubrimiento anticorrosión</p>
                    <p><strong>Función:</strong> Soporta el peso de la góndola y las palas, proporciona altura para captar vientos más fuertes</p>
                    <p><strong>Peso:</strong> 200-300 toneladas</p>
                `;
                break;
            case 'nacelle':
                info = `
                    <h3>⚙️ Góndola</h3>
                    <p><strong>Contiene:</strong> Generador, multiplicadora, sistema de control</p>
                    <p><strong>Peso:</strong> 50-100 toneladas</p>
                    <p><strong>Función:</strong> Convertir energía cinética del rotor en electricidad</p>
                    <p><strong>Tecnología:</strong> Generador síncrono de imanes permanentes</p>
                `;
                break;
            case 'rotor':
                info = `
                    <h3>🌀 Rotor</h3>
                    <p><strong>Diámetro:</strong> 80-120 metros</p>
                    <p><strong>Velocidad:</strong> 10-20 RPM (rotaciones por minuto)</p>
                    <p><strong>Función:</strong> Capturar la energía cinética del viento</p>
                    <p><strong>Eficiencia:</strong> 35-45% conversión de energía</p>
                `;
                break;
            case 'blade1':
            case 'blade2':
            case 'blade3':
                info = `
                    <h3>🍃 Pala ${partName.slice(-1)}</h3>
                    <p><strong>Longitud:</strong> 40-60 metros</p>
                    <p><strong>Material:</strong> Fibra de vidrio con núcleo de espuma</p>
                    <p><strong>Forma:</strong> Perfil aerodinámico tipo ala de avión</p>
                    <p><strong>Peso:</strong> 8-15 toneladas por pala</p>
                    <p><strong>Función:</strong> Convertir energía del viento en rotación mecánica</p>
                `;
                break;
            case 'yaw':
                info = `
                    <h3>🧭 Sistema de Orientación</h3>
                    <p><strong>Función:</strong> Orientar la turbina hacia la dirección del viento</p>
                    <p><strong>Tecnología:</strong> Motores eléctricos + sensores de dirección</p>
                    <p><strong>Precisión:</strong> ±2 grados de error</p>
                    <p><strong>Velocidad de giro:</strong> 0.5 grados/segundo</p>
                `;
                break;
        }
        
        infoPanel.innerHTML = info;
    });
});

// Inicializar rotación
document.addEventListener('DOMContentLoaded', function() {
    const rotor = document.querySelector('.turbine-rotor');
    rotor.classList.add('rotating');
});

// Función mejorada para CSV con formato de tabla
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
        
        // Mostrar la tabla en la sección de inicio
        document.getElementById('csv-content').style.display = 'block';
    };
    reader.readAsText(file, 'UTF-8');
}

// Función para mostrar tabla con formato mejorado
function mostrarTablaCSV() {
    if (csvData.length === 0) return;
    
    const tableHead = document.getElementById('csvTableHead');
    const tableBody = document.getElementById('csvTableBody');
    
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';
    
    // Crear encabezados
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

// Función para ordenar tabla por columna
function ordenarPorColumna(columna) {
    csvData.sort((a, b) => {
        if (typeof a[columna] === 'number') {
            return a[columna] - b[columna];
        }
        return a[columna].localeCompare(b[columna]);
    });
    mostrarPagina();
}