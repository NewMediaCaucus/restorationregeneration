class NeuralRegeneration {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();
    this.setupResizeHandler();
    
    // Animation settings
    this.isRunning = true;
    this.speed = 60; // Faster for dynamic neural activity
    
    // Neural system
    this.neurons = [];
    this.maxNeurons = 40;
    this.connections = [];
    this.maxConnections = 100;
    
    // Growth system
    this.growthTime = 0;
    this.growthRate = 0.02;
    
    // Color palettes
    this.colorPalettes = [
      // Blue Neural
      {
        neuron: 'hsla(200, 80%, 60%, 1)',
        dendrite: 'hsla(220, 70%, 70%, 1)',
        axon: 'hsla(180, 80%, 50%, 1)',
        synapse: 'hsla(120, 90%, 60%, 1)',
        signal: 'hsla(60, 100%, 70%, 1)',
        background: 'hsla(0, 0%, 100%, 1)',
        glow: 'hsla(200, 80%, 60%, 0.3)'
      },
      // Green Growth
      {
        neuron: 'hsla(120, 70%, 50%, 1)',
        dendrite: 'hsla(140, 60%, 60%, 1)',
        axon: 'hsla(100, 80%, 40%, 1)',
        synapse: 'hsla(160, 90%, 50%, 1)',
        signal: 'hsla(80, 100%, 60%, 1)',
        background: 'hsla(0, 0%, 100%, 1)',
        glow: 'hsla(120, 70%, 50%, 0.3)'
      },
      // Purple Mystical
      {
        neuron: 'hsla(280, 70%, 60%, 1)',
        dendrite: 'hsla(300, 60%, 70%, 1)',
        axon: 'hsla(260, 80%, 50%, 1)',
        synapse: 'hsla(320, 90%, 60%, 1)',
        signal: 'hsla(240, 100%, 70%, 1)',
        background: 'hsla(0, 0%, 100%, 1)',
        glow: 'hsla(280, 70%, 60%, 0.3)'
      },
      // Orange Warm
      {
        neuron: 'hsla(30, 80%, 60%, 1)',
        dendrite: 'hsla(50, 70%, 70%, 1)',
        axon: 'hsla(10, 90%, 50%, 1)',
        synapse: 'hsla(70, 90%, 60%, 1)',
        signal: 'hsla(45, 100%, 65%, 1)',
        background: 'hsla(0, 0%, 100%, 1)',
        glow: 'hsla(30, 80%, 60%, 0.3)'
      },
      // Teal Ocean
      {
        neuron: 'hsla(180, 70%, 50%, 1)',
        dendrite: 'hsla(200, 60%, 60%, 1)',
        axon: 'hsla(160, 80%, 40%, 1)',
        synapse: 'hsla(220, 90%, 55%, 1)',
        signal: 'hsla(150, 100%, 60%, 1)',
        background: 'hsla(0, 0%, 100%, 1)',
        glow: 'hsla(180, 70%, 50%, 0.3)'
      }
    ];
    
    this.currentPaletteIndex = 0;
    this.colors = this.colorPalettes[this.currentPaletteIndex];
    console.log('Initial palette index:', this.currentPaletteIndex); // Debug log
    console.log('Initial colors:', this.colors); // Debug log
    
    this.initializeNeurons();
    this.animate();
  }
  
  // Resize canvas to browser width
  resizeCanvas() {
    this.width = window.innerWidth;
    
    // Responsive height based on screen size
    if (this.width >= 1440) {
      this.height = 800;
    } else if (this.width >= 1024) {
      this.height = 700;
    } else if (this.width >= 768) {
      this.height = 600;
    } else if (this.width >= 480) {
      this.height = 240; // 240px for 480px breakpoint
    } else {
      this.height = 400;
    }
    
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
  
  // Setup resize handler
  setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resizeCanvas();
        this.reset();
      }, 250); // Debounce resize events
    });
  }
  
  // Neuron class
  createNeuron(x, y) {
    return {
      x: x,
      y: y,
      radius: Math.random() * 8 + 6,
      dendrites: [],
      axon: null,
      signals: [],
      growth: 0,
      maxGrowth: Math.random() * 0.5 + 0.5,
      age: 0,
      active: false,
      connections: 0,
      maxConnections: Math.floor(Math.random() * 3) + 2,
      fadeIn: 0, // Fade-in progress (0 to 1)
      fadeInDuration: 60, // Frames to complete fade-in
      shrinking: false, // Whether neuron is shrinking
      shrinkStartAge: 0 // Age when shrinking started
    };
  }
  
  // Dendrite class
  createDendrite(neuron) {
    const angle = Math.random() * Math.PI * 2;
    const length = Math.random() * 40 + 20;
    return {
      x: neuron.x,
      y: neuron.y,
      endX: neuron.x + Math.cos(angle) * length,
      endY: neuron.y + Math.sin(angle) * length,
      length: length,
      currentLength: 0,
      angle: angle,
      active: false
    };
  }
  
  // Axon class
  createAxon(neuron) {
    const angle = Math.random() * Math.PI * 2;
    const length = Math.random() * 60 + 40;
    return {
      x: neuron.x,
      y: neuron.y,
      endX: neuron.x + Math.cos(angle) * length,
      endY: neuron.y + Math.sin(angle) * length,
      length: length,
      currentLength: 0,
      angle: angle,
      active: false,
      target: null
    };
  }
  
  // Signal class
  createSignal(x, y, targetX, targetY) {
    return {
      x: x,
      y: y,
      targetX: targetX,
      targetY: targetY,
      progress: 0,
      speed: Math.random() * 0.02 + 0.01,
      size: Math.random() * 3 + 2
    };
  }
  
  // Initialize starting neurons
  initializeNeurons() {
    // Add initial neurons in a network pattern, keeping away from edges
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const margin = 50;
    const maxDistance = Math.min(this.width, this.height) / 2 - margin;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = Math.random() * maxDistance + 50;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      // Ensure neuron is within safe bounds
      const safeX = Math.max(margin, Math.min(this.width - margin, x));
      const safeY = Math.max(margin, Math.min(this.height - margin, y));
      
      this.neurons.push(this.createNeuron(safeX, safeY));
    }
  }
  
  // Add new neurons periodically
  addNeurons() {
    if (this.neurons.length < this.maxNeurons && Math.random() < 0.03) {
      // Keep neurons 50px away from edges
      const margin = 50;
      const x = margin + Math.random() * (this.width - 2 * margin);
      const y = margin + Math.random() * (this.height - 2 * margin);
      this.neurons.push(this.createNeuron(x, y));
    }
  }
  
  // Update neural growth
  updateNeuralGrowth() {
    for (let neuron of this.neurons) {
      neuron.age++;
      
      // Fade in neuron
      if (neuron.fadeIn < 1) {
        neuron.fadeIn += 1 / neuron.fadeInDuration;
      }
      
      // Start shrinking after neuron has been mature for a while
      if (!neuron.shrinking && neuron.growth >= neuron.maxGrowth && neuron.age > 900) {
        neuron.shrinking = true;
        neuron.shrinkStartAge = neuron.age;
      }
      
      // Grow or shrink neuron
      if (neuron.shrinking) {
        // Shrink neuron
        neuron.growth -= this.growthRate * 0.5; // Slower shrinking
        if (neuron.growth <= 0) {
          // Remove neuron when fully shrunk
          const index = this.neurons.indexOf(neuron);
          if (index > -1) {
            this.neurons.splice(index, 1);
          }
        }
      } else {
        // Grow neuron
        if (neuron.growth < neuron.maxGrowth) {
          neuron.growth += this.growthRate;
        }
      }
      
      // Add dendrites as neuron grows
      if (neuron.growth > 0.2 && neuron.dendrites.length < 4) {
        if (Math.random() < 0.02) {
          neuron.dendrites.push(this.createDendrite(neuron));
        }
      }
      
      // Add axon when mature
      if (neuron.growth > 0.5 && !neuron.axon) {
        neuron.axon = this.createAxon(neuron);
      }
      
      // Grow dendrites
      for (let dendrite of neuron.dendrites) {
        if (dendrite.currentLength < dendrite.length) {
          dendrite.currentLength += 0.5;
          dendrite.endX = neuron.x + Math.cos(dendrite.angle) * dendrite.currentLength;
          dendrite.endY = neuron.y + Math.sin(dendrite.angle) * dendrite.currentLength;
        }
      }
      
      // Grow axon
      if (neuron.axon && neuron.axon.currentLength < neuron.axon.length) {
        neuron.axon.currentLength += 0.8;
        neuron.axon.endX = neuron.x + Math.cos(neuron.axon.angle) * neuron.axon.currentLength;
        neuron.axon.endY = neuron.y + Math.sin(neuron.axon.angle) * neuron.axon.currentLength;
      }
      
      // Remove neuron activation - no firing
      // if (neuron.age > 50 && Math.random() < 0.01) {
      //   neuron.active = true;
      //   this.createNeuralSignal(neuron);
      // }
    }
  }
  
  // Create neural signals
  createNeuralSignal(neuron) {
    // Find nearby neurons to send signals to
    for (let other of this.neurons) {
      if (other !== neuron) {
        const distance = Math.sqrt((neuron.x - other.x) ** 2 + (neuron.y - other.y) ** 2);
        if (distance < 150 && Math.random() < 0.3) {
          const signal = this.createSignal(neuron.x, neuron.y, other.x, other.y);
          neuron.signals.push(signal);
        }
      }
    }
  }
  
  // Update neural signals
  updateSignals() {
    for (let neuron of this.neurons) {
      for (let i = neuron.signals.length - 1; i >= 0; i--) {
        const signal = neuron.signals[i];
        signal.progress += signal.speed;
        
        // Update signal position
        signal.x = signal.x + (signal.targetX - signal.x) * signal.speed;
        signal.y = signal.y + (signal.targetY - signal.y) * signal.speed;
        
        // Remove completed signals
        if (signal.progress >= 1) {
          neuron.signals.splice(i, 1);
          
          // Activate target neuron
          for (let target of this.neurons) {
            const distance = Math.sqrt((signal.targetX - target.x) ** 2 + (signal.targetY - target.y) ** 2);
            if (distance < 20) {
              target.active = true;
              setTimeout(() => { target.active = false; }, 1000);
            }
          }
        }
      }
    }
  }
  
  // Create connections between neurons
  createConnections() {
    for (let i = 0; i < this.neurons.length; i++) {
      const neuron1 = this.neurons[i];
      
      for (let j = i + 1; j < this.neurons.length; j++) {
        const neuron2 = this.neurons[j];
        const distance = Math.sqrt((neuron1.x - neuron2.x) ** 2 + (neuron1.y - neuron2.y) ** 2);
        
        if (distance < 120 && Math.random() < 0.005) {
          this.connections.push({
            from: neuron1,
            to: neuron2,
            strength: Math.random() * 0.5 + 0.5,
            active: false
          });
        }
      }
    }
  }
  
  // Draw the neural network
  draw() {
    // Clear with neural background
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
          // Draw connections (static, no activation)
      for (const connection of this.connections) {
        this.ctx.strokeStyle = this.colors.neuron;
        this.ctx.lineWidth = connection.strength * 1; // Half as thick
        this.ctx.lineCap = 'round'; // Rounded ends
        this.ctx.beginPath();
        this.ctx.moveTo(connection.from.x, connection.from.y);
        this.ctx.lineTo(connection.to.x, connection.to.y);
        this.ctx.stroke();
      }
    
    // Draw neurons (static, no activation)
    for (const neuron of this.neurons) {
      // Draw neuron body with fade-in and shrinking
      this.ctx.fillStyle = this.colors.neuron;
      this.ctx.beginPath();
      this.ctx.arc(neuron.x, neuron.y, neuron.radius * neuron.growth, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Draw dendrites with fade-in and shrinking
      for (const dendrite of neuron.dendrites) {
        this.ctx.strokeStyle = this.colors.dendrite;
        this.ctx.lineWidth = 1 * neuron.growth; // Scale with growth
        this.ctx.lineCap = 'round'; // Rounded ends
        this.ctx.beginPath();
        this.ctx.moveTo(neuron.x, neuron.y);
        this.ctx.lineTo(dendrite.endX, dendrite.endY);
        this.ctx.stroke();
      }
      
      // Draw axon with fade-in and shrinking
      if (neuron.axon) {
        this.ctx.strokeStyle = this.colors.axon;
        this.ctx.lineWidth = 1.5 * neuron.growth; // Scale with growth
        this.ctx.lineCap = 'round'; // Rounded ends
        this.ctx.beginPath();
        this.ctx.moveTo(neuron.x, neuron.y);
        this.ctx.lineTo(neuron.axon.endX, neuron.axon.endY);
        this.ctx.stroke();
      }
      
      // Remove signal drawing - no firing
      // for (const signal of neuron.signals) {
      //   this.ctx.fillStyle = this.colors.signal;
      //   this.ctx.beginPath();
      //   this.ctx.arc(signal.x, signal.y, signal.size, 0, Math.PI * 2);
      //   this.ctx.fill();
      // }
    }
    
    // Draw control button and growth indicator
    this.drawControlButton();
    // this.drawGrowthIndicator();
  }
  
  // Draw control button
  drawControlButton() {
    const buttonSize = 40;
    const margin = 20;
    
    // Button background (using rectangle instead of roundRect for compatibility)
    this.ctx.fillStyle = 'hsla(0, 0%, 20%, 0.9)';
    this.ctx.fillRect(margin, margin, buttonSize, buttonSize);
    
    // Button border
    this.ctx.strokeStyle = 'hsla(0, 0%, 100%, 0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(margin, margin, buttonSize, buttonSize);
    
    // Button icon (color palette)
    this.ctx.fillStyle = this.colors.neuron;
    this.ctx.beginPath();
    this.ctx.arc(margin + buttonSize/2, margin + buttonSize/2 - 3, 4, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = this.colors.dendrite;
    this.ctx.beginPath();
    this.ctx.arc(margin + buttonSize/2 - 4, margin + buttonSize/2 + 3, 3, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.fillStyle = this.colors.axon;
    this.ctx.beginPath();
    this.ctx.arc(margin + buttonSize/2 + 4, margin + buttonSize/2 + 3, 3, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  // Draw neural growth indicator
  // drawGrowthIndicator() {
  //   const totalGrowth = this.neurons.reduce((sum, neuron) => sum + neuron.growth, 0) / this.neurons.length;
    
  //   this.ctx.fillStyle = 'hsla(0, 0%, 20%, 0.8)';
  //   this.ctx.fillRect(10, 80, 200, 30);
    
  //   this.ctx.fillStyle = 'hsla(0, 0%, 100%, 1)';
  //   this.ctx.font = '14px Inter';
  //   this.ctx.fillText(`Neural Growth: ${Math.round(totalGrowth * 100)}%`, 20, 100);
  // }
  
  // Main animation loop
  animate() {
    if (this.isRunning) {
      // Update growth time
      this.growthTime++;
      
      // Add new neurons
      this.addNeurons();
      
      // Update neural growth
      this.updateNeuralGrowth();
      
      // Update signals
      this.updateSignals();
      
      // Create new connections
      if (this.growthTime % 100 === 0) {
        this.createConnections();
      }
      
      // Remove connection activation - no firing
      // for (const connection of this.connections) {
      //   if (Math.random() < 0.01) {
      //     connection.active = true;
      //     setTimeout(() => { connection.active = false; }, 500);
      //   }
      // }
      
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
  
  nextPalette() {
    this.currentPaletteIndex = (this.currentPaletteIndex + 1) % this.colorPalettes.length;
    this.colors = this.colorPalettes[this.currentPaletteIndex];
    console.log('Palette changed to index:', this.currentPaletteIndex); // Debug log
    console.log('New colors:', this.colors); // Debug log
  }
  
  reset() {
    this.neurons = [];
    this.connections = [];
    this.growthTime = 0;
    this.initializeNeurons();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('neural-regeneration-canvas');
  if (canvas) {
    const animation = new NeuralRegeneration(canvas);
    
    // Make animation globally accessible for controls
    window.neuralRegeneration = animation;
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      if (e.key === ' ') {
        e.preventDefault();
        animation.toggle();
      } else if (e.key === 'r') {
        animation.reset();
      } else if (e.key === 'c') {
        animation.nextPalette();
      }
    });
    
    // Add canvas click handler for button
    canvas.addEventListener('click', function(e) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      console.log('Canvas clicked at:', x, y); // Debug log
      
      // Check if click is in button area (20,20 to 60,60)
      if (x >= 20 && x <= 60 && y >= 20 && y <= 60) {
        console.log('Button clicked!'); // Debug log
        animation.nextPalette();
      }
    });
  }
}); 