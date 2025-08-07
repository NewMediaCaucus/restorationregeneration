/**
 * Countdown Timer for Event
 * Displays days, hours, minutes, and seconds until the event
 */

class CountdownTimer {
  constructor(targetDate) {
    this.targetDate = new Date(targetDate);
    this.elements = {
      days: document.getElementById('days')
    };
    
    this.init();
  }

  init() {
    // Start the countdown immediately
    this.updateCountdown();
    
    // Update every second
    setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  updateCountdown() {
    const now = new Date();
    const timeDifference = this.targetDate - now;

    if (timeDifference <= 0) {
      // Event has passed
      this.displayExpired();
      return;
    }

    // Calculate days only
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // Update display
    this.updateDisplay(days);
  }

  updateDisplay(days) {
    if (this.elements.days) {
      this.elements.days.textContent = days.toString();
    }
  }

  displayExpired() {
    if (this.elements.days) this.elements.days.textContent = '0';
  }
}

// Initialize countdown timer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Hardcoded event date: March 6, 2026
  const eventDate = new Date('2026-03-06T00:00:00');
  
  // Check if the date is valid
  if (!isNaN(eventDate.getTime())) {
    new CountdownTimer(eventDate);
    console.log('Countdown timer initialized for March 6, 2026');
  } else {
    console.error('Invalid event date');
  }
}); 