let filas, columnas, cantidadMinas;
let tablero = [];
let juegoTerminado = false;

function establecerDificultad(level) {
    switch (level) {
        case 'facil':
            filas = 8;
            columnas = 8;
            cantidadMinas = 10;
            break;
        case 'medio':
            filas = 12;
            columnas = 12;
            cantidadMinas = 24;
            break;
        case 'dificil':
            filas = 14;
            columnas = 14;
            cantidadMinas = 32;
            break;
    }
}

function crearTablero() {
    // Inicializar el tablero con ceros
    tablero = [];
    for (let i = 0; i < filas; i++) {
        let fila = [];
        for (let j = 0; j < columnas; j++) {
            fila.push(0);
        }
        tablero.push(fila);
    }

    // Colocar minas en el tablero
    let minasColocadas = 0;
    while (minasColocadas < cantidadMinas) {
        const filaAleatoria = Math.floor(Math.random() * filas);
        const columnaAleatoria = Math.floor(Math.random() * columnas);

        if (tablero[filaAleatoria][columnaAleatoria] === 0) {
            tablero[filaAleatoria][columnaAleatoria] = 'M'; // Colocar mina
            minasColocadas++;

            // Incrementar los contadores alrededor de la mina
            for (let incrementoFila = -1; incrementoFila <= 1; incrementoFila++) {
                for (let incrementoColumna = -1; incrementoColumna <= 1; incrementoColumna++) {
                    const nuevaFila = filaAleatoria + incrementoFila;
                    const nuevaColumna = columnaAleatoria + incrementoColumna;

                    if (nuevaFila >= 0 && nuevaFila < filas &&
                        nuevaColumna >= 0 && nuevaColumna < columnas &&
                        tablero[nuevaFila][nuevaColumna] !== 'M') {
                        tablero[nuevaFila][nuevaColumna]++;
                    }
                }
            }
        }
    }
}

function generarTableroVisual() {
    const divJuego = document.getElementById('game');
    divJuego.innerHTML = ''; // Limpiar el tablero visual
    divJuego.style.gridTemplateColumns = `repeat(${columnas}, 30px)`; // Ajustar las columnas según la dificultad

    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
            const celda = document.createElement('div');
            celda.classList.add('cell');
            celda.dataset.fila = fila;
            celda.dataset.columna = columna;
            celda.addEventListener('click', manejarClickCelda);
            divJuego.appendChild(celda);
        }
    }
}

function manejarClickCelda(evento) {
    if (juegoTerminado) return;

    const celda = evento.target;
    const fila = parseInt(celda.dataset.fila);
    const columna = parseInt(celda.dataset.columna);

    if (tablero[fila][columna] === 'M') {
        celda.classList.add('mina');
        revelarTodasLasMinas();
        alert('¡Has perdido!');
        juegoTerminado = true;
    } else {
        revelarCelda(fila, columna);
    }
}

function revelarCelda(fila, columna) {
    const celda = document.querySelector(`[data-fila='${fila}'][data-columna='${columna}']`);
    if (!celda || celda.classList.contains('abierta')) return;

    celda.classList.add('abierta');
    celda.textContent = tablero[fila][columna] || ''; // Mostrar número o dejar vacío si es 0

    // Si la celda es 0, revelar las celdas adyacentes recursivamente
    if (tablero[fila][columna] === 0) {
        for (let incrementoFila = -1; incrementoFila <= 1; incrementoFila++) {
            for (let incrementoColumna = -1; incrementoColumna <= 1; incrementoColumna++) {
                const nuevaFila = fila + incrementoFila;
                const nuevaColumna = columna + incrementoColumna;

                if (nuevaFila >= 0 && nuevaFila < filas && 
                    nuevaColumna >= 0 && nuevaColumna < columnas) {
                    revelarCelda(nuevaFila, nuevaColumna);
                }
            }
        }
    }
}

function revelarTodasLasMinas() {
    const celdas = document.getElementsByClassName('cell');
    for (let i = 0; i < celdas.length; i++) {
        const celda = celdas[i];
        const fila = celda.dataset.fila;
        const columna = celda.dataset.columna;

        if (tablero[fila][columna] === 'M') {
            celda.classList.add('mina');
        }
    }
}

function reiniciarJuego() {
    const selectorDificultad = document.getElementById('level');
    const nivel = selectorDificultad.value;
    establecerDificultad(nivel);
    juegoTerminado = false;
    crearTablero();
    generarTableroVisual();
}

document.getElementById('reset').addEventListener('click', reiniciarJuego);
document.getElementById('level').addEventListener('change', reiniciarJuego);
reiniciarJuego(); // Inicializar el juego al cargar la página
