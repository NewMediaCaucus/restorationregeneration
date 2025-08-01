class RegenerationFractal3D {
  constructor(canvas) {
    this.canvas = canvas;
    
    // Animation settings
    this.isRunning = true;
    this.speed = 60;
    
    // Fractal regeneration system
    this.fractals = [];
    this.maxFractals = 25;
    this.cycleTime = 0;
    this.cycleDuration = 1200; // 20 seconds per cycle
    
    // Growth and decay phases
    this.growthRate = 0.006; // Very slow growth
    this.decayRate = 0.008; // Very slow decay
    this.branchingRate = 0.02; // How often new branches form
    
    // Background transition system
    this.backgroundTransition = {
      startTime: Date.now(),
      duration: 80000, // 80 seconds
      nightColor: new THREE.Color(0x000000), // Black
      morningColor: new THREE.Color(0x1a1a2e), // Deep blue
      currentPhase: 0
    };
    
    // Color palettes for different regeneration phases
    this.colorPalettes = [
      // Emerald Growth Phase
      {
        primary: 0x00d4aa,
        secondary: 0x00b894,
        decay: 0x00a085,
        regeneration: 0x00e6b8,
        background: 0x000000,
        glow: 0x00d4aa
      },
      // Crimson Regeneration Phase
      {
        primary: 0xdc143c,
        secondary: 0xb91c3c,
        decay: 0xa01830,
        regeneration: 0xe31b54,
        background: 0x000000,
        glow: 0xdc143c
      },
      // Golden Transformation Phase
      {
        primary: 0xffd700,
        secondary: 0xffb347,
        decay: 0xffa500,
        regeneration: 0xffed4e,
        background: 0x000000,
        glow: 0xffd700
      },
      // Violet Evolution Phase
      {
        primary: 0x8a2be2,
        secondary: 0x9370db,
        decay: 0x7b68ee,
        regeneration: 0x9932cc,
        background: 0x000000,
        glow: 0x8a2be2
      }
    ];
    
    this.currentPaletteIndex = 0;
    this.colors = this.colorPalettes[this.currentPaletteIndex];
    
    this.setupThreeJS();
    this.setupResizeHandler();
    
    this.initializeFractals();
    this.animate();
  }
  
  setupThreeJS() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.colors.background);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / 800, 0.1, 1000);
    this.camera.position.set(0, 0, 20);
    
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
    this.controls.autoRotateSpeed = 1.5;
    
    this.setupLighting();
  }
  
  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    // Point lights for glow effect
    const pointLight1 = new THREE.PointLight(0x00d4aa, 0.6, 25);
    pointLight1.position.set(8, 8, 8);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xdc143c, 0.6, 25);
    pointLight2.position.set(-8, -8, 8);
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
  
  createFractal(x, y, z) {
    const group = new THREE.Group();
    
    // Create fractal structure with recursive branching
    const createBranch = (parent, depth, maxDepth, direction, length) => {
      if (depth >= maxDepth) return;
      
      // Create branch geometry
      const branchGeometry = new THREE.CylinderGeometry(0.05, 0.02, length, 8);
      const branchMaterial = new THREE.MeshLambertMaterial({ 
        color: this.colors.primary,
        transparent: true,
        opacity: 1.0
      });
      const branch = new THREE.Mesh(branchGeometry, branchMaterial);
      branch.castShadow = true;
      
      // Position and orient branch
      branch.position.copy(direction.clone().multiplyScalar(length / 2));
      branch.lookAt(direction.clone().multiplyScalar(length));
      
      parent.add(branch);
      
      // Add child branches
      const childCount = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < childCount; i++) {
        const childDirection = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ).normalize();
        
        const childLength = length * 0.7;
        createBranch(branch, depth + 1, maxDepth, childDirection, childLength);
      }
    };
    
    // Create main trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.1, 0.05, 3, 8);
    const trunkMaterial = new THREE.MeshLambertMaterial({ 
      color: this.colors.primary,
      transparent: true,
      opacity: 1.0
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.castShadow = true;
    group.add(trunk);
    
    // Add branches
    const branchCount = Math.floor(Math.random() * 4) + 2;
    for (let i = 0; i < branchCount; i++) {
      const angle = (i / branchCount) * Math.PI * 2;
      const direction = new THREE.Vector3(
        Math.cos(angle),
        Math.sin(angle),
        (Math.random() - 0.5) * 0.5
      ).normalize();
      
      createBranch(trunk, 0, 3, direction, 2);
    }
    
    // Position the group
    group.position.set(x, y, z);
    
    // Add rotation animation
    group.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.005,
      y: (Math.random() - 0.5) * 0.005,
      z: (Math.random() - 0.5) * 0.005
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
      phase: 'growing',
      age: 0,
      cycle: 0,
      mutation: Math.random() * 0.4,
      originalScale: 1.0,
      branchCount: branchCount,
      colors: {
        primary: this.colors.primary,
        secondary: this.colors.secondary,
        decay: this.colors.decay,
        regeneration: this.colors.regeneration
      }
    };
  }
  
  initializeFractals() {
    // Create initial fractals
    for (let i = 0; i < this.maxFractals; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 15;
      
      const fractal = this.createFractal(x, y, z);
      this.fractals.push(fractal);
      this.scene.add(fractal.mesh);
    }
  }
  
  updateFractalRegeneration() {
    this.cycleTime++;
    
    // Change color palette every cycle
    if (this.cycleTime % this.cycleDuration === 0) {
      this.currentPaletteIndex = (this.currentPaletteIndex + 1) % this.colorPalettes.length;
      this.colors = this.colorPalettes[this.currentPaletteIndex];
    }
    
    for (let fractal of this.fractals) {
      fractal.age++;
      
      // Rotate fractal
      fractal.mesh.rotation.x += fractal.mesh.rotationSpeed.x;
      fractal.mesh.rotation.y += fractal.mesh.rotationSpeed.y;
      fractal.mesh.rotation.z += fractal.mesh.rotationSpeed.z;
      
      // Phase transitions
      if (fractal.phase === 'growing') {
        fractal.growth += this.growthRate;
        if (fractal.growth >= fractal.maxGrowth) {
          fractal.phase = 'decaying';
          fractal.growth = fractal.maxGrowth;
        }
      } else if (fractal.phase === 'decaying') {
        fractal.decay += this.decayRate;
        if (fractal.decay >= fractal.maxDecay) {
          fractal.phase = 'regenerating';
          fractal.cycle++;
          fractal.decay = 0;
          fractal.growth = 0;
          
          // Apply mutation
          fractal.mutation = Math.random() * 0.4;
          fractal.maxGrowth = Math.random() * 0.5 + 0.5;
          fractal.originalScale = 1.0 + fractal.mutation;
          
          // Change colors for regeneration
          fractal.colors = {
            primary: this.colors.regeneration,
            secondary: this.colors.secondary,
            decay: this.colors.decay,
            regeneration: this.colors.regeneration
          };
        }
      } else if (fractal.phase === 'regenerating') {
        fractal.growth += this.growthRate;
        if (fractal.growth >= fractal.maxGrowth) {
          fractal.phase = 'growing';
          fractal.growth = fractal.maxGrowth;
          
          // Reset to normal colors
          fractal.colors = {
            primary: this.colors.primary,
            secondary: this.colors.secondary,
            decay: this.colors.decay,
            regeneration: this.colors.regeneration
          };
        }
      }
      
      // Apply scaling based on phase
      let scale = 1.0;
      if (fractal.phase === 'growing') {
        scale = fractal.growth * fractal.originalScale;
      } else if (fractal.phase === 'decaying') {
        scale = (1.0 - fractal.decay) * fractal.originalScale;
      } else if (fractal.phase === 'regenerating') {
        scale = fractal.growth * fractal.originalScale;
      }
      
      fractal.mesh.scale.setScalar(scale);
      
      // Update colors based on phase
      const updateColors = (mesh) => {
        if (fractal.phase === 'decaying') {
          mesh.material.color.setHex(fractal.colors.decay);
        } else if (fractal.phase === 'regenerating') {
          mesh.material.color.setHex(fractal.colors.regeneration);
        } else {
          mesh.material.color.setHex(fractal.colors.primary);
        }
        
        // Recursively update child meshes
        mesh.children.forEach(child => {
          if (child.material) {
            updateColors(child);
          }
        });
      };
      
      fractal.mesh.children.forEach(child => {
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
      // First half: fade from black to deep blue
      const fadeProgress = progress * 2;
      currentColor = new THREE.Color().lerpColors(
        this.backgroundTransition.nightColor,
        this.backgroundTransition.morningColor,
        fadeProgress
      );
    } else {
      // Second half: fade from deep blue back to black
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
    
    this.updateFractalRegeneration();
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
    // Clear existing fractals
    for (let fractal of this.fractals) {
      this.scene.remove(fractal.mesh);
    }
    this.fractals = [];
    
    // Reinitialize
    this.initializeFractals();
  }
}

// Initialize the animation when the canvas is ready
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('regeneration-fractal-canvas');
  if (canvas) {
    new RegenerationFractal3D(canvas);
  }
}); 