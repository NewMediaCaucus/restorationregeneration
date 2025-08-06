# Header Animation System

## Overview

The header animation system provides dynamic, mathematically-driven visual experiences that change based on the day of the month. The system uses a combination of prime number detection and odd/even logic to determine which animation to display.

## Animation Schedule

### Prime Number Days (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31)
**Animation**: `tissue-regeneration-3d.js`
- **Theme**: Biological tissue healing and regeneration
- **Features**: Pink tissue cells that grow, divide, migrate, and form connections
- **Visual Elements**: 
  - Spherical cells in various pink shades
  - Cell division and growth cycles
  - Migration towards nearby cells (chemotaxis)
  - Tissue fiber connections between cells
  - Dynamic background gradient

### Even Days (4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30)
**Animation**: `obsidian-icebergs-3d.js`
- **Theme**: Angular obsidian formations with subtle purple hints
- **Features**: Sharp, geometric icebergs that multiply, divide, and give birth
- **Visual Elements**:
  - Angular obsidian-like structures
  - Subtle purple color variations
  - Life cycle: birth, division, death, health decay
  - Dramatic lighting with purple tints
  - Contemplative, slower movement

### Odd Days (1, 9, 15, 21, 25, 27)
**Animation**: `neural-regeneration-3d.js`
- **Theme**: Neural network growth and regeneration
- **Features**: Neurons with growing dendrites and axons
- **Visual Elements**:
  - Spherical neurons with independent rotation
  - Growing dendrites and axons
  - Neural connections between nearby neurons
  - Background color transitions
  - Neuron life cycles with rotation-based timing

## Advanced Features

### Cell Interaction System (Tissue Regeneration)
- **Proximity Detection**: Cells detect when within 2.5 units of each other
- **Color Change**: Cells turn light purple (0xDDA0DD) when interacting
- **State Management**: Tracks interaction state to prevent flickering
- **Smooth Transitions**: Gradual color changes with original color restoration
- **Biological Realism**: Mimics cell-to-cell communication in tissue

### Accelerated Color Transitions (Obsidian Icebergs)
- **Early Color Shift**: Icebergs transition from black to lighter colors 2.5x faster
- **Modified Ratio**: `(1 - healthRatio) * 2.5` for accelerated progression
- **Faster Blending**: Increased lerp speed from 0.5 to 0.8
- **Safety Cap**: Prevents color index overflow with `Math.min(1, acceleratedRatio)`

### Migration and Attraction Systems
- **Chemotaxis Simulation**: Cells move towards nearest neighbors
- **Attraction Radius**: 8-unit detection range for cell migration
- **Velocity Damping**: 0.98 multiplier for realistic movement
- **Boundary Physics**: Cells bounce off boundaries with 0.8 velocity reduction

## Technical Implementation

### Animation Loader (`assets/js/animation-loader.js`)

The animation loader uses a sophisticated algorithm to determine which animation to display:

```javascript
// Prime number detection
function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}
```

### Decision Logic

1. **Check if day is prime**: If true, load tissue regeneration
2. **Check if day is even**: If true (and not prime), load obsidian icebergs
3. **Default to odd**: Load neural regeneration

### Responsive Design

All animations adapt to different screen sizes:
- **Large Desktop (1440px+)**: 800px height
- **Desktop (1024-1439px)**: 700px height
- **Tablet (768-1023px)**: 600px height
- **Mobile (480-767px)**: 380px height
- **Small Mobile (<480px)**: 400px height

## Animation Files

### `tissue-regeneration-3d.js`
- **Class**: `TissueRegeneration3D`
- **Initialization**: `initializeTissueRegeneration()`
- **Max Cells**: 120
- **Max Connections**: 80
- **Growth Rate**: 0.03
- **Division Rate**: 0.005
- **Migration Speed**: 0.02
- **Attraction Radius**: 8 units
- **Cell Colors**: 6 shades of pink (0xE91E63 to 0xC2185B)
- **Interaction Color**: Light purple (0xDDA0DD) when cells touch
- **Background**: Dynamic gradient between dark blue-gray tones

### `obsidian-icebergs-3d.js`
- **Class**: `ObsidianIcebergs3D`
- **Initialization**: Auto-initializes
- **Max Icebergs**: 20
- **Initial Count**: 12
- **Birth Rate**: Every 15 seconds
- **Division Rate**: Every 20 seconds
- **Color Palette**: 10 obsidian shades with purple hints
- **Accelerated Color Transition**: 2.5x faster color changes from black
- **Health Decay**: Slower rate (1 unit/second)
- **Movement**: Slower, more contemplative rotation and floating

### `neural-regeneration-3d.js`
- **Class**: `NeuralRegeneration3D`
- **Initialization**: `initializeNeuralRegeneration()`
- **Max Neurons**: 160
- **Max Connections**: 160
- **Initial Neurons**: 48
- **Rotation Speed**: 0.06

## Header Template Integration

### Home Page (`site/snippets/header.php`)
- Loads Three.js libraries only on home page
- Includes animation loader script
- Displays dynamic hero overlay content

### Internal Pages
- Uses static header with background images
- Background alternates based on day of month
- Hero overlay content from home page data

## CSS Styling

### Animated Header (Home Page)
```css
.header-animation {
  height: 600px;
  position: relative;
  overflow: hidden;
}

#regeneration-canvas {
  width: 100%;
  height: 100%;
}
```

### Static Header (Internal Pages)
```css
.static-header {
  height: 200px;
  position: relative;
  overflow: hidden;
}
```

## Background Images

### Even Days
- **File**: `assets/icons/header-background-even.png`
- **Usage**: Static header background for even days

### Odd Days
- **File**: `assets/icons/header-background-odd.png`
- **Usage**: Static header background for odd days

## Performance Considerations

### WebGL Detection
- All animations include WebGL context checking
- Graceful fallbacks for unsupported browsers
- Console logging for debugging

### Memory Management
- Proper disposal of Three.js geometries and materials
- Reset functions to clear scene objects
- Timeout-based animation loops

### Responsive Optimization
- Canvas resizing with debounced event handlers
- Aspect ratio maintenance across devices
- Performance-appropriate detail levels

## Browser Compatibility

### Supported
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Requirements
- WebGL support
- ES6+ JavaScript support
- Three.js library (CDN loaded)

## Debugging

### Console Logging
All animations include extensive console logging:
- Animation initialization status
- Script loading progress
- Day detection results
- Error handling

### Common Issues
1. **Canvas not found**: Check DOM structure
2. **WebGL context failed**: Browser compatibility
3. **Script loading errors**: Network connectivity
4. **Animation not starting**: Check console for errors

### Testing and Temporary Overrides
- **Temporary Animation Testing**: Override logic to test specific animations
- **Console Logging**: Extensive logging for debugging animation loading
- **Override Pattern**: Comment out original logic, add hardcoded animation load
- **Restoration**: Easy restoration of normal day-based scheduling

## Customization

### Adding New Animations
1. Create new animation file in `assets/js/`
2. Implement standard class structure
3. Add initialization function
4. Update animation loader logic
5. Test across different days

### Modifying Schedule
Edit `assets/js/animation-loader.js`:
- Change prime number logic
- Modify day detection
- Add new animation conditions
- Update script loading paths

### Styling Changes
Modify `assets/css/style.css`:
- Header heights and responsive breakpoints
- Hero overlay positioning
- Animation canvas styling
- Static header backgrounds

## Mathematical Foundation

### Prime Number Algorithm
Uses optimized trial division:
- Early exit for numbers ≤ 3
- Divisibility tests for 2 and 3
- 6k±1 optimization for larger numbers
- Efficient for numbers up to 31 (month days)

### Day Distribution
- **Prime Days**: 11 days per month (35.5%)
- **Even Days**: 14-15 days per month (48.4%)
- **Odd Days**: 5-6 days per month (16.1%)

This creates a balanced but mathematically interesting distribution of animations throughout the month.

### Animation Complexity Levels
- **Tissue Regeneration**: High complexity with cell interactions, migration, and division
- **Obsidian Icebergs**: Medium complexity with life cycles and color transitions
- **Neural Regeneration**: High complexity with neural growth and connection systems

## Future Enhancements

### Potential Additions
- Seasonal animation themes
- User preference overrides
- Animation transition effects
- Performance monitoring
- Accessibility features

### Scalability
- Modular animation system
- Plugin architecture
- Configuration-driven scheduling
- A/B testing capabilities 