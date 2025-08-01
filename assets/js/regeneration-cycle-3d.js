class RegenerationCycle3D {
  constructor(canvas) {
    this.canvas = canvas;
    
    // Animation settings
    this.isRunning = true;
    this.speed = 60;
    
    // Regeneration system
    this.organisms = [];
    this.maxOrganisms = 40;
    this.cycleTime = 0;
    this.cycleDuration = 900; // 15 seconds per cycle (much slower)
    
    // Growth and decay phases
    this.growthRate = 0.008; // Much slower growth
    this.decayRate = 0.012; // Much slower decay
    this.mutationRate = 0.3; // How much variation in regeneration
    
    // Background transition system
    this.backgroundTransition = {
      startTime: Date.now(),
      duration: 60000, // 60 seconds
      nightColor: new THREE.Color(0x000000), // Black
      morningColor: new THREE.Color(0x2D1B3D), // Dark purple
      currentPhase: 0
    };
    
    // Color palettes for different regeneration phases
    this.colorPalettes = [
      // Green Growth Phase
      {
        organism: 0x4CAF50,
        decay: 0x8BC34A,
        regeneration: 0x66BB6A,
        background: 0x000000,
        glow: 0x4CAF50
      },
      // Purple Mystical Phase
      {
        organism: 0x9C27B0,
        decay: 0xBA68C8,
        regeneration: 0x7B1FA2,
        background: 0x000000,
        glow: 0x9C27B0
      },
      // Blue Ocean Phase
      {
        organism: 0x2196F3,
        decay: 0x64B5F6,
        regeneration: 0x1976D2,
        background: 0x000000,
        glow: 0x2196F3
      },
      // Orange Fire Phase
      {
        organism: 0xFF9800,
        decay: 0xFFB74D,
        regeneration: 0xF57C00,
        background: 0x000000,
        glow: 0xFF9800
      }
    ];
    
    this.currentPaletteIndex = 0;
    this.colors = this.colorPalettes[this.currentPaletteIndex];
    
    this.setupThreeJS();
    this.setupResizeHandler();
    
    this.initializeOrganisms();
    this.animate();
  }
  
  setupThreeJS() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.colors.background);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / 800, 0.1, 1000);
    this.camera.position.set(0, 0, 16);
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.resizeCanvas();
    this.renderer.shadowMap.enabled = true;
    
    // Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = false;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = false;
    this.controls.enablePan = false;
    this.controls.enableRotate = false;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 2.0;
    
    this.setupLighting();
  }
  
  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Point lights for glow effect
    const pointLight1 = new THREE.PointLight(0x4CAF50, 0.5, 20);
    pointLight1.position.set(5, 5, 5);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x9C27B0, 0.5, 20);
    pointLight2.position.set(-5, -5, 5);
    this.scene.add(pointLight2);
  }
  
  setupResizeHandler() {
    window.addEventListener('resize', () => {
      this.resizeCanvas();
    });
  }
  
  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = 800;
    
    if (this.width >= 1440) {
      this.height = 600;
    } else if (this.width >= 1024) {
      this.height = 500;
    } else if (this.width >= 768) {
      this.height = 450;
    } else if (this.width >= 480) {
      this.height = 380;
    } else {
      this.height = 300;
    }
    
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }
  
  createOrganism(x, y, z) {
    // Create a complex organism with multiple geometric shapes
    const group = new THREE.Group();
    
    // Main body (sphere)
    const bodyGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const bodyMaterial = new THREE.MeshLambertMaterial({ 
      color: this.colors.organism,
      transparent: true,
      opacity: 1.0
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    group.add(body);
    
    // Appendages (cylinders)
    const appendageCount = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < appendageCount; i++) {
      const angle = (i / appendageCount) * Math.PI * 2;
      const radius = 1.2;
      const appendageX = Math.cos(angle) * radius;
      const appendageY = Math.sin(angle) * radius;
      
      const appendageGeometry = new THREE.CylinderGeometry(0.1, 0.05, 1.5, 8);
      const appendageMaterial = new THREE.MeshLambertMaterial({ 
        color: this.colors.organism,
        transparent: true,
        opacity: 1.0
      });
      const appendage = new THREE.Mesh(appendageGeometry, appendageMaterial);
      appendage.position.set(appendageX, appendageY, 0);
      appendage.rotation.z = angle;
      appendage.castShadow = true;
      group.add(appendage);
    }
    
    // Position the group
    group.position.set(x, y, z);
    
    // Add rotation animation
    group.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.008, // Much slower rotation
      y: (Math.random() - 0.5) * 0.008,
      z: (Math.random() - 0.5) * 0.008
    };
    
    return {
      mesh: group,
      x: x,
      y: y,
      z: z,
      growth: 0,
      maxGrowth: Math.random() * 0.5 + 0.5,
      decay: 0,
      maxDecay: 1.0,
      phase: 'growing', // growing, decaying, regenerating
      age: 0,
      cycle: 0,
      mutation: Math.random() * this.mutationRate,
      originalScale: 1.0,
      appendageCount: appendageCount,
      colors: {
        organism: this.colors.organism,
        decay: this.colors.decay,
        regeneration: this.colors.regeneration
      }
    };
  }
  
  initializeOrganisms() {
    // Create initial organisms
    for (let i = 0; i < this.maxOrganisms; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;
      
      const organism = this.createOrganism(x, y, z);
      this.organisms.push(organism);
      this.scene.add(organism.mesh);
    }
  }
  
  updateRegenerationCycle() {
    this.cycleTime++;
    
    // Change color palette every cycle
    if (this.cycleTime % this.cycleDuration === 0) {
      this.currentPaletteIndex = (this.currentPaletteIndex + 1) % this.colorPalettes.length;
      this.colors = this.colorPalettes[this.currentPaletteIndex];
    }
    
    for (let organism of this.organisms) {
      organism.age++;
      
      // Rotate organism
      organism.mesh.rotation.x += organism.mesh.rotationSpeed.x;
      organism.mesh.rotation.y += organism.mesh.rotationSpeed.y;
      organism.mesh.rotation.z += organism.mesh.rotationSpeed.z;
      
      // Phase transitions
      if (organism.phase === 'growing') {
        organism.growth += this.growthRate;
        if (organism.growth >= organism.maxGrowth) {
          organism.phase = 'decaying';
          organism.growth = organism.maxGrowth;
        }
      } else if (organism.phase === 'decaying') {
        organism.decay += this.decayRate;
        if (organism.decay >= organism.maxDecay) {
          organism.phase = 'regenerating';
          organism.cycle++;
          organism.decay = 0;
          organism.growth = 0;
          
          // Apply mutation
          organism.mutation = Math.random() * this.mutationRate;
          organism.maxGrowth = Math.random() * 0.5 + 0.5;
          organism.originalScale = 1.0 + organism.mutation;
          
          // Change colors for regeneration
          organism.colors = {
            organism: this.colors.regeneration,
            decay: this.colors.decay,
            regeneration: this.colors.regeneration
          };
        }
      } else if (organism.phase === 'regenerating') {
        organism.growth += this.growthRate;
        if (organism.growth >= organism.maxGrowth) {
          organism.phase = 'growing';
          organism.growth = organism.maxGrowth;
          
          // Reset to normal colors
          organism.colors = {
            organism: this.colors.organism,
            decay: this.colors.decay,
            regeneration: this.colors.regeneration
          };
        }
      }
      
      // Apply scaling based on phase
      let scale = 1.0;
      if (organism.phase === 'growing') {
        scale = organism.growth * organism.originalScale;
      } else if (organism.phase === 'decaying') {
        scale = (1.0 - organism.decay) * organism.originalScale;
      } else if (organism.phase === 'regenerating') {
        scale = organism.growth * organism.originalScale;
      }
      
      organism.mesh.scale.setScalar(scale);
      
      // Update colors based on phase
      organism.mesh.children.forEach(child => {
        if (organism.phase === 'decaying') {
          child.material.color.setHex(organism.colors.decay);
        } else if (organism.phase === 'regenerating') {
          child.material.color.setHex(organism.colors.regeneration);
        } else {
          child.material.color.setHex(organism.colors.organism);
        }
      });
    }
  }
  
  updateBackgroundTransition() {
    const currentTime = Date.now();
    const elapsed = currentTime - this.backgroundTransition.startTime;
    const progress = (elapsed % this.backgroundTransition.duration) / this.backgroundTransition.duration;
    
    let currentColor;
    if (progress <= 0.5) {
      // First half: fade from black to purple
      const fadeProgress = progress * 2;
      currentColor = new THREE.Color().lerpColors(
        this.backgroundTransition.nightColor,
        this.backgroundTransition.morningColor,
        fadeProgress
      );
    } else {
      // Second half: fade from purple back to black
      const fadeProgress = (progress - 0.5) * 2;
      currentColor = new THREE.Color().lerpColors(
        this.backgroundTransition.morningColor,
        this.backgroundTransition.nightColor,
        fadeProgress
      );
    }
    this.scene.background = currentColor;
  }
  
  animate() {
    if (!this.isRunning) return;
    
    requestAnimationFrame(() => this.animate());
    
    this.updateRegenerationCycle();
    this.updateBackgroundTransition();
    
    this.renderer.render(this.scene, this.camera);
  }
  
  toggle() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      this.animate();
    }
  }
  
  reset() {
    // Clear existing organisms
    for (let organism of this.organisms) {
      this.scene.remove(organism.mesh);
    }
    this.organisms = [];
    
    // Reinitialize
    this.initializeOrganisms();
  }
}

// Initialize the animation when the canvas is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('regeneration-cycle-canvas');
  if (canvas) {
    new RegenerationCycle3D(canvas);
  }
}); 