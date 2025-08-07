// ===== DATOS COMPONENTES =====
const componentData = {
    aspas: {
        title: "Aspas del Aerogenerador",
        description: "Capturan la energía cinética del viento.",
        function: "Convierten la energía del viento en rotación mediante perfil aerodinámico.",
        specs: { Material: "Fibra de vidrio + resina epoxi", Longitud: "45-80 m", Peso: "6-12 t", Velocidad: "15-40 RPM", Durabilidad: "20-25 años" },
        characteristics: "Perfil aerodinámico optimizado, resistencia UV, sistema de deshielo."
    },
    nacelle: {
        title: "Góndola (Nacelle)",
        description: "Alberga el generador y sistema de control.",
        function: "Contiene generador, multiplicadora y controles principales.",
        specs: { Material: "Acero + fibra de vidrio", Peso: "50-80 t", Dimensiones: "15×4×4 m", Durabilidad: "20-25 años" },
        characteristics: "Diseño resistente al viento, orientación automática."
    },
    hub: {
        title: "Buje Central (Hub)",
        description: "Conecta aspas con eje principal.",
        function: "Transmite rotación de aspas al eje principal.",
        specs: { Material: "Hierro fundido nodular", Diámetro: "3-4 m", Peso: "15-25 t", Durabilidad: "25-30 años" },
        characteristics: "Balanceado dinámico, pitch control."
    },
    torre: {
        title: "Torre de Soporte",
        description: "Eleva el aerogenerador.",
        function: "Eleva el rotor a alturas donde el viento es constante.",
        specs: { Material: "Acero galvanizado", Altura: "80-120 m", Peso: "150-300 t", Durabilidad: "25-30 años" },
        characteristics: "Diseño tubular cónico, resistencia a cargas dinámicas."
    },
    cimentacion: {
        title: "Cimentación",
        description: "Base de concreto armado.",
        function: "Transmite todas las cargas al suelo.",
        specs: { Material: "Concreto armado", Profundidad: "3-5 m", Diámetro: "15-20 m", Durabilidad: "50+ años" },
        characteristics: "Diseño sísmico, drenaje integrado."
    }
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupSimulator();
    setupWindControls();
    setupAnimations();
    setupFormValidation();
});

// ===== NAVEGACIÓN =====
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ===== SIMULADOR =====
function setupSimulator() {
    const parts = document.querySelectorAll('.clickable-part');
    const info = document.getElementById('info-content');
    parts.forEach(part => {
        part.addEventListener('click', () => {
            parts.forEach(p => p.classList.remove('active-component'));
            part.classList.add('active-component');
            const type = part.dataset.part;
            displayComponentInfo(type, info);
        });
    });
}

function displayComponentInfo(type, container) {
    const data = componentData[type];
    if (!data) return;
    container.innerHTML = `
        <h3>${data.title}</h3>
        <p><strong>Descripción:</strong> ${data.description}</p>
        <div class="component-specs">
            <h4>Especificaciones:</h4>
            ${Object.entries(data.specs).map(([k, v]) => `<div class="spec-item"><span>${k}:</span><span>${v}</span></div>`).join('')}
        </div>
        <h4>Funcionamiento:</h4><p>${data.function}</p>
        <h4>Características:</h4><p>${data.characteristics}</p>
    `;
}

// ===== CONTROL VIENTO =====
function setupWindControls() {
    const slider = document.getElementById('wind-speed');
    const speedValue = document.getElementById('speed-value');
    const powerOutput = document.getElementById('power-output');
    const blades = document.getElementById('blades');

    slider.addEventListener('input', () => {
        const speed = parseInt(slider.value);
        speedValue.textContent = speed;
        powerOutput.textContent = calculatePower(speed);
        blades.style.animationDuration = (26 - speed) / 4 + 's';
    });
}

function calculatePower(s) {
    if (s < 3) return '0 kW';
    if (s <= 12) return Math.round(Math.pow(s - 2, 2.5) * 8) + ' kW';
    if (s <= 25) return Math.round(1500 + (s - 12) * 20) + ' kW';
    return '0 kW';
}

// ===== CALCULADORA =====
function calcularConsumo() {
    const personas = parseInt(document.getElementById('num-personas').value);
    const consumo = parseInt(document.getElementById('consumo-mensual').value);
    const costo = parseFloat(document.getElementById('costo-kwh').value);
    if (isNaN(personas) || isNaN(consumo) || isNaN(costo) || personas <= 0 || consumo < 0 || costo < 0) {
        document.getElementById('results-content').innerHTML = '<p style="color:red;">Por favor ingresa valores válidos y positivos.</p>';
        return;
    }
    const total = consumo * costo;
    document.getElementById('results-content').innerHTML = `
        <p><strong>Total mensual:</strong> $${total.toLocaleString()} COP</p>
        <p><strong>Por persona:</strong> $${(total / personas).toLocaleString()} COP</p>
        <p><strong>Consumo:</strong> ${consumo} kWh</p>
    `;
}

// ===== CSV → TABLA → GRÁFICOS =====
let csvData = [];
let csvHeaders = [];

function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: result => {
            csvData = result.data;
            csvHeaders = result.meta.fields;
            mostrarTabla();
            generarDashboard();
        }
    });
}

function mostrarTabla() {
    const container = document.getElementById('data-table-container');
    container.innerHTML = '';
    const table = document.createElement('table');
    table.id = 'data-table';
    table.innerHTML = `
        <thead><tr>${csvHeaders.map(h => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${csvData.map(row => `<tr>${csvHeaders.map(h => `<td>${row[h] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
    `;
    container.appendChild(table);
}

function generarDashboard() {
    const labels = csvData.map((_, i) => 'Fila ' + (i + 1));
    const valores = csvData.map(row => parseFloat(Object.values(row)[0]) || 0);

    const ctx = document.getElementById('chart-canvas').getContext('2d');
    if (window.chart) window.chart.destroy();
    window.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: csvHeaders[0],
                data: valores,
                backgroundColor: 'rgba(54, 162, 235, 0.6)'
            }]
        },
        options: { responsive: true, plugins: { title: { display: true, text: 'Dashboard Analítico' } } }
    });
}

// ===== FORMULARIO CONTACTO CON VALIDACIÓN SECUENCIAL =====
function setupFormValidation() {
    const fields = ['nombre', 'email', 'telefono', 'mensaje'];
    const patterns = {
        nombre: /^[a-zA-ZáéíóúñÑ\s]+$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        telefono: /^\d{7,15}$/
    };
    const form = document.getElementById('contact-form');
    fields.forEach((field, index) => {
        const input = document.getElementById(field);
        const next = fields[index + 1] ? document.getElementById(fields[index + 1]) : null;
        const error = document.getElementById(`error-${field}`);
        input.addEventListener('input', () => {
            const val = input.value.trim();
            let ok = true;
            if (!val) { error.textContent = 'Campo obligatorio'; ok = false; }
            else if (patterns[field] && !patterns[field].test(val)) {
                error.textContent = field === 'nombre' ? 'Solo letras y espacios' : field === 'email' ? 'Correo inválido' : 'Solo números (7-15 dígitos)';
                ok = false;
            } else if (field === 'telefono' && val.startsWith('-')) { error.textContent = 'No se permiten negativos'; ok = false; }
            else error.textContent = '';
            error.style.display = ok ? 'none' : 'block';
            if (next) next.disabled = !ok;
        });
    });
    form.addEventListener('submit', e => {
        e.preventDefault();
        const valid = fields.every(f => !document.getElementById(`error-${f}`).textContent);
        if (!valid) return;
        const progress = document.getElementById('progress-bar');
        const container = document.getElementById('progress-container');
        const success = document.getElementById('success-message');
        container.style.display = 'block';
        let value = 0;
        const interval = setInterval(() => {
            value += 10;
            progress.value = value;
            if (value >= 100) {
                clearInterval(interval);
                container.style.display = 'none';
                success.style.display = 'block';
                form.reset();
                fields.forEach((f, i) => document.getElementById(f).disabled = i !== 0);
                fields.forEach(f => document.getElementById(`error-${f}`).textContent = '');
                setTimeout(() => success.style.display = 'none', 3000);
            }
        }, 100);
    });
    document.getElementById('nombre').disabled = false;
}

// ===== ANIMACIONES =====
function setupAnimations() {
    const obs = new IntersectionObserver(entries => entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = 1;
            e.target.style.transform = 'translateY(0)';
        }
    }), { threshold: 0.1 });
    document.querySelectorAll('.project-card, .info-card').forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        obs.observe(el);
    });
}