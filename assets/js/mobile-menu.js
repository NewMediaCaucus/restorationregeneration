(function() {
  'use strict';

  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  if (!mobileMenuToggle || !mobileMenuOverlay || !mobileMenuClose) {
    return;
  }

  function openMenu() {
    mobileMenuOverlay.classList.add('active');
    document.body.classList.add('mobile-menu-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenuOverlay.classList.remove('active');
    document.body.classList.remove('mobile-menu-open');
    document.body.style.overflow = '';
  }

  // Open menu on hamburger click
  mobileMenuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    openMenu();
  });

  // Close menu on X button click
  mobileMenuClose.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    closeMenu();
  });

  // Close menu on overlay click (outside content)
  mobileMenuOverlay.addEventListener('click', function(e) {
    if (e.target === mobileMenuOverlay) {
      closeMenu();
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close menu when a link is clicked
  const mobileMenuLinks = mobileMenuOverlay.querySelectorAll('.mobile-navblock-links a');
  mobileMenuLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      closeMenu();
    });
  });
})();

