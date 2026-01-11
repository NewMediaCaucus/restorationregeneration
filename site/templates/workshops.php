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

      // Group workshops by date
      $workshopsByDate = [];
      $workshopsWithoutDate = [];

      foreach ($workshops as $workshop) {
        if ($workshop->date()->isNotEmpty()) {
          try {
            $dateObj = new DateTime($workshop->date()->value());
            $dateKey = $dateObj->format('Y-m-d');
            $dateFormatted = $dateObj->format('l, F j, Y');

            if (!isset($workshopsByDate[$dateKey])) {
              $workshopsByDate[$dateKey] = [
                'formatted' => $dateFormatted,
                'workshops' => []
              ];
            }
            $workshopsByDate[$dateKey]['workshops'][] = $workshop;
          } catch (Exception $e) {
            $workshopsWithoutDate[] = $workshop;
          }
        } else {
          $workshopsWithoutDate[] = $workshop;
        }
      }

      // Sort dates chronologically
      ksort($workshopsByDate);

      // Timeblock order
      $timeblockOrder = [
        "9:00AM to 11:00AM",
        "11:15AM to 1:15PM",
        "2:15PM to 4:15PM",
        "4:30PM to 6:30PM"
      ];

      // Get the listing page URL for workshops
      $listingPage = $site->find('workshops');
      if (!$listingPage) {
        $listingPage = $site->index()->filter(function ($page) {
          return $page->intendedTemplate()->name() === 'workshops';
        })->first();
      }
      $listingUrl = $listingPage ? $listingPage->url() : $page->url();

      if (count($workshopsByDate) > 0 || count($workshopsWithoutDate) > 0):
      ?>
        <?php
        // Display workshops grouped by date
        foreach ($workshopsByDate as $dateKey => $dateData):
          // Group workshops by timeblock for this date
          $workshopsByTimeblock = [];
          $workshopsWithoutTimeblock = [];

          foreach ($dateData['workshops'] as $workshop) {
            $timeblock = $workshop->timeblock()->isNotEmpty() ? $workshop->timeblock()->value() : '';

            if ($timeblock && in_array($timeblock, $timeblockOrder)) {
              if (!isset($workshopsByTimeblock[$timeblock])) {
                $workshopsByTimeblock[$timeblock] = [];
              }
              $workshopsByTimeblock[$timeblock][] = $workshop;
            } else {
              $workshopsWithoutTimeblock[] = $workshop;
            }
          }
        ?>
          <div class="date-group">
            <h2>Workshops for <?= $dateData['formatted'] ?></h2>

            <?php
            // Display timeblocks in order
            foreach ($timeblockOrder as $timeblock) {
              if (isset($workshopsByTimeblock[$timeblock]) && count($workshopsByTimeblock[$timeblock]) > 0):
            ?>
                <div class="timeblock-group">
                  <h3 class="timeblock-header"><?= $timeblock ?></h3>
                  <div class="events-grid">
                    <?php foreach ($workshopsByTimeblock[$timeblock] as $workshop): ?>
                      <div class="event-card">
                        <div class="event-info">
                          <div class="event-type-container">
                            <div class="event-type">
                              <a href="<?= $listingUrl ?>"><?= $workshop->blueprint()->title() ?></a>
                            </div>
                            <?php if ($workshop->duration()->isNotEmpty()): ?>
                              <div class="event-duration"><?= $workshop->duration() ?></div>
                            <?php endif ?>
                          </div>
                          <h4 class="event-name">
                            <a href="<?= $workshop->url() ?>"><?= $workshop->title() ?></a>
                          </h4>
                          <?php if ($workshop->presenters()->isNotEmpty()): ?>
                            <div class="event-presenters">
                              <?php
                              $presenterList = $workshop->presenters()->toPages();
                              $presenterNames = [];
                              foreach ($presenterList as $presenter) {
                                $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                              }
                              echo implode(', ', $presenterNames);
                              ?>
                            </div>
                          <?php endif ?>
                          <div class="event-footer">
                            <?php if ($workshop->timeblock()->isNotEmpty()): ?>
                              <div class="event-timeblock">
                                <?= $workshop->timeblock() ?>
                              </div>
                            <?php endif ?>
                            <?php if ($workshop->location()->isNotEmpty()): ?>
                              <?php
                              $location = $workshop->location()->toPage();
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

            // Display workshops without timeblock for this date
            if (count($workshopsWithoutTimeblock) > 0):
              ?>
              <div class="timeblock-group">
                <h3 class="timeblock-header">Other Workshops</h3>
                <div class="events-grid">
                  <?php foreach ($workshopsWithoutTimeblock as $workshop): ?>
                    <div class="event-card">
                      <div class="event-info">
                        <div class="event-type-container">
                          <div class="event-type">
                            <a href="<?= $listingUrl ?>"><?= $workshop->blueprint()->title() ?></a>
                          </div>
                          <?php if ($workshop->duration()->isNotEmpty()): ?>
                            <div class="event-duration"><?= $workshop->duration() ?></div>
                          <?php endif ?>
                        </div>
                        <h4 class="event-name">
                          <a href="<?= $workshop->url() ?>"><?= $workshop->title() ?></a>
                        </h4>
                        <?php if ($workshop->presenters()->isNotEmpty()): ?>
                          <div class="event-presenters">
                            <?php
                            $presenterList = $workshop->presenters()->toPages();
                            $presenterNames = [];
                            foreach ($presenterList as $presenter) {
                              $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                            }
                            echo implode(', ', $presenterNames);
                            ?>
                          </div>
                        <?php endif ?>
                        <div class="event-footer">
                          <?php if ($workshop->location()->isNotEmpty()): ?>
                            <?php
                            $location = $workshop->location()->toPage();
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
        // Display workshops without dates
        if (count($workshopsWithoutDate) > 0):
        ?>
          <div class="date-group">
            <h2>Workshops</h2>
            <div class="events-grid">
              <?php foreach ($workshopsWithoutDate as $workshop): ?>
                <div class="event-card">
                  <div class="event-info">
                    <div class="event-type-duration">
                      <div class="event-type">
                        <a href="<?= $listingUrl ?>"><?= $workshop->blueprint()->title() ?></a>
                      </div>
                      <?php if ($workshop->duration()->isNotEmpty()): ?>
                        <span class="event-duration"><?= $workshop->duration() ?></span>
                      <?php endif ?>
                    </div>
                    <h4 class="event-name">
                      <a href="<?= $workshop->url() ?>"><?= $workshop->title() ?></a>
                    </h4>
                    <?php if ($workshop->presenters()->isNotEmpty()): ?>
                      <div class="event-presenters">
                        <?php
                        $presenterList = $workshop->presenters()->toPages();
                        $presenterNames = [];
                        foreach ($presenterList as $presenter) {
                          $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                        }
                        echo implode(', ', $presenterNames);
                        ?>
                      </div>
                    <?php endif ?>
                    <div class="event-footer">
                      <?php if ($workshop->timeblock()->isNotEmpty()): ?>
                        <div class="event-timeblock">
                          <?= $workshop->timeblock() ?>
                        </div>
                      <?php endif ?>
                      <?php if ($workshop->location()->isNotEmpty()): ?>
                        <?php
                        $location = $workshop->location()->toPage();
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
        <p>No workshops available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>