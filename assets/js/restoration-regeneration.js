class RestorationRegeneration {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    // Animation settings
    this.isRunning = true;
    this.speed = 100; // Slower, more meditative pace
    
    // Plant growth system
    this.plants = [];
    this.maxPlants = 50;
    this.growthRate = 0.02;
    
    // Healing particles
    this.particles = [];
    this.maxParticles = 100;
    
    // Regeneration cycles
    this.cycleTime = 0;
    this.cycleDuration = 600; // 10 seconds per cycle
    
    // Color themes for restoration/regeneration
    this.colors = {
      earth: 'hsla(30, 60%, 40%, 1)',
      growth: 'hsla(120, 70%, 50%, 1)',
      healing: 'hsla(200, 80%, 60%, 1)',
      renewal: 'hsla(280, 60%, 70%, 1)',
      life: 'hsla(45, 90%, 60%, 1)',
      water: 'hsla(210, 70%, 50%, 1)'
    };
    
    this.animate();
  }
  
  // Plant class for growth simulation
  createPlant(x, y) {
    return {
      x: x,
      y: y,
      height: 0,
      maxHeight: Math.random() * 100 + 50,
      growth: 0,
      branches: [],
      leaves: [],
      age: 0,
      health: 1,
      color: this.getRandomColor()
    };
  }
  
  // Particle class for healing effects
  createParticle(x, y) {
    return {
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 100,
      maxLife: 100,
      size: Math.random() * 3 + 1,
      color: this.getRandomColor()
    };
  }
  
  getRandomColor() {
    const colorKeys = Object.keys(this.colors);
    return this.colors[colorKeys[Math.floor(Math.random() * colorKeys.length)]];
  }
  
  // Add new plants periodically
  addPlants() {
    if (this.plants.length < this.maxPlants && Math.random() < 0.1) {
      const x = Math.random() * this.width;
      const y = this.height - 20; // Start from bottom
      this.plants.push(this.createPlant(x, y));
    }
  }
  
  // Add healing particles
  addParticles() {
    if (this.particles.length < this.maxParticles && Math.random() < 0.3) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      this.particles.push(this.createParticle(x, y));
    }
  }
  
  // Update plant growth
  updatePlants() {
    for (let plant of this.plants) {
      // Grow the plant
      if (plant.height < plant.maxHeight) {
        plant.height += this.growthRate * plant.health;
      }
      
      // Add branches as plant grows
      if (plant.height > 30 && plant.branches.length < 3) {
        if (Math.random() < 0.01) {
          plant.branches.push({
            x: plant.x + (Math.random() - 0.5) * 20,
            y: plant.y - plant.height * 0.7,
            length: Math.random() * 30 + 10
          });
        }
      }
      
      // Add leaves
      if (plant.height > 20 && plant.leaves.length < 5) {
        if (Math.random() < 0.02) {
          plant.leaves.push({
            x: plant.x + (Math.random() - 0.5) * 40,
            y: plant.y - plant.height * (0.3 + Math.random() * 0.4),
            size: Math.random() * 8 + 4
          });
        }
      }
      
      plant.age++;
    }
  }
  
  // Update healing particles
  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Add gentle gravity
      particle.vy += 0.02;
      
      // Reduce life
      particle.life--;
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }
  
  // Draw the restoration/regeneration scene
  draw() {
    // Clear with gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#1a2a3a'); // Deep blue-green
    gradient.addColorStop(0.5, '#2d4a3a'); // Earth green
    gradient.addColorStop(1, '#1a3a2a'); // Dark green
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw healing particles
    for (const particle of this.particles) {
      const alpha = particle.life / particle.maxLife;
      const hex = particle.color.replace(/hsla?\([^)]+\)/, '');
      this.ctx.fillStyle = particle.color.replace(/1\)$/, `${alpha})`);
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
    // Draw plants
    for (const plant of this.plants) {
      // Draw trunk
      this.ctx.strokeStyle = this.colors.earth;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.moveTo(plant.x, plant.y);
      this.ctx.lineTo(plant.x, plant.y - plant.height);
      this.ctx.stroke();
      
      // Draw branches
      for (const branch of plant.branches) {
        this.ctx.strokeStyle = this.colors.growth;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(plant.x, branch.y);
        this.ctx.lineTo(branch.x, branch.y - branch.length);
        this.ctx.stroke();
      }
      
      // Draw leaves
      for (const leaf of plant.leaves) {
        this.ctx.fillStyle = this.colors.life;
        this.ctx.beginPath();
        this.ctx.ellipse(leaf.x, leaf.y, leaf.size, leaf.size * 0.6, 0, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // Draw growth rings at base
      if (plant.height > 10) {
        this.ctx.strokeStyle = this.colors.renewal;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(plant.x, plant.y, 5 + plant.age * 0.1, 0, Math.PI * 2);
        this.ctx.stroke();
      }
    }
    
    // Draw regeneration cycle indicator
    const cycleProgress = this.cycleTime / this.cycleDuration;
    this.ctx.strokeStyle = this.colors.healing;
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.arc(this.width - 30, 30, 20, -Math.PI/2, -Math.PI/2 + (cycleProgress * Math.PI * 2));
    this.ctx.stroke();
  }
  
  // Main animation loop
  animate() {
    if (this.isRunning) {
      // Update cycle time
      this.cycleTime = (this.cycleTime + 1) % this.cycleDuration;
      
      // Add new elements
      this.addPlants();
      this.addParticles();
      
      // Update existing elements
      this.updatePlants();
      this.updateParticles();
      
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
    this.plants = [];
    this.particles = [];
    this.cycleTime = 0;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('game-of-life-canvas');
  if (canvas) {
    // Change canvas ID to match the new animation
    canvas.id = 'restoration-regeneration-canvas';
    
    const animation = new RestorationRegeneration(canvas);
    
    // Make animation globally accessible for controls
    window.restorationRegeneration = animation;
    
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