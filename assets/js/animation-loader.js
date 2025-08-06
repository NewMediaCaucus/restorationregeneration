// Animation Loader - Loads different animations based on the day of the month
document.addEventListener('DOMContentLoaded', () => {
  console.log('Animation Loader: DOM loaded');
  
  const today = new Date();
  const dayOfMonth = today.getDate();
  const isEvenDay = dayOfMonth % 2 === 0;

  console.log(`Animation Loader: Day ${dayOfMonth}, isEvenDay: ${isEvenDay}`);

  // Helper function to check if a number is prime
  function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
  }

  const isPrimeDay = isPrime(dayOfMonth);
  console.log(`Animation Loader: Day ${dayOfMonth} is prime: ${isPrimeDay}`);

  // Get the canvas element
  const canvas = document.getElementById('regeneration-canvas');
  if (!canvas) {
    console.error('Animation Loader: Canvas element not found');
    return;
  }

  console.log('Animation Loader: Canvas found, loading animation...');

  // Load the appropriate animation based on the day
  if (isPrimeDay) {
    // Prime day - load tissue-regeneration-3d.js
    console.log(`Animation Loader: Day ${dayOfMonth} is prime - loading tissue-regeneration-3d.js`);
    loadScript('assets/js/tissue-regeneration-3d.js').then(() => {
      console.log('Animation Loader: Tissue regeneration script loaded successfully');
      // The animation auto-initializes when the script loads
    }).catch((error) => {
      console.error('Animation Loader: Failed to load tissue regeneration script:', error);
    });
  } else if (isEvenDay) {
    // Even day (non-prime) - load obsidian-icebergs-3d.js
    console.log(`Animation Loader: Day ${dayOfMonth} is even (non-prime) - loading obsidian-icebergs-3d.js`);
    loadScript('assets/js/obsidian-icebergs-3d.js').then(() => {
      console.log('Animation Loader: Obsidian icebergs script loaded successfully');
      // The animation auto-initializes when the script loads
    }).catch((error) => {
      console.error('Animation Loader: Failed to load obsidian icebergs script:', error);
    });
  } else {
    // Odd day (non-prime) - load neural-regeneration-3d.js
    console.log(`Animation Loader: Day ${dayOfMonth} is odd (non-prime) - loading neural-regeneration-3d.js`);
    loadScript('assets/js/neural-regeneration-3d.js').then(() => {
      console.log('Animation Loader: Neural regeneration script loaded successfully');
      // Initialize the neural regeneration animation
      if (typeof initializeNeuralRegeneration === 'function') {
        initializeNeuralRegeneration();
      }
    }).catch((error) => {
      console.error('Animation Loader: Failed to load neural regeneration script:', error);
    });
  }
});

// Helper function to load scripts dynamically
function loadScript(src) {
  console.log(`Animation Loader: Loading script: ${src}`);
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      console.log(`Animation Loader: Script loaded successfully: ${src}`);
      resolve();
    };
    script.onerror = (error) => {
      console.error(`Animation Loader: Script failed to load: ${src}`, error);
      reject(error);
    };
    document.head.appendChild(script);
  });
} 