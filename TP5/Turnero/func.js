// Clase para manejar el Turnero
class TurneroAleatorio {
    constructor() {
        this.limiteInferior = 1;
        this.limiteSuperior = 100;
        this.numerosGenerados = [];
        this.inicializar();
    }

    async inicializar() {
        await this.cargarDatos();
        this.actualizarInterfaz();
        this.configurarEventos();
    }

    configurarEventos() {
        document.getElementById('btnGuardarLimites').addEventListener('click', () => this.guardarLimites());
        document.getElementById('btnGenerar').addEventListener('click', () => this.generarNumero());
        document.getElementById('btnReiniciar').addEventListener('click', () => this.reiniciarSistema());

        document.getElementById('limiteInferior').addEventListener('change', () => this.validarLimites());
        document.getElementById('limiteSuperior').addEventListener('change', () => this.validarLimites());
    }

    validarLimites() {
        const inferior = parseInt(document.getElementById('limiteInferior').value);
        const superior = parseInt(document.getElementById('limiteSuperior').value);

        if (inferior >= superior) {
            this.mostrarAlerta('El límite inferior debe ser menor que el superior', 'warning');
            document.getElementById('btnGenerar').disabled = true;
        } else {
            document.getElementById('btnGenerar').disabled = false;
            this.ocultarAlerta();
        }
    }

    async cargarDatos() {
        this.mostrarLoader(true);
        try {
            const response = await fetch('api.php?action=cargar');
            if (response.ok) {
                const data = await response.json();
                if (data.success && data.data) {
                    this.limiteInferior = data.data.limite_inferior || 1;
                    this.limiteSuperior = data.data.limite_superior || 100;
                    // AHORA cargamos los numeros guardados en el servidor
                    this.numerosGenerados = Array.isArray(data.data.numeros) ? data.data.numeros.map(n => parseInt(n)) : [];

                    document.getElementById('limiteInferior').value = this.limiteInferior;
                    document.getElementById('limiteSuperior').value = this.limiteSuperior;
                }
            } else {
                console.error('Respuesta no OK al cargar datos:', response.status);
            }
        } catch (error) {
            console.log('No se pudieron cargar datos previos:', error);
        } finally {
            this.mostrarLoader(false);
        }
    }

    // Esta función guarda límites + ARRAY de numeros en el servidor
    async guardarDatos() {
        const datos = {
            limite_inferior: this.limiteInferior,
            limite_superior: this.limiteSuperior,
            numeros: this.numerosGenerados
        };

        try {
            const response = await fetch('api.php?action=guardar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });
            const result = await response.json();
            if (!result.success) console.error('Error al guardar datos:', result.message);
        } catch (err) {
            console.error('Error al guardar datos:', err);
        }
    }

    async guardarLimites() {
        const inferior = parseInt(document.getElementById('limiteInferior').value);
        const superior = parseInt(document.getElementById('limiteSuperior').value);

        if (inferior >= superior) {
            this.mostrarAlerta('El límite inferior debe ser menor que el superior', 'danger');
            return;
        }

        this.limiteInferior = inferior;
        this.limiteSuperior = superior;

        // Guardar límites (no borramos numeros salvo que queramos)
        await this.guardarDatos();
        this.mostrarAlerta('Límites guardados correctamente', 'success');
        this.actualizarInterfaz();
    }

    async generarNumero() {
        const totalNumeros = this.limiteSuperior - this.limiteInferior + 1;

        if (this.numerosGenerados.length >= totalNumeros) {
            this.mostrarAlerta('Todos los números han sido generados', 'info');
            return;
        }

        const display = document.getElementById('numeroDisplay');
        display.classList.add('animating');

        let numeroAleatorio;
        let intentos = 0;
        const maxIntentos = totalNumeros * 2;

        do {
            numeroAleatorio = Math.floor(Math.random() * (this.limiteSuperior - this.limiteInferior + 1)) + this.limiteInferior;
            intentos++;
        } while (this.numerosGenerados.includes(numeroAleatorio) && intentos < maxIntentos);

        if (this.numerosGenerados.includes(numeroAleatorio)) {
            numeroAleatorio = this.buscarNumeroDisponible(numeroAleatorio);
            if (numeroAleatorio === null) {
                this.mostrarAlerta('Todos los números han sido generados', 'info');
                display.classList.remove('animating');
                return;
            }
        }

        this.numerosGenerados.push(numeroAleatorio);

        setTimeout(() => {
            document.getElementById('numeroText').textContent = numeroAleatorio;
            display.classList.remove('animating');
        }, 200);

        // Guardamos inmediatamente para que persista tras F5
        await this.guardarDatos();

        this.actualizarInterfaz();
    }

    buscarNumeroDisponible(numeroBase) {
        for (let i = numeroBase + 1; i <= this.limiteSuperior; i++) {
            if (!this.numerosGenerados.includes(i)) return i;
        }
        for (let i = numeroBase - 1; i >= this.limiteInferior; i--) {
            if (!this.numerosGenerados.includes(i)) return i;
        }
        return null;
    }

    async reiniciarSistema() {
        if (!confirm('¿Está seguro de que desea reiniciar el sistema? Se borrarán todos los números generados.')) {
            return;
        }

        this.mostrarLoader(true);
        this.numerosGenerados = [];
        await this.guardarDatos();

        document.getElementById('numeroText').textContent = 'Presiona Generar';
        this.actualizarInterfaz();
        this.mostrarAlerta('Sistema reiniciado correctamente', 'success');
        this.mostrarLoader(false);
    }

    actualizarInterfaz() {
        const listaNumeros = document.getElementById('listaNumeros');
        if (this.numerosGenerados.length > 0) {
            const numerosOrdenados = [...this.numerosGenerados].sort((a, b) => a - b);
            listaNumeros.innerHTML = numerosOrdenados
                .map(num => `<span class="numero-badge">${num}</span>`)
                .join('');
        } else {
            listaNumeros.innerHTML = '<p class="text-muted">No hay números generados aún</p>';
        }

        const totalNumeros = this.limiteSuperior - this.limiteInferior + 1;
        const porcentaje = totalNumeros > 0 ? (this.numerosGenerados.length / totalNumeros * 100).toFixed(1) : 0;

        document.getElementById('rangoActual').textContent = `${this.limiteInferior} - ${this.limiteSuperior}`;
        document.getElementById('cantidadGenerados').textContent = this.numerosGenerados.length;
        document.getElementById('cantidadDisponibles').textContent = totalNumeros - this.numerosGenerados.length;

        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = `${porcentaje}%`;
        progressBar.textContent = `${porcentaje}%`;

        document.getElementById('btnGenerar').disabled = this.numerosGenerados.length >= totalNumeros;
    }

    mostrarAlerta(mensaje, tipo) {
        const alertContainer = document.getElementById('alertContainer');
        const alertId = 'alert-' + Date.now();

        alertContainer.innerHTML = `
            <div id="${alertId}" class="alert alert-${tipo} alert-custom alert-dismissible fade show" role="alert">
                <i class="bi bi-${tipo === 'success' ? 'check-circle' : tipo === 'danger' ? 'x-circle' : 'info-circle'}"></i>
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        setTimeout(() => {
            const alert = document.getElementById(alertId);
            if (alert) alert.remove();
        }, 5000);
    }

    ocultarAlerta() {
        document.getElementById('alertContainer').innerHTML = '';
    }

    mostrarLoader(mostrar) {
        const loader = document.querySelector('.loading-spinner');
        if (mostrar) loader.classList.add('active'); else loader.classList.remove('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TurneroAleatorio();
});
