function validarCuilCuit(valor) {
    // 1️⃣ Normalizar: quitar guiones y espacios
    let cuit = valor.replace(/-/g, "").trim();

    // 2️⃣ Validar formato básico: debe tener 11 dígitos
    if (!/^\d{11}$/.test(cuit)) {
        return { valido: false, mensaje: "Formato inválido: debe contener 11 dígitos" };
    }

    // 3️⃣ Extraer partes
    let tipo = parseInt(cuit.substring(0, 2), 10);
    let numero = cuit.substring(2, 10);
    let digitoVerificador = parseInt(cuit[10], 10);

    // 4️⃣ Validar tipo permitido
    const tiposValidos = [20, 23, 24, 27, 30, 33, 34];
    if (!tiposValidos.includes(tipo)) {
        return { valido: false, mensaje: "Tipo de CUIT/CUIL no válido" };
    }

    // 5️⃣ Calcular dígito verificador con Módulo 11
    const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;

    for (let i = 0; i < 10; i++) {
        suma += parseInt(cuit[i], 10) * multiplicadores[i];
    }

    let resto = suma % 11;
    let dvCalculado = 11 - resto;

    if (dvCalculado === 11) dvCalculado = 0;
    else if (dvCalculado === 10) {
        return { valido: false, mensaje: "CUIT/CUIL inválido: dígito verificador no existe (resultado 10)" };
    }

    // 6️⃣ Comparar con el dígito ingresado
    if (dvCalculado === digitoVerificador) {
        return { valido: true, mensaje: "CUIT/CUIL válido" };
    } else {
        return { valido: false, mensaje: "Dígito verificador incorrecto" };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dniForm');
    const input = document.getElementById('DNI');
    const result = document.getElementById('result');
    let hideTimer = null;

    function showMessage(text, ok){
        clearTimeout(hideTimer);
        result.textContent = text;
        result.className = ''; // reset
        result.classList.add(ok ? 'success' : 'error', 'show');
        // mantener visible 4.5s y luego ocultar (opcional)
        hideTimer = setTimeout(()=> result.classList.remove('show'), 4500);
    }

    function validarDNI(valor){
        const sin = String(valor).replace(/\D/g,''); // sólo dígitos
        if (sin.length !== 11) return { ok:false, msg:'El DNI debe tener exactamente 11 dígitos.' };

        const digitos = sin.split('').map(d => parseInt(d,10));
        const tipo = parseInt(sin.slice(0,2),10);
        const validTipos = [20,23,24,27,30,33,34]; // opcional
        if (!validTipos.includes(tipo)) {
            // no obligatorio fallar, sólo advertencia; aquí lo consideramos válido pero avisamos
            // return { ok:false, msg:'Prefijo (dos primeros dígitos) no reconocido.' };
        }

        const mult = [5,4,3,2,7,6,5,4,3,2];
        let suma = 0;
        for(let i=0;i<10;i++){ suma += mult[i] * digitos[i]; }
        const resto = suma % 11;
        let dv = (resto === 0) ? 0 : (resto === 1) ? 9 : (11 - resto);

        if (dv === digitos[10]) {
            return { ok:true, msg: `DNI válido — ${sin.slice(0,2)}-${sin.slice(2,10)}-${sin.slice(10)}` };
        } else {
            return { ok:false, msg: `Dígito verificador incorrecto. Esperado ${dv} (entrada: ${digitos[10]}).` };
        }
    }

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const valor = input.value.trim();
        if (!valor) {
            showMessage('Ingrese un número de documento.', false);
            return;
        }
        const res = validarDNI(valor);
        showMessage(res.msg, res.ok);
    });

    // limpiar resultado si el usuario hace click fuera y vuelve a probar
    input.addEventListener('input', () => {
        result.classList.remove('show');
    });
});
