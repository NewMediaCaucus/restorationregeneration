class NeuralRegeneration3D {
  constructor(canvas) {
    this.canvas = canvas;
    
    // Animation settings
    this.isRunning = true;
    this.speed = 60;

    
    // Neural system
    this.neurons = [];
    this.maxNeurons = 30; // Multiple spheres for full effect
    this.connections = [];
    this.maxConnections = 80; // Connections between neurons
    
    // Growth system
    this.growthTime = 0;
    this.growthRate = 0.02;
    
    // Color palettes
    this.colorPalettes = [
      // Blue Neural
      {
        neuron: 0x4A90E2,
        dendrite: 0x5BA0F2,
        axon: 0x3A80D2,
        synapse: 0x7AB0FF,
        signal: 0xFFFF80,
        background: 0xFFFFFF,
        glow: 0x4A90E2
      },
      // Green Growth
      {
        neuron: 0x4CAF50,
        dendrite: 0x5CBF60,
        axon: 0x3C9F40,
        synapse: 0x7CDF80,
        signal: 0x80FF80,
        background: 0xFFFFFF,
        glow: 0x4CAF50
      },
      // Purple Mystical
      {
        neuron: 0x9C27B0,
        dendrite: 0xAC37C0,
        axon: 0x8C17A0,
        synapse: 0xCC47D0,
        signal: 0xFF80FF,
        background: 0xFFFFFF,
        glow: 0x9C27B0
      },
      // Orange Warm
      {
        neuron: 0xFF9800,
        dendrite: 0xFFA810,
        axon: 0xFF8800,
        synapse: 0xFFB820,
        signal: 0xFFD080,
        background: 0xFFFFFF,
        glow: 0xFF9800
      },
      // Teal Ocean
      {
        neuron: 0x009688,
        dendrite: 0x10A698,
        axon: 0x008678,
        synapse: 0x20B6A8,
        signal: 0x80FFE0,
        background: 0xFFFFFF,
        glow: 0x009688
      }
    ];
    
    this.currentPaletteIndex = 0;
    this.colors = this.colorPalettes[this.currentPaletteIndex];
    
    this.setupThreeJS();
    this.setupResizeHandler();
    
    this.initializeNeurons();
    this.animate();
  }
  
  setupThreeJS() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.colors.background);
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / 800, 0.1, 1000);
    this.camera.position.set(0, 0, 50);
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas, 
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(window.innerWidth, 800);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Lighting
    this.setupLighting();
    
    // Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
  }
  
  setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    
    // Point light for glow effect
    const pointLight = new THREE.PointLight(0xffffff, 0.5, 100);
    pointLight.position.set(0, 0, 20);
    this.scene.add(pointLight);
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
    this.width = window.innerWidth;
    
    // Responsive height based on screen size
    if (this.width >= 1440) {
      this.height = 800;
    } else if (this.width >= 1024) {
      this.height = 700;
    } else if (this.width >= 768) {
      this.height = 600;
    } else if (this.width >= 480) {
      this.height = 240;
    } else {
      this.height = 400;
    }
    
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }
  
  createNeuron(x, y, z) {
    const geometry = new THREE.SphereGeometry(1, 16, 16);
    const material = new THREE.MeshPhongMaterial({ 
      color: this.colors.neuron,
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(x, y, z);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    
    // Add rotation animation
    sphere.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02
    };
    
    return {
      mesh: sphere,
      x: x,
      y: y,
      z: z,
      radius: Math.random() * 2 + 1,
      dendrites: [],
      axon: null,
      growth: 0,
      maxGrowth: Math.random() * 0.5 + 0.5,
      age: 0,
      connections: 0,
      maxConnections: Math.floor(Math.random() * 3) + 2,
      shrinking: false,
      shrinkStartAge: 0
    };
  }
  
  createDendrite(neuron) {
    // Create a random point on the sphere's surface
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    // Calculate direction from sphere center to surface point (this is the normal)
    const direction = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    );
    
    const length = Math.random() * 8 + 4;
    const spherePosition = neuron.mesh.position;
    const endPoint = new THREE.Vector3(
      spherePosition.x + direction.x * length,
      spherePosition.y + direction.y * length,
      spherePosition.z + direction.z * length
    );
    
    return {
      startPoint: new THREE.Vector3(spherePosition.x, spherePosition.y, spherePosition.z), // Start from sphere center
      endPoint: endPoint,
      direction: direction,
      length: length,
      currentLength: 0,
      mesh: null,
      sphereOrigin: spherePosition.clone() // Store the sphere's origin
    };
  }
  
  createAxon(neuron) {
    // Create a random point on the sphere's surface
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    // Calculate direction from sphere center to surface point (this is the normal)
    const direction = new THREE.Vector3(
      Math.sin(phi) * Math.cos(theta),
      Math.sin(phi) * Math.sin(theta),
      Math.cos(phi)
    );
    
    const length = Math.random() * 12 + 8;
    const spherePosition = neuron.mesh.position;
    const endPoint = new THREE.Vector3(
      spherePosition.x + direction.x * length,
      spherePosition.y + direction.y * length,
      spherePosition.z + direction.z * length
    );
    
    return {
      startPoint: new THREE.Vector3(spherePosition.x, spherePosition.y, spherePosition.z), // Start from sphere center
      endPoint: endPoint,
      direction: direction,
      length: length,
      currentLength: 0,
      mesh: null,
      sphereOrigin: spherePosition.clone() // Store the sphere's origin
    };
  }
  
  initializeNeurons() {
    const centerX = 0;
    const centerY = 0;
    const centerZ = 0;
    const margin = 15;
    const maxDistance = 20;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const distance = Math.random() * maxDistance + 10;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const z = centerZ + (Math.random() - 0.5) * 10;
      
      const safeX = Math.max(-margin, Math.min(margin, x));
      const safeY = Math.max(-margin, Math.min(margin, y));
      const safeZ = Math.max(-margin, Math.min(margin, z));
      
      this.neurons.push(this.createNeuron(safeX, safeY, safeZ));
      this.scene.add(this.neurons[this.neurons.length - 1].mesh);
    }
  }
  
  addNeurons() {
    if (this.neurons.length < this.maxNeurons && Math.random() < 0.02) {
      const margin = 15;
      const x = (Math.random() - 0.5) * 2 * margin;
      const y = (Math.random() - 0.5) * 2 * margin;
      const z = (Math.random() - 0.5) * 2 * margin;
      
      const neuron = this.createNeuron(x, y, z);
      this.neurons.push(neuron);
      this.scene.add(neuron.mesh);
    }
  }
  
  updateNeuralGrowth() {
    for (let neuron of this.neurons) {
      neuron.age++;
      
      // Rotate the neuron sphere
      neuron.mesh.rotation.x += neuron.mesh.rotationSpeed.x;
      neuron.mesh.rotation.y += neuron.mesh.rotationSpeed.y;
      neuron.mesh.rotation.z += neuron.mesh.rotationSpeed.z;
      
      // Start shrinking after neuron has been mature for a while
      if (!neuron.shrinking && neuron.growth >= neuron.maxGrowth && neuron.age > 600) {
        neuron.shrinking = true;
        neuron.shrinkStartAge = neuron.age;
      }
      
      // Grow or shrink neuron
      if (neuron.shrinking) {
        neuron.growth -= this.growthRate * 0.5;
        if (neuron.growth <= 0) {
          const index = this.neurons.indexOf(neuron);
          if (index > -1) {
            this.scene.remove(neuron.mesh);
            this.neurons.splice(index, 1);
          }
        }
      } else {
        if (neuron.growth < neuron.maxGrowth) {
          neuron.growth += this.growthRate;
        }
      }
      
      // Scale neuron based on growth
      const scale = neuron.growth;
      neuron.mesh.scale.setScalar(scale);
      
      // Debug sphere growth
      if (neuron.age % 100 === 0) {
        console.log('Neuron growth:', neuron.growth, '/', neuron.maxGrowth, 'at age:', neuron.age);
      }
      
      // Add dendrites only after sphere is fully grown
      if (neuron.growth >= neuron.maxGrowth && neuron.dendrites.length < 4) {
        if (Math.random() < 0.02) {
          console.log('Creating dendrite for neuron at:', neuron.mesh.position);
          const dendrite = this.createDendrite(neuron);
          neuron.dendrites.push(dendrite);
        }
      }
      
      // Add axon only after sphere is fully grown
      if (neuron.growth >= neuron.maxGrowth && !neuron.axon) {
        console.log('Creating axon for neuron at:', neuron.mesh.position);
        neuron.axon = this.createAxon(neuron);
      }
      
      // Grow dendrites
      for (let dendrite of neuron.dendrites) {
        if (dendrite.currentLength < dendrite.length) {
          dendrite.currentLength += 0.3;
          
          // Create or update dendrite mesh
          if (!dendrite.mesh) {
            const geometry = new THREE.CylinderGeometry(0.05, 0.05, dendrite.currentLength, 8);
            const material = new THREE.MeshPhongMaterial({ 
              color: this.colors.dendrite,
              transparent: true,
              opacity: 0.7
            });
            dendrite.mesh = new THREE.Mesh(geometry, material);
            dendrite.mesh.castShadow = true;
            this.scene.add(dendrite.mesh);
          } else {
            dendrite.mesh.geometry.dispose();
            dendrite.mesh.geometry = new THREE.CylinderGeometry(0.05, 0.05, dendrite.currentLength, 8);
          }
          
          // Position dendrite - start from sphere center and grow outward like a light beam
          const sphereOrigin = dendrite.sphereOrigin;
          const currentEndPoint = new THREE.Vector3(
            sphereOrigin.x + dendrite.direction.x * dendrite.currentLength,
            sphereOrigin.y + dendrite.direction.y * dendrite.currentLength,
            sphereOrigin.z + dendrite.direction.z * dendrite.currentLength
          );
          
          console.log('Dendrite growth:', dendrite.currentLength, '/', dendrite.length);
          console.log('Sphere origin:', sphereOrigin);
          console.log('Current end point:', currentEndPoint);
          
          // Position the cylinder starting from sphere center, extending to current end point
          dendrite.mesh.position.copy(sphereOrigin);
          dendrite.mesh.lookAt(currentEndPoint);
        }
      }
      
      // Grow axon
      if (neuron.axon && neuron.axon.currentLength < neuron.axon.length) {
        neuron.axon.currentLength += 0.4;
        
        // Create or update axon mesh
        if (!neuron.axon.mesh) {
          const geometry = new THREE.CylinderGeometry(0.08, 0.08, neuron.axon.currentLength, 8);
          const material = new THREE.MeshPhongMaterial({ 
            color: this.colors.axon,
            transparent: true,
            opacity: 0.8
          });
          neuron.axon.mesh = new THREE.Mesh(geometry, material);
          neuron.axon.mesh.castShadow = true;
          this.scene.add(neuron.axon.mesh);
        } else {
          neuron.axon.mesh.geometry.dispose();
          neuron.axon.mesh.geometry = new THREE.CylinderGeometry(0.08, 0.08, neuron.axon.currentLength, 8);
        }
        
        // Position axon - start from sphere center and grow outward like a light beam
        const sphereOrigin = neuron.axon.sphereOrigin;
        const currentEndPoint = new THREE.Vector3(
          sphereOrigin.x + neuron.axon.direction.x * neuron.axon.currentLength,
          sphereOrigin.y + neuron.axon.direction.y * neuron.axon.currentLength,
          sphereOrigin.z + neuron.axon.direction.z * neuron.axon.currentLength
        );
        
        // Position the cylinder starting from sphere center, extending to current end point
        neuron.axon.mesh.position.copy(sphereOrigin);
        neuron.axon.mesh.lookAt(currentEndPoint);
      }
    }
  }
  
  createConnections() {
    for (let i = 0; i < this.neurons.length; i++) {
      const neuron1 = this.neurons[i];
      
      for (let j = i + 1; j < this.neurons.length; j++) {
        const neuron2 = this.neurons[j];
        const distance = Math.sqrt(
          (neuron1.x - neuron2.x) ** 2 + 
          (neuron1.y - neuron2.y) ** 2 + 
          (neuron1.z - neuron2.z) ** 2
        );
        
        if (distance < 15 && Math.random() < 0.003) {
          const connection = {
            from: neuron1,
            to: neuron2,
            strength: Math.random() * 0.5 + 0.5,
            mesh: null
          };
          
          // Create connection mesh
          const connectionGeometry = new THREE.CylinderGeometry(0.02, 0.02, distance, 6);
          const connectionMaterial = new THREE.MeshPhongMaterial({ 
            color: this.colors.neuron,
            transparent: true,
            opacity: 0.3
          });
          connection.mesh = new THREE.Mesh(connectionGeometry, connectionMaterial);
          
          // Position connection
          const midPoint = new THREE.Vector3(
            (neuron1.x + neuron2.x) / 2,
            (neuron1.y + neuron2.y) / 2,
            (neuron1.z + neuron2.z) / 2
          );
          connection.mesh.position.copy(midPoint);
          connection.mesh.lookAt(new THREE.Vector3(neuron2.x, neuron2.y, neuron2.z));
          
          this.connections.push(connection);
          this.scene.add(connection.mesh);
        }
      }
    }
  }
  
  drawControlButton() {
    // Create a simple 2D overlay for the button
    const buttonGeometry = new THREE.PlaneGeometry(40, 40);
    const buttonMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x333333,
      transparent: true,
      opacity: 0.9
    });
    
    if (!this.buttonMesh) {
      this.buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
      this.buttonMesh.position.set(-this.width/2 + 40, this.height/2 - 40, 0);
      this.scene.add(this.buttonMesh);
    }
  }
  
  animate() {
    if (this.isRunning) {
      this.growthTime++;
      
      // Add new neurons
      this.addNeurons();
      
      // Update neural growth
      this.updateNeuralGrowth();
      
      // Create new connections
      if (this.growthTime % 100 === 0) {
        this.createConnections();
      }
      
      // Update controls
      this.controls.update();
      
      // Render
      this.renderer.render(this.scene, this.camera);
      
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
    
    // Update scene background
    this.scene.background = new THREE.Color(this.colors.background);
    
    // Update all neuron materials
    for (let neuron of this.neurons) {
      neuron.mesh.material.color.setHex(this.colors.neuron);
    }
    
    // Update all dendrite materials
    for (let neuron of this.neurons) {
      for (let dendrite of neuron.dendrites) {
        if (dendrite.mesh) {
          dendrite.mesh.material.color.setHex(this.colors.dendrite);
        }
      }
    }
    
    // Update all axon materials
    for (let neuron of this.neurons) {
      if (neuron.axon && neuron.axon.mesh) {
        neuron.axon.mesh.material.color.setHex(this.colors.axon);
      }
    }
    
    // Update all connection materials
    for (let connection of this.connections) {
      if (connection.mesh) {
        connection.mesh.material.color.setHex(this.colors.neuron);
      }
    }
    
    console.log('3D Palette changed to index:', this.currentPaletteIndex);
    console.log('New 3D colors:', this.colors);
  }
  
  reset() {
    // Remove all meshes from scene
    for (let neuron of this.neurons) {
      this.scene.remove(neuron.mesh);
      for (let dendrite of neuron.dendrites) {
        if (dendrite.mesh) {
          this.scene.remove(dendrite.mesh);
        }
      }
      if (neuron.axon && neuron.axon.mesh) {
        this.scene.remove(neuron.axon.mesh);
      }
    }
    
    for (let connection of this.connections) {
      if (connection.mesh) {
        this.scene.remove(connection.mesh);
      }
    }
    
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
    const animation = new NeuralRegeneration3D(canvas);
    
    // Make animation globally accessible for controls
    window.neuralRegeneration3D = animation;
    
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
      
      console.log('3D Canvas clicked at:', x, y);
      
      // Check if click is in button area (top-left corner)
      if (x >= 20 && x <= 60 && y >= 20 && y <= 60) {
        console.log('3D Button clicked!');
        animation.nextPalette();
      }
    });
  }
}); 