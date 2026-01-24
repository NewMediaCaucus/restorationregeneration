<?php snippet('header') ?>

<main class="location-page">
  <div class="container">
    <article class="location-profile">

      <!-- Location Header -->
      <div class="location-header">
        <h1 class="location-title"><?= $page->title() ?></h1>

        <div class="location-meta">
          <?php if ($page->floor()->isNotEmpty()): ?>
            <div class="location-floor">
              <strong>Floor:</strong>
              <?php
              $floorValue = $page->floor()->toString();
              $floorOptions = [
                '1st-floor' => '1st Floor',
                '2nd-floor' => '2nd Floor',
                '3rd-floor' => '3rd Floor'
              ];
              echo isset($floorOptions[$floorValue]) ? $floorOptions[$floorValue] : $floorValue;
              ?>
            </div>
          <?php endif ?>

          <?php if ($page->capacity()->isNotEmpty()): ?>
            <div class="location-capacity">
              <strong>Capacity:</strong> <?= $page->capacity() ?> people
            </div>
          <?php endif ?>
        </div>
      </div>

      <!-- Location Photo -->
      <?php if ($page->photo()->isNotEmpty()): ?>
        <div class="location-photo">
          <?= $page->photo()->toFile() ?>
        </div>
      <?php endif ?>

      <!-- Location Description -->
      <?php if ($page->description()->isNotEmpty()): ?>
        <div class="location-description">
          <h2>About This Location</h2>
          <div class="description-content">
            <?= $page->description()->kt() ?>
          </div>
          <!-- Location Website -->
          <?php if ($page->location_url() !== ''): ?>
            <div class="location-url">
              <a href="<?= $page->location_url() ?>" target="_blank" class="location-website-link">
                <?= $page->location_url() ?>
                <svg class="external-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          <?php endif ?>
        </div>
      <?php endif ?>


      <!-- Location Address -->
      <?php if ($page->address()->isNotEmpty()): ?>
        <div class="location-address">
          <h2>Address</h2>
          <div class="address-content">
            <?php if ($page->map_link() !== ''): ?>
              <a href="<?= $page->map_link() ?>" target="_blank" class="address-map-link">
                <svg class="map-pin-icon" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <?= $page->address()->kt() ?>
              </a>
            <?php else: ?>
              <div class="address-with-pin">
                <svg class="map-pin-icon" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <?= $page->address()->kt() ?>
              </div>
            <?php endif ?>
          </div>
        </div>
      <?php endif ?>


      <!-- Location Accessibility -->
      <?php if ($page->accessibility()->isNotEmpty()): ?>
        <div class="location-accessibility">
          <h2>Accessibility</h2>
          <div class="accessibility-content">
            <?= $page->accessibility()->kt() ?>
          </div>
        </div>
      <?php endif ?>

      <!-- Events at this Location -->
      <?php
      // Get all event types
      $eventTemplates = ['presentation', 'workshop', 'expanded-media', 'performance', 'video'];
      $allEvents = [];

      foreach ($eventTemplates as $template) {
        $templateEvents = $site->index()->filterBy('intendedTemplate', $template);
        foreach ($templateEvents as $event) {
          $allEvents[] = $event;
        }
      }

      // Filter events that are at this location (videos can have multiple locations)
      $locationEvents = [];
      foreach ($allEvents as $event) {
        if ($event->location()->isNotEmpty()) {
          $eventLocations = $event->location()->toPages();
          foreach ($eventLocations as $loc) {
            if ($loc->id() === $page->id()) {
              $locationEvents[] = $event;
              break;
            }
          }
        }
      }

      // Sort events by date (Friday, Saturday, Sunday)
      $dateOrder = ['2026-03-06', '2026-03-07', '2026-03-08'];
      $sortedEvents = [];
      $eventsWithoutDate = [];

      foreach ($locationEvents as $event) {
        if ($event->date()->isNotEmpty()) {
          try {
            $eventDate = new DateTime($event->date()->value());
            $dateValue = $eventDate->format('Y-m-d');
            if (in_array($dateValue, $dateOrder)) {
              $sortedEvents[] = $event;
            } else {
              $eventsWithoutDate[] = $event;
            }
          } catch (Exception $e) {
            $eventsWithoutDate[] = $event;
          }
        } else {
          $eventsWithoutDate[] = $event;
        }
      }

      // Sort by date order
      usort($sortedEvents, function ($a, $b) use ($dateOrder) {
        try {
          $dateA = new DateTime($a->date()->value());
          $dateB = new DateTime($b->date()->value());
          $dateValueA = $dateA->format('Y-m-d');
          $dateValueB = $dateB->format('Y-m-d');
          $indexA = array_search($dateValueA, $dateOrder);
          $indexB = array_search($dateValueB, $dateOrder);
          if ($indexA === false) $indexA = 999;
          if ($indexB === false) $indexB = 999;
          return $indexA - $indexB;
        } catch (Exception $e) {
          return 0;
        }
      });

      // Combine sorted and unsorted events
      $finalEvents = array_merge($sortedEvents, $eventsWithoutDate);

      if (count($finalEvents) > 0):
      ?>
        <div class="location-events">
          <h2>Events at This Location</h2>
          <div class="events-grid">
            <?php foreach ($finalEvents as $event): ?>
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
                    <?php if ($templateName === 'expanded-media' && $event->type()->isNotEmpty()): ?>
                      <div class="event-work-type">
                        <?= $event->type() ?>
                      </div>
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
                      <?php foreach ($event->location()->toPages() as $loc): ?>
                        <div class="event-location">
                          <a href="<?= $loc->url() ?>">
                            <svg class="map-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <?= $loc->title() ?>
                          </a>
                        </div>
                      <?php endforeach ?>
                    <?php endif ?>
                  </div>
                </div>
              </div>
            <?php endforeach ?>
          </div>
        </div>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>