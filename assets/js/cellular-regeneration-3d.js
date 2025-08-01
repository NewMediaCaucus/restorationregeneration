class CellularRegeneration3D {
  constructor(canvas) {
    this.canvas = canvas;
    
    // Animation settings
    this.isRunning = true;
    this.speed = 60;
    
    // Cellular regeneration system
    this.cells = [];
    this.maxCells = 60;
    this.cycleTime = 0;
    this.cycleDuration = 2400; // 40 seconds per cycle (much slower)
    
    // Growth and division phases
    this.growthRate = 0.002; // Much slower growth
    this.divisionRate = 0.001; // Much slower division
    this.mutationRate = 0.8; // How much variation in regeneration
    
    // Background transition system
    this.backgroundTransition = {
      startTime: Date.now(),
      duration: 100000, // 100 seconds
      nightColor: new THREE.Color(0x000000), // Black
      morningColor: new THREE.Color(0x0f1419), // Deep space blue
      currentPhase: 0
    };
    
    // Color palettes for different regeneration phases
    this.colorPalettes = [
      // Cyan Cellular Phase
      {
        primary: 0x00ffff,
        secondary: 0x00cccc,
        decay: 0x008080,
        regeneration: 0x40e0d0,
        background: 0x000000,
        glow: 0x00ffff
      },
      // Magenta Division Phase
      {
        primary: 0xff00ff,
        secondary: 0xcc00cc,
        decay: 0x800080,
        regeneration: 0xff40ff,
        background: 0x000000,
        glow: 0xff00ff
      },
      // Lime Evolution Phase
      {
        primary: 0x32cd32,
        secondary: 0x228b22,
        decay: 0x006400,
        regeneration: 0x7fff00,
        background: 0x000000,
        glow: 0x32cd32
      },
      // Orange Adaptation Phase
      {
        primary: 0xff8c00,
        secondary: 0xff7f00,
        decay: 0xff4500,
        regeneration: 0xffa500,
        background: 0x000000,
        glow: 0xff8c00
      }
    ];
    
    this.currentPaletteIndex = 0;
    this.colors = this.colorPalettes[this.currentPaletteIndex];
    
    this.setupThreeJS();
    this.setupResizeHandler();
    
    this.initializeCells();
    this.animate();
  }
  
  setupThreeJS() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.colors.background);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / 800, 0.1, 1000);
    this.camera.position.set(0, 0, 25);
    
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
    this.controls.autoRotateSpeed = 1.0;
    
    this.setupLighting();
  }
  
  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    this.scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Point lights for glow effect
    const pointLight1 = new THREE.PointLight(0x00ffff, 0.7, 30);
    pointLight1.position.set(10, 10, 10);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00ff, 0.7, 30);
    pointLight2.position.set(-10, -10, 10);
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
  
  createCell(x, y, z) {
    const group = new THREE.Group();
    
    // Create cell nucleus (sphere)
    const nucleusGeometry = new THREE.SphereGeometry(0.6, 16, 16);
    const nucleusMaterial = new THREE.MeshLambertMaterial({ 
      color: this.colors.primary,
      transparent: true,
      opacity: 1.0
    });
    const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
    nucleus.castShadow = true;
    group.add(nucleus);
    
    // Create cell membrane (larger transparent sphere)
    const membraneGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    const membraneMaterial = new THREE.MeshLambertMaterial({ 
      color: this.colors.secondary,
      transparent: true,
      opacity: 0.3
    });
    const membrane = new THREE.Mesh(membraneGeometry, membraneMaterial);
    membrane.castShadow = true;
    group.add(membrane);
    
    // Create organelles (smaller spheres)
    const organelleCount = Math.floor(Math.random() * 8) + 1; // 1-8 organelles
    for (let i = 0; i < organelleCount; i++) {
      const angle = (i / organelleCount) * Math.PI * 2;
      const radius = 0.8 + (Math.random() - 0.5) * 0.4; // Vary the radius slightly
      const organelleX = Math.cos(angle) * radius;
      const organelleY = Math.sin(angle) * radius;
      
      const organelleGeometry = new THREE.SphereGeometry(0.15, 8, 8);
      const organelleMaterial = new THREE.MeshLambertMaterial({ 
        color: this.colors.primary,
        transparent: true,
        opacity: 0.8
      });
      const organelle = new THREE.Mesh(organelleGeometry, organelleMaterial);
      organelle.position.set(organelleX, organelleY, 0);
      organelle.castShadow = true;
      group.add(organelle);
    }
    
    // Position the group
    group.position.set(x, y, z);
    
    // Add rotation animation
    group.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.008, // Faster rotation
      y: (Math.random() - 0.5) * 0.008,
      z: (Math.random() - 0.5) * 0.008
    };
    
    // Add random rotation direction (some clockwise, some counter-clockwise)
    group.rotationDirection = {
      x: Math.random() > 0.5 ? 1 : -1,
      y: Math.random() > 0.5 ? 1 : -1,
      z: Math.random() > 0.5 ? 1 : -1
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
      phase: 'growing', // growing, dividing, regenerating
      age: 0,
      cycle: 0,
      mutation: Math.random() * this.mutationRate,
      originalScale: 1.0,
      organelleCount: organelleCount,
      readyToDivide: false,
      divisionProgress: 0,
      colors: {
        primary: this.colors.primary,
        secondary: this.colors.secondary,
        decay: this.colors.decay,
        regeneration: this.colors.regeneration
      }
    };
  }
  
  initializeCells() {
    // Create initial cells
    for (let i = 0; i < this.maxCells; i++) {
      const x = (Math.random() - 0.5) * 40;
      const y = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 20;
      
      const cell = this.createCell(x, y, z);
      this.cells.push(cell);
      this.scene.add(cell.mesh);
    }
  }
  
  updateCellularRegeneration() {
    this.cycleTime++;
    
    // Change color palette every cycle
    if (this.cycleTime % this.cycleDuration === 0) {
      this.currentPaletteIndex = (this.currentPaletteIndex + 1) % this.colorPalettes.length;
      this.colors = this.colorPalettes[this.currentPaletteIndex];
    }
    
    for (let cell of this.cells) {
      cell.age++;
      
      // Rotate cell
      cell.mesh.rotation.x += cell.mesh.rotationSpeed.x * cell.mesh.rotationDirection.x;
      cell.mesh.rotation.y += cell.mesh.rotationSpeed.y * cell.mesh.rotationDirection.y;
      cell.mesh.rotation.z += cell.mesh.rotationSpeed.z * cell.mesh.rotationDirection.z;
      
      // Phase transitions
      if (cell.phase === 'growing') {
        cell.growth += this.growthRate;
        if (cell.growth >= cell.maxGrowth) {
          cell.phase = 'dividing';
          cell.growth = cell.maxGrowth;
          cell.readyToDivide = true;
        }
      } else if (cell.phase === 'dividing') {
        cell.divisionProgress += this.divisionRate;
        if (cell.divisionProgress >= 1.0) {
          cell.phase = 'regenerating';
          cell.cycle++;
          cell.divisionProgress = 0;
          cell.growth = 0;
          cell.readyToDivide = false;
          
          // Apply mutation
          cell.mutation = Math.random() * this.mutationRate;
          cell.maxGrowth = Math.random() * 0.5 + 0.5;
          cell.originalScale = 1.0 + cell.mutation;
          
          // Change colors for regeneration
          cell.colors = {
            primary: this.colors.regeneration,
            secondary: this.colors.secondary,
            decay: this.colors.decay,
            regeneration: this.colors.regeneration
          };
        }
      } else if (cell.phase === 'regenerating') {
        cell.growth += this.growthRate;
        if (cell.growth >= cell.maxGrowth) {
          cell.phase = 'growing';
          cell.growth = cell.maxGrowth;
          
          // Reset to normal colors
          cell.colors = {
            primary: this.colors.primary,
            secondary: this.colors.secondary,
            decay: this.colors.decay,
            regeneration: this.colors.regeneration
          };
        }
      }
      
      // Apply scaling based on phase
      let scale = 1.0;
      if (cell.phase === 'growing') {
        scale = cell.growth * cell.originalScale;
      } else if (cell.phase === 'dividing') {
        // Create division effect - cell stretches and splits
        const stretchFactor = 1.0 + cell.divisionProgress * 0.5;
        scale = cell.originalScale * stretchFactor;
        
        // Add division animation
        cell.mesh.scale.x = scale;
        cell.mesh.scale.y = scale * 0.8;
        cell.mesh.scale.z = scale;
      } else if (cell.phase === 'regenerating') {
        scale = cell.growth * cell.originalScale;
        cell.mesh.scale.setScalar(scale);
      } else {
        cell.mesh.scale.setScalar(scale);
      }
      
      // Update colors based on phase
      const updateColors = (mesh) => {
        if (cell.phase === 'dividing') {
          mesh.material.color.setHex(cell.colors.decay);
        } else if (cell.phase === 'regenerating') {
          mesh.material.color.setHex(cell.colors.regeneration);
        } else {
          mesh.material.color.setHex(cell.colors.primary);
        }
        
        // Recursively update child meshes
        mesh.children.forEach(child => {
          if (child.material) {
            updateColors(child);
          }
        });
      };
      
      cell.mesh.children.forEach(child => {
        updateColors(child);
      });
    }
  }
  
  updateBackgroundTransition() {
    const currentTime = Date.now();
    const elapsed = currentTime - this.backgroundTransition.startTime;
    const progress = (elapsed % this.backgroundTransition.duration) / this.backgroundTransition.duration;
    
    let currentColor;
    if (progress <= 0.5) {
      // First half: fade from black to deep space blue
      const fadeProgress = progress * 2;
      currentColor = new THREE.Color().lerpColors(
        this.backgroundTransition.nightColor,
        this.backgroundTransition.morningColor,
        fadeProgress
      );
    } else {
      // Second half: fade from deep space blue back to black
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
    
    this.updateCellularRegeneration();
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
    // Clear existing cells
    for (let cell of this.cells) {
      this.scene.remove(cell.mesh);
    }
    this.cells = [];
    
    // Reinitialize
    this.initializeCells();
  }
}

// Initialize the animation when the canvas is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('cellular-regeneration-canvas');
  if (canvas) {
    new CellularRegeneration3D(canvas);
  }
}); 