/**
 * Memory Match Game
 * A card-flipping memory game with emoji pairs
 */

class MemoryGame {
  constructor() {
    this.boardSize = 16; // 4x4 grid
    this.pairs = 8; // 8 pairs of cards
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.gameOver = false;
    this.canFlip = true;
    this.timeRemaining = 0;
    this.timer = null;
    
    // New Media themed emoji pairs for the game
    this.emojiPairs = [
      '💻', '🖥️', '📱', '⌨️', '🖱️', '🎮', '🤖', '⚡'
    ];
    
    this.elements = {
      board: document.getElementById('memory-board'),
      moves: document.getElementById('game-moves'),
      pairs: document.getElementById('game-pairs'),
      newGameBtn: document.getElementById('new-game-btn'),
      shuffleBtn: document.getElementById('shuffle-btn')
    };
    
    this.init();
  }

  init() {
    this.getDaysUntilConference();
    this.createBoard();
    this.renderBoard();
    this.bindEvents();
    this.updateDisplay();
  }

  getDaysUntilConference() {
    // Hardcoded event date: March 6, 2026
    const eventDate = new Date('2026-03-06T00:00:00');
    const now = new Date();
    const timeDifference = eventDate - now;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    this.timeRemaining = Math.max(0, days);
  }

  createBoard() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.gameOver = false;
    this.canFlip = true;
    
    // Create pairs of cards (16 cards for 8 pairs)
    const cardPairs = [];
    for (let i = 0; i < this.pairs; i++) {
      cardPairs.push(this.emojiPairs[i], this.emojiPairs[i]);
    }
    
    // Shuffle the cards
    this.shuffleArray(cardPairs);
    
    // Create card objects
    for (let i = 0; i < this.boardSize; i++) {
      this.cards.push({
        id: i,
        emoji: cardPairs[i],
        isFlipped: false,
        isMatched: false
      });
    }
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  renderBoard() {
    if (!this.elements.board) return;
    
    this.elements.board.innerHTML = '';
    
    for (let i = 0; i < this.boardSize; i++) {
      const card = document.createElement('div');
      card.className = 'game-card';
      card.dataset.id = i;
      
      const cardFront = document.createElement('div');
      cardFront.className = 'card-front';
      cardFront.textContent = '?';
      
      const cardBack = document.createElement('div');
      cardBack.className = 'card-back';
      cardBack.textContent = this.cards[i].emoji;
      
      card.appendChild(cardFront);
      card.appendChild(cardBack);
      
      if (this.cards[i].isFlipped) {
        card.classList.add('flipped');
      }
      
      if (this.cards[i].isMatched) {
        card.classList.add('matched');
      }
      
      this.elements.board.appendChild(card);
    }
  }

  bindEvents() {
    if (!this.elements.board) return;
    
    this.elements.board.addEventListener('click', (e) => {
      if (e.target.closest('.game-card')) {
        const cardElement = e.target.closest('.game-card');
        const cardId = parseInt(cardElement.dataset.id);
        this.handleCardClick(cardId);
      }
    });
    
    if (this.elements.newGameBtn) {
      this.elements.newGameBtn.addEventListener('click', () => {
        this.newGame();
      });
    }
    
    if (this.elements.shuffleBtn) {
      this.elements.shuffleBtn.addEventListener('click', () => {
        this.shuffleGame();
      });
    }
  }

  handleCardClick(cardId) {
    if (this.gameOver || !this.canFlip) return;
    
    const card = this.cards[cardId];
    
    // Don't flip if card is already flipped or matched
    if (card.isFlipped || card.isMatched) return;
    
    // Start timer on first click
    if (this.moves === 0 && this.flippedCards.length === 0) {
      this.startTimer();
    }
    
    // Flip the card
    card.isFlipped = true;
    this.flippedCards.push(cardId);
    this.renderBoard();
    
    // Check if we have two cards flipped
    if (this.flippedCards.length === 2) {
      this.canFlip = false;
      this.moves++;
      this.updateDisplay();
      
      const card1 = this.cards[this.flippedCards[0]];
      const card2 = this.cards[this.flippedCards[1]];
      
      if (card1.emoji === card2.emoji) {
        // Match found!
        card1.isMatched = true;
        card2.isMatched = true;
        this.matchedPairs++;
        
        this.flippedCards = [];
        this.canFlip = true;
        this.renderBoard();
        this.updateDisplay();
        
        // Check for win
        if (this.matchedPairs === this.pairs) {
          this.gameOver = true;
          this.stopTimer();
          setTimeout(() => {
            alert(`Congratulations! You won in ${this.moves} moves with ${this.timeRemaining} seconds remaining!`);
          }, 500);
        }
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          card1.isFlipped = false;
          card2.isFlipped = false;
          this.flippedCards = [];
          this.canFlip = true;
          this.renderBoard();
        }, 1000);
      }
    }
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

  revealAll() {
    for (let i = 0; i < this.boardSize; i++) {
      this.cards[i].isFlipped = true;
    }
    this.renderBoard();
  }

  newGame() {
    this.stopTimer();
    this.getDaysUntilConference();
    this.createBoard();
    this.renderBoard();
    this.updateDisplay();
  }

  shuffleGame() {
    if (this.gameOver) {
      this.newGame();
      return;
    }
    
    // Only shuffle unmatched cards
    const unmatchedCards = this.cards.filter(card => !card.isMatched);
    const unmatchedEmojis = unmatchedCards.map(card => card.emoji);
    
    // Shuffle the unmatched emojis
    this.shuffleArray(unmatchedEmojis);
    
    // Update unmatched cards with new positions
    let emojiIndex = 0;
    for (let i = 0; i < this.boardSize; i++) {
      if (!this.cards[i].isMatched) {
        this.cards[i].emoji = unmatchedEmojis[emojiIndex];
        this.cards[i].isFlipped = false;
        emojiIndex++;
      }
    }
    
    this.flippedCards = [];
    this.canFlip = true;
    this.renderBoard();
  }

  updateDisplay() {
    if (this.elements.moves) {
      this.elements.moves.textContent = this.moves;
    }
    if (this.elements.pairs) {
      this.elements.pairs.textContent = this.matchedPairs;
    }
    
    // Update timer display if it exists
    const timeElement = document.getElementById('game-time');
    if (timeElement) {
      timeElement.textContent = this.timeRemaining;
    }
  }
}

// Initialize Memory Game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const gameBoard = document.getElementById('memory-board');
  if (gameBoard) {
    new MemoryGame();
  }
}); 