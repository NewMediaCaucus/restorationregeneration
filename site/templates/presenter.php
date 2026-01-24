<?php snippet('header') ?>

<main class="presenter-page">
  <div class="container">
    <article class="presenter-profile">

      <!-- Headshot and Basic Info -->
      <div class="presenter-header">
        <?php if ($page->headshot()->isNotEmpty()): ?>
          <div class="presenter-photo">
            <?= $page->headshot()->toFile() ?>
          </div>
        <?php endif ?>

        <div class="presenter-info">
          <h1 class="presenter-name"><?= $page->title() ?></h1>

          <?php if ($page->role()->isNotEmpty()): ?>
            <div class="presenter-title"><?= $page->role() ?></div>
          <?php endif ?>

          <?php if ($page->organization()->isNotEmpty()): ?>
            <div class="presenter-organization"><?= $page->organization() ?></div>
          <?php endif ?>
        </div>
      </div>

      <!-- Bio -->
      <?php if ($page->bio()->isNotEmpty()): ?>
        <div class="presenter-bio">
          <div class="bio-content">
            <?= $page->bio()->kt() ?>
          </div>
        </div>
      <?php endif ?>
      <!-- Links -->
      <?php if ($page->links()->isNotEmpty()): ?>
        <div class="presenter-social">
          <h2>Links</h2>
          <div class="social-links">
            <?php foreach ($page->links()->toStructure() as $social): ?>
              <?php if ($social->url()->isNotEmpty()): ?>
                <?php
                $url = $social->url();
                $isInstagram = str_contains($url, 'instagram.com');
                ?>
                <a href="<?= $url ?>" target="_blank" class="link-item">
                  <div class="link-icon">
                    <?php if ($isInstagram): ?>
                      <!-- Instagram Icon -->
                      <svg viewBox="0 0 24 24" fill="#000000">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    <?php else: ?>
                      <!-- Globe Icon -->
                      <svg viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    <?php endif ?>
                  </div>
                  <span class="link-text"><?= $url ?></span>
                </a>
              <?php endif ?>
            <?php endforeach ?>
          </div>
        </div>
      <?php endif ?>

      <!-- Events -->
      <?php
      // Get all event types that can have presenters
      $eventTemplates = ['presentation', 'workshop', 'expanded-media', 'performance', 'video'];
      $allEvents = new \Kirby\Cms\Pages();

      foreach ($eventTemplates as $template) {
        $templateEvents = $site->index()->filterBy('intendedTemplate', $template);
        $allEvents = $allEvents->merge($templateEvents);
      }

      // Filter events that include this presenter
      $events = new \Kirby\Cms\Pages();
      foreach ($allEvents as $event) {
        if ($event->presenters()->isNotEmpty()) {
          // Get the Pages collection from the presenters field
          $eventPresenters = $event->presenters()->toPages();
          // Check if the current presenter page is in the collection
          if ($eventPresenters->has($page)) {
            $events->add($event);
          }
        }
      }

      if ($events->count() > 0):
      ?>
        <div class="presenter-events">
          <h2>Events</h2>
          <div class="events-grid">
            <?php foreach ($events as $event): ?>
              <div class="event-card">
                <div class="event-info">
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

                  // Try to find the listing page
                  $listingPage = null;
                  $listingUrl = null;

                  if ($listingInfo) {
                    // First try to find by slug
                    $listingPage = $site->find($listingInfo['slug']);

                    // If not found by slug, try to find by template
                    if (!$listingPage) {
                      $listingPage = $site->index()->filter(function ($page) use ($listingInfo) {
                        return $page->intendedTemplate()->name() === $listingInfo['template'];
                      })->first();
                    }

                    // If still not found, construct URL based on expected slug
                    if (!$listingPage) {
                      $listingUrl = $site->url() . '/' . $listingInfo['slug'];
                    } else {
                      $listingUrl = $listingPage->url();
                    }
                  }
                  ?>
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
                    <?php if ($templateName === 'presentation' && $event->duration()->isNotEmpty()): ?>
                      <div class="event-duration"><?= $event->duration() ?></div>
                    <?php endif ?>
                  </div>
                  <h4 class="event-name">
                    <a href="<?= $event->url() ?>"><?= $event->title() ?></a>
                  </h4>
                  <?php if ($event->presenters()->isNotEmpty()): ?>
                    <div class="event-presenters">
                      <?php
                      $presenterList = $event->presenters()->toPages();
                      $presenterNames = [];
                      foreach ($presenterList as $presenter) {
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
                      <?php foreach ($event->location()->toPages() as $location): ?>
                        <div class="event-location">
                          <a href="<?= $location->url() ?>">
                            <svg class="map-pin-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <?= $location->title() ?>
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