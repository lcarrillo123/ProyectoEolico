// Variables globales
let csvData = null;
let currentPage = 1;
let rowsPerPage = 10;
let pieChart = null;
let lineChart = null;
let barChart = null;

// Datos de componentes del molino
const componentData = {
    tower: {
        title: "Torre",
        description: "La torre es la estructura principal que soporta todo el aerogenerador. Está diseñada para resistir fuertes vientos y cargas dinámicas, elevando la góndola y el rotor a la altura óptima para capturar el viento.",
        material: "Acero galvanizado",
        weight: "150-300 toneladas",
        dimensions: "80-120m altura",
        lifespan: "20-25 años"
    },
    nacelle: {
        title: "Góndola",
        description: "La góndola aloja todos los componentes principales del aerogenerador: el generador, la caja de cambios, el sistema de frenos, y los sistemas de control. Es el 'corazón' del aerogenerador.",
        material: "Fibra de vidrio reforzada",
        weight: "70-100 toneladas",
        dimensions: "10x4x4 metros",
        lifespan: "20 años"
    },
    rotor: {
        title: "Rotor",
        description: "El rotor incluye el buje y las palas. Es responsable de capturar la energía cinética del viento y convertirla en energía rotacional que luego se transmite al generador.",
        material: "Fibra de carbono y vidrio",
        weight: "35-50 toneladas",
        dimensions: "90-150m diámetro",
        lifespan: "20-25 años"
    },
    yaw: {
        title: "Sistema de Orientación (Yaw)",
        description: "El sistema de orientación permite que el rotor se alinee automáticamente con la dirección del viento para maximizar la captura de energía. Incluye motores y sensores de dirección del viento.",
        material: "Acero y componentes electrónicos",
        weight: "5-8 toneladas",
        dimensions: "Variable según modelo",
        lifespan: "15-20 años"
    },
    control: {
        title: "Sistema de Control",
        description: "El sistema de control monitorea y controla todos los aspectos del funcionamiento del aerogenerador: velocidad del rotor, ángulo de las palas, orientación, y seguridad operacional.",
        material: "Componentes electrónicos",
        weight: "500-1000 kg",
        dimensions: "2x1.5x2 metros",
        lifespan: "10-15 años"
    },
    blade1: {
        title: "Palas del Aerogenerador",
        description: "Las palas están diseñadas aerodinámicamente para capturar eficientemente la energía del viento. Su ángulo puede ajustarse para optimizar el rendimiento según las condiciones del viento.",
        material: "Fibra de vidrio y carbono",
        weight: "6-12 toneladas c/u",
        dimensions: "40-80m longitud",
        lifespan: "20-25 años"
    },
    blade2: {
        title: "Palas del Aerogenerador",
        description: "Las palas están diseñadas aerodinámicamente para capturar eficientemente la energía del viento. Su ángulo puede ajustarse para optimizar el rendimiento según las condiciones del viento.",
        material: "Fibra de vidrio y carbono",
        weight: "6-12 toneladas c/u",
        dimensions: "40-80m longitud",
        lifespan: "20-25 años"
    },
    blade3: {
        title: "Palas del Aerogenerador",
        description: "Las palas están diseñadas aerodinámicamente para capturar eficientemente la energía del viento. Su ángulo puede ajustarse para optimizar el rendimiento según las condiciones del viento.",
        material: "Fibra de vidrio y carbono",
        weight: "6-12 toneladas c/u",
        dimensions: "40-80m longitud",
        lifespan: "20-25 años"
    }
};

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Configurar eventos para componentes del molino
    setupWindmillInteractivity();
    
    // Configurar controles del molino
    setupWindmillControls();
    
    // Configurar animación principal
    setupMainAnimation();
    
    // Configurar drag and drop para CSV
    setupDragAndDrop();
    
    // Inicializar gráficos
    initializeCharts();
    
    // Configurar formulario de contacto
    setupContactForm();
    
    console.log('Aplicación inicializada correctamente');
}

// Función para mostrar secciones
function mostrarSeccion(seccionId) {
    // Ocultar todas las secciones
    const secciones = document.querySelectorAll('.content-section');
    secciones.forEach(seccion => {
        seccion.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const seccionActiva = document.getElementById(seccionId);
    if (seccionActiva) {
        seccionActiva.classList.add('active');
    }
    
    // Actualizar botones del menú
    const botones = document.querySelectorAll('.menu-item');
    botones.forEach(boton => {
        boton.classList.remove('active');
    });
    
    // Marcar el botón activo
    event.target.classList.add('active');
}

// Configurar interactividad del molino
function setupWindmillInteractivity() {
    // Componentes interactivos del molino
    const components = document.querySelectorAll('[data-component]');
    
    components.forEach(component => {
        component.addEventListener('click', function() {
            const componentType = this.getAttribute('data-component');
            showComponentInfo(componentType);
            highlightComponent(this);
        });
        
        component.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform.replace('scale(1)', 'scale(1.1)');
            if (!this.style.transform.includes('scale')) {
                this.style.transform += ' scale(1.1)';
            }
            this.style.filter = 'brightness(1.2)';
        });
        
        component.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(/scale\([^)]*\)/g, 'scale(1)');
            this.style.filter = 'brightness(1)';
        });
    });
    
    // Tarjetas de componentes
    const componentCards = document.querySelectorAll('.component-card');
    componentCards.forEach(card => {
        card.addEventListener('click', function() {
            const componentType = this.getAttribute('data-component');
            showComponentInfo(componentType);
            highlightComponentInDiagram(componentType);
        });
    });
}

function showComponentInfo(componentType) {
    const component = componentData[componentType];
    if (!component) return;
    
    // Actualizar información del componente
    document.getElementById('component-title').textContent = component.title;
    document.getElementById('component-description').textContent = component.description;
    document.getElementById('spec-material').textContent = component.material;
    document.getElementById('spec-weight').textContent = component.weight;
    document.getElementById('spec-dimensions').textContent = component.dimensions;
    document.getElementById('spec-lifespan').textContent = component.lifespan;
    
    // Añadir efecto visual
    const panel = document.querySelector('.component-info-panel');
    panel.style.transform = 'scale(1.02)';
    panel.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.25)';
    
    setTimeout(() => {
        panel.style.transform = 'scale(1)';
        panel.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
    }, 300);
}

function highlightComponent(element) {
    // Remover highlight anterior
    document.querySelectorAll('[data-component]').forEach(comp => {
        comp.style.boxShadow = '';
        comp.style.border = '';
    });
    
    // Highlight elemento actual
    element.style.boxShadow = '0 0 20px #FFD700, 0 0 30px #FFD700';
    element.style.border = '2px solid #FFD700';
    
    setTimeout(() => {
        element.style.boxShadow = '';
        element.style.border = '';
    }, 3000);
}

function highlightComponentInDiagram(componentType) {
    const diagramComponent = document.querySelector(`[data-component="${componentType}"]`);
    if (diagramComponent) {
        highlightComponent(diagramComponent);
    }
}

// Configurar controles del molino
function setupWindmillControls() {
    const windSpeedSlider = document.getElementById('wind-speed');
    const bladeAngleSlider = document.getElementById('blade-angle');
    const startBtn = document.getElementById('start-turbine');
    const stopBtn = document.getElementById('stop-turbine');
    const emergencyBtn = document.getElementById('emergency-stop');
    
    // Control de velocidad del viento
    if (windSpeedSlider) {
        windSpeedSlider.addEventListener('input', function() {
            const value = this.value;
            document.getElementById('wind-speed-value').textContent = value + ' m/s';
            updateTurbinePerformance();
            adjustBladeSpeed(value);
        });
    }
    
    // Control de ángulo de palas
    if (bladeAngleSlider) {
        bladeAngleSlider.addEventListener('input', function() {
            const value = this.value;
            document.getElementById('blade-angle-value').textContent = value + '°';
            updateTurbinePerformance();
            adjustBladeAngle(value);
        });
    }
    
    // Botones de control
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            startTurbine();
        });
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', function() {
            stopTurbine();
        });
    }
    
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', function() {
            emergencyStop();
        });
    }
}

function updateTurbinePerformance() {
    const windSpeed = parseFloat(document.getElementById('wind-speed').value);
    const bladeAngle = parseFloat(document.getElementById('blade-angle').value);
    
    // Cálculos simplificados de rendimiento
    const baseRPM = Math.min(windSpeed * 1.5, 25);
    const efficiency = Math.max(0, 100 - (bladeAngle * 0.8));
    const power = (windSpeed * windSpeed * windSpeed * efficiency) / 10;
    const temperature = 20 + (power / 50);
    
    // Actualizar métricas
    document.getElementById('rotor-rpm').textContent = baseRPM.toFixed(1);
    document.getElementById('power-output').textContent = Math.round(power).toLocaleString();
    document.getElementById('efficiency').textContent = efficiency.toFixed(1);
    document.getElementById('temperature').textContent = temperature.toFixed(1);
}

function adjustBladeSpeed(windSpeed) {
    const blades = document.querySelector('.blade-assembly');
    if (blades) {
        const animationDuration = Math.max(0.5, 4 - (windSpeed * 0.15));
        blades.style.animationDuration = animationDuration + 's';
    }
}

function adjustBladeAngle(angle) {
    const blades = document.querySelectorAll('.blade-interactive');
    blades.forEach(blade => {
        blade.style.transform += ` rotateX(${angle}deg)`;
    });
}

function startTurbine() {
    const startBtn = document.getElementById('start-turbine');
    const stopBtn = document.getElementById('stop-turbine');
    
    startBtn.classList.add('active');
    stopBtn.classList.remove('active');
    
    // Reanudar animación
    const bladeAssembly = document.querySelector('.blade-assembly');
    if (bladeAssembly) {
        bladeAssembly.style.animationPlayState = 'running';
    }
    
    updateTurbinePerformance();
}

function stopTurbine() {
    const startBtn = document.getElementById('start-turbine');
    const stopBtn = document.getElementById('stop-turbine');
    
    startBtn.classList.remove('active');
    stopBtn.classList.add('active');
    
    // Pausar animación
    const bladeAssembly = document.querySelector('.blade-assembly');
    if (bladeAssembly) {
        bladeAssembly.style.animationPlayState = 'paused';
    }
    
    // Reset métricas
    document.getElementById('rotor-rpm').textContent = '0.0';
    document.getElementById('power-output').textContent = '0';
}

function emergencyStop() {
    stopTurbine();
    
    // Efecto visual de emergencia
    const emergencyBtn = document.getElementById('emergency-stop');
    emergencyBtn.style.animation = 'emergencyPulse 0.5s ease-in-out 3';
    
    // Alerta
    alert('¡PARADA DE EMERGENCIA ACTIVADA!\nTodos los sistemas han sido detenidos por seguridad.');
    
    setTimeout(() => {
        emergencyBtn.style.animation = '';
    }, 1500);
}

// Configurar animación principal
function setupMainAnimation() {
    const toggleBtn = document.getElementById('toggle-animation');
    let isAnimationPaused = false;
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            const animatedElements = document.querySelectorAll('.windmill-blades, .energy-particle, .window-light');
            
            if (isAnimationPaused) {
                animatedElements.forEach(el => {
                    el.style.animationPlayState = 'running';
                });
                this.textContent = '⏸️ Pausar Animación';
                isAnimationPaused = false;
            } else {
                animatedElements.forEach(el => {
                    el.style.animationPlayState = 'paused';
                });
                this.textContent = '▶️ Iniciar Animación';
                isAnimationPaused = true;
            }
        });
    }
}

// Configurar drag and drop para CSV
function setupDragAndDrop() {
    const uploadArea = document.getElementById('upload-area');
    
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.background = 'rgba(255, 255, 255, 0.3)';
            this.style.transform = 'scale(1.02)';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.transform = 'scale(1)';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.transform = 'scale(1)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                procesarArchivo(files[0]);
            }
        });
    }
}

// Función para cargar CSV
function cargarCSV(event) {
    const file = event.target.files[0];
    if (file) {
        procesarArchivo(file);
    }
}

function procesarArchivo(file) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
        alert('Por favor selecciona un archivo CSV válido.');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        parseCSV(csv, file.name);
    };
    reader.readAsText(file);
}

function parseCSV(csvText, fileName) {
    try {
        // Usar PapaParse para procesar el CSV
        const results = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            transformHeader: function(header) {
                return header.trim();
            }
        });
        
        if (results.errors.length > 0) {
            console.warn('Errores en el CSV:', results.errors);
        }
        
        csvData = results.data;
        mostrarInformacionCSV(fileName, csvData.length, Object.keys(csvData[0] || {}));
        mostrarTablaCSV();
        actualizarGraficos();
        
        // Mostrar contenido CSV
        document.getElementById('csv-content').style.display = 'block';
        
    } catch (error) {
        alert('Error al procesar el archivo CSV: ' + error.message);
        console.error('Error:', error);
    }
}

function mostrarInformacionCSV(fileName, rows, headers) {
    const infoDiv = document.getElementById('csv-info');
    infoDiv.innerHTML = `
        <div class="file-details">
            <h4>📁 ${fileName}</h4>
            <p><strong>Filas:</strong> ${rows.toLocaleString()}</p>
            <p><strong>Columnas:</strong> ${headers.length}</p>
            <div class="headers-list">
                <strong>Encabezados:</strong>
                <div class="headers-tags">
                    ${headers.map(header => `<span class="header-tag">${header}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Añadir estilos para los tags de encabezados
    const style = document.createElement('style');
    style.textContent = `
        .headers-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        .header-tag {
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        .file-details {
            padding: 1rem;
            background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.05));
            border-radius: 10px;
            border: 1px solid rgba(25, 118, 210, 0.2);
        }
    `;
    document.head.appendChild(style);
}

function mostrarTablaCSV() {
    if (!csvData || csvData.length === 0) return;
    
    const headers = Object.keys(csvData[0]);
    const thead = document.getElementById('csvTableHead');
    const tbody = document.getElementById('csvTableBody');
    
    // Crear encabezados
    thead.innerHTML = `
        <tr>
            ${headers.map(header => `<th>${header}</th>`).join('')}
        </tr>
    `;
    
    // Mostrar datos con paginación
    mostrarPaginaActual();
    actualizarPaginacion();
}

function mostrarPaginaActual() {
    if (!csvData || csvData.length === 0) return;
    
    const tbody = document.getElementById('csvTableBody');
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, csvData.length);
    const pageData = csvData.slice(startIndex, endIndex);
    
    const headers = Object.keys(csvData[0]);
    
    tbody.innerHTML = pageData.map((row, index) => `
        <tr>
            ${headers.map(header => {
                const value = row[header];
                const displayValue = value !== null && value !== undefined ? value : '-';
                return `<td>${displayValue}</td>`;
            }).join('')}
        </tr>
    `).join('');
}

function actualizarPaginacion() {
    if (!csvData || csvData.length === 0) return;
    
    const totalPages = Math.ceil(csvData.length / rowsPerPage);
    const paginationInfo = document.getElementById('pagination-info');
    
    paginationInfo.textContent = `Página ${currentPage} de ${totalPages} (${csvData.length} registros total)`;
    
    // Actualizar botones
    const prevBtn = document.querySelector('.pagination-btn:first-child');
    const nextBtn = document.querySelector('.pagination-btn:last-child');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

function cambiarPagina(direction) {
    const totalPages = Math.ceil(csvData.length / rowsPerPage);
    
    if (direction === 1 && currentPage < totalPages) {
        currentPage++;
    } else if (direction === -1 && currentPage > 1) {
        currentPage--;
    }
    
    mostrarPaginaActual();
    actualizarPaginacion();
}

// Funciones de exportación
function exportarCSV() {
    if (!csvData || csvData.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }
    
    const headers = Object.keys(csvData[0]);
    const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
            headers.map(header => {
                const value = row[header];
                // Escapar valores que contengan comas
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`;
                }
                return value !== null && value !== undefined ? value : '';
            }).join(',')
        )
    ].join('\n');
    
    descargarArchivo(csvContent, 'datos_procesados.csv', 'text/csv');
}

function exportarExcel() {
    if (!csvData || csvData.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }
    
    // Crear un CSV que Excel pueda abrir correctamente
    const headers = Object.keys(csvData[0]);
    const bom = '\uFEFF'; // BOM para UTF-8
    const csvContent = bom + [
        headers.join('\t'), // Usar tabs para separar columnas
        ...csvData.map(row => 
            headers.map(header => {
                const value = row[header];
                return value !== null && value !== undefined ? value : '';
            }).join('\t')
        )
    ].join('\n');
    
    descargarArchivo(csvContent, 'datos_procesados.xls', 'application/vnd.ms-excel');
}

function descargarArchivo(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function mostrarEstadisticas() {
    if (!csvData || csvData.length === 0) {
        alert('No hay datos para analizar.');
        return;
    }
    
    const headers = Object.keys(csvData[0]);
    const stats = {};
    
    headers.forEach(header => {
        const values = csvData.map(row => row[header]).filter(val => val !== null && val !== undefined && val !== '');
        const numericValues = values.filter(val => !isNaN(val) && val !== '').map(val => parseFloat(val));
        
        if (numericValues.length > 0) {
            stats[header] = {
                count: values.length,
                min: Math.min(...numericValues),
                max: Math.max(...numericValues),
                avg: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
                type: 'numeric'
            };
        } else {
            const uniqueValues = [...new Set(values)];
            stats[header] = {
                count: values.length,
                unique: uniqueValues.length,
                type: 'text',
                sample: uniqueValues.slice(0, 5)
            };
        }
    });
    
    mostrarModalEstadisticas(stats);
}

function mostrarModalEstadisticas(stats) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        position: relative;
    `;
    
    const statsHTML = Object.entries(stats).map(([header, stat]) => {
        if (stat.type === 'numeric') {
            return `
                <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <h4 style="color: #1976D2; margin-bottom: 1rem;">${header}</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
                        <div><strong>Registros:</strong> ${stat.count}</div>
                        <div><strong>Mínimo:</strong> ${stat.min.toFixed(2)}</div>
                        <div><strong>Máximo:</strong> ${stat.max.toFixed(2)}</div>
                        <div><strong>Promedio:</strong> ${stat.avg.toFixed(2)}</div>
                    </div>
                </div>
            `;
        } else {
            return `
                <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                    <h4 style="color: #1976D2; margin-bottom: 1rem;">${header}</h4>
                    <div><strong>Registros:</strong> ${stat.count}</div>
                    <div><strong>Valores únicos:</strong> ${stat.unique}</div>
                    <div><strong>Muestra:</strong> ${stat.sample.join(', ')}</div>
                </div>
            `;
        }
    }).join('');
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
            <h2 style="color: #1976D2;">📊 Estadísticas de los Datos</h2>
            <button onclick="this.closest('.modal').remove()" style="background: #f44336; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">✕ Cerrar</button>
        </div>
        ${statsHTML}
    `;
    
    modal.className = 'modal';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function imprimirTablaCSV() {
    if (!csvData || csvData.length === 0) {
        alert('No hay datos para imprimir.');
        return;
    }
    
    const headers = Object.keys(csvData[0]);
    const printContent = `
        <html>
        <head>
            <title>Datos CSV - Energía Eólica Colombia</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #1976D2; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #1976D2; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            </style>
        </head>
        <body>
            <h1>🌪️ Energía Eólica Colombia - Datos CSV</h1>
            <div class="info">
                <strong>Total de registros:</strong> ${csvData.length}<br>
                <strong>Columnas:</strong> ${headers.length}<br>
                <strong>Fecha de impresión:</strong> ${new Date().toLocaleString()}
            </div>
            <table>
                <thead>
                    <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
                </thead>
                <tbody>
                    ${csvData.map(row => `
                        <tr>${headers.map(h => `<td>${row[h] || '-'}</td>`).join('')}</tr>
                    `).join('')}
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Inicialización de gráficos
function initializeCharts() {
    // Datos de ejemplo para los gráficos
    const sampleData = {
        pie: {
            labels: ['Eólica', 'Solar', 'Hidráulica', 'Térmica', 'Nuclear'],
            data: [25, 20, 30, 20, 5],
            colors: ['#4CAF50', '#FFC107', '#2196F3', '#FF5722', '#9C27B0']
        },
        line: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Generación Eólica (GWh)',
                data: [45, 52, 48, 61, 55, 67, 73, 69, 58, 52, 48, 44],
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                tension: 0.4
            }]
        },
        bar: {
            labels: ['La Guajira', 'Atlántico', 'Magdalena', 'Cesar', 'Bolívar'],
            datasets: [{
                label: 'Capacidad Instalada (MW)',
                data: [180, 45, 32, 28, 15],
                backgroundColor: [
                    'rgba(76, 175, 80, 0.8)',
                    'rgba(33, 150, 243, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(255, 87, 34, 0.8)',
                    'rgba(156, 39, 176, 0.8)'
                ],
                borderColor: [
                    '#4CAF50',
                    '#2196F3',
                    '#FFC107',
                    '#FF5722',
                    '#9C27B0'
                ],
                borderWidth: 2
            }]
        }
    };
    
    // Inicializar gráfico de torta
    const pieCtx = document.getElementById('pieChart');
    if (pieCtx) {
        pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: sampleData.pie.labels,
                datasets: [{
                    data: sampleData.pie.data,
                    backgroundColor: sampleData.pie.colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return context.label + ': ' + percentage + '%';
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }
    
    // Inicializar gráfico de líneas
    const lineCtx = document.getElementById('lineChart');
    if (lineCtx) {
        lineChart = new Chart(lineCtx, {
            type: 'line',
            data: sampleData.line,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Generación (GWh)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Meses'
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                animation: {
                    tension: {
                        duration: 1000,
                        easing: 'linear',
                        from: 1,
                        to: 0,
                        loop: true
                    }
                }
            }
        });
    }
    
    // Inicializar gráfico de barras
    const barCtx = document.getElementById('barChart');
    if (barCtx) {
        barChart = new Chart(barCtx, {
            type: 'bar',
            data: sampleData.bar,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.raw + ' MW';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Capacidad (MW)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Departamentos'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutBounce'
                }
            }
        });
    }
}

// Funciones para actualizar gráficos
function actualizarGraficos() {
    if (csvData && csvData.length > 0) {
        actualizarGraficosConDatos();
    }
}

function actualizarGraficosConDatos() {
    const headers = Object.keys(csvData[0]);
    
    // Buscar columnas numéricas
    const numericColumns = headers.filter(header => {
        const sample = csvData.slice(0, 10).map(row => row[header]);
        return sample.some(val => !isNaN(val) && val !== null && val !== '');
    });
    
    if (numericColumns.length >= 2) {
        // Actualizar gráfico de líneas con datos reales
        const firstNumericCol = numericColumns[0];
        const values = csvData.map(row => parseFloat(row[firstNumericCol]) || 0);
        const labels = csvData.map((row, index) => `Registro ${index + 1}`);
        
        if (lineChart) {
            lineChart.data.labels = labels.slice(0, 20); // Limitar a 20 puntos
            lineChart.data.datasets[0].data = values.slice(0, 20);
            lineChart.data.datasets[0].label = firstNumericCol;
            lineChart.update();
        }
        
        // Actualizar gráfico de barras
        if (numericColumns.length >= 2 && barChart) {
            const secondNumericCol = numericColumns[1];
            const barValues = csvData.slice(0, 10).map(row => parseFloat(row[secondNumericCol]) || 0);
            const barLabels = csvData.slice(0, 10).map((row, index) => `Item ${index + 1}`);
            
            barChart.data.labels = barLabels;
            barChart.data.datasets[0].data = barValues;
            barChart.data.datasets[0].label = secondNumericCol;
            barChart.update();
        }
    }
}

function actualizarGraficoTorta() {
    if (pieChart) {
        // Generar datos aleatorios para demostración
        const newData = Array.from({length: 5}, () => Math.floor(Math.random() * 100) + 10);
        pieChart.data.datasets[0].data = newData;
        pieChart.update('active');
        
        // Efecto visual
        pieChart.canvas.style.transform = 'scale(1.05)';
        setTimeout(() => {
            pieChart.canvas.style.transform = 'scale(1)';
        }, 300);
    }
}

function actualizarGraficoLineas() {
    if (lineChart) {
        // Generar datos aleatorios para demostración
        const newData = lineChart.data.datasets[0].data.map(() => 
            Math.floor(Math.random() * 50) + 30
        );
        lineChart.data.datasets[0].data = newData;
        lineChart.update('active');
        
        // Efecto visual
        lineChart.canvas.style.transform = 'scale(1.05)';
        setTimeout(() => {
            lineChart.canvas.style.transform = 'scale(1)';
        }, 300);
    }
}

function actualizarGraficoBarras() {
    if (barChart) {
        // Generar datos aleatorios para demostración
        const newData = barChart.data.datasets[0].data.map(() => 
            Math.floor(Math.random() * 200) + 20
        );
        barChart.data.datasets[0].data = newData;
        barChart.update('active');
        
        // Efecto visual
        barChart.canvas.style.transform = 'scale(1.05)';
        setTimeout(() => {
            barChart.canvas.style.transform = 'scale(1)';
        }, 300);
    }
}

function descargarGrafico(chartId) {
    const canvas = document.getElementById(chartId);
    if (canvas) {
        const link = document.createElement('a');
        link.download = `grafico_${chartId}_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
}

// Calculadora de consumo energético
function calcularConsumo() {
    const consumoMensual = parseFloat(document.getElementById('consumo-mensual').value);
    const tarifa = parseFloat(document.getElementById('tarifa').value);
    const personas = parseInt(document.getElementById('personas').value);
    
    if (isNaN(consumoMensual) || isNaN(tarifa) || isNaN(personas)) {
        alert('Por favor completa todos los campos con valores válidos.');
        return;
    }
    
    // Cálculos
    const consumoAnual = consumoMensual * 12;
    const costoAnual = consumoAnual * tarifa;
    const consumoPerCapita = consumoMensual / personas;
    const ahorroEolica = costoAnual * 0.30; // Estimación de 30% de ahorro
    
    // Mostrar resultados con animación
    mostrarResultadoAnimado('consumo-anual', `${consumoAnual.toLocaleString()} kWh`);
    mostrarResultadoAnimado('costo-anual', `${costoAnual.toLocaleString()} COP`);
    mostrarResultadoAnimado('consumo-percapita', `${consumoPerCapita.toFixed(1)} kWh/persona`);
    mostrarResultadoAnimado('ahorro-eolica', `${ahorroEolica.toLocaleString()} COP`);
}

function mostrarResultadoAnimado(elementId, valor) {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.style.transform = 'scale(1.1)';
        elemento.style.color = '#4CAF50';
        elemento.textContent = valor;
        
        setTimeout(() => {
            elemento.style.transform = 'scale(1)';
            elemento.style.color = '#1976D2';
        }, 500);
    }
}

// Configurar formulario de contacto
function setupContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            validarYEnviarFormulario();
        });
    }
}

// Configuración de validación secuencial
// Configuración de validación secuencial
const campos = ['nombre', 'email', 'telefono', 'asunto', 'mensaje'];
let campoActual = 0;

// Deshabilitar todos los campos excepto el primero
campos.forEach((campo, index) => {
    const elemento = document.getElementById(campo);
    if (index > 0) elemento.disabled = true;
});

// Función para validar campo actual
function validarCampoActual() {
    const campo = campos[campoActual];
    const elemento = document.getElementById(campo);
    const valor = elemento.value.trim();
    const errorElement = document.getElementById(`error-${campo}`);
    let esValido = false;

    // Verificar que existe el elemento de error
    if (!errorElement) {
        console.error(`No se encontró el elemento error-${campo}`);
        return false;
    }

    // Limpiar error previo
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    errorElement.style.visibility = 'hidden';
    errorElement.style.opacity = '0';

    switch (campo) {
        case 'nombre':
            if (!valor) {
                mostrarError(errorElement, 'Nombre es obligatorio');
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
                mostrarError(errorElement, 'Solo letras y espacios');
            } else {
                esValido = true;
            }
            break;

        case 'email':
            if (!valor) {
                mostrarError(errorElement, 'Email es obligatorio');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
                mostrarError(errorElement, 'Email inválido');
            } else {
                esValido = true;
            }
            break;

        case 'telefono':
            if (!valor) {
                mostrarError(errorElement, 'Solo números, mínimo 7 máximo 10 dígitos');
            } else if (valor.length < 7) {
                mostrarError(errorElement, 'Mínimo 7 dígitos');
            } else if (valor.length > 10) {
                mostrarError(errorElement, 'Máximo 10 dígitos');
            } else if (!/^\d+$/.test(valor)) {
                mostrarError(errorElement, 'Solo números permitidos');
            } else {
                esValido = true;
            }
            break;

        case 'asunto':
            if (valor === '') {
                mostrarError(errorElement, 'Selecciona un asunto');
            } else {
                esValido = true;
            }
            break;

        case 'mensaje':
            if (!valor) {
                mostrarError(errorElement, 'Mensaje es obligatorio');
            } else if (valor.length < 3) {
                mostrarError(errorElement, 'Mínimo 3 caracteres');
            } else {
                esValido = true;
            }
            break;
    }

    return esValido;
}

// Habilitar siguiente campo solo si el actual es válido
function habilitarSiguienteCampo() {
    if (campoActual < campos.length - 1 && validarCampoActual()) {
        campoActual++;
        const siguiente = document.getElementById(campos[campoActual]);
        siguiente.disabled = false;
        siguiente.focus();
    }
    actualizarBotonEnviar();
}

// Validación en tiempo real y control de teclas
campos.forEach((campo, index) => {
    const elemento = document.getElementById(campo);
    
    // Restricción especial para el campo teléfono
    if (campo === 'telefono') {
        elemento.addEventListener('input', function(e) {
            // Solo permitir números, no espacios
            let valor = e.target.value.replace(/[^0-9]/g, '');
            if (valor.length > 10) {
                valor = valor.slice(0, 10);
            }
            e.target.value = valor;
            
            if (index === campoActual) {
                validarCampoActual();
            }
        });
        
        // Prevenir pegar contenido no numérico
        elemento.addEventListener('paste', function(e) {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            const numericPaste = paste.replace(/[^0-9]/g, '').slice(0, 10);
            e.target.value = numericPaste;
            if (index === campoActual) {
                validarCampoActual();
            }
        });
        
        // Prevenir teclas no numéricas (incluyendo espacios)
        elemento.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
            }
        });
        
        // Prevenir espacios con keydown
        elemento.addEventListener('keydown', function(e) {
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
            }
        });
    } else {
        // Solo validar en tiempo real sin avanzar automáticamente para otros campos
        elemento.addEventListener('input', function() {
            if (index === campoActual) {
                validarCampoActual();
                // Si estamos en el último campo, actualizar botón
                if (index === campos.length - 1) {
                    actualizarBotonEnviar();
                }
            }
        });
    }

    // Controlar avance con TAB y ENTER
    elemento.addEventListener('keydown', function(e) {
        if (index === campoActual && (e.key === 'Tab' || e.key === 'Enter')) {
            // Siempre prevenir el comportamiento por defecto
            e.preventDefault();
            
            // Validar y avanzar si es válido
            if (validarCampoActual() && campoActual < campos.length - 1) {
                campoActual++;
                const siguiente = document.getElementById(campos[campoActual]);
                siguiente.disabled = false;
                siguiente.focus();
                actualizarBotonEnviar();
            }
        }
    });

    elemento.addEventListener('blur', function() {
        if (index === campoActual) {
            validarCampoActual();
            // Si estamos en el último campo, actualizar botón
            if (index === campos.length - 1) {
                actualizarBotonEnviar();
            }
        }
    });
});

// Control del botón enviar - versión simplificada
function actualizarBotonEnviar() {
    const boton = document.querySelector('.submit-btn');
    
    // Solo habilitar cuando estemos en el último campo (mensaje)
    if (campoActual < campos.length - 1) {
        boton.disabled = true;
        console.log('Botón deshabilitado - No estás en el último campo');
        return;
    }
    
    // Verificar manualmente cada campo
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const asunto = document.getElementById('asunto').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    
    const nombreValido = nombre && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre);
    const emailValido = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const telefonoValido = telefono && telefono.length >= 7 && telefono.length <= 10 && /^\d+$/.test(telefono);
    const asuntoValido = asunto !== '';
    const mensajeValido = mensaje && mensaje.length >= 3;
    
    const todosValidos = nombreValido && emailValido && telefonoValido && asuntoValido && mensajeValido;
    
    // Debug detallado
    console.log('=== DEBUG CAMPOS ===');
    console.log('Nombre:', nombre, '- Válido:', nombreValido);
    console.log('Email:', email, '- Válido:', emailValido);
    console.log('Teléfono:', telefono, '- Válido:', telefonoValido, '- Longitud:', telefono.length);
    console.log('Asunto:', asunto, '- Válido:', asuntoValido);
    console.log('Mensaje:', mensaje, '- Válido:', mensajeValido, '- Longitud:', mensaje.length);
    console.log('TODOS VÁLIDOS:', todosValidos);
    console.log('================');
    
    boton.disabled = !todosValidos;
}

// Función para simular envío
function simularEnvio() {
    const boton = document.querySelector('.submit-btn');
    const form = document.getElementById('contactForm');
    
    // Crear barra de progreso
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 300px;
        text-align: center;
    `;
    
    progressContainer.innerHTML = `
        <h3 style="margin: 0 0 20px 0; color: #333;">Enviando mensaje...</h3>
        <div style="width: 100%; height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden;">
            <div id="progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #4CAF50, #45a049); transition: width 0.3s ease; border-radius: 10px;"></div>
        </div>
        <div id="progress-text" style="margin-top: 10px; font-weight: bold; color: #333;">0%</div>
    `;
    
    document.body.appendChild(progressContainer);
    
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Incremento aleatorio entre 5-20
        if (progress > 100) progress = 100;
        
        progressBar.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            
            // Cambiar a mensaje de éxito
            progressContainer.innerHTML = `
                <div style="color: #4CAF50; font-size: 50px; margin-bottom: 15px;">✅</div>
                <h3 style="margin: 0 0 10px 0; color: #4CAF50;">¡Datos enviados!</h3>
                <p style="margin: 0; color: #666;">Tu mensaje ha sido enviado correctamente</p>
            `;
            
            // Limpiar formulario y resetear después de 2 segundos
            setTimeout(() => {
                // Limpiar todos los campos
                document.getElementById('nombre').value = '';
                document.getElementById('email').value = '';
                document.getElementById('telefono').value = '';
                document.getElementById('asunto').value = '';
                document.getElementById('mensaje').value = '';
                
                // Resetear validación
                campoActual = 0;
                campos.forEach((campo, index) => {
                    const elemento = document.getElementById(campo);
                    const errorElement = document.getElementById(`error-${campo}`);
                    
                    if (index > 0) {
                        elemento.disabled = true;
                    } else {
                        elemento.disabled = false;
                        elemento.focus(); // Foco en el primer campo
                    }
                    
                    // Limpiar errores
                    if (errorElement) {
                        errorElement.textContent = '';
                        errorElement.style.display = 'none';
                    }
                });
                
                // Deshabilitar botón
                boton.disabled = true;
                
                // Quitar modal
                document.body.removeChild(progressContainer);
                
            }, 2000);
        }
    }, 100);
}

// Event listener para el formulario
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            simularEnvio();
        });
    }
    
    // Funcionalidad para botones de redes sociales
    // Facebook
    const facebookBtn = document.querySelector('img[src*="facebook"], a[href*="facebook"], #facebook');
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://www.facebook.com/energiasolica.co', '_blank');
        });
    }
    
    // X (anteriormente Twitter)
    const xBtn = document.querySelector('img[src*="twitter"], img[src*="x-"], a[href*="twitter"], a[href*="x.com"], #twitter, #x');
    if (xBtn) {
        xBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://x.com/energiasolica', '_blank');
        });
    }
    
    // LinkedIn
    const linkedinBtn = document.querySelector('img[src*="linkedin"], a[href*="linkedin"], #linkedin');
    if (linkedinBtn) {
        linkedinBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open('https://www.linkedin.com/company/energiasolica', '_blank');
        });
    }
    
    // Si los botones tienen texto específico, también buscarlos
    const socialButtons = document.querySelectorAll('a, button, img');
    socialButtons.forEach(button => {
        const text = button.textContent || button.alt || button.title || '';
        const href = button.href || '';
        
        if (text.toLowerCase().includes('facebook') || href.includes('facebook')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://www.facebook.com/energiasolica.co', '_blank');
            });
        }
        
        if (text.toLowerCase().includes('twitter') || text.toLowerCase().includes('x') || 
            href.includes('twitter') || href.includes('x.com')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://x.com/energiasolica', '_blank');
            });
        }
        
        if (text.toLowerCase().includes('linkedin') || href.includes('linkedin')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                window.open('https://www.linkedin.com/company/energiasolica', '_blank');
            });
        }
    });
});

// Función auxiliar para mostrar errores
function mostrarError(elemento, mensaje) {
    elemento.textContent = mensaje;
    elemento.style.display = 'block';
    elemento.style.color = '#181616ff';
    elemento.style.visibility = 'visible';
    elemento.style.opacity = '1';
}