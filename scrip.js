let rows, cols, minesCount;
let grid = [];
let gameOver = false;

function setDifficulty(level) {
    switch (level) {
        case 'facil':
            rows = 8;
            cols = 8;
            minesCount = 10;
            break;
        case 'medio':
            rows = 16;
            cols = 16;
            minesCount = 40;
            break;
        case 'dificil':
            rows = 22;
            cols = 22;
            minesCount = 96;
            break;
        default:
            rows = 10;
            cols = 10;
            minesCount = 10;
    }
}

function createGrid() {
    grid = Array.from({ length: rows }, () => Array(cols).fill(0));

    // Colocar minas
    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
        const x = Math.floor(Math.random() * rows);
        const y = Math.floor(Math.random() * cols);
        if (grid[x][y] === 0) {
            grid[x][y] = 'X'; // Mina
            minesPlaced++;
            // Incrementar los contadores alrededor
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (x + i >= 0 && x + i < rows && y + j >= 0 && y + j < cols && grid[x + i][y + j] !== 'X') {
                        grid[x + i][y + j]++;
                    }
                }
            }
        }
    }
}

function createBoard() {
    const gameDiv = document.getElementById('game');
    gameDiv.innerHTML = ''; // Limpiar el tablero
    gameDiv.style.gridTemplateColumns = `repeat(${cols}, 30px)`; // Ajustar columnas según la dificultad
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.addEventListener('click', handleCellClick);
            gameDiv.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    if (gameOver) return;
    const cell = event.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;

    if (grid[row][col] === 'X') {
        cell.classList.add('mine');
        alert('¡Has perdido!');
        gameOver = true;
    } else {
        cell.classList.add('open');
        cell.textContent = grid[row][col] || '';
    }
}

function resetGame() {
    const difficultySelect = document.getElementById('level');
    const level = difficultySelect.value;
    setDifficulty(level);
    gameOver = false;
    createGrid();
    createBoard();
}

document.getElementById('reset').addEventListener('click', resetGame);
document.getElementById('level').addEventListener('change', resetGame); // Reiniciar al cambiar dificultad
resetGame(); // Iniciar el juego
