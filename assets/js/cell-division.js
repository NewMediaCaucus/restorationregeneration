class CellDivision {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    // Animation settings
    this.isRunning = true;
    this.speed = 80; // Slower for detailed observation
    
    // Cell system
    this.cells = [];
    this.maxCells = 30;
    
    // Chromosome system
    this.chromosomes = [];
    this.maxChromosomes = 50;
    
    // Mitosis phases
    this.phase = 'interphase'; // interphase, prophase, metaphase, anaphase, telophase
    this.phaseTime = 0;
    this.phaseDuration = 200; // frames per phase
    
    // Cellular colors
    this.colors = {
      nucleus: 'hsla(240, 70%, 60%, 1)',
      cytoplasm: 'hsla(60, 40%, 80%, 1)',
      membrane: 'hsla(0, 0%, 90%, 1)',
      chromosome: 'hsla(280, 80%, 70%, 1)',
      spindle: 'hsla(200, 90%, 60%, 1)',
      centriole: 'hsla(30, 80%, 50%, 1)',
      division: 'hsla(120, 70%, 60%, 1)'
    };
    
    this.initializeCells();
    this.animate();
  }
  
  // Cell class
  createCell(x, y) {
    return {
      x: x,
      y: y,
      radius: Math.random() * 20 + 15,
      nucleusRadius: 0,
      maxNucleusRadius: Math.random() * 8 + 4,
      chromosomes: [],
      centrioles: [],
      spindle: null,
      divisionProgress: 0,
      phase: 'interphase',
      age: 0,
      health: 1,
      dividing: false
    };
  }
  
  // Chromosome class
  createChromosome(x, y) {
    return {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      length: Math.random() * 15 + 10,
      width: Math.random() * 2 + 1,
      angle: Math.random() * Math.PI * 2,
      attached: false,
      targetX: 0,
      targetY: 0
    };
  }
  
  // Initialize starting cells
  initializeCells() {
    // Add a few initial cells
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      this.cells.push(this.createCell(x, y));
    }
  }
  
  // Add new cells periodically
  addCells() {
    if (this.cells.length < this.maxCells && Math.random() < 0.05) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      this.cells.push(this.createCell(x, y));
    }
  }
  
  // Update cell division phases
  updateCellPhases() {
    for (let cell of this.cells) {
      cell.age++;
      
      // Grow nucleus
      if (cell.nucleusRadius < cell.maxNucleusRadius) {
        cell.nucleusRadius += 0.1;
      }
      
      // Start division when cell is mature
      if (cell.age > 100 && !cell.dividing && Math.random() < 0.01) {
        cell.dividing = true;
        cell.phase = 'prophase';
        this.startMitosis(cell);
      }
      
      // Update division progress
      if (cell.dividing) {
        cell.divisionProgress += 0.01;
        this.updateMitosis(cell);
      }
    }
  }
  
  // Start mitosis process
  startMitosis(cell) {
    // Create chromosomes
    const numChromosomes = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < numChromosomes; i++) {
      const angle = (i / numChromosomes) * Math.PI * 2;
      const x = cell.x + Math.cos(angle) * cell.nucleusRadius;
      const y = cell.y + Math.sin(angle) * cell.nucleusRadius;
      cell.chromosomes.push(this.createChromosome(x, y));
    }
    
    // Create centrioles
    cell.centrioles = [
      { x: cell.x - 15, y: cell.y - 15 },
      { x: cell.x + 15, y: cell.y + 15 }
    ];
  }
  
  // Update mitosis phases
  updateMitosis(cell) {
    if (cell.divisionProgress < 0.2) {
      // Prophase - chromosomes condense
      cell.phase = 'prophase';
      for (let chrom of cell.chromosomes) {
        chrom.length = Math.min(chrom.length, 8);
      }
    } else if (cell.divisionProgress < 0.4) {
      // Metaphase - chromosomes align
      cell.phase = 'metaphase';
      const centerX = cell.x;
      const centerY = cell.y;
      for (let i = 0; i < cell.chromosomes.length; i++) {
        const chrom = cell.chromosomes[i];
        const angle = (i / cell.chromosomes.length) * Math.PI * 2;
        chrom.targetX = centerX + Math.cos(angle) * 10;
        chrom.targetY = centerY + Math.sin(angle) * 10;
        chrom.x += (chrom.targetX - chrom.x) * 0.1;
        chrom.y += (chrom.targetY - chrom.y) * 0.1;
      }
    } else if (cell.divisionProgress < 0.6) {
      // Anaphase - chromosomes separate
      cell.phase = 'anaphase';
      for (let i = 0; i < cell.chromosomes.length; i++) {
        const chrom = cell.chromosomes[i];
        const angle = (i / cell.chromosomes.length) * Math.PI * 2;
        const distance = (cell.divisionProgress - 0.4) * 50;
        chrom.x = cell.x + Math.cos(angle) * (10 + distance);
        chrom.y = cell.y + Math.sin(angle) * (10 + distance);
      }
    } else if (cell.divisionProgress < 0.8) {
      // Telophase - nuclei reform
      cell.phase = 'telophase';
      cell.radius *= 0.99; // Cell elongates
    } else if (cell.divisionProgress < 1.0) {
      // Cytokinesis - cell divides
      cell.phase = 'cytokinesis';
      if (cell.divisionProgress > 0.95) {
        this.completeDivision(cell);
      }
    }
  }
  
  // Complete cell division
  completeDivision(cell) {
    // Create daughter cell
    const daughterCell = this.createCell(cell.x + 30, cell.y);
    daughterCell.nucleusRadius = cell.nucleusRadius * 0.8;
    daughterCell.maxNucleusRadius = cell.maxNucleusRadius * 0.8;
    this.cells.push(daughterCell);
    
    // Reset parent cell
    cell.dividing = false;
    cell.divisionProgress = 0;
    cell.phase = 'interphase';
    cell.chromosomes = [];
    cell.centrioles = [];
    cell.radius *= 0.8;
    cell.nucleusRadius *= 0.8;
    cell.age = 0;
  }
  
  // Draw the cellular scene
  draw() {
    // Clear with cellular background
    this.ctx.fillStyle = 'hsla(220, 20%, 95%, 1)'; // Light blue-gray
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw cells
    for (const cell of this.cells) {
      // Draw cell membrane
      this.ctx.strokeStyle = this.colors.membrane;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      
      // Draw cytoplasm
      this.ctx.fillStyle = this.colors.cytoplasm;
      this.ctx.beginPath();
      this.ctx.arc(cell.x, cell.y, cell.radius - 1, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw nucleus
      if (cell.nucleusRadius > 0) {
        this.ctx.fillStyle = this.colors.nucleus;
        this.ctx.beginPath();
        this.ctx.arc(cell.x, cell.y, cell.nucleusRadius, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // Draw chromosomes
      for (const chrom of cell.chromosomes) {
        this.ctx.strokeStyle = this.colors.chromosome;
        this.ctx.lineWidth = chrom.width;
        this.ctx.beginPath();
        this.ctx.moveTo(chrom.x - chrom.length/2, chrom.y);
        this.ctx.lineTo(chrom.x + chrom.length/2, chrom.y);
        this.ctx.stroke();
      }
      
      // Draw centrioles
      for (const centriole of cell.centrioles) {
        this.ctx.fillStyle = this.colors.centriole;
        this.ctx.beginPath();
        this.ctx.arc(centriole.x, centriole.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // Draw spindle fibers during metaphase/anaphase
      if (cell.phase === 'metaphase' || cell.phase === 'anaphase') {
        this.ctx.strokeStyle = this.colors.spindle;
        this.ctx.lineWidth = 1;
        for (const centriole of cell.centrioles) {
          for (const chrom of cell.chromosomes) {
            this.ctx.beginPath();
            this.ctx.moveTo(centriole.x, centriole.y);
            this.ctx.lineTo(chrom.x, chrom.y);
            this.ctx.stroke();
          }
        }
      }
      
      // Draw division indicator
      if (cell.dividing) {
        this.ctx.strokeStyle = this.colors.division;
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.arc(cell.x, cell.y, cell.radius + 5, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }
    }
    
    // Draw phase indicator
    this.drawPhaseIndicator();
  }
  
  // Draw mitosis phase indicator
  drawPhaseIndicator() {
    const phases = ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'];
    const currentPhase = phases[Math.floor(this.phaseTime / this.phaseDuration) % phases.length];
    
    this.ctx.fillStyle = 'hsla(0, 0%, 20%, 0.8)';
    this.ctx.fillRect(10, 10, 200, 30);
    
    this.ctx.fillStyle = 'hsla(0, 0%, 100%, 1)';
    this.ctx.font = '14px Inter';
    this.ctx.fillText(`Phase: ${currentPhase}`, 20, 30);
  }
  
  // Main animation loop
  animate() {
    if (this.isRunning) {
      // Update phase time
      const phases = ['interphase', 'prophase', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'];
      this.phaseTime = (this.phaseTime + 1) % (this.phaseDuration * phases.length);
      
      // Add new cells
      this.addCells();
      
      // Update cell phases
      this.updateCellPhases();
      
      // Draw everything
      this.draw();
      
      // Continue animation
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
    this.cells = [];
    this.chromosomes = [];
    this.phaseTime = 0;
    this.initializeCells();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('cell-division-canvas');
  if (canvas) {
    
    const animation = new CellDivision(canvas);
    
    // Make animation globally accessible for controls
    window.cellDivision = animation;
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if (e.key === ' ') {
        e.preventDefault();
        animation.toggle();
      } else if (e.key === 'r') {
        animation.reset();
      }
    });
  }
}); 