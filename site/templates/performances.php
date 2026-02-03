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
      $listingPage = $site->find('performances');
      if (!$listingPage) {
        $listingPage = $site->index()->filter(function ($p) { return $p->intendedTemplate()->name() === 'performances'; })->first();
      }
      $listingUrl = $listingPage ? $listingPage->url() : $page->url();

      if ($performances->count() > 0):
      ?>
        <div class="events-grid">
          <?php foreach ($performances as $performance): ?>
            <div class="event-card">
              <div class="event-info">
                <div class="event-type-container">
                  <div class="event-type">
                    <a href="<?= $listingUrl ?>"><?= $performance->blueprint()->title() ?></a>
                  </div>
                  <?php if ($performance->type()->isNotEmpty()): ?>
                    <div class="event-work-type">
                      <?= $performance->type() ?>
                    </div>
                  <?php endif ?>
                  <?php if ($performance->duration()->isNotEmpty()): ?>
                    <div class="event-duration"><?= $performance->duration() ?></div>
                  <?php endif ?>
                </div>
                <h4 class="event-name">
                  <a href="<?= $performance->url() ?>"><?= $performance->title() ?></a>
                </h4>
                <?php if ($performance->presenters()->isNotEmpty()): ?>
                  <div class="event-presenters">
                    <?php
                    $presenterList = $performance->presenters()->toPages();
                    $presenterNames = [];
                    foreach ($presenterList as $presenter) {
                      $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                    }
                    echo implode(', ', $presenterNames);
                    ?>
                  </div>
                <?php endif ?>
                <div class="event-footer">
                  <?php if ($performance->date()->isNotEmpty()): ?>
                    <?php
                    try {
                      $eventDate = new DateTime($performance->date()->value());
                      $dateValue = $eventDate->format('Y-m-d');
                      $dateFormatted = $eventDate->format('l, F j, Y');
                      $scheduleDatePage = $site->find($dateValue);
                      $scheduleDateUrl = $scheduleDatePage ? $scheduleDatePage->url() : $site->url() . '/' . $dateValue;
                    ?>
                      <div class="event-date">
                        <a href="<?= $scheduleDateUrl ?>"><?= $dateFormatted ?></a>
                      </div>
                    <?php
                    } catch (Exception $e) { }
                    ?>
                  <?php endif ?>
                  <?php if ($performance->timeblock()->isNotEmpty()): ?>
                    <div class="event-timeblock">
                      <?= $performance->timeblock() ?>
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
                </div>
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