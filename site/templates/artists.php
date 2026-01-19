<?php snippet('header') ?>

<main class="listings-page">
  <div class="container">
    <article class="listings-content">

      <div class="listings-header">
        <h1>Artists</h1>
      </div>

      <?php snippet('construction-alert') ?>

      <?php
      // Get all presenters
      $presenters = $site->index()->filterBy('intendedTemplate', 'presenter');

      // Sort presenters by last name
      $presentersArray = [];
      foreach ($presenters as $presenter) {
        $presentersArray[] = $presenter;
      }
      usort($presentersArray, function ($a, $b) {
        $nameA = $a->title();
        $nameB = $b->title();

        // Extract last name (last word in the name)
        $partsA = explode(' ', trim($nameA));
        $partsB = explode(' ', trim($nameB));
        $lastNameA = end($partsA);
        $lastNameB = end($partsB);

        return strcasecmp($lastNameA, $lastNameB);
      });

      // Get all event types that can have presenters
      $eventTemplates = ['presentation', 'workshop', 'expanded-media', 'performance', 'video'];
      $allEvents = new \Kirby\Cms\Pages();

      foreach ($eventTemplates as $template) {
        $templateEvents = $site->index()->filterBy('intendedTemplate', $template);
        $allEvents = $allEvents->merge($templateEvents);
      }

      if (count($presentersArray) > 0):
      ?>
        <div class="artists-grid">
          <?php foreach ($presentersArray as $presenter): ?>
            <?php
            // Filter events that include this presenter
            $presenterEvents = new \Kirby\Cms\Pages();
            foreach ($allEvents as $event) {
              if ($event->presenters()->isNotEmpty()) {
                $eventPresenters = $event->presenters()->toPages();
                if ($eventPresenters->has($presenter)) {
                  $presenterEvents->add($event);
                }
              }
            }
            ?>
            <div class="artist-card">
              <a href="<?= $presenter->url() ?>" class="artist-headshot-link">
                <div class="artist-headshot">
                  <?php if ($presenter->headshot()->isNotEmpty()): ?>
                    <?= $presenter->headshot()->toFile() ?>
                  <?php else: ?>
                    <div class="artist-headshot-placeholder"></div>
                  <?php endif ?>
                </div>
              </a>
              <div class="artist-info">
                <h3 class="artist-name">
                  <a href="<?= $presenter->url() ?>"><?= $presenter->title() ?></a>
                </h3>
                <?php if ($presenterEvents->count() > 0): ?>
                  <div class="artist-events">
                    <?php foreach ($presenterEvents as $event): ?>
                      <a href="<?= $event->url() ?>"><?= $event->title() ?></a>
                    <?php endforeach ?>
                  </div>
                <?php endif ?>
              </div>
            </div>
          <?php endforeach ?>
        </div>
      <?php else: ?>
        <p>No artists available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>