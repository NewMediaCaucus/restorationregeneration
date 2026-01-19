<?php snippet('header') ?>

<main class="listings-page">
  <div class="container">
    <article class="listings-content">

      <div class="listings-header">
        <h1>Single-Channel Videos</h1>
      </div>

      <?php snippet('construction-alert') ?>

      <?php
      // Get all videos
      $videos = $site->index()->filterBy('intendedTemplate', 'video');

      // Group videos by date
      $videosByDate = [];
      $videosWithoutDate = [];

      foreach ($videos as $video) {
        if ($video->date()->isNotEmpty()) {
          try {
            $dateObj = new DateTime($video->date()->value());
            $dateKey = $dateObj->format('Y-m-d');
            $dateFormatted = $dateObj->format('l, F j, Y');

            if (!isset($videosByDate[$dateKey])) {
              $videosByDate[$dateKey] = [
                'formatted' => $dateFormatted,
                'videos' => []
              ];
            }
            $videosByDate[$dateKey]['videos'][] = $video;
          } catch (Exception $e) {
            $videosWithoutDate[] = $video;
          }
        } else {
          $videosWithoutDate[] = $video;
        }
      }

      // Sort dates chronologically
      ksort($videosByDate);

      // Timeblock order
      $timeblockOrder = [
        "9:00AM to 11:00AM",
        "11:15AM to 1:15PM",
        "2:15PM to 4:15PM",
        "4:30PM to 6:30PM"
      ];

      // Get the listing page URL for videos
      $listingPage = $site->find('videos');
      if (!$listingPage) {
        $listingPage = $site->index()->filter(function ($page) {
          return $page->intendedTemplate()->name() === 'videos';
        })->first();
      }
      $listingUrl = $listingPage ? $listingPage->url() : $page->url();

      if (count($videosByDate) > 0 || count($videosWithoutDate) > 0):
      ?>
        <?php
        // Display videos grouped by date
        foreach ($videosByDate as $dateKey => $dateData):
          // Group videos by timeblock for this date
          $videosByTimeblock = [];
          $videosWithoutTimeblock = [];

          foreach ($dateData['videos'] as $video) {
            $timeblock = $video->timeblock()->isNotEmpty() ? $video->timeblock()->value() : '';

            if ($timeblock && in_array($timeblock, $timeblockOrder)) {
              if (!isset($videosByTimeblock[$timeblock])) {
                $videosByTimeblock[$timeblock] = [];
              }
              $videosByTimeblock[$timeblock][] = $video;
            } else {
              $videosWithoutTimeblock[] = $video;
            }
          }
        ?>
          <div class="date-group">
            <?php
            // Display timeblocks in order
            foreach ($timeblockOrder as $timeblock) {
              if (isset($videosByTimeblock[$timeblock]) && count($videosByTimeblock[$timeblock]) > 0):
            ?>
                <div class="timeblock-group">
                  <h3 class="timeblock-header"><?= $timeblock ?></h3>
                  <div class="events-grid">
                    <?php foreach ($videosByTimeblock[$timeblock] as $video): ?>
                      <div class="event-card">
                        <div class="event-info">
                          <div class="event-type-container">
                            <div class="event-type">
                              <a href="<?= $listingUrl ?>"><?= $video->blueprint()->title() ?></a>
                            </div>
                            <?php if ($video->duration()->isNotEmpty()): ?>
                              <div class="event-duration"><?= $video->duration() ?></div>
                            <?php endif ?>
                          </div>
                          <h4 class="event-name">
                            <a href="<?= $video->url() ?>"><?= $video->title() ?></a>
                          </h4>
                          <?php if ($video->presenters()->isNotEmpty()): ?>
                            <div class="event-presenters">
                              <?php
                              $presenterList = $video->presenters()->toPages();
                              $presenterNames = [];
                              foreach ($presenterList as $presenter) {
                                $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                              }
                              echo implode(', ', $presenterNames);
                              ?>
                            </div>
                          <?php endif ?>
                          <div class="event-footer">
                            <?php if ($video->date()->isNotEmpty()): ?>
                              <?php
                              try {
                                $eventDate = new DateTime($video->date()->value());
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
                            <?php if ($video->timeblock()->isNotEmpty()): ?>
                              <div class="event-timeblock">
                                <?= $video->timeblock() ?>
                              </div>
                            <?php endif ?>
                            <?php if ($video->location()->isNotEmpty()): ?>
                              <?php
                              $location = $video->location()->toPage();
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

            // Display videos without timeblock for this date
            if (count($videosWithoutTimeblock) > 0):
              ?>
              <div class="timeblock-group">
                <h3 class="timeblock-header">Other Single-Channel Videos</h3>
                <div class="events-grid">
                  <?php foreach ($videosWithoutTimeblock as $video): ?>
                    <div class="event-card">
                      <div class="event-info">
                        <div class="event-type-container">
                          <div class="event-type">
                            <a href="<?= $listingUrl ?>"><?= $video->blueprint()->title() ?></a>
                          </div>
                          <?php if ($video->duration()->isNotEmpty()): ?>
                            <div class="event-duration"><?= $video->duration() ?></div>
                          <?php endif ?>
                        </div>
                        <h4 class="event-name">
                          <a href="<?= $video->url() ?>"><?= $video->title() ?></a>
                        </h4>
                        <?php if ($video->presenters()->isNotEmpty()): ?>
                          <div class="event-presenters">
                            <?php
                            $presenterList = $video->presenters()->toPages();
                            $presenterNames = [];
                            foreach ($presenterList as $presenter) {
                              $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                            }
                            echo implode(', ', $presenterNames);
                            ?>
                          </div>
                        <?php endif ?>
                        <div class="event-footer">
                          <?php if ($video->date()->isNotEmpty()): ?>
                            <?php
                            try {
                              $eventDate = new DateTime($video->date()->value());
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
                          <?php if ($video->location()->isNotEmpty()): ?>
                            <?php
                            $location = $video->location()->toPage();
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
        // Display videos without dates
        if (count($videosWithoutDate) > 0):
        ?>
          <div class="date-group">
            <div class="events-grid">
              <?php foreach ($videosWithoutDate as $video): ?>
                <div class="event-card">
                  <div class="event-info">
                    <div class="event-type-container">
                      <div class="event-type">
                        <a href="<?= $listingUrl ?>"><?= $video->blueprint()->title() ?></a>
                      </div>
                      <?php if ($video->duration()->isNotEmpty()): ?>
                        <div class="event-duration"><?= $video->duration() ?></div>
                      <?php endif ?>
                    </div>
                    <h4 class="event-name">
                      <a href="<?= $video->url() ?>"><?= $video->title() ?></a>
                    </h4>
                    <?php if ($video->presenters()->isNotEmpty()): ?>
                      <div class="event-presenters">
                        <?php
                        $presenterList = $video->presenters()->toPages();
                        $presenterNames = [];
                        foreach ($presenterList as $presenter) {
                          $presenterNames[] = '<a href="' . $presenter->url() . '">' . $presenter->title() . '</a>';
                        }
                        echo implode(', ', $presenterNames);
                        ?>
                      </div>
                    <?php endif ?>
                    <div class="event-footer">
                      <?php if ($video->date()->isNotEmpty()): ?>
                        <?php
                        try {
                          $eventDate = new DateTime($video->date()->value());
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
                      <?php if ($video->location()->isNotEmpty()): ?>
                        <?php
                        $location = $video->location()->toPage();
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
        <p>No videos available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>