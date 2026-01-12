<?php snippet('header') ?>

<main class="schedule-page">
  <div class="container">
    <article class="schedule-content">

      <div class="schedule-header">
        <h1>Symposium Schedule</h1>
      </div>

      <?php
      // Define the three days
      $dates = [
        '2026-03-06' => 'Friday, March 6, 2026',
        '2026-03-07' => 'Saturday, March 7, 2026',
        '2026-03-08' => 'Sunday, March 8, 2026'
      ];

      // Get all event types that can have dates
      $eventTemplates = ['presentation', 'workshop', 'expanded-media', 'performance', 'video'];
      $allEvents = [];

      foreach ($eventTemplates as $template) {
        $templateEvents = $site->index()->filterBy('intendedTemplate', $template);
        foreach ($templateEvents as $event) {
          $allEvents[] = $event;
        }
      }

      // Timeblock order
      $timeblockOrder = [
        "9:00AM to 11:00AM",
        "11:15AM to 1:15PM",
        "2:15PM to 4:15PM",
        "4:30PM to 6:30PM"
      ];

      // Event type order
      $eventTypeOrder = ['presentation', 'workshop', 'expanded-media', 'performance', 'video'];

      // Process each date
      foreach ($dates as $dateValue => $dateFormatted):
        // Filter events for this date
        $dayEvents = [];
        foreach ($allEvents as $event) {
          if ($event->date()->isNotEmpty()) {
            try {
              $eventDate = new DateTime($event->date()->value());
              if ($eventDate->format('Y-m-d') === $dateValue) {
                $dayEvents[] = $event;
              }
            } catch (Exception $e) {
              // Skip events with invalid dates
            }
          }
        }

        // Skip if no events for this date
        if (count($dayEvents) === 0) {
          continue;
        }

        // Group events by timeblock, then by event type
        $groupedEvents = [];
        $eventsWithoutTimeblock = [];

        foreach ($dayEvents as $event) {
          $timeblock = $event->timeblock()->isNotEmpty() ? $event->timeblock()->value() : '';
          $eventType = $event->intendedTemplate()->name();
          $eventTypeTitle = $event->blueprint()->title();

          if ($timeblock && in_array($timeblock, $timeblockOrder)) {
            if (!isset($groupedEvents[$timeblock])) {
              $groupedEvents[$timeblock] = [];
            }
            if (!isset($groupedEvents[$timeblock][$eventType])) {
              $groupedEvents[$timeblock][$eventType] = [
                'title' => $eventTypeTitle,
                'events' => []
              ];
            }
            $groupedEvents[$timeblock][$eventType]['events'][] = $event;
          } else {
            $eventsWithoutTimeblock[] = $event;
          }
        }
      ?>
        <div class="date-group">
          <h2 class="date-header"><?= $dateFormatted ?></h2>

          <?php
          // Display events grouped by timeblock
          foreach ($timeblockOrder as $timeblock) {
            if (isset($groupedEvents[$timeblock]) && count($groupedEvents[$timeblock]) > 0):
          ?>
              <div class="timeblock-group">
                <h3 class="timeblock-header"><?= $timeblock ?></h3>

                <?php
                // Sort event types within timeblock
                $sortedTypes = [];
                foreach ($eventTypeOrder as $type) {
                  if (isset($groupedEvents[$timeblock][$type])) {
                    $sortedTypes[$type] = $groupedEvents[$timeblock][$type];
                  }
                }
                // Add any other types not in the ordered list
                foreach ($groupedEvents[$timeblock] as $type => $data) {
                  if (!isset($sortedTypes[$type])) {
                    $sortedTypes[$type] = $data;
                  }
                }

                // Display events grouped by type
                foreach ($sortedTypes as $eventType => $typeData):
                ?>
                  <div class="event-type-group">
                    <h4 class="event-type-header"><?= $typeData['title'] ?>s</h4>
                    <div class="events-grid">
                      <?php foreach ($typeData['events'] as $event): ?>
                        <?php
                        // Map event template names to listing page slugs and templates
                        $templateToListing = [
                          'presentation' => ['slug' => 'presentations', 'template' => 'presentations'],
                          'workshop' => ['slug' => 'workshops', 'template' => 'workshops'],
                          'expanded-media' => ['slug' => 'expanded-medias', 'template' => 'expanded-medias'],
                          'performance' => ['slug' => 'performances', 'template' => 'performances'],
                          'video' => ['slug' => 'videos', 'template' => 'videos']
                        ];
                        $templateName = $event->intendedTemplate()->name();
                        $listingInfo = $templateToListing[$templateName] ?? null;

                        $listingPage = null;
                        $listingUrl = null;

                        if ($listingInfo) {
                          $listingPage = $site->find($listingInfo['slug']);
                          if (!$listingPage) {
                            $listingPage = $site->index()->filter(function ($page) use ($listingInfo) {
                              return $page->intendedTemplate()->name() === $listingInfo['template'];
                            })->first();
                          }
                          if (!$listingPage) {
                            $listingUrl = $site->url() . '/' . $listingInfo['slug'];
                          } else {
                            $listingUrl = $listingPage->url();
                          }
                        }
                        ?>
                        <div class="event-card">
                          <div class="event-info">
                            <div class="event-type-container">
                              <?php if ($listingUrl): ?>
                                <div class="event-type">
                                  <a href="<?= $listingUrl ?>"><?= $event->blueprint()->title() ?></a>
                                </div>
                              <?php else: ?>
                                <div class="event-type"><?= $event->blueprint()->title() ?></div>
                              <?php endif ?>
                              <?php if ($event->duration()->isNotEmpty()): ?>
                                <div class="event-duration"><?= $event->duration() ?></div>
                              <?php endif ?>
                            </div>
                            <h4 class="event-name">
                              <a href="<?= $event->url() ?>"><?= $event->title() ?></a>
                            </h4>
                            <?php if ($event->presenters()->isNotEmpty()): ?>
                              <div class="event-presenters">
                                <?php
                                $presenters = $event->presenters()->toPages();
                                $presenterNames = [];
                                foreach ($presenters as $presenter) {
                                  $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                                }
                                echo implode(', ', $presenterNames);
                                ?>
                              </div>
                            <?php endif ?>
                            <div class="event-footer">
                              <?php if ($event->date()->isNotEmpty()): ?>
                                <?php
                                try {
                                  $eventDate = new DateTime($event->date()->value());
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
                              <?php if ($event->timeblock()->isNotEmpty()): ?>
                                <div class="event-timeblock">
                                  <?= $event->timeblock() ?>
                                </div>
                              <?php endif ?>
                              <?php if ($event->location()->isNotEmpty()): ?>
                                <?php
                                $location = $event->location()->toPage();
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
                <?php endforeach ?>
              </div>
            <?php
            endif;
          }

          // Display events without timeblock
          if (count($eventsWithoutTimeblock) > 0):
            ?>
            <div class="timeblock-group">
              <h3 class="timeblock-header">Other Events</h3>
              <div class="events-grid">
                <?php foreach ($eventsWithoutTimeblock as $event): ?>
                  <?php
                  // Map event template names to listing page slugs and templates
                  $templateToListing = [
                    'presentation' => ['slug' => 'presentations', 'template' => 'presentations'],
                    'workshop' => ['slug' => 'workshops', 'template' => 'workshops'],
                    'expanded-media' => ['slug' => 'expanded-medias', 'template' => 'expanded-medias'],
                    'performance' => ['slug' => 'performances', 'template' => 'performances'],
                    'video' => ['slug' => 'videos', 'template' => 'videos']
                  ];
                  $templateName = $event->intendedTemplate()->name();
                  $listingInfo = $templateToListing[$templateName] ?? null;

                  $listingPage = null;
                  $listingUrl = null;

                  if ($listingInfo) {
                    $listingPage = $site->find($listingInfo['slug']);
                    if (!$listingPage) {
                      $listingPage = $site->index()->filter(function ($page) use ($listingInfo) {
                        return $page->intendedTemplate()->name() === $listingInfo['template'];
                      })->first();
                    }
                    if (!$listingPage) {
                      $listingUrl = $site->url() . '/' . $listingInfo['slug'];
                    } else {
                      $listingUrl = $listingPage->url();
                    }
                  }
                  ?>
                  <div class="event-card">
                    <div class="event-info">
                      <div class="event-type-container">
                        <?php if ($listingUrl): ?>
                          <div class="event-type">
                            <a href="<?= $listingUrl ?>"><?= $event->blueprint()->title() ?></a>
                          </div>
                        <?php else: ?>
                          <div class="event-type"><?= $event->blueprint()->title() ?></div>
                        <?php endif ?>
                        <?php if ($event->duration()->isNotEmpty()): ?>
                          <div class="event-duration"><?= $event->duration() ?></div>
                        <?php endif ?>
                      </div>
                      <h4 class="event-name">
                        <a href="<?= $event->url() ?>"><?= $event->title() ?></a>
                      </h4>
                      <?php if ($event->presenters()->isNotEmpty()): ?>
                        <div class="event-presenters">
                          <?php
                          $presenters = $event->presenters()->toPages();
                          $presenterNames = [];
                          foreach ($presenters as $presenter) {
                            $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                          }
                          echo implode(', ', $presenterNames);
                          ?>
                        </div>
                      <?php endif ?>
                      <div class="event-footer">
                        <?php if ($event->date()->isNotEmpty()): ?>
                          <?php
                          try {
                            $eventDate = new DateTime($event->date()->value());
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
                        <?php if ($event->timeblock()->isNotEmpty()): ?>
                          <div class="event-timeblock">
                            <?= $event->timeblock() ?>
                          </div>
                        <?php elseif ($event->start_time()->isNotEmpty() && $event->end_time()->isNotEmpty()): ?>
                          <div class="event-time">
                            <?php
                            $start = new DateTime($event->start_time());
                            $end = new DateTime($event->end_time());
                            echo $start->format('g:i A') . ' - ' . $end->format('g:i A') . ' MST';
                            ?>
                          </div>
                        <?php endif ?>
                        <?php if ($event->location()->isNotEmpty()): ?>
                          <?php
                          $location = $event->location()->toPage();
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

    </article>
  </div>
</main>

<?php snippet('footer') ?>