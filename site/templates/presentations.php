<?php snippet('header') ?>

<main class="listings-page">
  <div class="container">
    <article class="listings-content">

      <div class="listings-header">
        <h1>Presentations</h1>
      </div>

      <?php snippet('construction-alert') ?>

      <?php
      // Get all presentations
      $presentations = $site->index()->filterBy('intendedTemplate', 'presentation');

      // Group presentations by date
      $presentationsByDate = [];
      $presentationsWithoutDate = [];

      foreach ($presentations as $presentation) {
        if ($presentation->date()->isNotEmpty()) {
          try {
            $dateObj = new DateTime($presentation->date()->value());
            $dateKey = $dateObj->format('Y-m-d');
            $dateFormatted = $dateObj->format('l, F j, Y');

            if (!isset($presentationsByDate[$dateKey])) {
              $presentationsByDate[$dateKey] = [
                'formatted' => $dateFormatted,
                'presentations' => []
              ];
            }
            $presentationsByDate[$dateKey]['presentations'][] = $presentation;
          } catch (Exception $e) {
            $presentationsWithoutDate[] = $presentation;
          }
        } else {
          $presentationsWithoutDate[] = $presentation;
        }
      }

      // Sort dates chronologically
      ksort($presentationsByDate);

      // Timeblock order
      $timeblockOrder = [
        "9:00AM to 11:00AM",
        "11:15AM to 1:15PM",
        "2:15PM to 4:15PM",
        "4:30PM to 6:30PM"
      ];

      // Get the listing page URL for presentations
      $listingPage = $site->find('presentations');
      if (!$listingPage) {
        $listingPage = $site->index()->filter(function ($page) {
          return $page->intendedTemplate()->name() === 'presentations';
        })->first();
      }
      $listingUrl = $listingPage ? $listingPage->url() : $page->url();

      if (count($presentationsByDate) > 0 || count($presentationsWithoutDate) > 0):
      ?>
        <?php
        // Display presentations grouped by date
        foreach ($presentationsByDate as $dateKey => $dateData):
          // Group presentations by timeblock for this date
          $presentationsByTimeblock = [];
          $presentationsWithoutTimeblock = [];

          foreach ($dateData['presentations'] as $presentation) {
            $timeblock = $presentation->timeblock()->isNotEmpty() ? $presentation->timeblock()->value() : '';

            if ($timeblock && in_array($timeblock, $timeblockOrder)) {
              if (!isset($presentationsByTimeblock[$timeblock])) {
                $presentationsByTimeblock[$timeblock] = [];
              }
              $presentationsByTimeblock[$timeblock][] = $presentation;
            } else {
              $presentationsWithoutTimeblock[] = $presentation;
            }
          }
        ?>
          <div class="date-group">
            <h2>Presentations for <?= $dateData['formatted'] ?></h2>

            <?php
            // Display timeblocks in order
            foreach ($timeblockOrder as $timeblock) {
              if (isset($presentationsByTimeblock[$timeblock]) && count($presentationsByTimeblock[$timeblock]) > 0):
            ?>
                <div class="timeblock-group">
                  <h3 class="timeblock-header"><?= $timeblock ?></h3>
                  <div class="events-grid">
                    <?php foreach ($presentationsByTimeblock[$timeblock] as $presentation): ?>
                      <div class="event-card">
                        <div class="event-info">
                          <div class="event-type-container">
                            <div class="event-type">
                              <a href="<?= $listingUrl ?>"><?= $presentation->blueprint()->title() ?></a>
                            </div>
                            <?php if ($presentation->duration()->isNotEmpty()): ?>
                              <div class="event-duration"><?= $presentation->duration() ?></div>
                            <?php endif ?>
                          </div>
                          <h4 class="event-name">
                            <a href="<?= $presentation->url() ?>"><?= $presentation->title() ?></a>
                          </h4>
                          <?php if ($presentation->presenters()->isNotEmpty()): ?>
                            <div class="event-presenters">
                              <?php
                              $presenterList = $presentation->presenters()->toPages();
                              $presenterNames = [];
                              foreach ($presenterList as $presenter) {
                                $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                              }
                              echo implode(', ', $presenterNames);
                              ?>
                            </div>
                          <?php endif ?>
                          <div class="event-footer">
                            <?php if ($presentation->date()->isNotEmpty()): ?>
                              <?php
                              try {
                                $eventDate = new DateTime($presentation->date()->value());
                                $dateValue = $eventDate->format('Y-m-d');
                                $dateFormatted = $eventDate->format('l, F j, Y');

                                // Find or create schedule-date page URL
                                $scheduleDatePage = $site->find($dateValue);
                                $scheduleDateUrl = $scheduleDatePage ? $scheduleDatePage->url() : $site->url() . '/' . $dateValue;
                              ?>
                                <div class="event-date">
                                  <a href="<?= $scheduleDateUrl ?>"><?= $dateFormatted ?></a>
                                </div>
                              <?php
                              } catch (Exception $e) {
                                // Skip if date is invalid
                              }
                              ?>
                            <?php endif ?>
                            <?php if ($presentation->timeblock()->isNotEmpty()): ?>
                              <div class="event-timeblock">
                                <?= $presentation->timeblock() ?>
                              </div>
                            <?php endif ?>
                            <?php if ($presentation->location()->isNotEmpty()): ?>
                              <?php
                              $location = $presentation->location()->toPage();
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
                </div>
              <?php
              endif;
            }

            // Display presentations without timeblock for this date
            if (count($presentationsWithoutTimeblock) > 0):
              ?>
              <div class="timeblock-group">
                <h3 class="timeblock-header">Other Presentations</h3>
                <div class="events-grid">
                  <?php foreach ($presentationsWithoutTimeblock as $presentation): ?>
                    <div class="event-card">
                      <div class="event-info">
                        <div class="event-type-duration">
                          <div class="event-type">
                            <a href="<?= $listingUrl ?>"><?= $presentation->blueprint()->title() ?></a>
                          </div>
                          <?php if ($presentation->duration()->isNotEmpty()): ?>
                            <span class="event-duration"><?= $presentation->duration() ?></span>
                          <?php endif ?>
                        </div>
                        <h4 class="event-name">
                          <a href="<?= $presentation->url() ?>"><?= $presentation->title() ?></a>
                        </h4>
                        <?php if ($presentation->presenters()->isNotEmpty()): ?>
                          <div class="event-presenters">
                            <?php
                            $presenterList = $presentation->presenters()->toPages();
                            $presenterNames = [];
                            foreach ($presenterList as $presenter) {
                              $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                            }
                            echo implode(', ', $presenterNames);
                            ?>
                          </div>
                        <?php endif ?>
                        <div class="event-footer">
                          <?php if ($presentation->date()->isNotEmpty()): ?>
                            <?php
                            try {
                              $eventDate = new DateTime($presentation->date()->value());
                              $dateValue = $eventDate->format('Y-m-d');
                              $dateFormatted = $eventDate->format('l, F j, Y');

                              // Find or create schedule-date page URL
                              $scheduleDatePage = $site->find($dateValue);
                              $scheduleDateUrl = $scheduleDatePage ? $scheduleDatePage->url() : $site->url() . '/' . $dateValue;
                            ?>
                              <div class="event-date">
                                <a href="<?= $scheduleDateUrl ?>"><?= $dateFormatted ?></a>
                              </div>
                            <?php
                            } catch (Exception $e) {
                              // Skip if date is invalid
                            }
                            ?>
                          <?php endif ?>
                          <?php if ($presentation->location()->isNotEmpty()): ?>
                            <?php
                            $location = $presentation->location()->toPage();
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
              </div>
            <?php endif ?>
          </div>
        <?php endforeach ?>

        <?php
        // Display presentations without dates
        if (count($presentationsWithoutDate) > 0):
        ?>
          <div class="date-group">
            <h2>Presentations</h2>
            <div class="events-grid">
              <?php foreach ($presentationsWithoutDate as $presentation): ?>
                <div class="event-card">
                  <div class="event-info">
                    <div class="event-type-duration">
                      <div class="event-type">
                        <a href="<?= $listingUrl ?>"><?= $presentation->blueprint()->title() ?></a>
                      </div>
                      <?php if ($presentation->duration()->isNotEmpty()): ?>
                        <span class="event-duration"><?= $presentation->duration() ?></span>
                      <?php endif ?>
                    </div>
                    <h4 class="event-name">
                      <a href="<?= $presentation->url() ?>"><?= $presentation->title() ?></a>
                    </h4>
                    <?php if ($presentation->presenters()->isNotEmpty()): ?>
                      <div class="event-presenters">
                        <?php
                        $presenterList = $presentation->presenters()->toPages();
                        $presenterNames = [];
                        foreach ($presenterList as $presenter) {
                          $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                        }
                        echo implode(', ', $presenterNames);
                        ?>
                      </div>
                    <?php endif ?>
                    <div class="event-footer">
                      <?php if ($presentation->date()->isNotEmpty()): ?>
                        <?php
                        try {
                          $eventDate = new DateTime($presentation->date()->value());
                          $dateValue = $eventDate->format('Y-m-d');
                          $dateFormatted = $eventDate->format('l, F j, Y');

                          // Find or create schedule-date page URL
                          $scheduleDatePage = $site->find($dateValue);
                          $scheduleDateUrl = $scheduleDatePage ? $scheduleDatePage->url() : $site->url() . '/' . $dateValue;
                        ?>
                          <div class="event-date">
                            <a href="<?= $scheduleDateUrl ?>"><?= $dateFormatted ?></a>
                          </div>
                        <?php
                        } catch (Exception $e) {
                          // Skip if date is invalid
                        }
                        ?>
                      <?php endif ?>
                      <?php if ($presentation->timeblock()->isNotEmpty()): ?>
                        <div class="event-timeblock">
                          <?= $presentation->timeblock() ?>
                        </div>
                      <?php endif ?>
                      <?php if ($presentation->location()->isNotEmpty()): ?>
                        <?php
                        $location = $presentation->location()->toPage();
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
          </div>
        <?php endif ?>
      <?php else: ?>
        <p>No presentations available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>