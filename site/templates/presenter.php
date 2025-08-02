<?php snippet('header') ?>

<main class="presenter-page">
  <div class="container">
    <article class="presenter-profile">

      <!-- Headshot and Basic Info -->
      <div class="presenter-header">
        <?php if ($page->headshot()->isNotEmpty()): ?>
          <div class="presenter-photo">
            <?= $page->headshot()->toFile() ?>
          </div>
        <?php endif ?>

        <div class="presenter-info">
          <?php if ($page->presenter_name()->isNotEmpty()): ?>
            <h1 class="presenter-name"><?= $page->presenter_name() ?></h1>
          <?php endif ?>

          <?php if ($page->role()->isNotEmpty()): ?>
            <div class="presenter-title"><?= $page->role() ?></div>
          <?php endif ?>

          <?php if ($page->organization()->isNotEmpty()): ?>
            <div class="presenter-organization"><?= $page->organization() ?></div>
          <?php endif ?>
        </div>
      </div>

      <!-- Bio -->
      <?php if ($page->bio()->isNotEmpty()): ?>
        <div class="presenter-bio">
          <h2>Biography</h2>
          <div class="bio-content">
            <?= $page->bio()->kt() ?>
          </div>
        </div>
      <?php endif ?>

      <!-- Social Media -->
      <?php if ($page->social_media()->isNotEmpty()): ?>
        <div class="presenter-social">
          <h2>Connect</h2>
          <div class="social-links">
            <?php foreach ($page->social_media()->toStructure() as $social): ?>
              <?php if ($social->url()->isNotEmpty()): ?>
                <?php
                $url = $social->url();
                $isInstagram = str_contains($url, 'instagram.com');
                $iconClass = $isInstagram ? 'instagram-icon' : 'globe-icon';
                ?>
                <a href="<?= $url ?>" target="_blank" class="social-link <?= $iconClass ?>">
                  <div class="social-icon">
                    <?php if ($isInstagram): ?>
                      <!-- Instagram Icon -->
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    <?php else: ?>
                      <!-- Globe Icon -->
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                      </svg>
                    <?php endif ?>
                  </div>
                  <span class="social-text"><?= $isInstagram ? 'Instagram' : 'Website' ?></span>
                </a>
              <?php endif ?>
            <?php endforeach ?>
          </div>
        </div>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>