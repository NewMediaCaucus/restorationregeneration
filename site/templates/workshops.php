<?php snippet('header') ?>

<main class="listings-page">
  <div class="container">
    <article class="listings-content">

      <div class="listings-header">
        <h1>Workshops</h1>
      </div>

      <?php
      // Get all workshops
      $workshops = $site->index()->filterBy('intendedTemplate', 'workshop');

      if ($workshops->count() > 0):
      ?>
        <div class="events-grid">
          <?php foreach ($workshops as $workshop): ?>
            <div class="event-card">
              <div class="event-info">
                <h3 class="event-name">
                  <a href="<?= $workshop->url() ?>"><?= $workshop->title() ?></a>
                </h3>
                <?php if ($workshop->date()->isNotEmpty()): ?>
                  <?php
                  $dateObj = new DateTime($workshop->date());
                  $dateFormatted = $dateObj->format('l, F j, Y');
                  $dateSlug = $dateObj->format('Y-m-d');
                  
                  // Try to find a page using the schedule-date template with matching slug
                  $datePage = $site->index()->filter(function($page) use ($dateSlug) {
                    return $page->intendedTemplate()->name() === 'schedule-date' && 
                           ($page->slug() === $dateSlug || $page->slug() === str_replace('-', '', $dateSlug));
                  })->first();
                  
                  if (!$datePage) {
                    $datePage = $site->find($dateSlug);
                    if ($datePage && $datePage->intendedTemplate()->name() !== 'schedule-date') {
                      $datePage = null;
                    }
                  }
                  
                  $dateUrl = $datePage ? $datePage->url() : ($site->url() . '/' . $dateSlug);
                  ?>
                  <div class="event-date">
                    <a href="<?= $dateUrl ?>"><?= $dateFormatted ?></a>
                  </div>
                <?php endif ?>
                <?php if ($workshop->timeblock()->isNotEmpty()): ?>
                  <div class="event-time">
                    <?= $workshop->timeblock() ?>
                  </div>
                <?php endif ?>
                <?php if ($workshop->duration()->isNotEmpty()): ?>
                  <div class="event-duration">
                    Duration: <?= $workshop->duration() ?>
                  </div>
                <?php endif ?>
                <?php if ($workshop->location()->isNotEmpty()): ?>
                  <?php
                  $location = $workshop->location()->toPage();
                  if ($location):
                  ?>
                    <div class="event-location">
                      Location: <a href="<?= $location->url() ?>"><?= $location->title() ?></a>
                    </div>
                  <?php endif ?>
                <?php endif ?>
                <?php if ($workshop->description()->isNotEmpty()): ?>
                  <div class="event-description-preview">
                    <?= $workshop->description()->excerpt(150) ?>
                  </div>
                <?php endif ?>
              </div>
            </div>
          <?php endforeach ?>
        </div>
      <?php else: ?>
        <p>No workshops available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>