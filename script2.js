// Variables globales
let csvData = [];
let chartInstances = {};
let currentPage = 1;
let rowsPerPage = 20;
let totalPages = 1;

// Event listeners y funciones de inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la primera sección
    mostrarSeccion('origen');
    
    // Configurar drag and drop para CSV
    configurarDragAndDrop();
    
    // Configurar formulario de contacto
    configurarFormularioContacto();
    
    // Agregar event listener para redimensionar gráficos
    window.addEventListener('resize', redimensionarGraficos);
    
    // Validación en tiempo real para la calculadora
    configurarCalculadora();
    
    // Crear gráficos con datos de ejemplo al inicio
    setTimeout(() => {
        crearGraficoTorta();
        crearGraficoLineas();
        crearGraficoBarras();
    }, 500);
    
    // Verificar compatibilidad del navegador
    verificarCompatibilidad();
});

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

// Configurar drag and drop para CSV
function configurarDragAndDrop() {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('csvFile');
    
    if (uploadArea) {
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                cargarCSV({ target: { files: files } });
            }
        });
    }
}

// Configurar formulario de contacto
function configurarFormularioContacto() {
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
                    const errorElement = document.getElementById(`error-${campo}`);
                    if (errorElement && errorElement.textContent) {
                        this.classList.remove('error');
                        errorElement.textContent = '';
                    }
                });
            }
        });
    }
}

// Configurar calculadora
function configurarCalculadora() {
    const camposCalculadora = ['consumo-mensual', 'tarifa', 'personas'];
    camposCalculadora.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            campo.addEventListener('input', function() {
                if (this.value < 0) {
                    this.value = '';
                }
            });
            
            campo.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    calcularConsumo();
                }
            });
        }
    });
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
    const elementoConsumoAnual = document.getElementById('consumo-anual');
    const elementoCostoAnual = document.getElementById('costo-anual');
    const elementoConsumoPercapita = document.getElementById('consumo-percapita');
    const elementoAhorroEolica = document.getElementById('ahorro-eolica');
    
    if (elementoConsumoAnual) elementoConsumoAnual.textContent = `${consumoAnual.toLocaleString()} kWh`;
    if (elementoCostoAnual) elementoCostoAnual.textContent = `${costoAnual.toLocaleString()} COP`;
    if (elementoConsumoPercapita) elementoConsumoPercapita.textContent = `${consumoPerCapita.toFixed(1)} kWh/persona`;
    if (elementoAhorroEolica) elementoAhorroEolica.textContent = `${ahorroEolica.toLocaleString()} COP`;
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

// Función mejorada para cargar y procesar CSV
function cargarCSV(event) {
    const archivo = event.target.files[0];
    
    if (!archivo) {
        return;
    }
    
    // Validar archivo
    const validacion = validarArchivoCSV(archivo);
    if (!validacion.valido) {
        alert(validacion.mensaje);
        event.target.value = '';
        return;
    }
    
    const lector = new FileReader();
    
    lector.onload = function(e) {
        try {
            const contenido = e.target.result;
            procesarCSV(contenido);
        } catch (error) {
            alert('Error al procesar el archivo CSV: ' + error.message);
        }
    };
    
    lector.readAsText(archivo);
}

// Función para procesar el contenido del CSV
function procesarCSV(contenido) {
    const lineas = contenido.split('\n').filter(linea => linea.trim() !== '');
    
    if (lineas.length < 2) {
        alert('El archivo CSV debe contener al menos una fila de encabezados y una fila de datos');
        return;
    }
    
    // Procesar encabezados
    const encabezados = parsearLineaCSV(lineas[0]);
    
    // Procesar datos
    csvData = [];
    const erroresFilas = [];
    
    for (let i = 1; i < lineas.length; i++) {
        try {
            const valores = parsearLineaCSV(lineas[i]);
            
            if (valores.length === encabezados.length) {
                const fila = {};
                encabezados.forEach((encabezado, index) => {
                    fila[encabezado] = limpiarDatosCSV(valores[index]);
                });
                csvData.push(fila);
            } else {
                erroresFilas.push(i + 1);
            }
        } catch (error) {
            erroresFilas.push(i + 1);
        }
    }
    
    if (csvData.length === 0) {
        alert('No se pudieron procesar los datos del archivo CSV');
        return;
    }
    
    // Mostrar advertencias si hay errores
    if (erroresFilas.length > 0 && erroresFilas.length < 10) {
        alert(`Advertencia: Se ignoraron ${erroresFilas.length} filas con errores: líneas ${erroresFilas.join(', ')}`);
    } else if (erroresFilas.length >= 10) {
        alert(`Advertencia: Se ignoraron ${erroresFilas.length} filas con errores en el procesamiento`);
    }
    
    // Reiniciar paginación
    currentPage = 1;
    totalPages = Math.ceil(csvData.length / rowsPerPage);
    
    // Mostrar tabla y estadísticas
    mostrarTablaCSV(encabezados, csvData);
    actualizarEstadisticasCSV();
    
    alert(`CSV cargado correctamente. ${csvData.length} filas procesadas de ${lineas.length - 1} total.`);
}

// Función para parsear líneas CSV considerando comillas
function parsearLineaCSV(linea) {
    const resultado = [];
    let actual = '';
    let dentroComillas = false;
    
    for (let i = 0; i < linea.length; i++) {
        const char = linea[i];
        
        if (char === '"') {
            dentroComillas = !dentroComillas;
        } else if (char === ',' && !dentroComillas) {
            resultado.push(actual.trim());
            actual = '';
        } else {
            actual += char;
        }
    }
    
    resultado.push(actual.trim());
    return resultado.map(val => val.replace(/^"|"$/g, ''));
}

// Mostrar tabla CSV con paginación
function mostrarTablaCSV(encabezados, datos) {
    const contenedorCSV = document.getElementById('csv-content');
    const cabezaTabla = document.getElementById('csvTableHead');
    const cuerpoTabla = document.getElementById('csvTableBody');
    
    if (!cabezaTabla || !cuerpoTabla) {
        console.error('No se encontraron los elementos de la tabla CSV');
        return;
    }
    
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
    
    // Calcular datos para la página actual
    const inicio = (currentPage - 1) * rowsPerPage;
    const fin = Math.min(inicio + rowsPerPage, datos.length);
    const datosPagina = datos.slice(inicio, fin);
    
    // Crear filas de datos
    datosPagina.forEach(fila => {
        const tr = document.createElement('tr');
        encabezados.forEach(encabezado => {
            const td = document.createElement('td');
            const valor = fila[encabezado];
            
            // Formatear números
            if (typeof valor === 'number') {
                td.textContent = valor.toLocaleString('es-CO', {
                    minimumFractionDigits: valor % 1 === 0 ? 0 : 2,
                    maximumFractionDigits: 2
                });
                td.classList.add('numeric');
            } else {
                td.textContent = valor || '';
            }
            
            tr.appendChild(td);
        });
        cuerpoTabla.appendChild(tr);
    });
    
    // Mostrar/ocultar paginación
    const paginationContainer = document.getElementById('pagination-container');
    if (paginationContainer) {
        if (totalPages > 1) {
            paginationContainer.style.display = 'flex';
            actualizarPaginacion();
        } else {
            paginationContainer.style.display = 'none';
        }
    }
    
    // Mostrar el contenedor
    if (contenedorCSV) {
        contenedorCSV.style.display = 'block';
    }
}

// Funciones de paginación
function cambiarPagina(direccion) {
    const nuevaPagina = currentPage + direccion;
    
    if (nuevaPagina >= 1 && nuevaPagina <= totalPages) {
        currentPage = nuevaPagina;
        const encabezados = Object.keys(csvData[0]);
        mostrarTablaCSV(encabezados, csvData);
    }
}

function actualizarPaginacion() {
    const paginationInfo = document.getElementById('pagination-info');
    const btnAnterior = document.querySelector('button[onclick="cambiarPagina(-1)"]');
    const btnSiguiente = document.querySelector('button[onclick="cambiarPagina(1)"]');
    
    if (paginationInfo) {
        paginationInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    }
    
    if (btnAnterior) btnAnterior.disabled = currentPage === 1;
    if (btnSiguiente) btnSiguiente.disabled = currentPage === totalPages;
}

// Actualizar estadísticas CSV
function actualizarEstadisticasCSV() {
    const csvInfo = document.getElementById('csv-info');
    if (csvInfo && csvData.length > 0) {
        csvInfo.textContent = `${csvData.length} filas • ${Object.keys(csvData[0]).length} columnas`;
    }
}

// Función para crear datos de ejemplo si no hay CSV
function crearDatosEjemplo() {
    return [
        { mes: 'Enero', generacion: 450, velocidad_viento: 8.2, temperatura: 24 },
        { mes: 'Febrero', generacion: 520, velocidad_viento: 9.1, temperatura: 25 },
        { mes: 'Marzo', generacion: 480, velocidad_viento: 8.8, temperatura: 26 },
        { mes: 'Abril', generacion: 390, velocidad_viento: 7.5, temperatura: 27 },
        { mes: 'Mayo', generacion: 320, velocidad_viento: 6.8, temperatura: 28 },
        { mes: 'Junio', generacion: 280, velocidad_viento: 6.2, temperatura: 29 },
        { mes: 'Julio', generacion: 310, velocidad_viento: 6.5, temperatura: 28 },
        { mes: 'Agosto', generacion: 380, velocidad_viento: 7.2, temperatura: 28 },
        { mes: 'Septiembre', generacion: 420, velocidad_viento: 7.8, temperatura: 27 },
        { mes: 'Octubre', generacion: 510, velocidad_viento: 8.9, temperatura: 26 },
        { mes: 'Noviembre', generacion: 480, velocidad_viento: 8.6, temperatura: 25 },
        { mes: 'Diciembre', generacion: 460, velocidad_viento: 8.3, temperatura: 24 }
    ];
}

// Crear gráfico de torta
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

// Función para redimensionar gráficos
function redimensionarGraficos() {
    Object.values(chartInstances).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
}

// Funciones adicionales de utilidad
function formatearNumero(numero) {
    return numero.toLocaleString('es-CO');
}

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
        
        if (resultados[0]) {
            mostrarSeccion(resultados[0].id);
        }
    } else {
        alert('No se encontraron resultados para: ' + termino);
    }
}

function verificarCompatibilidad() {
    const caracteristicas = {
        fileReader: typeof FileReader !== 'undefined',
        canvas: !!document.createElement('canvas').getContext,
        dragDrop: 'draggable' in document.createElement('div')
    };
    
    const incompatible = Object.keys(caracteristicas).filter(
        key => !caracteristicas[key]
    );
    
    if (incompatible.length > 0) {
        console.warn('Características no soportadas:', incompatible);
    }
    
    return incompatible.length === 0;
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

// Función para exportar datos a CSV
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
        alert('No hay datos cargados para mostrar estadísticas');
        return;
    }
    
    const encabezados = Object.keys(csvData[0]);
    const columnasNumericas = encabezados.filter(key => 
        typeof csvData[0][key] === 'number'
    );
    
    if (columnasNumericas.length === 0) {
        alert('No hay columnas numéricas para calcular estadísticas');
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

// Función para imprimir tabla CSV
function imprimirTablaCSV() {
    if (csvData.length === 0) {
        alert('No hay datos para imprimir');
        return;
    }
    
    const tabla = document.getElementById('csvTable');
    if (!tabla) return;
    
    const ventanaImpresion = window.open('', '_blank');
    ventanaImpresion.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Datos CSV - Energía Eólica Colombia</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #4caf50; color: white; }
                tr:nth-child(even) { background-color: #f2f2f2; }
                .numeric { text-align: right; }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>Datos de Energía Eólica</h1>
            <p>Fecha de exportación: ${new Date().toLocaleDateString('es-CO')}</p>
            <p>Total de registros: ${csvData.length}</p>
            ${tabla.outerHTML}
        </body>
        </html>
    `);
    
    ventanaImpresion.document.close();
    ventanaImpresion.focus();
    ventanaImpresion.print();
}

// Función para exportar gráfico como imagen
function exportarGraficoComoImagen(chartInstance, nombre) {
    if (!chartInstance) {
        alert('No hay gráfico para exportar');
        return;
    }
    
    const canvas = chartInstance.canvas;
    const url = canvas.toDataURL('image/png');
    
    const enlace = document.createElement('a');
    enlace.download = `${nombre}_${new Date().toISOString().split('T')[0]}.png`;
    enlace.href = url;
    enlace.click();
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

// Función para resetear gráficos
function resetearGraficos() {
    Object.values(chartInstances).forEach(chart => {
        if (chart) {
            chart.destroy();
        }
    });
    chartInstances = {};
}

// Función para generar colores automáticamente
function generarColores(cantidad) {
    const coloresBase = [
        '#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0',
        '#3f51b5', '#00bcd4', '#8bc34a', '#ffc107', '#ff5722'
    ];
    
    const colores = [];
    for (let i = 0; i < cantidad; i++) {
        colores.push(coloresBase[i % coloresBase.length]);
    }
    
    return colores;
}

// Función para alternar tema (funcionalidad adicional)
function alternarTema() {
    document.body.classList.toggle('tema-oscuro');
}

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

// Manejar errores globales
window.addEventListener('error', function(error) {
    console.error('Error en la aplicación:', error);
});

// Función para obtener color basado en valor
function obtenerColorPorValor(valor, minimo, maximo) {
    const normalizado = (valor - minimo) / (maximo - minimo);
    const rojo = Math.floor(255 * (1 - normalizado));
    const verde = Math.floor(255 * normalizado);
    return `rgb(${rojo}, ${verde}, 0)`;
}

// Función para detectar tipo de datos en columna
function detectarTipoColumna(datos, columna) {
    const valores = datos.map(fila => fila[columna]).filter(val => val !== null && val !== undefined);
    
    if (valores.length === 0) return 'vacio';
    
    const numericos = valores.filter(val => typeof val === 'number' || !isNaN(val));
    const fechas = valores.filter(val => !isNaN(Date.parse(val)));
    
    if (numericos.length === valores.length) return 'numerico';
    if (fechas.length === valores.length) return 'fecha';
    
    return 'texto';
}

// Función para formatear etiquetas largas
function formatearEtiqueta(etiqueta, maxLongitud = 15) {
    if (!etiqueta) return 'Sin etiqueta';
    
    const str = String(etiqueta);
    if (str.length <= maxLongitud) return str;
    
    return str.substring(0, maxLongitud - 3) + '...';
}

// Función para limpiar y preparar datos para visualización
function prepararDatosParaVisualizacion(datos, limite = 50) {
    if (!datos || datos.length === 0) return [];
    
    // Limitar datos para mejor rendimiento
    const datosLimitados = datos.slice(0, limite);
    
    // Limpiar valores nulos o indefinidos
    return datosLimitados.map(fila => {
        const filaLimpia = {};
        Object.keys(fila).forEach(key => {
            filaLimpia[key] = fila[key] !== null && fila[key] !== undefined ? fila[key] : 0;
        });
        return filaLimpia;
    });
}

// Función para validar datos CSV antes de crear gráficos
function validarDatosParaGraficos() {
    if (csvData.length === 0) {
        return { valido: false, mensaje: 'No hay datos CSV cargados' };
    }
    
    const encabezados = Object.keys(csvData[0]);
    const columnasNumericas = encabezados.filter(key => 
        typeof csvData[0][key] === 'number'
    );
    
    if (columnasNumericas.length === 0) {
        return { valido: false, mensaje: 'No hay columnas numéricas en los datos' };
    }
    
    return { valido: true };
}