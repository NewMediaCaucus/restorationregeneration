<?php snippet('header') ?>

<main class="listings-page">
  <div class="container">
    <article class="listings-content">

      <div class="listings-header">
        <h1>Performances</h1>
      </div>

      <?php snippet('construction-alert') ?>

      <?php
      // Get all performances
      $performances = $site->index()->filterBy('intendedTemplate', 'performance');

      if ($performances->count() > 0):
      ?>
        <div class="events-grid">
          <?php foreach ($performances as $performance): ?>
            <div class="event-card">
              <div class="event-info">
                <h3 class="event-name">
                  <a href="<?= $performance->url() ?>"><?= $performance->title() ?></a>
                </h3>
                <?php if ($performance->type()->isNotEmpty()): ?>
                  <div class="event-type">
                    Type: <?= $performance->type() ?>
                  </div>
                <?php endif ?>
                <?php if ($performance->location()->isNotEmpty()): ?>
                  <?php
                  $location = $performance->location()->toPage();
                  if ($location):
                  ?>
                    <div class="event-location">
                      <a href="<?= $location->url() ?>">
                        <svg class="map-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <?= $location->title() ?>
                      </a>
                    </div>
                  <?php endif ?>
                <?php endif ?>
                <?php if ($performance->description()->isNotEmpty()): ?>
                  <div class="event-description-preview">
                    <?= $performance->description()->excerpt(150) ?>
                  </div>
                <?php endif ?>
              </div>
            </div>
          <?php endforeach ?>
        </div>
      <?php else: ?>
        <p>No performances available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>