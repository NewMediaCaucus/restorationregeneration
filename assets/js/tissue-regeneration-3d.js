// Tissue Regeneration 3D Animation
// Represents biological tissue healing with cells that grow, divide, migrate, and form connections

class TissueRegeneration3D {
  constructor(canvas) {
    this.canvas = canvas;

    this.renderer = null;
    this.context = null;
    this.handleContextLost = null;
    this.handleContextRestored = null;
    this.isContextLost = false;
    this.lightsInitialized = false;
    this.controls = null;

    // Animation settings
    this.isRunning = true;
    this.speed = 60;
    
    // Tissue system
    this.cells = [];
    this.maxCells = 120;
    this.connections = [];
    this.maxConnections = 80;
    
    // Growth and division system
    this.growthTime = 0;
    this.growthRate = 0.03;
    this.divisionRate = 0.005;
    
    // Migration system
    this.migrationSpeed = 0.02;
    this.attractionRadius = 8;
    
    // Color palette for tissue cells
    this.cellColors = [
      0xE91E63, // Pink
      0xF06292, // Light pink
      0xEC407A, // Medium pink
      0xD81B60, // Dark pink
      0xAD1457, // Deep pink
      0xC2185B  // Material pink
    ];
    
    // Interaction color
    this.interactionColor = 0xDDA0DD; // Light purple
    
    // Background gradient
    this.backgroundGradient = {
      startColor: new THREE.Color(0x1A1A2E), // Dark blue-gray
      endColor: new THREE.Color(0x16213E),    // Darker blue
      transitionSpeed: 0.001
    };
    
    if (!this.setupThreeJS()) {
      this.isRunning = false;
      this.showFallbackMessage();
      return;
    }

    this.setupResizeHandler();
    
    this.initializeCells();
    this.animate();
  }

  acquireWebGLContext() {
    if (!this.canvas) {
      return null;
    }

    const attributes = {
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false
    };

    return (
      this.canvas.getContext('webgl2', attributes) ||
      this.canvas.getContext('webgl', attributes) ||
      this.canvas.getContext('experimental-webgl', attributes)
    );
  }

  bindContextEvents() {
    if (!this.canvas) {
      return;
    }

    if (this.handleContextLost) {
      this.canvas.removeEventListener('webglcontextlost', this.handleContextLost);
    }
    if (this.handleContextRestored) {
      this.canvas.removeEventListener('webglcontextrestored', this.handleContextRestored);
    }

    this.handleContextLost = (event) => {
      event.preventDefault();
      console.warn('TissueRegeneration3D: WebGL context lost.');
      this.isContextLost = true;
      this.isRunning = false;
      this.disposeRenderer();
      this.context = null;
    };

    this.handleContextRestored = () => {
      console.info('TissueRegeneration3D: WebGL context restored.');
      this.isContextLost = false;
      if (this.setupThreeJS()) {
        this.reset();
        this.isRunning = true;
        this.animate();
      } else {
        this.showFallbackMessage();
      }
    };

    this.canvas.addEventListener('webglcontextlost', this.handleContextLost, false);
    this.canvas.addEventListener('webglcontextrestored', this.handleContextRestored, false);
  }

  disposeRenderer() {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
  }

  showFallbackMessage(message = 'Interactive 3D visualization is unavailable on this device.') {
    if (!this.canvas) {
      return;
    }

    if (this.canvas.dataset.webglFallbackApplied === 'true') {
      return;
    }

    this.canvas.dataset.webglFallbackApplied = 'true';

    const fallback = document.createElement('div');
    fallback.className = 'webgl-fallback-message';
    fallback.textContent = message;
    fallback.style.textAlign = 'center';
    fallback.style.padding = '2rem 1rem';
    fallback.style.color = '#666';
    fallback.style.fontSize = '1rem';

    if (this.canvas.parentNode) {
      this.canvas.parentNode.insertBefore(fallback, this.canvas.nextSibling);
    }
  }
  
  setupThreeJS() {
    if (typeof THREE === 'undefined') {
      console.error('TissueRegeneration3D: THREE is not defined.');
      return false;
    }

    const gl = this.acquireWebGLContext();
    if (!gl) {
      console.error('TissueRegeneration3D: Unable to acquire a WebGL context.');
      return false;
    }

git    // Check if context is lost
    if (typeof gl.isContextLost === 'function' && gl.isContextLost()) {
      console.error('TissueRegeneration3D: WebGL context was lost immediately after creation.');
      return false;
    }

    // Verify context is actually usable by testing a WebGL call
    try {
      const testParameter = gl.getParameter(gl.VERSION);
      if (!testParameter) {
        console.error('TissueRegeneration3D: WebGL context returned null from getParameter test.');
        return false;
      }
    } catch (error) {
      console.error('TissueRegeneration3D: WebGL context test failed.', error);
      return false;
    }

    if (this.renderer) {
      this.disposeRenderer();
    }

    if (!this.scene) {
      this.scene = new THREE.Scene();
    }
    this.scene.background = new THREE.Color(this.backgroundGradient.startColor);
    
    if (!this.camera) {
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / 800, 0.1, 1000);
      this.camera.position.set(0, 0, 20);
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        context: gl,
        antialias: true,
        alpha: true
      });
    } catch (error) {
      console.error('TissueRegeneration3D: Failed to construct WebGLRenderer.', error);
      return false;
    }

    if (!renderer) {
      console.error('TissueRegeneration3D: WebGLRenderer construction returned null/undefined.');
      return false;
    }

    // Verify renderer has a valid WebGL context
    const rendererContext = renderer.getContext();
    if (!rendererContext || (typeof rendererContext.isContextLost === 'function' && rendererContext.isContextLost())) {
      console.error('TissueRegeneration3D: Renderer context is invalid or lost.');
      renderer.dispose();
      return false;
    }

    this.context = gl;
    this.renderer = renderer;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.bindContextEvents();
    this.resizeCanvas();
    
    if (!this.lightsInitialized) {
      this.setupLighting();
      this.lightsInitialized = true;
    }
    
    if (!this.controls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = false;
      this.controls.dampingFactor = 0.05;
      this.controls.enableZoom = false;
      this.controls.enablePan = false;
      this.controls.enableRotate = false;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 2.0;
    }

    return true;
  }
  
  setupLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    this.scene.add(ambientLight);
    
    // Directional light for shadows and depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    
    // Point lights for cell highlighting
    const pointLight1 = new THREE.PointLight(0xff69b4, 0.6, 30);
    pointLight1.position.set(5, 5, 10);
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff1493, 0.4, 25);
    pointLight2.position.set(-5, -5, 10);
    this.scene.add(pointLight2);
  }
  
  setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resizeCanvas();
        this.reset();
      }, 250);
    });
  }
  
  resizeCanvas() {
    if (!this.renderer || !this.camera) {
      return;
    }

    this.width = window.innerWidth;
    
    // Responsive height based on screen size
    if (this.width >= 1440) {
      this.height = 800;
    } else if (this.width >= 1024) {
      this.height = 700;
    } else if (this.width >= 768) {
      this.height = 600;
    } else if (this.width >= 480) {
      this.height = 380;
    } else {
      this.height = 400;
    }
    
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(this.width, this.height);
  }
  
  createCell(x, y, z) {
    // Create cell geometry (spherical with slight irregularity)
    const radius = Math.random() * 0.8 + 0.6;
    const geometry = new THREE.SphereGeometry(radius, 12, 8);
    
    // Random tissue color
    const color = this.cellColors[Math.floor(Math.random() * this.cellColors.length)];
    
    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.9,
      shininess: 80,
      specular: 0x333333
    });
    
    const cell = new THREE.Mesh(geometry, material);
    cell.position.set(x, y, z);
    cell.castShadow = true;
    cell.receiveShadow = true;
    
    // Add cell properties
    cell.userData = {
      x: x,
      y: y,
      z: z,
      radius: radius,
      growth: 0,
      maxGrowth: Math.random() * 0.5 + 0.5,
      growthRate: Math.random() * this.growthRate * 0.8 + this.growthRate * 0.2,
      age: 0,
      maxAge: Math.random() * 500 + 300,
      divisionCount: 0,
      maxDivisions: Math.floor(Math.random() * 3) + 1,
      migrationTarget: null,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01,
        (Math.random() - 0.5) * 0.01
      ),
      connections: 0,
      maxConnections: Math.floor(Math.random() * 4) + 2,
      isDividing: false,
      divisionProgress: 0,
      originalScale: cell.scale.clone(),
      isInteracting: false,
      originalColor: null
    };
    
    return cell;
  }
  
  initializeCells() {
    const centerX = 0;
    const centerY = 0;
    const centerZ = 0;
    const margin = 12;
    const maxDistance = 15;
    
    // Create initial tissue cells in a cluster
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = Math.random() * maxDistance + 5;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const z = centerZ + (Math.random() - 0.5) * 8;
      
      const safeX = Math.max(-margin, Math.min(margin, x));
      const safeY = Math.max(-margin, Math.min(margin, y));
      const safeZ = Math.max(-margin, Math.min(margin, z));
      
      this.cells.push(this.createCell(safeX, safeY, safeZ));
      this.scene.add(this.cells[this.cells.length - 1]);
    }
  }
  
  addCells() {
    if (this.cells.length < this.maxCells && Math.random() < 0.015) {
      const margin = 12;
      const x = (Math.random() - 0.5) * 2 * margin;
      const y = (Math.random() - 0.5) * 2 * margin;
      const z = (Math.random() - 0.5) * 2 * margin;
      
      const cell = this.createCell(x, y, z);
      this.cells.push(cell);
      this.scene.add(cell);
    }
  }
  
  updateCellGrowth() {
    for (let i = this.cells.length - 1; i >= 0; i--) {
      const cell = this.cells[i];
      cell.userData.age++;
      
      // Grow cell
      if (cell.userData.growth < cell.userData.maxGrowth) {
        cell.userData.growth += cell.userData.growthRate;
        const scale = cell.userData.growth;
        cell.scale.setScalar(scale);
      }
      
      // Cell division when fully grown
      if (cell.userData.growth >= cell.userData.maxGrowth && 
          cell.userData.divisionCount < cell.userData.maxDivisions &&
          Math.random() < this.divisionRate) {
        this.divideCell(cell, i);
      }
      
      // Cell migration
      this.updateCellMigration(cell);
      
      // Remove old cells
      if (cell.userData.age > cell.userData.maxAge) {
        this.scene.remove(cell);
        this.cells.splice(i, 1);
      }
    }
  }
  
  divideCell(parentCell, index) {
    parentCell.userData.isDividing = true;
    parentCell.userData.divisionProgress += 0.02;
    
    if (parentCell.userData.divisionProgress >= 1) {
      // Create daughter cell
      const daughterCell = parentCell.clone();
      daughterCell.geometry = parentCell.geometry.clone();
      daughterCell.material = parentCell.material.clone();
      
      // Position daughter cell slightly offset from parent
      const offset = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      );
      daughterCell.position.copy(parentCell.position);
      daughterCell.position.add(offset);
      
      // Reset daughter cell properties
      daughterCell.userData = {
        x: daughterCell.position.x,
        y: daughterCell.position.y,
        z: daughterCell.position.z,
        radius: parentCell.userData.radius * 0.8,
        growth: 0,
        maxGrowth: Math.random() * 0.5 + 0.5,
        growthRate: Math.random() * this.growthRate * 0.8 + this.growthRate * 0.2,
        age: 0,
        maxAge: Math.random() * 500 + 300,
        divisionCount: 0,
        maxDivisions: Math.floor(Math.random() * 2) + 1,
        migrationTarget: null,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        connections: 0,
        maxConnections: Math.floor(Math.random() * 4) + 2,
        isDividing: false,
        divisionProgress: 0,
        originalScale: daughterCell.scale.clone(),
        isInteracting: false,
        originalColor: null
      };
      
      this.cells.push(daughterCell);
      this.scene.add(daughterCell);
      
      // Reset parent cell
      parentCell.userData.divisionCount++;
      parentCell.userData.isDividing = false;
      parentCell.userData.divisionProgress = 0;
      parentCell.userData.growth = 0;
      parentCell.scale.setScalar(0.5);
    }
  }
  
  updateCellMigration(cell) {
    // Find nearest cell for attraction
    let nearestCell = null;
    let minDistance = Infinity;
    let isInteracting = false;
    
    for (let otherCell of this.cells) {
      if (otherCell === cell) continue;
      
      const distance = cell.position.distanceTo(otherCell.position);
      if (distance < minDistance && distance < this.attractionRadius) {
        minDistance = distance;
        nearestCell = otherCell;
      }
      
      // Check for close interaction (cells touching or very close)
      if (distance < 2.5) {
        isInteracting = true;
      }
    }
    
    // Change color based on interaction
    if (isInteracting) {
      if (!cell.userData.isInteracting) {
        cell.userData.isInteracting = true;
        cell.userData.originalColor = cell.material.color.getHex();
        cell.material.color.setHex(this.interactionColor);
      }
    } else {
      if (cell.userData.isInteracting) {
        cell.userData.isInteracting = false;
        if (cell.userData.originalColor) {
          cell.material.color.setHex(cell.userData.originalColor);
        }
      }
    }
    
    // Move towards nearest cell if found
    if (nearestCell) {
      const direction = new THREE.Vector3();
      direction.subVectors(nearestCell.position, cell.position);
      direction.normalize();
      direction.multiplyScalar(this.migrationSpeed);
      
      cell.userData.velocity.add(direction);
    }
    
    // Apply velocity with damping
    cell.userData.velocity.multiplyScalar(0.98);
    cell.position.add(cell.userData.velocity);
    
    // Bounce off boundaries
    const margin = 12;
    if (Math.abs(cell.position.x) > margin) {
      cell.userData.velocity.x *= -0.8;
      cell.position.x = Math.sign(cell.position.x) * margin;
    }
    if (Math.abs(cell.position.y) > margin) {
      cell.userData.velocity.y *= -0.8;
      cell.position.y = Math.sign(cell.position.y) * margin;
    }
    if (Math.abs(cell.position.z) > margin) {
      cell.userData.velocity.z *= -0.8;
      cell.position.z = Math.sign(cell.position.z) * margin;
    }
    
    // Update cell data
    cell.userData.x = cell.position.x;
    cell.userData.y = cell.position.y;
    cell.userData.z = cell.position.z;
  }
  
  createConnections() {
    for (let i = 0; i < this.cells.length; i++) {
      const cell1 = this.cells[i];
      
      for (let j = i + 1; j < this.cells.length; j++) {
        const cell2 = this.cells[j];
        const distance = cell1.position.distanceTo(cell2.position);
        
        if (distance < 6 && Math.random() < 0.002) {
          const connection = {
            from: cell1,
            to: cell2,
            strength: Math.random() * 0.5 + 0.5,
            mesh: null
          };
          
          // Create connection mesh (tissue fiber)
          const connectionGeometry = new THREE.CylinderGeometry(0.015, 0.015, distance, 6);
          const connectionMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff69b4,
            transparent: true,
            opacity: 0.4
          });
          connection.mesh = new THREE.Mesh(connectionGeometry, connectionMaterial);
          
          // Position connection
          const midPoint = new THREE.Vector3();
          midPoint.addVectors(cell1.position, cell2.position);
          midPoint.multiplyScalar(0.5);
          connection.mesh.position.copy(midPoint);
          connection.mesh.lookAt(cell2.position);
          
          this.connections.push(connection);
          this.scene.add(connection.mesh);
        }
      }
    }
  }
  
  updateBackgroundGradient() {
    const time = Date.now() * this.backgroundGradient.transitionSpeed;
    const progress = (Math.sin(time) + 1) / 2; // 0 to 1
    
    const currentColor = new THREE.Color().lerpColors(
      this.backgroundGradient.startColor,
      this.backgroundGradient.endColor,
      progress
    );
    
    this.scene.background = currentColor;
  }

  animate() {
    if (!this.isRunning || !this.renderer || !this.scene || !this.camera) {
      return;
    }

    // Check if context is lost before rendering
    if (this.context && typeof this.context.isContextLost === 'function' && this.context.isContextLost()) {
      console.warn('TissueRegeneration3D: Context lost during animation, stopping.');
      this.isRunning = false;
      this.isContextLost = true;
      return;
    }

    this.growthTime++;
    
    // Update background gradient
    this.updateBackgroundGradient();
    
    // Add new cells
    this.addCells();
    
    // Update cell growth and division
    this.updateCellGrowth();
    
    // Create tissue connections
    if (this.growthTime % 80 === 0) {
      this.createConnections();
    }
    
    // Update controls
    if (this.controls) {
      this.controls.update();
    }
    
    // Render
    this.renderer.render(this.scene, this.camera);
    
    // Continue animation
    setTimeout(() => this.animate(), this.speed);
  }
  
  toggle() {
    this.isRunning = !this.isRunning;
    if (this.isRunning) {
      this.animate();
    }
  }
  
  reset() {
    if (!this.scene) {
      return;
    }

    // Remove all meshes from scene
    for (let cell of this.cells) {
      this.scene.remove(cell);
    }
    
    for (let connection of this.connections) {
      if (connection.mesh) {
        this.scene.remove(connection.mesh);
      }
    }
    
    this.cells = [];
    this.connections = [];
    this.growthTime = 0;
    this.initializeCells();
  }
}

// Initialize the animation when called
function initializeTissueRegeneration() {
  // Prevent double initialization
  if (window.tissueRegenerationInitialized) {
    console.log('Tissue Regeneration already initialized, skipping...');
    return;
  }
  
  const canvas = document.getElementById('regeneration-canvas');
  if (canvas) {
    console.log('Initializing Tissue Regeneration 3D animation');
    window.tissueRegenerationInitialized = true;
    new TissueRegeneration3D(canvas);
  } else {
    console.error('Canvas not found for Tissue Regeneration 3D');
  }
}

// Auto-initialize if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTissueRegeneration);
} else {
  // DOM is already loaded, initialize immediately
  initializeTissueRegeneration();
} 