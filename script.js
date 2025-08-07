// Variables globales
let csvData = [];
let chartInstances = {};

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
    
    // Actualizar menú activo
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Encontrar y activar el elemento del menú correspondiente
    const menuActivo = document.querySelector(`[onclick="mostrarSeccion('${seccionId}')"]`);
    if (menuActivo) {
        menuActivo.classList.add('active');
    }
    
    // Si es una sección de gráfico, redibujar el gráfico
    if (seccionId.includes('grafico') && csvData.length > 0) {
        setTimeout(() => {
            if (seccionId === 'grafico-torta') {
                crearGraficoTorta();
            } else if (seccionId === 'grafico-lineas') {
                crearGraficoLineas();
            } else if (seccionId === 'grafico-barras') {
                crearGraficoBarras();
            }
        }, 100);
    }
}

// Calculadora de consumo energético
function calcularConsumo() {
    const consumoMensual = parseFloat(document.getElementById('consumo-mensual').value);
    const tarifa = parseFloat(document.getElementById('tarifa').value);
    const personas = parseInt(document.getElementById('personas').value);
    
    // Validaciones
    if (!consumoMensual || consumoMensual <= 0) {
        alert('Por favor ingrese un consumo mensual válido');
        return;
    }
    
    if (!tarifa || tarifa <= 0) {
        alert('Por favor ingrese una tarifa válida');
        return;
    }
    
    if (!personas || personas <= 0) {
        alert('Por favor ingrese un número válido de personas');
        return;
    }
    
    // Cálculos
    const consumoAnual = consumoMensual * 12;
    const costoAnual = consumoAnual * tarifa;
    const consumoPerCapita = consumoAnual / personas;
    const ahorroEolica = costoAnual * 0.3; // 30% de ahorro estimado
    
    // Mostrar resultados
    document.getElementById('consumo-anual').textContent = `${consumoAnual.toLocaleString()} kWh`;
    document.getElementById('costo-anual').textContent = `$${costoAnual.toLocaleString()} COP`;
    document.getElementById('consumo-percapita').textContent = `${consumoPerCapita.toFixed(1)} kWh/persona`;
    document.getElementById('ahorro-eolica').textContent = `$${ahorroEolica.toLocaleString()} COP`;
}

// Validación del formulario de contacto
function validarFormulario() {
    let esValido = true;
    const errores = {};
    
    // Validar nombre
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        errores.nombre = 'El nombre es obligatorio';
        esValido = false;
    } else if (nombre.length < 2) {
        errores.nombre = 'El nombre debe tener al menos 2 caracteres';
        esValido = false;
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) {
        errores.nombre = 'El nombre solo puede contener letras y espacios';
        esValido = false;
    }
    
    // Validar email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        errores.email = 'El correo electrónico es obligatorio';
        esValido = false;
    } else if (!emailRegex.test(email)) {
        errores.email = 'Por favor ingrese un correo electrónico válido';
        esValido = false;
    }
    
    // Validar teléfono (opcional pero si se ingresa debe ser válido)
    const telefono = document.getElementById('telefono').value.trim();
    if (telefono && !/^[\d\s\+\-\(\)]+$/.test(telefono)) {
        errores.telefono = 'Por favor ingrese un teléfono válido';
        esValido = false;
    } else if (telefono && telefono.length < 7) {
        errores.telefono = 'El teléfono debe tener al menos 7 dígitos';
        esValido = false;
    }
    
    // Validar asunto
    const asunto = document.getElementById('asunto').value;
    if (!asunto) {
        errores.asunto = 'Por favor seleccione un asunto';
        esValido = false;
    }
    
    // Validar mensaje
    const mensaje = document.getElementById('mensaje').value.trim();
    if (!mensaje) {
        errores.mensaje = 'El mensaje es obligatorio';
        esValido = false;
    } else if (mensaje.length < 10) {
        errores.mensaje = 'El mensaje debe tener al menos 10 caracteres';
        esValido = false;
    } else if (mensaje.length > 1000) {
        errores.mensaje = 'El mensaje no puede exceder 1000 caracteres';
        esValido = false;
    }
    
    // Mostrar errores
    Object.keys(errores).forEach(campo => {
        const errorElement = document.getElementById(`error-${campo}`);
        const inputElement = document.getElementById(campo);
        
        if (errorElement) {
            errorElement.textContent = errores[campo];
        }
        
        if (inputElement) {
            inputElement.classList.add('error');
        }
    });
    
    // Limpiar errores de campos válidos
    const todosLosCampos = ['nombre', 'email', 'telefono', 'asunto', 'mensaje'];
    todosLosCampos.forEach(campo => {
        if (!errores[campo]) {
            const errorElement = document.getElementById(`error-${campo}`);
            const inputElement = document.getElementById(campo);
            
            if (errorElement) {
                errorElement.textContent = '';
            }
            
            if (inputElement) {
                inputElement.classList.remove('error');
            }
        }
    });
    
    return esValido;
}

// Manejo del formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('contactForm');
    
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validarFormulario()) {
                // Simulación de envío
                alert('¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.');
                formulario.reset();
                
                // Limpiar mensajes de error
                const errores = document.querySelectorAll('.error-message');
                errores.forEach(error => error.textContent = '');
                
                const inputs = document.querySelectorAll('.error');
                inputs.forEach(input => input.classList.remove('error'));
            }
        });
        
        // Validación en tiempo real
        const campos = ['nombre', 'email', 'telefono', 'asunto', 'mensaje'];
        campos.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.addEventListener('blur', validarFormulario);
                input.addEventListener('input', function() {
                    // Limpiar error cuando el usuario comience a escribir
                    const errorElement = document.getElementById(`error-${campo}`);
                    if (errorElement && errorElement.textContent) {
                        this.classList.remove('error');
                        errorElement.textContent = '';
                    }
                });
            }
        });
    }
});

// Función para cargar y procesar CSV
function cargarCSV(event) {
    const archivo = event.target.files[0];
    
    if (!archivo) {
        return;
    }
    
    if (!archivo.name.toLowerCase().endsWith('.csv')) {
        alert('Por favor seleccione un archivo CSV válido');
        return;
    }
    
    const lector = new FileReader();
    
    lector.onload = function(e) {
        try {
            const contenido = e.target.result;
            const lineas = contenido.split('\n').filter(linea => linea.trim() !== '');
            
            if (lineas.length < 2) {
                alert('El archivo CSV debe contener al menos una fila de encabezados y una fila de datos');
                return;
            }
            
            // Procesar encabezados
            const encabezados = lineas[0].split(',').map(h => h.trim().replace(/"/g, ''));
            
            // Procesar datos
            csvData = [];
            for (let i = 1; i < lineas.length; i++) {
                const valores = lineas[i].split(',').map(v => v.trim().replace(/"/g, ''));
                if (valores.length === encabezados.length) {
                    const fila = {};
                    encabezados.forEach((encabezado, index) => {
                        // Intentar convertir a número si es posible
                        const valor = valores[index];
                        if (!isNaN(valor) && valor !== '') {
                            fila[encabezado] = parseFloat(valor);
                        } else {
                            fila[encabezado] = valor;
                        }
                    });
                    csvData.push(fila);
                }
            }
            
            if (csvData.length === 0) {
                alert('No se pudieron procesar los datos del archivo CSV');
                return;
            }
            
            // Mostrar tabla
            mostrarTablaCSV(encabezados, csvData);
            
            // Crear gráficos con datos de ejemplo si no hay datos suficientes
            if (csvData.length > 0) {
                crearGraficosEjemplo();
            }
            
            alert(`CSV cargado correctamente. ${csvData.length} filas procesadas.`);
            
        } catch (error) {
            alert('Error al procesar el archivo CSV: ' + error.message);
        }
    };
    
    lector.readAsText(archivo);
}

// Mostrar tabla CSV
function mostrarTablaCSV(encabezados, datos) {
    const contenedorCSV = document.getElementById('csv-content');
    const cabezaTabla = document.getElementById('csvTableHead');
    const cuerpoTabla = document.getElementById('csvTableBody');
    
    // Limpiar contenido anterior
    cabezaTabla.innerHTML = '';
    cuerpoTabla.innerHTML = '';
    
    // Crear encabezados
    const filaEncabezado = document.createElement('tr');
    encabezados.forEach(encabezado => {
        const th = document.createElement('th');
        th.textContent = encabezado;
        filaEncabezado.appendChild(th);
    });
    cabezaTabla.appendChild(filaEncabezado);
    
    // Crear filas de datos (mostrar máximo 50 filas para rendimiento)
    const maxFilas = Math.min(datos.length, 50);
    for (let i = 0; i < maxFilas; i++) {
        const fila = document.createElement('tr');
        encabezados.forEach(encabezado => {
            const td = document.createElement('td');
            td.textContent = datos[i][encabezado] || '';
            fila.appendChild(td);
        });
        cuerpoTabla.appendChild(fila);
    }
    
    if (datos.length > 50) {
        const filaInfo = document.createElement('tr');
        const tdInfo = document.createElement('td');
        tdInfo.colSpan = encabezados.length;
        tdInfo.textContent = `... y ${datos.length - 50} filas más`;
        tdInfo.style.textAlign = 'center';
        tdInfo.style.fontStyle = 'italic';
        tdInfo.style.color = '#666';
        filaInfo.appendChild(tdInfo);
        cuerpoTabla.appendChild(filaInfo);
    }
    
    // Mostrar el contenedor
    contenedorCSV.style.display = 'block';
}

// Crear gráficos de ejemplo o con datos reales
function crearGraficosEjemplo() {
    // Si no hay datos CSV, usar datos de ejemplo
    if (csvData.length === 0) {
        csvData = [
            { mes: 'Enero', generacion: 450, velocidad_viento: 8.2 },
            { mes: 'Febrero', generacion: 520, velocidad_viento: 9.1 },
            { mes: 'Marzo', generacion: 480, velocidad_viento: 8.8 },
            { mes: 'Abril', generacion: 390, velocidad_viento: 7.5 },
            { mes: 'Mayo', generacion: 320, velocidad_viento: 6.8 },
            { mes: 'Junio', generacion: 280, velocidad_viento: 6.2 },
            { mes: 'Julio', generacion: 310, velocidad_viento: 6.5 },
            { mes: 'Agosto', generacion: 380, velocidad_viento: 7.2 },
            { mes: 'Septiembre', generacion: 420, velocidad_viento: 7.8 },
            { mes: 'Octubre', generacion: 510, velocidad_viento: 8.9 },
            { mes: 'Noviembre', generacion: 480, velocidad_viento: 8.6 },
            { mes: 'Diciembre', generacion: 460, velocidad_viento: 8.3 }
        ];
    }
}

// Crear gráfico de torta
function crearGraficoTorta() {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;
    
    // Destruir gráfico anterior si existe
    if (chartInstances.pie) {
        chartInstances.pie.destroy();
    }
    
    // Preparar datos para el gráfico de torta
    let labels = [];
    let data = [];
    
    if (csvData.length > 0) {
        // Usar datos CSV
        const claves = Object.keys(csvData[0]);
        const columnaNumerica = claves.find(key => 
            typeof csvData[0][key] === 'number'
        );
        
        if (columnaNumerica) {
            labels = csvData.map((fila, index) => {
                const primeraColumna = fila[claves[0]];
                return primeraColumna || `Item ${index + 1}`;
            }).slice(0, 12); // Máximo 12 barras
            
            data = csvData.map(fila => fila[columnaNumerica]).slice(0, 12);
        }
    }
    
    // Datos por defecto
    if (labels.length === 0) {
        labels = ['Jepírachi', 'Guajira I', 'Windpeshi', 'Beta', 'Casa Eléctrica', 'Carrizal'];
        data = [19.5, 20, 205, 280, 150, 175];
    }
    
    chartInstances.bar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Capacidad (MW)',
                data: data,
                backgroundColor: [
                    '#4caf50',
                    '#66bb6a',
                    '#81c784',
                    '#a5d6a7',
                    '#c8e6c9',
                    '#e8f5e8'
                ],
                borderColor: '#2e7d32',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Comparación de Datos',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#2e7d32'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e0e0e0'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45
                    }
                }
            }
        }
    });
}

// Función para redimensionar gráficos cuando cambia el tamaño de ventana
function redimensionarGraficos() {
    Object.values(chartInstances).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la primera sección
    mostrarSeccion('origen');
    
    // Crear gráficos de ejemplo al cargar la página
    crearGraficosEjemplo();
    
    // Agregar event listener para redimensionar gráficos
    window.addEventListener('resize', redimensionarGraficos);
    
    // Validación en tiempo real para la calculadora
    const camposCalculadora = ['consumo-mensual', 'tarifa', 'personas'];
    camposCalculadora.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', function() {
                // Validar que solo se ingresen números positivos
                if (this.value < 0) {
                    this.value = '';
                }
            });
        }
    });
    
    // Agregar funcionalidad de Enter para la calculadora
    const inputsCalculadora = document.querySelectorAll('#calculadora input');
    inputsCalculadora.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calcularConsumo();
            }
        });
    });
});

// Función para formatear números con separadores de miles
function formatearNumero(numero) {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Función para validar archivos CSV
function validarArchivoCSV(archivo) {
    const tiposPermitidos = ['text/csv', 'application/vnd.ms-excel'];
    const extensionesPermitidas = ['.csv'];
    
    const extension = archivo.name.toLowerCase().substring(archivo.name.lastIndexOf('.'));
    
    if (!extensionesPermitidas.includes(extension)) {
        return {
            valido: false,
            mensaje: 'Por favor seleccione un archivo CSV válido (.csv)'
        };
    }
    
    if (archivo.size > 5 * 1024 * 1024) { // 5MB máximo
        return {
            valido: false,
            mensaje: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
        };
    }
    
    return { valido: true };
}

// Función para limpiar datos CSV
function limpiarDatosCSV(valor) {
    if (typeof valor === 'string') {
        // Eliminar comillas y espacios extra
        valor = valor.replace(/^["']|["']$/g, '').trim();
        
        // Intentar convertir a número si es posible
        if (!isNaN(valor) && valor !== '') {
            return parseFloat(valor);
        }
    }
    
    return valor;
}

// Función para exportar datos a CSV (funcionalidad adicional)
function exportarCSV() {
    if (csvData.length === 0) {
        alert('No hay datos para exportar');
        return;
    }
    
    const encabezados = Object.keys(csvData[0]);
    let contenidoCSV = encabezados.join(',') + '\n';
    
    csvData.forEach(fila => {
        const valores = encabezados.map(encabezado => {
            const valor = fila[encabezado];
            // Envolver en comillas si contiene comas
            if (typeof valor === 'string' && valor.includes(',')) {
                return `"${valor}"`;
            }
            return valor;
        });
        contenidoCSV += valores.join(',') + '\n';
    });
    
    // Crear y descargar archivo
    const blob = new Blob([contenidoCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = 'datos_energia_eolica.csv';
    enlace.click();
    window.URL.revokeObjectURL(url);
}

// Función para mostrar estadísticas de los datos CSV
function mostrarEstadisticas() {
    if (csvData.length === 0) {
        return;
    }
    
    const encabezados = Object.keys(csvData[0]);
    const columnasNumericas = encabezados.filter(key => 
        typeof csvData[0][key] === 'number'
    );
    
    if (columnasNumericas.length === 0) {
        return;
    }
    
    let estadisticas = 'Estadísticas de los datos:\n\n';
    
    columnasNumericas.forEach(columna => {
        const valores = csvData.map(fila => fila[columna]).filter(val => !isNaN(val));
        
        if (valores.length > 0) {
            const suma = valores.reduce((a, b) => a + b, 0);
            const promedio = suma / valores.length;
            const maximo = Math.max(...valores);
            const minimo = Math.min(...valores);
            
            estadisticas += `${columna}:\n`;
            estadisticas += `  Promedio: ${promedio.toFixed(2)}\n`;
            estadisticas += `  Máximo: ${maximo}\n`;
            estadisticas += `  Mínimo: ${minimo}\n`;
            estadisticas += `  Total: ${suma.toFixed(2)}\n\n`;
        }
    });
    
    alert(estadisticas);
}

// Función para alternar tema (funcionalidad adicional)
function alternarTema() {
    document.body.classList.toggle('tema-oscuro');
    
    // Guardar preferencia en localStorage si está disponible
    try {
        if (typeof(Storage) !== "undefined") {
            const temaOscuro = document.body.classList.contains('tema-oscuro');
            localStorage.setItem('tema-oscuro', temaOscuro);
        }
    } catch (error) {
        // Ignorar error si localStorage no está disponible
    }
}

// Cargar tema guardado al inicializar
document.addEventListener('DOMContentLoaded', function() {
    try {
        if (typeof(Storage) !== "undefined") {
            const temaGuardado = localStorage.getItem('tema-oscuro');
            if (temaGuardado === 'true') {
                document.body.classList.add('tema-oscuro');
            }
        }
    } catch (error) {
        // Ignorar error si localStorage no está disponible
    }
});

// Función para imprimir sección actual
function imprimirSeccion() {
    const seccionActiva = document.querySelector('.content-section.active');
    if (!seccionActiva) {
        alert('No hay contenido para imprimir');
        return;
    }
    
    const contenido = seccionActiva.innerHTML;
    const ventanaImpresion = window.open('', '_blank');
    
    ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Energía Eólica Colombia - Impresión</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #2e7d32; border-bottom: 2px solid #4caf50; }
                .chart-container { display: none; }
                @media print {
                    body { margin: 0; }
                    .chart-container { display: none; }
                }
            </style>
        </head>
        <body>
            ${contenido}
        </body>
        </html>
    `);
    
    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    ventanaImpresion.print();
}

// Función para buscar contenido
function buscarContenido(termino) {
    if (!termino) {
        return;
    }
    
    const secciones = document.querySelectorAll('.content-section');
    let resultados = [];
    
    secciones.forEach(seccion => {
        const textoSeccion = seccion.textContent.toLowerCase();
        if (textoSeccion.includes(termino.toLowerCase())) {
            resultados.push({
                id: seccion.id,
                titulo: seccion.querySelector('h1')?.textContent || seccion.id
            });
        }
    });
    
    if (resultados.length > 0) {
        let mensaje = 'Resultados encontrados:\n\n';
        resultados.forEach((resultado, index) => {
            mensaje += `${index + 1}. ${resultado.titulo}\n`;
        });
        
        alert(mensaje);
        
        // Mostrar la primera sección encontrada
        if (resultados[0]) {
            mostrarSeccion(resultados[0].id);
        }
    } else {
        alert('No se encontraron resultados para: ' + termino);
    }
}

// Función para scroll suave
function scrollSuave(elementoId) {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Manejar errores globales de JavaScript
window.addEventListener('error', function(error) {
    console.error('Error en la aplicación:', error);
    // No mostrar alertas de error en producción para mejor UX
});

// Función para verificar compatibilidad del navegador
function verificarCompatibilidad() {
    const caracteristicas = {
        fileReader: typeof FileReader !== 'undefined',
        canvas: !!document.createElement('canvas').getContext,
        localStorage: typeof Storage !== 'undefined'
    };
    
    const incompatible = Object.keys(caracteristicas).filter(
        key => !caracteristicas[key]
    );
    
    if (incompatible.length > 0) {
        console.warn('Características no soportadas:', incompatible);
    }
    
    return incompatible.length === 0;
}

// Inicializar verificación de compatibilidad
document.addEventListener('DOMContentLoaded', function() {
    verificarCompatibilidad();
});

// Crear gráfico de torta (pie chart) - corregido y movido dentro de la función
function crearGraficoTorta() {
    const ctx = document.getElementById('pieChart');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (chartInstances.pie) {
        chartInstances.pie.destroy();
    }

    let labels = [];
    let data = [];
    let colores = ['#4caf50', '#81c784', '#a5d6a7', '#c8e6c9', '#e8f5e8', '#f1f8e9'];

    if (csvData.length > 0) {
        // Usar las primeras columnas numéricas encontradas
        const primeraFilaClaves = Object.keys(csvData[0]);
        const columnaNumerica = primeraFilaClaves.find(key =>
            typeof csvData[0][key] === 'number' && key !== 'id'
        );

        if (columnaNumerica) {
            // Agrupar datos y sumar valores para el gráfico de torta
            const grupos = {};
            csvData.forEach(fila => {
                const etiqueta = fila[primeraFilaClaves[0]] || 'Sin categoría';
                const valor = fila[columnaNumerica] || 0;
                grupos[etiqueta] = (grupos[etiqueta] || 0) + valor;
            });

            labels = Object.keys(grupos).slice(0, 6); // Máximo 6 categorías
            data = labels.map(label => grupos[label]);
        }
    }

    // Datos por defecto si no hay datos CSV válidos
    if (labels.length === 0) {
        labels = ['Eólica', 'Hidráulica', 'Térmica', 'Solar', 'Biomasa'];
        data = [25, 45, 20, 8, 2];
    }

    chartInstances.pie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colores.slice(0, labels.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Distribución de Datos',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#2e7d32'
                }
            }
        }
    });
}

// Crear gráfico de líneas
function crearGraficoLineas() {
    const ctx = document.getElementById('lineChart');
    if (!ctx) return;
    
    // Destruir gráfico anterior si existe
    if (chartInstances.line) {
        chartInstances.line.destroy();
    }
    
    let labels = [];
    let datasets = [];
    
    if (csvData.length > 0) {
        // Usar datos CSV
        const claves = Object.keys(csvData[0]);
        const clavesNumericas = claves.filter(key => 
            typeof csvData[0][key] === 'number'
        );
        
        labels = csvData.map((fila, index) => {
            // Usar la primera columna como etiqueta o usar índice
            const primeraColumna = fila[claves[0]];
            return primeraColumna || `Punto ${index + 1}`;
        });
        
        // Crear datasets para cada columna numérica
        clavesNumericas.slice(0, 3).forEach((clave, index) => {
            const colores = ['#4caf50', '#81c784', '#a5d6a7'];
            datasets.push({
                label: clave,
                data: csvData.map(fila => fila[clave]),
                borderColor: colores[index],
                backgroundColor: colores[index] + '20',
                tension: 0.4,
                fill: false
            });
        });
    }
    
    // Datos por defecto
    if (datasets.length === 0) {
        labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        datasets = [{
            label: 'Generación (MWh)',
            data: [450, 520, 480, 390, 320, 280, 310, 380, 420, 510, 480, 460],
            borderColor: '#4caf50',
            backgroundColor: '#4caf5020',
            tension: 0.4,
            fill: true
        }];
    }
    
    chartInstances.line = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Evolución Temporal',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#2e7d32'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#e0e0e0'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    grid: {
                        color: '#e0e0e0'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    });
}

// Crear gráfico de barras
function crearGraficoBarras() {
    const ctx = document.getElementById('barChart');
    if (!ctx) return;
    
    // Destruir gráfico anterior si existe
    if (chartInstances.bar) {
        chartInstances.bar.destroy();
    }
    
    let labels = [];
    let data = [];
}