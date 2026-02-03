<footer class="site-footer">
  <div class="container">
    <!-- Megafooter Navigation -->
    <div class="megafooter">
      <!-- First Block: Arrive On Time -->
      <div class="megafooter-navblock">
        <h3 class="navblock-header">Arrive On Time</h3>
        <p class="navblock-description">Check our schedules to make sure you don't miss anything!</p>
        <nav class="navblock-links">
          <?php
          // Full Schedule
          $schedulePage = $site->find('schedule');
          $scheduleUrl = $schedulePage ? $schedulePage->url() : $site->url() . '/schedule';
          // Friday, Saturday, Sunday
          $fridayPage = $site->find('2026-03-06');
          $saturdayPage = $site->find('2026-03-07');
          $sundayPage = $site->find('2026-03-08');
          ?>
          <a href="<?= $fridayPage ? $fridayPage->url() : $site->url() . '/2026-03-06' ?>">Friday</a>
          <a href="<?= $saturdayPage ? $saturdayPage->url() : $site->url() . '/2026-03-07' ?>">Saturday</a>
          <a href="<?= $sundayPage ? $sundayPage->url() : $site->url() . '/2026-03-08' ?>">Sunday</a>
          <a href="<?= $scheduleUrl ?>">Full Schedule</a>
        </nav>
      </div>

      <!-- Second Block: Be Dazzled -->
      <div class="megafooter-navblock">
        <h3 class="navblock-header">Become Dazzled</h3>
        <p class="navblock-description">Discover the many artists, artforms, and activities converging at the symposium.</p>

        <nav class="navblock-links">
          <?php
          $artistsPage = $site->find('artists');
          $expandedMediasPage = $site->find('expanded-medias');
          $performancesPage = $site->find('performances');
          $presentationsPage = $site->find('presentations');
          $videosPage = $site->find('videos');
          $workshopsPage = $site->find('workshops');
          ?>
          <a href="<?= $artistsPage ? $artistsPage->url() : $site->url() . '/artists' ?>">Artists</a>
          <a href="<?= $expandedMediasPage ? $expandedMediasPage->url() : $site->url() . '/expanded-medias' ?>">Expanded Media</a>
          <a href="<?= $performancesPage ? $performancesPage->url() : $site->url() . '/performances' ?>">Performances</a>
          <a href="<?= $presentationsPage ? $presentationsPage->url() : $site->url() . '/presentations' ?>">Presentations</a>
          <a href="<?= $videosPage ? $videosPage->url() : $site->url() . '/videos' ?>">Single-Channel Videos</a>
          <a href="<?= $workshopsPage ? $workshopsPage->url() : $site->url() . '/workshops' ?>">Workshops</a>
        </nav>
      </div>

      <!-- Third Block: Find Yourself -->
      <div class="megafooter-navblock">
        <h3 class="navblock-header">Find Your Way</h3>
        <p class="navblock-description">Locate our destinations inside the MIX Center.</p>

        <nav class="navblock-links">
          <?php
          $locationsPage = $site->find('locations');
          ?>
          <a href="<?= $locationsPage ? $locationsPage->url() : $site->url() . '/locations' ?>">Our MIX Center Locations</a>
          <a href="https://maps.app.goo.gl/YwgmUCz7Z7hoTGZp9" target="_blank">
            <svg class="map-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            50 N Centennial Way, Mesa, AZ 85201
          </a>

        </nav>
      </div>

      <!-- Fourth Block: Join Us! -->
      <div class="megafooter-navblock">
        <h3 class="navblock-header">Join Us!</h3>
        <nav class="navblock-links">
          <a href="<https://www.tixtree.com/e/2026-symposium-restorationregeneration-1301fb9395e6>">Register for Restoration/Regeneration</a>
          <a href="https://newmediacaucus.org" target="_blank">newmediacaucus.org</a>
        </nav>
      </div>
    </div>

    <!-- Hamburger Menu Toggle (Mobile Only) -->
    <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle menu">
      <span class="hamburger-icon">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </button>

    <!-- Mobile Menu (Overlay) -->
    <div class="mobile-menu-overlay" id="mobile-menu-overlay">
      <button class="mobile-menu-close" id="mobile-menu-close" aria-label="Close menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <div class="mobile-menu-content">
        <!-- First Block: Arrive On Time -->
        <div class="mobile-navblock">
          <h3 class="mobile-navblock-header">Arrive On Time</h3>
          <nav class="mobile-navblock-links">
            <a href="<?= $fridayPage ? $fridayPage->url() : $site->url() . '/2026-03-06' ?>">Friday</a>
            <a href="<?= $saturdayPage ? $saturdayPage->url() : $site->url() . '/2026-03-07' ?>">Saturday</a>
            <a href="<?= $sundayPage ? $sundayPage->url() : $site->url() . '/2026-03-08' ?>">Sunday</a>
            <a href="<?= $scheduleUrl ?>">Full Schedule</a>
          </nav>
        </div>

        <!-- Second Block: Become Dazzled -->
        <div class="mobile-navblock">
          <h3 class="mobile-navblock-header">Become Dazzled</h3>
          <nav class="mobile-navblock-links">
            <a href="<?= $artistsPage ? $artistsPage->url() : $site->url() . '/artists' ?>">Artists</a>
            <a href="<?= $expandedMediasPage ? $expandedMediasPage->url() : $site->url() . '/expanded-medias' ?>">Expanded Media</a>
            <a href="<?= $performancesPage ? $performancesPage->url() : $site->url() . '/performances' ?>">Performances</a>
            <a href="<?= $presentationsPage ? $presentationsPage->url() : $site->url() . '/presentations' ?>">Presentations</a>
            <a href="<?= $videosPage ? $videosPage->url() : $site->url() . '/videos' ?>">Single-Channel Videos</a>
            <a href="<?= $workshopsPage ? $workshopsPage->url() : $site->url() . '/workshops' ?>">Workshops</a>
          </nav>
        </div>

        <!-- Third Block: Find Your Way -->
        <div class="mobile-navblock">
          <h3 class="mobile-navblock-header">Find Your Way</h3>
          <nav class="mobile-navblock-links">
            <a href="<?= $locationsPage ? $locationsPage->url() : $site->url() . '/locations' ?>">Our MIX Center Locations</a>
            <a href="https://maps.app.goo.gl/YwgmUCz7Z7hoTGZp9" target="_blank">
              <svg class="map-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              50 N Centennial Way, Mesa, AZ 85201
            </a>
          </nav>
        </div>
      </div>
    </div>

    <!-- Footer Content (Original) -->
    <div class="footer-content">
      <div class="footer-main">
        <p>The New Media Caucus (NMC) is an international non-profit association formed to promote the development and understanding of new media art. We represent and serve: artists, designers, practitioners, historians, theorists, educators, students, and scholars. <a href="http://newmediacaucus.org" target="_blank">Join us</a>.</p>
      </div>

      <div class="footer-links">
        <p>
          <a href="https://newmediacaucus.org/privacy-policy" target="_blank">Read our Privacy Policy</a>.
          Made with <a href="https://getkirby.com/" target="_blank">Kirby</a>.
          Found a bug or another weird thing? <a href="https://github.com/NewMediaCaucus/restorationregeneration/issues/new" target="_blank">Let us know</a>.
        </p>
      </div>

      <div class="footer-social">
        <a href="https://newmediacaucus.org" target="_blank" class="social-link nmc-logo">
          <img src="<?= url('assets/icons/nmc-purple-green.png') ?>" alt="New Media Caucus" class="social-icon">
        </a>
        <a href="https://www.facebook.com/groups/newmediacaucus" target="_blank" class="social-link facebook">
          <img src="/assets/icons/facebook.svg" alt="Facebook" class="social-icon">
        </a>
        <a href="https://www.instagram.com/newmediacaucus/" target="_blank" class="social-link instagram">
          <img src="/assets/icons/instagram.svg" alt="Instagram" class="social-icon">
        </a>
        <a href="https://github.com/NewMediaCaucus/" target="_blank" class="social-link github">
          <img src="/assets/icons/github.svg" alt="GitHub" class="social-icon">
        </a>
      </div>

      <div class="footer-copyright">
        <p>Copyright © <?= date('Y') ?> <a href="http://newmediacaucus.org" target="_blank">New Media Caucus</a></p>
      </div>
    </div>
  </div>
</footer>

<script src="<?= url('assets/js/mobile-menu.js') ?>" defer></script>

</body>

</html>