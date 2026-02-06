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

      // Group performances by date
      $performancesByDate = [];
      $performancesWithoutDate = [];

      foreach ($performances as $performance) {
        if ($performance->date()->isNotEmpty()) {
          try {
            $dateObj = new DateTime($performance->date()->value());
            $dateKey = $dateObj->format('Y-m-d');
            $dateFormatted = $dateObj->format('l, F j, Y');

            if (!isset($performancesByDate[$dateKey])) {
              $performancesByDate[$dateKey] = [
                'formatted' => $dateFormatted,
                'performances' => []
              ];
            }
            $performancesByDate[$dateKey]['performances'][] = $performance;
          } catch (Exception $e) {
            $performancesWithoutDate[] = $performance;
          }
        } else {
          $performancesWithoutDate[] = $performance;
        }
      }

      // Sort dates chronologically
      ksort($performancesByDate);

      // Timeblock order (from performance blueprint)
      $timeblockOrder = [
        "8:30AM to 9:00AM",
        "8:00PM to 10:00PM"
      ];

      $listingPage = $site->find('performances');
      if (!$listingPage) {
        $listingPage = $site->index()->filter(function ($p) { return $p->intendedTemplate()->name() === 'performances'; })->first();
      }
      $listingUrl = $listingPage ? $listingPage->url() : $page->url();

      if (count($performancesByDate) > 0 || count($performancesWithoutDate) > 0):
      ?>
        <?php
        // Display performances grouped by date
        foreach ($performancesByDate as $dateKey => $dateData):
          // Group performances by timeblock for this date
          $performancesByTimeblock = [];
          $performancesWithoutTimeblock = [];

          foreach ($dateData['performances'] as $performance) {
            $timeblock = $performance->timeblock()->isNotEmpty() ? $performance->timeblock()->value() : '';

            if ($timeblock && in_array($timeblock, $timeblockOrder)) {
              if (!isset($performancesByTimeblock[$timeblock])) {
                $performancesByTimeblock[$timeblock] = [];
              }
              $performancesByTimeblock[$timeblock][] = $performance;
            } else {
              $performancesWithoutTimeblock[] = $performance;
            }
          }
        ?>
          <div class="date-group">
            <h2>Performances for <?= $dateData['formatted'] ?></h2>

            <?php
            // Display timeblocks in order
            foreach ($timeblockOrder as $timeblock) {
              if (isset($performancesByTimeblock[$timeblock]) && count($performancesByTimeblock[$timeblock]) > 0):
            ?>
              <div class="timeblock-group">
                <h3 class="timeblock-header"><?= $timeblock ?></h3>
                <div class="events-grid">
                  <?php foreach ($performancesByTimeblock[$timeblock] as $performance): ?>
                    <div class="event-card">
                      <?php
                      $imgField = $performance->content()->get('image');
                      $imgFile = $imgField->isNotEmpty() ? $imgField->toFile() : null;
                      if ($imgFile): ?>
                        <a href="<?= $performance->url() ?>" class="event-card-image">
                          <?= $imgFile->html(['alt' => $imgFile->alt()->or($performance->title())]) ?>
                        </a>
                      <?php endif ?>
                      <div class="event-info">
                        <div class="event-type-container">
                          <div class="event-type">
                            <a href="<?= $listingUrl ?>"><?= $performance->blueprint()->title() ?></a>
                          </div>
                          <?php if ($performance->type()->isNotEmpty()): ?>
                            <div class="event-work-type"><?= $performance->type() ?></div>
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
                            <?php } catch (Exception $e) { } ?>
                          <?php endif ?>
                          <?php if ($performance->timeblock()->isNotEmpty()): ?>
                            <div class="event-timeblock"><?= $performance->timeblock() ?></div>
                          <?php endif ?>
                          <?php if ($performance->location()->isNotEmpty()): ?>
                            <?php $location = $performance->location()->toPage(); if ($location): ?>
                              <div class="event-location">
                                <a href="<?= $location->url() ?>">
                                  <svg class="map-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                  </svg>
                                  <?= $location->title() ?>
                                </a>
                              </div>
                            <?php endif; ?>
                          <?php endif ?>
                        </div>
                      </div>
                    </div>
                  <?php endforeach ?>
                </div>
              </div>
            <?php
              endif;
            }

            // Display performances without timeblock for this date
            if (count($performancesWithoutTimeblock) > 0):
            ?>
              <div class="timeblock-group">
                <h3 class="timeblock-header">Other Performances</h3>
                <div class="events-grid">
                  <?php foreach ($performancesWithoutTimeblock as $performance): ?>
                    <div class="event-card">
                      <?php
                      $imgField = $performance->content()->get('image');
                      $imgFile = $imgField->isNotEmpty() ? $imgField->toFile() : null;
                      if ($imgFile): ?>
                        <a href="<?= $performance->url() ?>" class="event-card-image">
                          <?= $imgFile->html(['alt' => $imgFile->alt()->or($performance->title())]) ?>
                        </a>
                      <?php endif ?>
                      <div class="event-info">
                        <div class="event-type-container">
                          <div class="event-type">
                            <a href="<?= $listingUrl ?>"><?= $performance->blueprint()->title() ?></a>
                          </div>
                          <?php if ($performance->type()->isNotEmpty()): ?>
                            <div class="event-work-type"><?= $performance->type() ?></div>
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
                            <?php } catch (Exception $e) { } ?>
                          <?php endif ?>
                          <?php if ($performance->timeblock()->isNotEmpty()): ?>
                            <div class="event-timeblock"><?= $performance->timeblock() ?></div>
                          <?php endif ?>
                          <?php if ($performance->location()->isNotEmpty()): ?>
                            <?php $location = $performance->location()->toPage(); if ($location): ?>
                              <div class="event-location">
                                <a href="<?= $location->url() ?>">
                                  <svg class="map-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                                  </svg>
                                  <?= $location->title() ?>
                                </a>
                              </div>
                            <?php endif; ?>
                          <?php endif ?>
                        </div>
                      </div>
                    </div>
                  <?php endforeach ?>
                </div>
              </div>
            <?php endif ?>
          </div>
        <?php endforeach ?>

        <?php
        // Display performances without dates
        if (count($performancesWithoutDate) > 0):
        ?>
          <div class="date-group">
            <h2>Performances</h2>
            <div class="events-grid">
              <?php foreach ($performancesWithoutDate as $performance): ?>
                <div class="event-card">
                  <?php
                  $imgField = $performance->content()->get('image');
                  $imgFile = $imgField->isNotEmpty() ? $imgField->toFile() : null;
                  if ($imgFile): ?>
                    <a href="<?= $performance->url() ?>" class="event-card-image">
                      <?= $imgFile->html(['alt' => $imgFile->alt()->or($performance->title())]) ?>
                    </a>
                  <?php endif ?>
                  <div class="event-info">
                    <div class="event-type-container">
                      <div class="event-type">
                        <a href="<?= $listingUrl ?>"><?= $performance->blueprint()->title() ?></a>
                      </div>
                      <?php if ($performance->type()->isNotEmpty()): ?>
                        <div class="event-work-type"><?= $performance->type() ?></div>
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
                        <?php } catch (Exception $e) { } ?>
                      <?php endif ?>
                      <?php if ($performance->timeblock()->isNotEmpty()): ?>
                        <div class="event-timeblock"><?= $performance->timeblock() ?></div>
                      <?php endif ?>
                      <?php if ($performance->location()->isNotEmpty()): ?>
                        <?php $location = $performance->location()->toPage(); if ($location): ?>
                          <div class="event-location">
                            <a href="<?= $location->url() ?>">
                              <svg class="map-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                              </svg>
                              <?= $location->title() ?>
                            </a>
                          </div>
                        <?php endif; ?>
                      <?php endif ?>
                    </div>
                  </div>
                </div>
              <?php endforeach ?>
            </div>
          </div>
        <?php endif ?>
      <?php else: ?>
        <p>No performances available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>