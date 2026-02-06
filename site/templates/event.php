<?php snippet('header') ?>

<main class="event-page">
  <div class="container">
    <article class="event-profile">

      <!-- Event Header -->
      <div class="event-header">
        <h1 class="event-title"><?= $page->title() ?></h1>

        <div class="event-meta">
          <?php if ($page->date()->isNotEmpty()): ?>
            <div class="event-date">
              <strong>Date:</strong>
              <?php
              $date = new DateTime($page->date());
              echo $date->format('l, F j, Y');
              ?>
            </div>
          <?php endif ?>

          <?php if ($page->start_time()->isNotEmpty() && $page->end_time()->isNotEmpty()): ?>
            <div class="event-time">
              <strong>Time:</strong>
              <?php
              $start = new DateTime($page->start_time());
              $end = new DateTime($page->end_time());
              echo $start->format('g:i A') . ' - ' . $end->format('g:i A') . ' MST';
              ?>
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

      <?php
      $imageField = $page->content()->get('image');
      $imageFile = $imageField->isNotEmpty() ? $imageField->toFile() : null;
      if ($imageFile): ?>
        <div class="performance-image">
          <?= $imageFile->html(['alt' => $imageFile->alt()->or($page->title())]) ?>
        </div>
      <?php endif ?>

      <!-- Event Description -->
      <?php if ($page->description()->isNotEmpty()): ?>
        <div class="event-description">
          <h2>Description</h2>
          <div class="description-content">
            <?= $page->description()->kt() ?>
          </div>
        </div>
      <?php endif ?>

      <!-- Presenters -->
      <?php if ($page->presenters()->isNotEmpty()): ?>
        <div class="event-presenters">
          <h2>Presenters</h2>
          <div class="presenters-grid">
            <?php foreach ($page->presenters()->toPages() as $presenter): ?>
              <a href="<?= $presenter->url() ?>" class="presenter-card">
                <?php if ($presenter->headshot()->isNotEmpty()): ?>
                  <div class="presenter-headshot">
                    <?= $presenter->headshot()->toFile() ?>
                  </div>
                <?php endif ?>
                <div class="presenter-info">
                  <h3 class="presenter-name"><?= $presenter->title() ?></h3>
                  <?php if ($presenter->organization()->isNotEmpty()): ?>
                    <div class="presenter-organization"><?= $presenter->organization() ?></div>
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