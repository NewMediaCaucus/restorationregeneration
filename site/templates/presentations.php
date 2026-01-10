<?php snippet('header') ?>

<main class="listings-page">
  <div class="container">
    <article class="listings-content">

      <div class="listings-header">
        <h1>Presentations</h1>
      </div>

      <?php
      // Get all presentations
      $presentations = $site->index()->filterBy('intendedTemplate', 'presentation');

      if ($presentations->count() > 0):
      ?>
        <div class="events-grid">
          <?php foreach ($presentations as $presentation): ?>
            <div class="event-card">
              <div class="event-info">
                <h3 class="event-name">
                  <a href="<?= $presentation->url() ?>"><?= $presentation->title() ?></a>
                </h3>
                <?php if ($presentation->theme()->isNotEmpty()): ?>
                  <div class="event-theme">
                    Theme: <?= $presentation->theme() ?>
                  </div>
                <?php endif ?>
                <?php if ($presentation->date()->isNotEmpty()): ?>
                  <?php
                  $dateObj = new DateTime($presentation->date());
                  $dateFormatted = $dateObj->format('l, F j, Y');
                  $dateSlug = $dateObj->format('Y-m-d');
                  
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
                <?php if ($presentation->timeblock()->isNotEmpty()): ?>
                  <div class="event-time">
                    <?= $presentation->timeblock() ?>
                  </div>
                <?php endif ?>
                <?php if ($presentation->duration()->isNotEmpty()): ?>
                  <div class="event-duration">
                    Duration: <?= $presentation->duration() ?>
                  </div>
                <?php endif ?>
                <?php if ($presentation->location()->isNotEmpty()): ?>
                  <?php
                  $location = $presentation->location()->toPage();
                  if ($location):
                  ?>
                    <div class="event-location">
                      Location: <a href="<?= $location->url() ?>"><?= $location->title() ?></a>
                    </div>
                  <?php endif ?>
                <?php endif ?>
                <?php if ($presentation->description()->isNotEmpty()): ?>
                  <div class="event-description-preview">
                    <?= $presentation->description()->excerpt(150) ?>
                  </div>
                <?php endif ?>
              </div>
            </div>
          <?php endforeach ?>
        </div>
      <?php else: ?>
        <p>No presentations available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>