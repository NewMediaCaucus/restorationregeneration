class GameOfLife {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.cellSize = 12; // 300% bigger (3 * 3 = 9)
    this.cols = Math.floor(this.width / this.cellSize);
    this.rows = Math.floor(this.height / this.cellSize);
    
    // Initialize grid
    this.grid = this.createGrid();
    this.nextGrid = this.createGrid();
    
    // Fade effect tracking
    this.fadeGrid = this.createGrid();
    this.fadeDuration = 24; // Longer fade for smoother effect
    
    // Initialize with some interesting patterns
    this.initializePatterns();
    
    // Animation settings
    this.isRunning = true;
    this.speed = 50; // much faster for smoother animation
    
    this.animate();
  }
  
  createGrid() {
    const grid = [];
    for (let i = 0; i < this.rows; i++) {
      grid[i] = [];
      for (let j = 0; j < this.cols; j++) {
        grid[i][j] = 0;
      }
    }
    return grid;
  }
  
  initializePatterns() {
    // Clear grid
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = 0;
      }
    }
    
    // Add a few gliders
    this.addGlider(5, 5);
    this.addGlider(25, 15);
    this.addGlider(45, 25);
    
    // Add a couple oscillators
    this.addBlinker(15, 40);
    this.addToad(35, 60);
    this.addBeacon(55, 80);
    
    // Add one complex pattern
    this.addPulsar(75, 20);
    
    // Add random cells with lower density
    this.addRandomCells(0.08);
  }
  
  addGlider(row, col) {
    const pattern = [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1]
    ];
    this.addPattern(pattern, row, col);
  }
  
  addBlinker(row, col) {
    const pattern = [
      [1],
      [1],
      [1]
    ];
    this.addPattern(pattern, row, col);
  }
  
  addToad(row, col) {
    const pattern = [
      [0, 1, 1, 1],
      [1, 1, 1, 0]
    ];
    this.addPattern(pattern, row, col);
  }
  
  addBeacon(row, col) {
    const pattern = [
      [1, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 1, 1]
    ];
    this.addPattern(pattern, row, col);
  }
  
  addPulsar(row, col) {
    const pattern = [
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0]
    ];
    this.addPattern(pattern, row, col);
  }
  
  addPentadecathlon(row, col) {
    const pattern = [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0]
    ];
    this.addPattern(pattern, row, col);
  }
  
  addPattern(pattern, startRow, startCol) {
    for (let i = 0; i < pattern.length; i++) {
      for (let j = 0; j < pattern[i].length; j++) {
        const row = startRow + i;
        const col = startCol + j;
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
          this.grid[row][col] = pattern[i][j];
        }
      }
    }
  }
  
  addRandomCells(density) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.random() < density) {
          this.grid[i][j] = 1;
        }
      }
    }
  }
  
  countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        
        const newRow = row + i;
        const newCol = col + j;
        
        if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols) {
          count += this.grid[newRow][newCol];
        }
      }
    }
    return count;
  }
  
  nextGeneration() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const neighbors = this.countNeighbors(i, j);
        const current = this.grid[i][j];
        
        // Conway's Game of Life rules
        if (current === 1) {
          // Live cell
          if (neighbors < 2 || neighbors > 3) {
            this.nextGrid[i][j] = 0; // Dies
            this.fadeGrid[i][j] = this.fadeDuration; // Start fade
          } else {
            this.nextGrid[i][j] = 1; // Survives
            this.fadeGrid[i][j] = 0; // No fade
          }
        } else {
          // Dead cell
          if (neighbors === 3) {
            this.nextGrid[i][j] = 1; // Born
            this.fadeGrid[i][j] = 0; // No fade
          } else {
            this.nextGrid[i][j] = 0; // Stays dead
            // Don't change fadeGrid for staying dead
          }
        }
      }
    }
    
    // Update fade grid
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.fadeGrid[i][j] > 0) {
          this.fadeGrid[i][j]--;
        }
      }
    }
    
    // Swap grids
    [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
  }
  
  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw cells with fade effect
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.grid[i][j] === 1 || this.fadeGrid[i][j] > 0) {
          const x = j * this.cellSize;
          const y = i * this.cellSize;
          const size = this.cellSize;
          const radius = 2; // Rounded corner radius
          
          // Calculate opacity based on fade with easing
          let opacity = 1;
          if (this.fadeGrid[i][j] > 0) {
            const fadeProgress = this.fadeGrid[i][j] / this.fadeDuration;
            // Use ease-out function for smoother fade
            opacity = Math.pow(fadeProgress, 0.7);
          }
          
          // Set color with opacity and add subtle glow effect
          const alpha = Math.max(0.05, opacity); // Lower minimum for longer trails
          this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
          this.ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.8})`; // Slightly transparent stroke
          this.ctx.lineWidth = 1;
          
          // Draw rounded rectangle
          this.ctx.beginPath();
          this.ctx.roundRect(x, y, size, size, radius);
          this.ctx.fill();
          this.ctx.stroke();
        }
      }
    }
  }
  
  animate() {
    if (this.isRunning) {
      this.nextGeneration();
      this.draw();
      // Use requestAnimationFrame for smoother animation
      setTimeout(() => this.animate(), this.speed);
    }
  }
  
  toggle() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      this.animate();
    }
  }
  
  reset() {
    this.initializePatterns();
    // Reset fade grid
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.fadeGrid[i][j] = 0;
      }
    }
  }
  
  // Add click interaction to toggle cells
  handleClick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      this.grid[row][col] = this.grid[row][col] ? 0 : 1;
      this.draw();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('game-of-life-canvas');
  if (canvas) {
    const game = new GameOfLife(canvas);
    
    // Add click interaction
    canvas.addEventListener('click', (e) => game.handleClick(e));
    
    // Make game globally accessible for controls
    window.gameOfLife = game;
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if (e.key === ' ') {
        e.preventDefault();
        game.toggle();
      } else if (e.key === 'r') {
        game.reset();
      }
    });
  }
}); 