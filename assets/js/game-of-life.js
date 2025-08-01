class GameOfLife {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    this.cellSize = 3; // 300% bigger (3 * 3 = 9)
    this.cols = Math.floor(this.width / this.cellSize);
    this.rows = Math.floor(this.height / this.cellSize);
    
    // Initialize grid
    this.grid = this.createGrid();
    this.nextGrid = this.createGrid();
    
    // Fade effect tracking
    this.fadeGrid = this.createGrid();
    this.fadeInGrid = this.createGrid(); // Track fade-in effects
    this.fadeOutGrid = this.createGrid(); // Track fade-out effects for dying cells
    this.fadeDuration = 480; // 20x longer fade for more steps
    this.fadeInDuration = 120; // Much longer fade-in duration for more steps
    this.fadeOutDuration = 240; // Much longer fade-out duration for more steps
    
    // Color tracking
    this.ageGrid = this.createGrid(); // Track how long cells have been alive
    this.currentPaletteIndex = 0; // Start with Starlight White palette
    
    // Night Sky color palettes using HSLA
    this.colorPalettes = [
      // Starlight White
      [
        'hsla(0, 0%, 60%, 1)', 'hsla(0, 0%, 70%, 1)', 'hsla(0, 0%, 80%, 1)', 'hsla(0, 0%, 85%, 1)', 'hsla(0, 0%, 90%, 1)',
        'hsla(0, 0%, 93%, 1)', 'hsla(0, 0%, 96%, 1)', 'hsla(0, 0%, 98%, 1)', 'hsla(0, 0%, 99%, 1)', 'hsla(0, 0%, 100%, 1)'
      ],
      // Blue Stars
      [
        'hsla(220, 30%, 50%, 1)', 'hsla(220, 40%, 60%, 1)', 'hsla(220, 50%, 70%, 1)', 'hsla(220, 60%, 80%, 1)', 'hsla(220, 70%, 85%, 1)',
        'hsla(220, 80%, 90%, 1)', 'hsla(220, 90%, 93%, 1)', 'hsla(220, 100%, 96%, 1)', 'hsla(220, 100%, 98%, 1)', 'hsla(220, 100%, 100%, 1)'
      ],
      // Golden Stars
      [
        'hsla(45, 40%, 50%, 1)', 'hsla(45, 50%, 60%, 1)', 'hsla(45, 60%, 70%, 1)', 'hsla(45, 70%, 80%, 1)', 'hsla(45, 80%, 85%, 1)',
        'hsla(45, 90%, 90%, 1)', 'hsla(45, 100%, 93%, 1)', 'hsla(45, 100%, 96%, 1)', 'hsla(45, 100%, 98%, 1)', 'hsla(45, 100%, 100%, 1)'
      ],
      // Purple Nebula
      [
        'hsla(280, 30%, 50%, 1)', 'hsla(280, 40%, 60%, 1)', 'hsla(280, 50%, 70%, 1)', 'hsla(280, 60%, 80%, 1)', 'hsla(280, 70%, 85%, 1)',
        'hsla(280, 80%, 90%, 1)', 'hsla(280, 90%, 93%, 1)', 'hsla(280, 100%, 96%, 1)', 'hsla(280, 100%, 98%, 1)', 'hsla(280, 100%, 100%, 1)'
      ],
      // Green Aurora
      [
        'hsla(160, 30%, 50%, 1)', 'hsla(160, 40%, 60%, 1)', 'hsla(160, 50%, 70%, 1)', 'hsla(160, 60%, 80%, 1)', 'hsla(160, 70%, 85%, 1)',
        'hsla(160, 80%, 90%, 1)', 'hsla(160, 90%, 93%, 1)', 'hsla(160, 100%, 96%, 1)', 'hsla(160, 100%, 98%, 1)', 'hsla(160, 100%, 100%, 1)'
      ],
      // Red Giant
      [
        'hsla(15, 40%, 50%, 1)', 'hsla(15, 50%, 60%, 1)', 'hsla(15, 60%, 70%, 1)', 'hsla(15, 70%, 80%, 1)', 'hsla(15, 80%, 85%, 1)',
        'hsla(15, 90%, 90%, 1)', 'hsla(15, 100%, 93%, 1)', 'hsla(15, 100%, 96%, 1)', 'hsla(15, 100%, 98%, 1)', 'hsla(15, 100%, 100%, 1)'
      ],
      // Cyan Pulsar
      [
        'hsla(180, 30%, 50%, 1)', 'hsla(180, 40%, 60%, 1)', 'hsla(180, 50%, 70%, 1)', 'hsla(180, 60%, 80%, 1)', 'hsla(180, 70%, 85%, 1)',
        'hsla(180, 80%, 90%, 1)', 'hsla(180, 90%, 93%, 1)', 'hsla(180, 100%, 96%, 1)', 'hsla(180, 100%, 98%, 1)', 'hsla(180, 100%, 100%, 1)'
      ],
      // Silver Moon
      [
        'hsla(0, 0%, 50%, 1)', 'hsla(0, 0%, 60%, 1)', 'hsla(0, 0%, 70%, 1)', 'hsla(0, 0%, 80%, 1)', 'hsla(0, 0%, 85%, 1)',
        'hsla(0, 0%, 90%, 1)', 'hsla(0, 0%, 93%, 1)', 'hsla(0, 0%, 96%, 1)', 'hsla(0, 0%, 98%, 1)', 'hsla(0, 0%, 100%, 1)'
      ]
    ];
    
    this.colorPalette = this.colorPalettes[this.currentPaletteIndex];
    
    // Initialize with some interesting patterns
    this.initializePatterns();
    
    // Animation settings
    this.isRunning = true;
    this.speed = 200; // slower animation (was 50ms, now 200ms)
    
    // Auto color cycling
    this.autoCycle = false; // Disabled - stays on selected palette
    this.cycleSpeed = 10; // frames between palette changes
    this.cycleCounter = 0;
    
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
    
    // Add just a few gliders spread out
    this.addGlider(10, 10);
    this.addGlider(50, 50);
    this.addGlider(90, 90);
    
    // Add just a couple oscillators
    this.addBlinker(30, 80);
    this.addToad(70, 120);
    
    // Add one complex pattern
    this.addPulsar(150, 40);
    
    // Add very few random cells
    this.addRandomCells(0.03);
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
  
  // Add new patterns periodically to prevent stasis
  addRandomPatterns() {
    // Much less aggressive pattern injection for lower density
    if (Math.random() < 0.05) { // 5% chance per frame (3x less frequent)
      const patterns = [
        () => this.addGlider(Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.cols)),
        () => this.addBlinker(Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.cols)),
        () => this.addToad(Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.cols)),
        () => this.addBeacon(Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.cols)),
        () => this.addPulsar(Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.cols)),
        () => this.addPentadecathlon(Math.floor(Math.random() * this.rows), Math.floor(Math.random() * this.cols))
        // Removed random cells from pattern injection
      ];
      
      const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
      randomPattern();
    }
    
    // Very infrequent random cell injection
    if (Math.random() < 0.005) { // 0.5% chance per frame (2x less frequent)
      this.addRandomCells(0.01); // Much lower density (0.01 instead of 0.02)
    }
  }
  

  
  // Auto color cycling
  updateColorCycle() {
    if (this.autoCycle) {
      this.cycleCounter++;
      if (this.cycleCounter >= this.cycleSpeed) {
        this.nextPalette();
        this.cycleCounter = 0;
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
            this.fadeOutGrid[i][j] = this.fadeOutDuration; // Start fade-out
            this.fadeGrid[i][j] = this.fadeDuration; // Start long fade
          } else {
            this.nextGrid[i][j] = 1; // Survives
            this.fadeGrid[i][j] = 0; // No fade
            this.fadeOutGrid[i][j] = 0; // No fade-out
            // Age the cell
            this.ageGrid[i][j] = Math.min(this.ageGrid[i][j] + 1, this.colorPalette.length - 1);
          }
        } else {
          // Dead cell
          if (neighbors === 3) {
            this.nextGrid[i][j] = 1; // Born
            this.fadeGrid[i][j] = 0; // No fade
            this.fadeInGrid[i][j] = this.fadeInDuration; // Start fade-in
            this.fadeOutGrid[i][j] = 0; // No fade-out
            this.ageGrid[i][j] = 0; // Reset age for new cell
          } else {
            this.nextGrid[i][j] = 0; // Stays dead
            // Don't change fadeGrid for staying dead
          }
        }
      }
    }
    
    // Update fade grids
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.fadeGrid[i][j] > 0) {
          this.fadeGrid[i][j]--;
        }
        if (this.fadeInGrid[i][j] > 0) {
          this.fadeInGrid[i][j]--;
        }
        if (this.fadeOutGrid[i][j] > 0) {
          this.fadeOutGrid[i][j]--;
        }
      }
    }
    
    // Add random patterns to prevent stasis
    this.addRandomPatterns();
    
    // Update auto color cycling
    this.updateColorCycle();
    
    // Swap grids
    [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
  }
  
  draw() {
    // Clear canvas with night sky background
    this.ctx.fillStyle = '#0a0a1a'; // Deep night sky blue
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw cells with color and fade effects
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.grid[i][j] === 1 || this.fadeGrid[i][j] > 0 || this.fadeOutGrid[i][j] > 0) {
          const x = j * this.cellSize;
          const y = i * this.cellSize;
          const size = this.cellSize;
          const radius = 2; // Rounded corner radius
          
          // Calculate opacity based on multi-layer fade with easing
          let opacity = 1;
          let fadeInOpacity = 1;
          let fadeOutOpacity = 1;
          
          // Fade-in effect (new cells)
          if (this.fadeInGrid[i][j] > 0) {
            const fadeInProgress = this.fadeInGrid[i][j] / this.fadeInDuration;
            fadeInOpacity = 1 - Math.pow(fadeInProgress, 0.2); // Even smoother ease-in
          }
          
          // Fade-out effect (dying cells)
          if (this.fadeOutGrid[i][j] > 0) {
            const fadeOutProgress = this.fadeOutGrid[i][j] / this.fadeOutDuration;
            fadeOutOpacity = Math.pow(fadeOutProgress, 0.2); // Even smoother ease-out
          }
          
          // Long fade effect (ghost trails)
          if (this.fadeGrid[i][j] > 0) {
            const fadeProgress = this.fadeGrid[i][j] / this.fadeDuration;
            opacity = Math.pow(fadeProgress, 0.2); // Even smoother ease-out
          }
          
          // Combine all fade effects
          opacity = Math.min(opacity, fadeInOpacity, fadeOutOpacity);
          
          // Get color based on cell age
          let baseColor = this.colorPalette[0]; // Use first color of current palette as base
          if (this.grid[i][j] === 1) {
            const age = this.ageGrid[i][j];
            baseColor = this.colorPalette[Math.min(age, this.colorPalette.length - 1)];
          }
          
          // Handle HSLA colors with opacity
          const alpha = Math.max(0.05, opacity);
          
          // If it's an HSLA color, modify the alpha
          if (baseColor.startsWith('hsla')) {
            this.ctx.fillStyle = baseColor.replace(/1\)$/, `${alpha})`);
          } else {
            // Fallback for any remaining hex colors
            const hex = baseColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          }
          
          this.ctx.lineWidth = 1;
          
          // Draw rounded rectangle
          this.ctx.beginPath();
          this.ctx.roundRect(x, y, size, size, radius);
          this.ctx.fill();
          // this.ctx.stroke();
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
    // Reset fade grids and age grid
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.fadeGrid[i][j] = 0;
        this.fadeInGrid[i][j] = 0;
        this.fadeOutGrid[i][j] = 0;
        this.ageGrid[i][j] = 0;
      }
    }
  }
  
  nextPalette() {
    this.currentPaletteIndex = (this.currentPaletteIndex + 1) % this.colorPalettes.length;
    this.colorPalette = this.colorPalettes[this.currentPaletteIndex];
  }
  
  previousPalette() {
    this.currentPaletteIndex = (this.currentPaletteIndex - 1 + this.colorPalettes.length) % this.colorPalettes.length;
    this.colorPalette = this.colorPalettes[this.currentPaletteIndex];
  }
  
  setPalette(index) {
    if (index >= 0 && index < this.colorPalettes.length) {
      this.currentPaletteIndex = index;
      this.colorPalette = this.colorPalettes[this.currentPaletteIndex];
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
      } else if (e.key === 'ArrowRight') {
        game.nextPalette();
      } else if (e.key === 'ArrowLeft') {
        game.previousPalette();
      } else if (e.key >= '1' && e.key <= '8') {
        game.setPalette(parseInt(e.key) - 1);
      }
    });
  }
}); 