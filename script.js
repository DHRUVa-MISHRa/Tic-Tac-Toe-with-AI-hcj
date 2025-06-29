const cells = document.querySelectorAll('.cell');
const statusDiv = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let board = Array(9).fill('');
let currentPlayer = 'X'; // Human
let gameActive = true;

// All possible winning combinations
const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // columns
  [0,4,8], [2,4,6]           // diagonals
];

// Handle cell click
cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', restartGame);

function handleCellClick(e) {
  const idx = e.target.getAttribute('data-index');
  if (!gameActive || board[idx] !== '') return;

  board[idx] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin(board, currentPlayer)) {
    statusDiv.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  } else if (board.every(cell => cell !== '')) {
    statusDiv.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = 'O';
  statusDiv.textContent = "Computer's turn...";
  setTimeout(computerMove, 500);
}

// AI Move (Minimax Algorithm)
function computerMove() {
  const bestMove = minimax(board, 'O').index;
  board[bestMove] = 'O';
  cells[bestMove].textContent = 'O';

  if (checkWin(board, 'O')) {
    statusDiv.textContent = "Computer wins!";
    gameActive = false;
  } else if (board.every(cell => cell !== '')) {
    statusDiv.textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = 'X';
    statusDiv.textContent = "Your turn";
  }
}

// Check for win
function checkWin(board, player) {
  return winPatterns.some(pattern =>
    pattern.every(idx => board[idx] === player)
  );
}

// Minimax Algorithm for AI
function minimax(newBoard, player) {
  // Get available spots
  const availSpots = newBoard
    .map((val, idx) => val === '' ? idx : null)
    .filter(idx => idx !== null);

  // Check for terminal states
  if (checkWin(newBoard, 'X')) return { score: -10 };
  if (checkWin(newBoard, 'O')) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  // Collect all moves and their scores
  const moves = [];
  for (let i of availSpots) {
    let move = {};
    move.index = i;
    newBoard[i] = player;

    if (player === 'O') {
      let result = minimax(newBoard, 'X');
      move.score = result.score;
    } else {
      let result = minimax(newBoard, 'O');
      move.score = result.score;
    }

    newBoard[i] = '';
    moves.push(move);
  }

  // Choose the best move
  let bestMove;
  if (player === 'O') {
    let bestScore = -Infinity;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

function restartGame() {
  board = Array(9).fill('');
  cells.forEach(cell => cell.textContent = '');
  statusDiv.textContent = '';
  currentPlayer = 'X';
  gameActive = true;
}
