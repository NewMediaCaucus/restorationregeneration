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
          <h1 class="presenter-name"><?= $page->title() ?></h1>

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
      <!-- Links -->
      <?php if ($page->links()->isNotEmpty()): ?>
        <div class="presenter-social">
          <h2>Links</h2>
          <div class="social-links">
            <?php foreach ($page->links()->toStructure() as $social): ?>
              <?php if ($social->url()->isNotEmpty()): ?>
                <?php
                $url = $social->url();
                $isInstagram = str_contains($url, 'instagram.com');
                ?>
                <a href="<?= $url ?>" target="_blank" class="link-item">
                  <div class="link-icon">
                    <?php if ($isInstagram): ?>
                      <!-- Instagram Icon -->
                      <svg viewBox="0 0 24 24" fill="#000000">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    <?php else: ?>
                      <!-- Globe Icon -->
                      <svg viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    <?php endif ?>
                  </div>
                  <span class="link-text"><?= $url ?></span>
                </a>
              <?php endif ?>
            <?php endforeach ?>
          </div>
        </div>
      <?php endif ?>

      <!-- Events -->
      <?php
      // Debug: Let's see what we're working with
      $currentPresenterId = $page->id();
      $currentPresenterUuid = $page->uuid();
      // Extract just the UUID part without the 'page://' prefix
      $uuidOnly = str_replace('page://', '', $currentPresenterUuid);
      $allEvents = $site->index()->filterBy('intendedTemplate', 'event');

      // Manual approach: check each event's presenters field
      $events = new \Kirby\Cms\Pages();
      foreach ($allEvents as $event) {
        if ($event->presenters()->isNotEmpty()) {
          // Check if the current presenter's UUID is in the presenters field
          if (str_contains($event->presenters(), $currentPresenterUuid)) {
            $events->add($event);
          }
        }
      }

      // Debug output
      echo "<!-- Debug: Current presenter ID: " . $currentPresenterId . " -->";
      echo "<!-- Debug: Current presenter UUID: " . $currentPresenterUuid . " -->";
      echo "<!-- Debug: UUID only: " . $uuidOnly . " -->";
      echo "<!-- Debug: Total events found: " . $allEvents->count() . " -->";
      echo "<!-- Debug: Events with this presenter: " . $events->count() . " -->";

      // Let's also check what the presenters field contains in each event
      foreach ($allEvents as $event) {
        echo "<!-- Debug: Event '" . $event->title() . "' presenters: " . $event->presenters() . " -->";
      }

      if ($events->count() > 0):
      ?>
        <div class="presenter-events">
          <h2>Events</h2>
          <div class="events-grid">
            <?php foreach ($events as $event): ?>
              <a href="<?= $event->url() ?>" class="event-card">
                <div class="event-info">
                  <h3 class="event-name"><?= $event->title() ?></h3>
                  <?php if ($event->date()->isNotEmpty()): ?>
                    <div class="event-date">
                      <?php
                      $date = new DateTime($event->date());
                      echo $date->format('l, F j, Y');
                      ?>
                    </div>
                  <?php endif ?>
                  <?php if ($event->start_time()->isNotEmpty() && $event->end_time()->isNotEmpty()): ?>
                    <div class="event-time">
                      <?php
                      $start = new DateTime($event->start_time());
                      $end = new DateTime($event->end_time());
                      echo $start->format('g:i A') . ' - ' . $end->format('g:i A') . ' MST';
                      ?>
                    </div>
                  <?php endif ?>
                </div>
              </a>
            <?php endforeach ?>
          </div>
        </div>
      <?php endif ?>


    </article>
  </div>
</main>

<?php snippet('footer') ?>