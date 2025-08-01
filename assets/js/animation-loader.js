// Animation Loader - Loads different animations based on the day of the month
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const dayOfMonth = today.getDate();
  const isEvenDay = dayOfMonth % 2 === 0;
  
  // Get the canvas element
  const canvas = document.getElementById('regeneration-canvas');
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }
  
  // Load the appropriate animation based on the day
  if (isEvenDay) {
    // Even day - load restoration-regeneration.js
    console.log(`Day ${dayOfMonth} is even - loading restoration-regeneration.js`);
    loadScript('assets/js/restoration-regeneration.js').then(() => {
      console.log('Restoration regeneration script loaded successfully');
      // Initialize the restoration regeneration animation
      if (typeof initializeRestorationRegeneration === 'function') {
        initializeRestorationRegeneration();
      }
    }).catch((error) => {
      console.error('Failed to load restoration regeneration script:', error);
    });
  } else {
    // Odd day - load neural-regeneration-3d.js
    console.log(`Day ${dayOfMonth} is odd - loading neural-regeneration-3d.js`);
    loadScript('assets/js/neural-regeneration-3d.js').then(() => {
      console.log('Neural regeneration script loaded successfully');
      // Initialize the neural regeneration animation
      if (typeof initializeNeuralRegeneration === 'function') {
        initializeNeuralRegeneration();
      }
    }).catch((error) => {
      console.error('Failed to load neural regeneration script:', error);
    });
  }
});

// Helper function to load scripts dynamically
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
} 