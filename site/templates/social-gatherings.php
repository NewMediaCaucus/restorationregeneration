<?php snippet('header') ?>

<main class="listings-page">
  <div class="container">
    <article class="listings-content">

      <div class="listings-header">
        <h1>Social Gatherings</h1>
      </div>

      <?php snippet('construction-alert') ?>

      <?php
      // Get all social gatherings
      $socialGatherings = $site->index()->filterBy('intendedTemplate', 'social-gathering');

      // Group social gatherings by date
      $gatheringsByDate = [];
      $gatheringsWithoutDate = [];

      foreach ($socialGatherings as $gathering) {
        if ($gathering->date()->isNotEmpty()) {
          try {
            $dateObj = new DateTime($gathering->date()->value());
            $dateKey = $dateObj->format('Y-m-d');
            $dateFormatted = $dateObj->format('l, F j, Y');

            if (!isset($gatheringsByDate[$dateKey])) {
              $gatheringsByDate[$dateKey] = [
                'formatted' => $dateFormatted,
                'gatherings' => []
              ];
            }
            $gatheringsByDate[$dateKey]['gatherings'][] = $gathering;
          } catch (Exception $e) {
            $gatheringsWithoutDate[] = $gathering;
          }
        } else {
          $gatheringsWithoutDate[] = $gathering;
        }
      }

      // Sort dates chronologically
      ksort($gatheringsByDate);

      // Timeblock order (from social-gathering blueprint)
      $timeblockOrder = [
        "8:30AM to 9:00AM",
        "5:00PM to 7:00PM",
        "6:00PM to 7:00PM",
        "7:00PM to 8:00PM",
        "8:30PM to 10:00PM",
        "10:00PM to 12:00AM"
      ];

      $listingPage = $site->find('social-gatherings');
      if (!$listingPage) {
        $listingPage = $site->index()->filter(function ($p) { return $p->intendedTemplate()->name() === 'social-gatherings'; })->first();
      }
      $listingUrl = $listingPage ? $listingPage->url() : $page->url();

      if (count($gatheringsByDate) > 0 || count($gatheringsWithoutDate) > 0):
      ?>
        <?php
        // Display social gatherings grouped by date
        foreach ($gatheringsByDate as $dateKey => $dateData):
          // Group gatherings by timeblock for this date
          $gatheringsByTimeblock = [];
          $gatheringsWithoutTimeblock = [];

          foreach ($dateData['gatherings'] as $gathering) {
            $timeblock = $gathering->timeblock()->isNotEmpty() ? $gathering->timeblock()->value() : '';

            if ($timeblock && in_array($timeblock, $timeblockOrder)) {
              if (!isset($gatheringsByTimeblock[$timeblock])) {
                $gatheringsByTimeblock[$timeblock] = [];
              }
              $gatheringsByTimeblock[$timeblock][] = $gathering;
            } else {
              $gatheringsWithoutTimeblock[] = $gathering;
            }
          }
        ?>
          <div class="date-group">
            <h2>Social Gatherings for <?= $dateData['formatted'] ?></h2>

            <?php
            // Display timeblocks in order
            foreach ($timeblockOrder as $timeblock) {
              if (isset($gatheringsByTimeblock[$timeblock]) && count($gatheringsByTimeblock[$timeblock]) > 0):
            ?>
              <div class="timeblock-group">
                <h3 class="timeblock-header"><?= $timeblock ?></h3>
                <div class="events-grid">
                  <?php foreach ($gatheringsByTimeblock[$timeblock] as $gathering): ?>
                    <div class="event-card">
                      <?php
                      $imgField = $gathering->content()->get('image');
                      $imgFile = $imgField->isNotEmpty() ? $imgField->toFile() : null;
                      if ($imgFile): ?>
                        <a href="<?= $gathering->url() ?>" class="event-card-image">
                          <?= $imgFile->html(['alt' => $imgFile->alt()->or($gathering->title())]) ?>
                        </a>
                      <?php endif ?>
                      <div class="event-info">
                        <div class="event-type-container">
                          <div class="event-type">
                            <a href="<?= $listingUrl ?>"><?= $gathering->blueprint()->title() ?></a>
                          </div>
                          <?php if ($gathering->type()->isNotEmpty()): ?>
                            <div class="event-work-type"><?= $gathering->type() ?></div>
                          <?php endif ?>
                          <?php if ($gathering->duration()->isNotEmpty()): ?>
                            <div class="event-duration"><?= $gathering->duration() ?></div>
                          <?php endif ?>
                        </div>
                        <h4 class="event-name">
                          <a href="<?= $gathering->url() ?>"><?= $gathering->title() ?></a>
                        </h4>
                        <?php if ($gathering->presenters()->isNotEmpty()): ?>
                          <div class="event-presenters">
                            <?php
                            $presenterList = $gathering->presenters()->toPages();
                            $presenterNames = [];
                            foreach ($presenterList as $presenter) {
                              $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                            }
                            echo implode(', ', $presenterNames);
                            ?>
                          </div>
                        <?php endif ?>
                        <div class="event-footer">
                          <?php if ($gathering->date()->isNotEmpty()): ?>
                            <?php
                            try {
                              $eventDate = new DateTime($gathering->date()->value());
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
                          <?php if ($gathering->timeblock()->isNotEmpty()): ?>
                            <div class="event-timeblock"><?= $gathering->timeblock() ?></div>
                          <?php endif ?>
                          <?php if ($gathering->location()->isNotEmpty()): ?>
                            <?php $location = $gathering->location()->toPage(); if ($location): ?>
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

            // Display gatherings without timeblock for this date
            if (count($gatheringsWithoutTimeblock) > 0):
            ?>
              <div class="timeblock-group">
                <h3 class="timeblock-header">Other Social Gatherings</h3>
                <div class="events-grid">
                  <?php foreach ($gatheringsWithoutTimeblock as $gathering): ?>
                    <div class="event-card">
                      <?php
                      $imgField = $gathering->content()->get('image');
                      $imgFile = $imgField->isNotEmpty() ? $imgField->toFile() : null;
                      if ($imgFile): ?>
                        <a href="<?= $gathering->url() ?>" class="event-card-image">
                          <?= $imgFile->html(['alt' => $imgFile->alt()->or($gathering->title())]) ?>
                        </a>
                      <?php endif ?>
                      <div class="event-info">
                        <div class="event-type-container">
                          <div class="event-type">
                            <a href="<?= $listingUrl ?>"><?= $gathering->blueprint()->title() ?></a>
                          </div>
                          <?php if ($gathering->type()->isNotEmpty()): ?>
                            <div class="event-work-type"><?= $gathering->type() ?></div>
                          <?php endif ?>
                          <?php if ($gathering->duration()->isNotEmpty()): ?>
                            <div class="event-duration"><?= $gathering->duration() ?></div>
                          <?php endif ?>
                        </div>
                        <h4 class="event-name">
                          <a href="<?= $gathering->url() ?>"><?= $gathering->title() ?></a>
                        </h4>
                        <?php if ($gathering->presenters()->isNotEmpty()): ?>
                          <div class="event-presenters">
                            <?php
                            $presenterList = $gathering->presenters()->toPages();
                            $presenterNames = [];
                            foreach ($presenterList as $presenter) {
                              $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                            }
                            echo implode(', ', $presenterNames);
                            ?>
                          </div>
                        <?php endif ?>
                        <div class="event-footer">
                          <?php if ($gathering->date()->isNotEmpty()): ?>
                            <?php
                            try {
                              $eventDate = new DateTime($gathering->date()->value());
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
                          <?php if ($gathering->timeblock()->isNotEmpty()): ?>
                            <div class="event-timeblock"><?= $gathering->timeblock() ?></div>
                          <?php endif ?>
                          <?php if ($gathering->location()->isNotEmpty()): ?>
                            <?php $location = $gathering->location()->toPage(); if ($location): ?>
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
        // Display social gatherings without dates
        if (count($gatheringsWithoutDate) > 0):
        ?>
          <div class="date-group">
            <h2>Social Gatherings</h2>
            <div class="events-grid">
              <?php foreach ($gatheringsWithoutDate as $gathering): ?>
                <div class="event-card">
                  <?php
                  $imgField = $gathering->content()->get('image');
                  $imgFile = $imgField->isNotEmpty() ? $imgField->toFile() : null;
                  if ($imgFile): ?>
                    <a href="<?= $gathering->url() ?>" class="event-card-image">
                      <?= $imgFile->html(['alt' => $imgFile->alt()->or($gathering->title())]) ?>
                    </a>
                  <?php endif ?>
                  <div class="event-info">
                    <div class="event-type-container">
                      <div class="event-type">
                        <a href="<?= $listingUrl ?>"><?= $gathering->blueprint()->title() ?></a>
                      </div>
                      <?php if ($gathering->type()->isNotEmpty()): ?>
                        <div class="event-work-type"><?= $gathering->type() ?></div>
                      <?php endif ?>
                      <?php if ($gathering->duration()->isNotEmpty()): ?>
                        <div class="event-duration"><?= $gathering->duration() ?></div>
                      <?php endif ?>
                    </div>
                    <h4 class="event-name">
                      <a href="<?= $gathering->url() ?>"><?= $gathering->title() ?></a>
                    </h4>
                    <?php if ($gathering->presenters()->isNotEmpty()): ?>
                      <div class="event-presenters">
                        <?php
                        $presenterList = $gathering->presenters()->toPages();
                        $presenterNames = [];
                        foreach ($presenterList as $presenter) {
                          $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                        }
                        echo implode(', ', $presenterNames);
                        ?>
                      </div>
                    <?php endif ?>
                    <div class="event-footer">
                      <?php if ($gathering->date()->isNotEmpty()): ?>
                        <?php
                        try {
                          $eventDate = new DateTime($gathering->date()->value());
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
                      <?php if ($gathering->timeblock()->isNotEmpty()): ?>
                        <div class="event-timeblock"><?= $gathering->timeblock() ?></div>
                      <?php endif ?>
                      <?php if ($gathering->location()->isNotEmpty()): ?>
                        <?php $location = $gathering->location()->toPage(); if ($location): ?>
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
        <p>No social gatherings available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>
