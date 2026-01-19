<?php snippet('header') ?>

<main class="listings-page">
  <div class="container">
    <article class="listings-content">

      <div class="listings-header">
        <h1>Expanded Media</h1>
      </div>

      <?php snippet('construction-alert') ?>

      <?php
      // Get all expanded media
      $expandedMedia = $site->index()->filterBy('intendedTemplate', 'expanded-media');

      // Group expanded media by date
      $expandedMediaByDate = [];
      $expandedMediaWithoutDate = [];

      foreach ($expandedMedia as $item) {
        if ($item->date()->isNotEmpty()) {
          try {
            $dateObj = new DateTime($item->date()->value());
            $dateKey = $dateObj->format('Y-m-d');
            $dateFormatted = $dateObj->format('l, F j, Y');

            if (!isset($expandedMediaByDate[$dateKey])) {
              $expandedMediaByDate[$dateKey] = [
                'formatted' => $dateFormatted,
                'items' => []
              ];
            }
            $expandedMediaByDate[$dateKey]['items'][] = $item;
          } catch (Exception $e) {
            $expandedMediaWithoutDate[] = $item;
          }
        } else {
          $expandedMediaWithoutDate[] = $item;
        }
      }

      // Sort dates chronologically
      ksort($expandedMediaByDate);

      // Timeblock order
      $timeblockOrder = [
        "9:00AM to 11:00AM",
        "11:15AM to 1:15PM",
        "2:15PM to 4:15PM",
        "4:30PM to 6:30PM"
      ];

      // Get the listing page URL for expanded media
      $listingPage = $site->find('expanded-medias');
      if (!$listingPage) {
        $listingPage = $site->index()->filter(function ($page) {
          return $page->intendedTemplate()->name() === 'expanded-medias';
        })->first();
      }
      $listingUrl = $listingPage ? $listingPage->url() : $page->url();

      if (count($expandedMediaByDate) > 0 || count($expandedMediaWithoutDate) > 0):
      ?>
        <?php
        // Display expanded media grouped by date
        foreach ($expandedMediaByDate as $dateKey => $dateData):
          // Group expanded media by timeblock for this date
          $expandedMediaByTimeblock = [];
          $expandedMediaWithoutTimeblock = [];

          foreach ($dateData['items'] as $item) {
            $timeblock = $item->timeblock()->isNotEmpty() ? $item->timeblock()->value() : '';

            if ($timeblock && in_array($timeblock, $timeblockOrder)) {
              if (!isset($expandedMediaByTimeblock[$timeblock])) {
                $expandedMediaByTimeblock[$timeblock] = [];
              }
              $expandedMediaByTimeblock[$timeblock][] = $item;
            } else {
              $expandedMediaWithoutTimeblock[] = $item;
            }
          }
        ?>
          <div class="date-group">
            <?php
            // Display timeblocks in order
            foreach ($timeblockOrder as $timeblock) {
              if (isset($expandedMediaByTimeblock[$timeblock]) && count($expandedMediaByTimeblock[$timeblock]) > 0):
            ?>
                <div class="timeblock-group">
                  <h3 class="timeblock-header"><?= $timeblock ?></h3>
                  <div class="events-grid">
                    <?php foreach ($expandedMediaByTimeblock[$timeblock] as $item): ?>
                      <div class="event-card">
                        <div class="event-info">
                          <div class="event-type-container">
                            <div class="event-type">
                              <a href="<?= $listingUrl ?>"><?= $item->blueprint()->title() ?></a>
                            </div>
                            <?php if ($item->type()->isNotEmpty()): ?>
                              <div class="event-work-type">
                                <?= $item->type() ?>
                              </div>
                            <?php endif ?>
                            <?php if ($item->duration()->isNotEmpty()): ?>
                              <div class="event-duration"><?= $item->duration() ?></div>
                            <?php endif ?>
                          </div>
                          <h4 class="event-name">
                            <a href="<?= $item->url() ?>"><?= $item->title() ?></a>
                          </h4>
                          <?php if ($item->presenters()->isNotEmpty()): ?>
                            <div class="event-presenters">
                              <?php
                              $presenterList = $item->presenters()->toPages();
                              $presenterNames = [];
                              foreach ($presenterList as $presenter) {
                                $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                              }
                              echo implode(', ', $presenterNames);
                              ?>
                            </div>
                          <?php endif ?>
                          <div class="event-footer">
                            <?php if ($item->date()->isNotEmpty()): ?>
                              <?php
                              try {
                                $eventDate = new DateTime($item->date()->value());
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
                            <?php if ($item->timeblock()->isNotEmpty()): ?>
                              <div class="event-timeblock">
                                <?= $item->timeblock() ?>
                              </div>
                            <?php endif ?>
                            <?php if ($item->location()->isNotEmpty()): ?>
                              <?php
                              $location = $item->location()->toPage();
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

            // Display expanded media without timeblock for this date
            if (count($expandedMediaWithoutTimeblock) > 0):
              ?>
              <div class="timeblock-group">
                <h3 class="timeblock-header">Other Expanded Media</h3>
                <div class="events-grid">
                  <?php foreach ($expandedMediaWithoutTimeblock as $item): ?>
                    <div class="event-card">
                      <div class="event-info">
                        <div class="event-type-duration">
                          <div class="event-type-container">
                            <div class="event-type">
                              <a href="<?= $listingUrl ?>"><?= $item->blueprint()->title() ?></a>
                            </div>
                            <?php if ($item->type()->isNotEmpty()): ?>
                              <div class="event-work-type">
                                <?= $item->type() ?>
                              </div>
                            <?php endif ?>
                          </div>
                          <?php if ($item->duration()->isNotEmpty()): ?>
                            <span class="event-duration"><?= $item->duration() ?></span>
                          <?php endif ?>
                        </div>
                        <h4 class="event-name">
                          <a href="<?= $item->url() ?>"><?= $item->title() ?></a>
                        </h4>
                        <?php if ($item->presenters()->isNotEmpty()): ?>
                          <div class="event-presenters">
                            <?php
                            $presenterList = $item->presenters()->toPages();
                            $presenterNames = [];
                            foreach ($presenterList as $presenter) {
                              $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                            }
                            echo implode(', ', $presenterNames);
                            ?>
                          </div>
                        <?php endif ?>
                        <div class="event-footer">
                          <?php if ($item->date()->isNotEmpty()): ?>
                            <?php
                            try {
                              $eventDate = new DateTime($item->date()->value());
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
                          <?php if ($item->location()->isNotEmpty()): ?>
                            <?php
                            $location = $item->location()->toPage();
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
        // Display expanded media without dates
        if (count($expandedMediaWithoutDate) > 0):
        ?>
          <div class="date-group">
            <div class="events-grid">
              <?php foreach ($expandedMediaWithoutDate as $item): ?>
                <div class="event-card">
                  <div class="event-info">
                    <div class="event-type-duration">
                      <div class="event-type-container">
                        <div class="event-type">
                          <a href="<?= $listingUrl ?>"><?= $item->blueprint()->title() ?></a>
                        </div>
                        <?php if ($item->type()->isNotEmpty()): ?>
                          <div class="event-work-type">
                            <?= $item->type() ?>
                          </div>
                        <?php endif ?>
                      </div>
                      <?php if ($item->duration()->isNotEmpty()): ?>
                        <span class="event-duration"><?= $item->duration() ?></span>
                      <?php endif ?>
                    </div>
                    <h4 class="event-name">
                      <a href="<?= $item->url() ?>"><?= $item->title() ?></a>
                    </h4>
                    <?php if ($item->presenters()->isNotEmpty()): ?>
                      <div class="event-presenters">
                        <?php
                        $presenterList = $item->presenters()->toPages();
                        $presenterNames = [];
                        foreach ($presenterList as $presenter) {
                          $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                        }
                        echo implode(', ', $presenterNames);
                        ?>
                      </div>
                    <?php endif ?>
                    <div class="event-footer">
                      <?php if ($item->date()->isNotEmpty()): ?>
                        <?php
                        try {
                          $eventDate = new DateTime($item->date()->value());
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
                      <?php if ($item->timeblock()->isNotEmpty()): ?>
                        <div class="event-timeblock">
                          <?= $item->timeblock() ?>
                        </div>
                      <?php endif ?>
                      <?php if ($item->location()->isNotEmpty()): ?>
                        <?php
                        $location = $item->location()->toPage();
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
        <p>No expanded media available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>