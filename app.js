// Función para seleccionar elementos del DOM de forma segura
function $(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.error(`Elemento con ID '${id}' no encontrado`);
        return null;
    }
    return element;
}

// Seleccionar elementos del DOM
const entradaContrasena = $('password-input');
const botonReintentar = $('retry-btn');
const botonCopiar = $('copy-btn');
const casillaMayusculas = $('mayus');
const casillaMinusculas = $('minus');
const casillaNumeros = $('numeros');
const casillaSimbolos = $('simbolos');
const entradaRango = $('rango-entrada');
const salidaRango = $('rango-salida');
const botonMenos = $('menos');
const botonMas = $('mas');
const elementoNivel = $('nivel');
const elementoImagen = $('imagen');
const mensajeCopiado = $('mensaje-copiado');
const mensajeError = $('mensaje-error');

// Caracteres disponibles
const mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const minusculas = 'abcdefghijklmnopqrstuvwxyz';
const numeros = '0123456789';
const simbolos = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// Imágenes de Majin Buu
const imagenes = {
    debil: '/majinFlaco.png',
    normal: '/majinFuerte.png',
    fuerte: '/majinGordo.png',
    nada: '/nada.png'
};

// Función para aplicar la animación de deslizamiento
function aplicarAnimacionDeslizamiento() {
    elementoImagen.classList.remove('deslizarEntrada');
    void elementoImagen.offsetWidth; // Forzar un reflow
    elementoImagen.classList.add('deslizarEntrada');
}

// Función para generar contraseña
function generarContrasena() {
    let caracteres = '';
    if (casillaMayusculas.checked) caracteres += mayusculas;
    if (casillaMinusculas.checked) caracteres += minusculas;
    if (casillaNumeros.checked) caracteres += numeros;
    if (casillaSimbolos.checked) caracteres += simbolos;

    if (caracteres === '') {
        entradaContrasena.value = 'Selecciona al menos un tipo de carácter';
        elementoNivel.textContent = 'Inválido';
        elementoNivel.style.color = 'gray';
        elementoImagen.src = imagenes.nada;
        aplicarAnimacionDeslizamiento();
        return;
    }

    let contrasena = '';
    const longitud = parseInt(entradaRango.value);
    for (let i = 0; i < longitud; i++) {
        contrasena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    entradaContrasena.value = contrasena;
    actualizarNivel(contrasena);
}

// Función para actualizar el nivel de seguridad
function actualizarNivel(contrasena) {
    const longitud = contrasena.length;
    const tiposCaracteres = (casillaMayusculas.checked ? 1 : 0) +
        (casillaMinusculas.checked ? 1 : 0) +
        (casillaNumeros.checked ? 1 : 0) +
        (casillaSimbolos.checked ? 1 : 0);

    let nivel, imagen;

    if (longitud >= 15 || (longitud >= 12 && tiposCaracteres >= 3)) {
        nivel = 'Fuerte';
        imagen = imagenes.fuerte;
    } else if (longitud >= 8 && tiposCaracteres >= 2) {
        nivel = 'Normal';
        imagen = imagenes.normal;
    } else {
        nivel = 'Débil';
        imagen = imagenes.debil;
    }

    elementoNivel.textContent = nivel;
    elementoImagen.src = imagen;
    aplicarAnimacionDeslizamiento();

    // Cambiar color del texto según el nivel
    switch (nivel) {
        case 'Fuerte':
            elementoNivel.style.color = 'black';
            break;
        case 'Normal':
            elementoNivel.style.color = 'purple';
            break;
        case 'Débil':
            elementoNivel.style.color = 'white';
            break;
    }
}

// Función para mostrar el mensaje de copiado
function mostrarMensajeCopiado() {
    mostrarMensaje(mensajeCopiado, 'Contraseña copiada exitosamente');
}

// Función para mostrar el mensaje de error
function mostrarMensajeError(texto) {
    mostrarMensaje(mensajeError, texto);
}

// Función genérica para mostrar mensajes
function mostrarMensaje(elemento, texto) {
    elemento.textContent = texto;
    elemento.classList.add('visible');
    setTimeout(() => {
        elemento.classList.remove('visible');
    }, 2000);
}

// Función para inicializar el estado de la página
function inicializarPagina() {
    // Asegurarse de que al menos un tipo de carácter esté seleccionado
    if (!casillaMayusculas.checked && !casillaMinusculas.checked &&
        !casillaNumeros.checked && !casillaSimbolos.checked) {
        casillaMayusculas.checked = true;
        casillaMinusculas.checked = true;
    }

    // Inicializar el rango de longitud
    salidaRango.textContent = entradaRango.value;

    // Generar contraseña inicial
    generarContrasena();
}

// Event listeners
[casillaMayusculas, casillaMinusculas, casillaNumeros, casillaSimbolos].forEach(casilla => {
    if (casilla) {
        casilla.addEventListener('change', () => {
            const haySeleccion = casillaMayusculas.checked || casillaMinusculas.checked || casillaNumeros.checked || casillaSimbolos.checked;

            if (!haySeleccion) {
                entradaContrasena.value = 'Selecciona al menos un tipo de carácter';
                elementoNivel.textContent = 'Inválido';
                elementoNivel.style.color = 'gray';
                elementoImagen.src = imagenes.nada;
                aplicarAnimacionDeslizamiento();
            } else {
                generarContrasena();
            }
        });
    }
});

if (botonReintentar) {
    botonReintentar.addEventListener('click', generarContrasena);
}

if (botonCopiar) {
    botonCopiar.addEventListener('click', () => {
        if (entradaContrasena.value && entradaContrasena.value !== 'Selecciona al menos un tipo de carácter') {
            entradaContrasena.select();
            document.execCommand('copy');
            mostrarMensajeCopiado();
        } else {
            mostrarMensajeError('No hay una contraseña válida para copiar');
        }
    });
}

if (entradaRango) {
    entradaRango.addEventListener('input', () => {
        salidaRango.textContent = entradaRango.value;
        generarContrasena();
    });
}

if (botonMenos) {
    botonMenos.addEventListener('click', () => {
        if (parseInt(entradaRango.value) > parseInt(entradaRango.min)) {
            entradaRango.value= parseInt(entradaRango.value) - 1;
            salidaRango.textContent = entradaRango.value;
            generarContrasena();
        }
    });
}

if (botonMas) {
    botonMas.addEventListener('click', () => {
        if (entradaRango.value < entradaRango.max) {
            entradaRango.value++;
            salidaRango.textContent = entradaRango.value;
            generarContrasena();
        }
    });
}

// Inicializar la página cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarPagina);
