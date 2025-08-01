/**
 * TimeSweeper Game
 * A time-based version of minesweeper
 */

class TimeSweeper {
  constructor() {
    this.boardSize = 8;
    this.mineCount = 10;
    this.timeLimit = 60; // seconds
    this.board = [];
    this.revealed = [];
    this.flagged = [];
    this.gameStarted = false;
    this.gameOver = false;
    this.score = 0;
    this.timeRemaining = this.timeLimit;
    this.timer = null;
    
    this.elements = {
      board: document.getElementById('timesweeper-board'),
      time: document.getElementById('game-time'),
      score: document.getElementById('game-score'),
      newGameBtn: document.getElementById('new-game-btn'),
      pauseBtn: document.getElementById('pause-btn')
    };
    
    this.init();
  }

  init() {
    this.createBoard();
    this.renderBoard();
    this.bindEvents();
    this.updateDisplay();
  }

  createBoard() {
    // Initialize empty board
    this.board = [];
    this.revealed = [];
    this.flagged = [];
    
    for (let i = 0; i < this.boardSize; i++) {
      this.board[i] = [];
      this.revealed[i] = [];
      this.flagged[i] = [];
      for (let j = 0; j < this.boardSize; j++) {
        this.board[i][j] = 0;
        this.revealed[i][j] = false;
        this.flagged[i][j] = false;
      }
    }
  }

  placeMines(firstX, firstY) {
    let minesPlaced = 0;
    
    while (minesPlaced < this.mineCount) {
      const x = Math.floor(Math.random() * this.boardSize);
      const y = Math.floor(Math.random() * this.boardSize);
      
      // Don't place mine on first click or already mined cell
      if ((x !== firstX || y !== firstY) && this.board[x][y] !== -1) {
        this.board[x][y] = -1; // -1 represents a mine
        minesPlaced++;
      }
    }
    
    // Calculate numbers for adjacent cells
    this.calculateNumbers();
  }

  calculateNumbers() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] !== -1) {
          let count = 0;
          // Check all 8 adjacent cells
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              const ni = i + di;
              const nj = j + dj;
              if (ni >= 0 && ni < this.boardSize && nj >= 0 && nj < this.boardSize) {
                if (this.board[ni][nj] === -1) count++;
              }
            }
          }
          this.board[i][j] = count;
        }
      }
    }
  }

  renderBoard() {
    if (!this.elements.board) return;
    
    this.elements.board.innerHTML = '';
    
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'game-cell';
        cell.dataset.x = i;
        cell.dataset.y = j;
        
        if (this.revealed[i][j]) {
          cell.classList.add('revealed');
          if (this.board[i][j] === -1) {
            cell.classList.add('mine');
            cell.textContent = '💣';
          } else if (this.board[i][j] > 0) {
            cell.classList.add(`number-${this.board[i][j]}`);
            cell.textContent = this.board[i][j];
          }
        } else if (this.flagged[i][j]) {
          cell.classList.add('flagged');
          cell.textContent = '🚩';
        }
        
        this.elements.board.appendChild(cell);
      }
    }
  }

  bindEvents() {
    if (!this.elements.board) return;
    
    this.elements.board.addEventListener('click', (e) => {
      if (e.target.classList.contains('game-cell')) {
        this.handleClick(
          parseInt(e.target.dataset.x),
          parseInt(e.target.dataset.y)
        );
      }
    });
    
    this.elements.board.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (e.target.classList.contains('game-cell')) {
        this.handleRightClick(
          parseInt(e.target.dataset.x),
          parseInt(e.target.dataset.y)
        );
      }
    });
    
    if (this.elements.newGameBtn) {
      this.elements.newGameBtn.addEventListener('click', () => {
        this.newGame();
      });
    }
    
    if (this.elements.pauseBtn) {
      this.elements.pauseBtn.addEventListener('click', () => {
        this.togglePause();
      });
    }
  }

  handleClick(x, y) {
    if (this.gameOver || this.flagged[x][y]) return;
    
    if (!this.gameStarted) {
      this.startGame(x, y);
    }
    
    if (this.board[x][y] === -1) {
      this.gameOver = true;
      this.revealAll();
      this.stopTimer();
      setTimeout(() => {
        alert('Game Over! You hit a mine!');
      }, 100);
      return;
    }
    
    this.revealCell(x, y);
    this.renderBoard();
    this.updateDisplay();
    
    if (this.checkWin()) {
      this.gameOver = true;
      this.stopTimer();
      this.score += Math.floor(this.timeRemaining * 10);
      setTimeout(() => {
        alert(`Congratulations! You won! Score: ${this.score}`);
      }, 100);
    }
  }

  handleRightClick(x, y) {
    if (this.gameOver || this.revealed[x][y]) return;
    
    this.flagged[x][y] = !this.flagged[x][y];
    this.renderBoard();
    this.updateDisplay();
  }

  revealCell(x, y) {
    if (x < 0 || x >= this.boardSize || y < 0 || y >= this.boardSize) return;
    if (this.revealed[x][y] || this.flagged[x][y]) return;
    
    this.revealed[x][y] = true;
    this.score += 10;
    
    if (this.board[x][y] === 0) {
      // Reveal adjacent cells for empty cells
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          this.revealCell(x + di, y + dj);
        }
      }
    }
  }

  revealAll() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        this.revealed[i][j] = true;
      }
    }
    this.renderBoard();
  }

  startGame(firstX, firstY) {
    this.gameStarted = true;
    this.placeMines(firstX, firstY);
    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      this.updateDisplay();
      
      if (this.timeRemaining <= 0) {
        this.gameOver = true;
        this.stopTimer();
        this.revealAll();
        setTimeout(() => {
          alert('Time\'s up! Game Over!');
        }, 100);
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  togglePause() {
    if (this.gameOver || !this.gameStarted) return;
    
    if (this.timer) {
      this.stopTimer();
      this.elements.pauseBtn.textContent = 'Resume';
    } else {
      this.startTimer();
      this.elements.pauseBtn.textContent = 'Pause';
    }
  }

  newGame() {
    this.stopTimer();
    this.gameStarted = false;
    this.gameOver = false;
    this.score = 0;
    this.timeRemaining = this.timeLimit;
    this.createBoard();
    this.renderBoard();
    this.updateDisplay();
    this.elements.pauseBtn.textContent = 'Pause';
  }

  checkWin() {
    let revealedCount = 0;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.revealed[i][j] && this.board[i][j] !== -1) {
          revealedCount++;
        }
      }
    }
    return revealedCount === (this.boardSize * this.boardSize - this.mineCount);
  }

  updateDisplay() {
    if (this.elements.time) {
      this.elements.time.textContent = this.timeRemaining;
    }
    if (this.elements.score) {
      this.elements.score.textContent = this.score;
    }
  }
}

// Initialize TimeSweeper when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const gameBoard = document.getElementById('timesweeper-board');
  if (gameBoard) {
    new TimeSweeper();
  }
}); 