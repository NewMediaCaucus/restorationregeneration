<?php snippet('header') ?>

<main class="location-page">
  <div class="container">
    <article class="location-profile">

      <!-- Location Header -->
      <div class="location-header">
        <h1 class="location-title"><?= $page->title() ?></h1>

        <div class="location-meta">
          <?php if ($page->floor()->isNotEmpty()): ?>
            <div class="location-floor">
              <strong>Floor:</strong>
              <?php
              $floorValue = $page->floor()->toString();
              $floorOptions = [
                '1st-floor' => '1st Floor',
                '2nd-floor' => '2nd Floor',
                '3rd-floor' => '3rd Floor'
              ];
              echo isset($floorOptions[$floorValue]) ? $floorOptions[$floorValue] : $floorValue;
              ?>
            </div>
          <?php endif ?>

          <?php if ($page->capacity()->isNotEmpty()): ?>
            <div class="location-capacity">
              <strong>Capacity:</strong> <?= $page->capacity() ?> people
            </div>
          <?php endif ?>
        </div>
      </div>

      <!-- Location Photo -->
      <?php if ($page->photo()->isNotEmpty()): ?>
        <div class="location-photo">
          <?= $page->photo()->toFile() ?>
        </div>
      <?php endif ?>

      <!-- Location Description -->
      <?php if ($page->description()->isNotEmpty()): ?>
        <div class="location-description">
          <h2>About This Location</h2>
          <div class="description-content">
            <?= $page->description()->kt() ?>
          </div>
        </div>
      <?php endif ?>

      <!-- Location Address -->
      <?php if ($page->address()->isNotEmpty()): ?>
        <div class="location-address">
          <h2>Address</h2>
          <div class="address-content">
            <?= $page->address()->kt() ?>
          </div>
        </div>
      <?php endif ?>

      <!-- Location Website -->
      <?php if ($page->url() !== ''): ?>
        <div class="location-url">
          <h2>Website</h2>
          <a href="<?= $page->url() ?>" target="_blank" class="location-website-link">
            <svg class="external-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15,3 21,3 21,9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Visit Website
          </a>
        </div>
      <?php endif ?>

      <!-- Location Map Link -->
      <?php if ($page->map_link() !== ''): ?>
        <div class="location-map-link">
          <h2>Get Directions</h2>
          <a href="<?= $page->map_link() ?>" target="_blank" class="map-link">
            <svg class="map-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Open in Maps
          </a>
        </div>
      <?php endif ?>

      <!-- Location Accessibility -->
      <?php if ($page->accessibility()->isNotEmpty()): ?>
        <div class="location-accessibility">
          <h2>Accessibility</h2>
          <div class="accessibility-content">
            <?= $page->accessibility()->kt() ?>
          </div>
        </div>
      <?php endif ?>

      <!-- Events at this Location -->
      <?php
      $events = $site->index()->filterBy('intendedTemplate', 'event')->filterBy('location', $page->id());
      if ($events->count() > 0):
      ?>
        <div class="location-events">
          <h2>Events at This Location</h2>
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