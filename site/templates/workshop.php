<?php snippet('header') ?>

<main class="event-page">
  <div class="container">
    <article class="event-profile">

      <!-- Event Header -->
      <div class="event-header">
        <h1 class="event-title"><?= $page->title() ?></h1>

        <div class="event-meta">
          <?php if ($page->date()->isNotEmpty()): ?>
            <?php
            $dateObj = new DateTime($page->date());
            $dateFormatted = $dateObj->format('l, F j, Y');
            $dateSlug = $dateObj->format('Y-m-d');

            // Try to find a page using the schedule-date template with matching slug
            $datePage = $site->index()->filter(function ($page) use ($dateSlug) {
              return $page->intendedTemplate()->name() === 'schedule-date' &&
                ($page->slug() === $dateSlug || $page->slug() === str_replace('-', '', $dateSlug));
            })->first();

            // If not found by slug match, try finding by exact slug
            if (!$datePage) {
              $datePage = $site->find($dateSlug);
              if ($datePage && $datePage->intendedTemplate()->name() !== 'schedule-date') {
                $datePage = null;
              }
            }

            // Construct URL if page exists, otherwise use expected URL
            if ($datePage) {
              $dateUrl = $datePage->url();
            } else {
              $dateUrl = $site->url() . '/' . $dateSlug;
            }
            ?>
            <div class="event-date">
              <a href="<?= $dateUrl ?>"><?= $dateFormatted ?></a>
            </div>
          <?php endif ?>

          <?php if ($page->timeblock()->isNotEmpty()): ?>
            <div class="event-time">
              <?= $page->timeblock() ?>
            </div>
          <?php endif ?>

          <?php if ($page->duration()->isNotEmpty()): ?>
            <div class="event-duration">
              <strong>Duration:</strong> <?= $page->duration() ?>
            </div>
          <?php endif ?>

          <?php if ($page->location()->isNotEmpty()): ?>
            <div class="event-location">
              <?php
              $location = $page->location()->toPage();
              if ($location): ?>
                <a href="<?= $location->url() ?>" class="location-link">
                  <svg class="map-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <?= $location->title() ?>
                </a>
              <?php else: ?>
                <svg class="map-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <?= $page->location() ?>
              <?php endif ?>
            </div>
          <?php endif ?>
        </div>
      </div>

      <!-- Event Description -->
      <?php if ($page->description()->isNotEmpty()): ?>
        <div class="event-description">
          <h2>Description</h2>
          <div class="description-content">
            <?= $page->description()->kt() ?>
          </div>
        </div>
      <?php endif ?>

      <!-- Artists -->
      <?php if ($page->presenters()->isNotEmpty()): ?>
        <div class="event-presenters">
          <h2>Artists</h2>
          <div class="presenters-grid">
            <?php foreach ($page->presenters()->toPages() as $presenter): ?>
              <div class="artist-card">
                <a href="<?= $presenter->url() ?>" class="artist-headshot-link">
                  <div class="artist-headshot">
                    <?php if ($presenter->headshot()->isNotEmpty()): ?>
                      <?= $presenter->headshot()->toFile() ?>
                    <?php else: ?>
                      <div class="artist-headshot-placeholder"></div>
                    <?php endif ?>
                  </div>
                </a>
                <div class="artist-info">
                  <h3 class="artist-name">
                    <a href="<?= $presenter->url() ?>"><?= $presenter->title() ?></a>
                  </h3>
                  <?php if ($presenter->organization()->isNotEmpty()): ?>
                    <div class="presenter-organization"><?= $presenter->organization() ?></div>
                  <?php endif ?>
                </div>
              </div>
            <?php endforeach ?>
          </div>
        </div>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>