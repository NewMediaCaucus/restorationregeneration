// Obsidian Icebergs 3D Animation
// Represents system renewal through obsidian-like angular forms that multiply, divide, die, and give birth

class ObsidianIcebergs3D {
  constructor(canvas) {
    console.log('ObsidianIcebergs3D: Initializing...');
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.animationId = null;
    
    // Create a simple clock if THREE.Clock is not available
    if (typeof THREE !== 'undefined' && THREE.Clock) {
      this.clock = new THREE.Clock();
    } else {
      console.log('ObsidianIcebergs3D: THREE.Clock not available, using fallback');
      this.clock = { 
        getDelta: () => 0.016, 
        getElapsedTime: () => Date.now() / 1000 
      };
    }
    
    // Iceberg properties
    this.icebergs = [];
    this.ashParticles = [];
    this.birthEvents = [];
    this.deathEvents = [];
    
    // Animation state
    this.cycleTime = 0;
    this.birthTimer = 0;
    this.deathTimer = 0;
    this.divisionTimer = 0;
    
    // Obsidian color palette with purple hints
    this.obsidianColors = [
      '#000000', // Pure black
      '#0a0a0a', // Very dark
      '#1a1a1a', // Dark obsidian
      '#2a1a2a', // Dark obsidian with purple hint
      '#3a2a3a', // Medium dark with purple
      '#4a3a4a', // Medium obsidian with purple
      '#5a4a5a', // Light obsidian with purple
      '#6a5a6a', // Light ash with purple
      '#7a6a7a', // Very light ash with purple
      '#8a7a8a'  // Almost white ash with purple
    ];
    
    this.currentColorIndex = 0;
    
    this.init();
  }

  init() {
    console.log('ObsidianIcebergs3D: Starting initialization...');
    try {
      this.setupThreeJS();
      this.createInitialIcebergs();
      this.animate();
      console.log('ObsidianIcebergs3D: Initialization complete');
    } catch (error) {
      console.error('ObsidianIcebergs3D: Error during initialization:', error);
    }
  }

  setupThreeJS() {
    console.log('ObsidianIcebergs3D: Setting up Three.js...');
    
    // Check if THREE is available
    if (typeof THREE === 'undefined') {
      throw new Error('THREE is not defined');
    }
    
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    // Camera - positioned for dramatic view
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.canvas.clientWidth / this.canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 15, 20);
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Increased lighting for better visibility with purple hints
    const ambientLight = new THREE.AmbientLight(0x404040, 0.7); // Increased from 0.5 to 0.7
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // Increased from 1.5 to 2.0
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Add more dramatic point lights with purple hints
    const pointLight1 = new THREE.PointLight(0xffffff, 1.5, 50); // Increased from 1.2 to 1.5
    pointLight1.position.set(-15, 10, -15);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1.3, 50); // Increased from 1.0 to 1.3
    pointLight2.position.set(15, -5, 15);
    this.scene.add(pointLight2);

    // Add a third light for more illumination
    const pointLight3 = new THREE.PointLight(0xffffff, 1.0, 40); // Increased from 0.8 to 1.0
    pointLight3.position.set(0, 15, 0);
    this.scene.add(pointLight3);

    // Add a fourth light for even more illumination
    const pointLight4 = new THREE.PointLight(0xffffff, 0.8, 35);
    pointLight4.position.set(0, -10, 0);
    this.scene.add(pointLight4);

    // Add a fifth light for dramatic side lighting with purple hint
    const pointLight5 = new THREE.PointLight(0xf0f0ff, 0.6, 30); // Slight purple tint
    pointLight5.position.set(20, 5, 0);
    this.scene.add(pointLight5);

    // Add a sixth light with purple accent
    const pointLight6 = new THREE.PointLight(0xfff0ff, 0.4, 25); // Light purple tint
    pointLight6.position.set(-20, 5, 0);
    this.scene.add(pointLight6);

    // Handle resize
    window.addEventListener('resize', () => this.onWindowResize());
    
    console.log('ObsidianIcebergs3D: Three.js setup complete');
  }

  createIcebergGeometry() {
    // Create angular, obsidian-like geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    
    // Create a sharp, angular iceberg shape
    const height = 8 + Math.random() * 4;
    const baseWidth = 3 + Math.random() * 2;
    const topWidth = 1 + Math.random() * 1;
    
    // Base vertices
    vertices.push(-baseWidth, 0, -baseWidth);
    vertices.push(baseWidth, 0, -baseWidth);
    vertices.push(baseWidth, 0, baseWidth);
    vertices.push(-baseWidth, 0, baseWidth);
    
    // Middle vertices (sharp angles)
    const midHeight = height * 0.6;
    vertices.push(-baseWidth * 0.7, midHeight, -baseWidth * 0.7);
    vertices.push(baseWidth * 0.7, midHeight, -baseWidth * 0.7);
    vertices.push(baseWidth * 0.7, midHeight, baseWidth * 0.7);
    vertices.push(-baseWidth * 0.7, midHeight, baseWidth * 0.7);
    
    // Top vertices (sharp peak)
    vertices.push(-topWidth, height, -topWidth);
    vertices.push(topWidth, height, -topWidth);
    vertices.push(topWidth, height, topWidth);
    vertices.push(-topWidth, height, topWidth);
    
    // Create faces (triangles for sharp edges)
    // Base faces
    indices.push(0, 1, 2); indices.push(0, 2, 3);
    
    // Side faces (angular)
    indices.push(0, 4, 1); indices.push(1, 5, 4);
    indices.push(1, 2, 5); indices.push(2, 6, 5);
    indices.push(2, 3, 6); indices.push(3, 7, 6);
    indices.push(3, 0, 7); indices.push(0, 4, 7);
    
    // Top faces
    indices.push(4, 5, 6); indices.push(4, 6, 7);
    indices.push(4, 8, 5); indices.push(5, 9, 8);
    indices.push(5, 6, 9); indices.push(6, 10, 9);
    indices.push(6, 7, 10); indices.push(7, 11, 10);
    indices.push(7, 4, 11); indices.push(4, 8, 11);
    
    // Peak faces
    indices.push(8, 9, 10); indices.push(8, 10, 11);
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    return geometry;
  }

  createInitialIcebergs() {
    // Create more initial icebergs
    for (let i = 0; i < 12; i++) { // Increased from 5 to 12
      this.createIceberg();
    }
  }

  createIceberg() {
    const geometry = this.createIcebergGeometry();
    const material = new THREE.MeshPhongMaterial({
      color: this.obsidianColors[Math.floor(Math.random() * 4)], // Dark obsidian
      transparent: true,
      opacity: 0.9,
      flatShading: true,
      shininess: 0
    });
    
    const iceberg = new THREE.Mesh(geometry, material);
    
    // Random position
    const x = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;
    iceberg.position.set(x, 0, z);
    
    iceberg.castShadow = true;
    iceberg.receiveShadow = true;
    
    iceberg.userData = {
      id: Date.now() + Math.random(),
      age: 0,
      health: 100,
      size: 1 + Math.random() * 0.5,
      divisionCount: 0,
      maxDivisions: 3,
      birthTime: this.clock.getElapsedTime(),
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      floatSpeed: 0.5 + Math.random() * 0.5
    };
    
    iceberg.scale.setScalar(iceberg.userData.size);
    
    this.icebergs.push(iceberg);
    this.scene.add(iceberg);
  }

  updateIcebergs(deltaTime) {
    this.cycleTime += deltaTime;
    this.birthTimer += deltaTime;
    this.deathTimer += deltaTime;
    this.divisionTimer += deltaTime;
    
    // Birth new icebergs - slowed down
    if (this.birthTimer > 15 && this.icebergs.length < 20) { // Increased from 12 to 20
      this.createIceberg();
      this.birthTimer = 0;
      this.createBirthEvent();
    }
    
    // Update each iceberg
    for (let i = this.icebergs.length - 1; i >= 0; i--) {
      const iceberg = this.icebergs[i];
      iceberg.userData.age += deltaTime;
      iceberg.userData.health -= deltaTime * 1; // Reduced from 2 to 1
      
      // Rotation - slowed down
      iceberg.rotation.y += iceberg.userData.rotationSpeed * 0.5; // Reduced by half
      iceberg.rotation.x += iceberg.userData.rotationSpeed * 0.25; // Reduced by half
      
      // Floating motion - slowed down
      iceberg.position.y = Math.sin(this.cycleTime * iceberg.userData.floatSpeed * 0.5) * 0.5; // Reduced speed by half
      
      // Division (birth of new icebergs) - slowed down
      if (this.divisionTimer > 20 && iceberg.userData.divisionCount < iceberg.userData.maxDivisions) { // Increased from 12 to 20
        this.divideIceberg(iceberg);
        this.divisionTimer = 0;
      }
      
      // Death
      if (iceberg.userData.health <= 0) {
        this.killIceberg(i);
        this.createDeathEvent(iceberg.position);
      }
      
      // Color changes based on health
      const healthRatio = iceberg.userData.health / 100;
      const colorIndex = Math.floor((1 - healthRatio) * this.obsidianColors.length);
      const targetColor = new THREE.Color(this.obsidianColors[colorIndex]);
      iceberg.material.color.lerp(targetColor, deltaTime * 0.5); // Reduced from 1 to 0.5
      
      // Scaling based on health
      const scale = iceberg.userData.size * (0.5 + healthRatio * 0.5);
      iceberg.scale.setScalar(scale);
    }
  }

  divideIceberg(parentIceberg) {
    // Create a new iceberg from the parent
    const geometry = this.createIcebergGeometry();
    const material = new THREE.MeshPhongMaterial({
      color: parentIceberg.material.color.clone(),
      transparent: true,
      opacity: 0.9,
      flatShading: true,
      shininess: 0
    });
    
    const newIceberg = new THREE.Mesh(geometry, material);
    
    // Position near parent
    const offset = 3;
    newIceberg.position.set(
      parentIceberg.position.x + (Math.random() - 0.5) * offset,
      parentIceberg.position.y,
      parentIceberg.position.z + (Math.random() - 0.5) * offset
    );
    
    newIceberg.castShadow = true;
    newIceberg.receiveShadow = true;
    
    newIceberg.userData = {
      id: Date.now() + Math.random(),
      age: 0,
      health: 80, // Slightly less health than parent
      size: parentIceberg.userData.size * 0.8,
      divisionCount: 0,
      maxDivisions: Math.max(0, parentIceberg.userData.maxDivisions - 1),
      birthTime: this.clock.getElapsedTime(),
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      floatSpeed: 0.5 + Math.random() * 0.5
    };
    
    newIceberg.scale.setScalar(newIceberg.userData.size);
    
    this.icebergs.push(newIceberg);
    this.scene.add(newIceberg);
    
    // Reduce parent's health
    parentIceberg.userData.health -= 20;
    parentIceberg.userData.divisionCount++;
  }

  killIceberg(index) {
    const iceberg = this.icebergs[index];
    
    // Remove from scene and array (no more small square particles)
    this.scene.remove(iceberg);
    this.icebergs.splice(index, 1);
  }

  createBirthEvent() {
    // Create birth effect with purple hint
    const birthGeometry = new THREE.SphereGeometry(2, 8, 8);
    const birthMaterial = new THREE.MeshBasicMaterial({
      color: 0x8a7a8a, // Light purple-tinged ash
      transparent: true,
      opacity: 0.6
    });
    
    const birthEffect = new THREE.Mesh(birthGeometry, birthMaterial);
    birthEffect.position.set(
      (Math.random() - 0.5) * 20,
      0,
      (Math.random() - 0.5) * 20
    );
    
    birthEffect.userData = {
      life: 0,
      maxLife: 1
    };
    
    this.birthEvents.push(birthEffect);
    this.scene.add(birthEffect);
  }

  createDeathEvent(position) {
    // Create death effect with purple hint
    const deathGeometry = new THREE.SphereGeometry(1, 8, 8);
    const deathMaterial = new THREE.MeshBasicMaterial({
      color: 0x2a1a2a, // Dark purple-tinged obsidian
      transparent: true,
      opacity: 0.8
    });
    
    const deathEffect = new THREE.Mesh(deathGeometry, deathMaterial);
    deathEffect.position.copy(position);
    
    deathEffect.userData = {
      life: 0,
      maxLife: 1.5
    };
    
    this.deathEvents.push(deathEffect);
    this.scene.add(deathEffect);
  }

  updateBirthEvents(deltaTime) {
    for (let i = this.birthEvents.length - 1; i >= 0; i--) {
      const event = this.birthEvents[i];
      event.userData.life += deltaTime;
      
      if (event.userData.life >= event.userData.maxLife) {
        this.scene.remove(event);
        this.birthEvents.splice(i, 1);
        continue;
      }
      
      // Expand and fade
      const lifeRatio = event.userData.life / event.userData.maxLife;
      event.scale.setScalar(1 + lifeRatio * 3);
      event.material.opacity = (1 - lifeRatio) * 0.6;
    }
  }

  updateDeathEvents(deltaTime) {
    for (let i = this.deathEvents.length - 1; i >= 0; i--) {
      const event = this.deathEvents[i];
      event.userData.life += deltaTime;
      
      if (event.userData.life >= event.userData.maxLife) {
        this.scene.remove(event);
        this.deathEvents.splice(i, 1);
        continue;
      }
      
      // Contract and fade
      const lifeRatio = event.userData.life / event.userData.maxLife;
      event.scale.setScalar(1 - lifeRatio * 0.5);
      event.material.opacity = (1 - lifeRatio) * 0.8;
    }
  }

  updateCamera(deltaTime) {
    // Dramatic camera movement - slowed down
    const time = this.clock.getElapsedTime();
    this.camera.position.x = Math.sin(time * 0.05) * 15; // Reduced from 0.1 to 0.05
    this.camera.position.y = 15 + Math.sin(time * 0.075) * 3; // Reduced from 0.15 to 0.075
    this.camera.position.z = Math.cos(time * 0.05) * 20; // Reduced from 0.1 to 0.05
    this.camera.lookAt(0, 0, 0);
  }

  onWindowResize() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

  animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const deltaTime = this.clock.getDelta();
    
    this.updateIcebergs(deltaTime);
    this.updateBirthEvents(deltaTime);
    this.updateDeathEvents(deltaTime);
    this.updateCamera(deltaTime);
    
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Dispose of geometries and materials
    this.scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    this.renderer.dispose();
  }
}

// Global flag to prevent double initialization
if (window.obsidianIcebergsInitialized) {
  console.log('Obsidian Icebergs 3D already initialized');
} else {
  window.obsidianIcebergsInitialized = true;
  
  // Initialize the animation immediately or when DOM is ready
  function initializeObsidianIcebergs() {
    console.log('ObsidianIcebergs3D: Looking for canvas...');
    const canvas = document.getElementById('regeneration-canvas');
    if (canvas) {
      console.log('ObsidianIcebergs3D: Canvas found, creating animation...');
      new ObsidianIcebergs3D(canvas);
    } else {
      console.error('ObsidianIcebergs3D: Canvas not found');
    }
  }
  
  // Try to initialize immediately, or wait for DOM if needed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeObsidianIcebergs);
  } else {
    // DOM is already loaded
    setTimeout(initializeObsidianIcebergs, 0);
  }
} 