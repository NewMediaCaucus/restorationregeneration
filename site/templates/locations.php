<?php snippet('header') ?>

<main class="listings-page">
  <div class="container">
    <article class="listings-content">

      <div class="listings-header">
        <h1>Locations</h1>
      </div>

      <?php snippet('construction-alert') ?>

      <?php
      // Get all locations
      $locations = $site->index()->filterBy('intendedTemplate', 'location');

      // Group locations by floor
      $floorGroups = [
        '1st-floor' => ['label' => 'MIX Center 1st Floor', 'locations' => []],
        '2nd-floor' => ['label' => 'MIX Center 2nd Floor', 'locations' => []],
        '3rd-floor' => ['label' => 'MIX Center 3rd Floor', 'locations' => []],
        'no-floor' => ['label' => '', 'locations' => []]
      ];

      foreach ($locations as $location) {
        $floorValue = $location->floor()->value();

        if ($floorValue && isset($floorGroups[$floorValue])) {
          $floorGroups[$floorValue]['locations'][] = $location;
        } else {
          $floorGroups['no-floor']['locations'][] = $location;
        }
      }

      // Display locations grouped by floor
      $floorOrder = ['1st-floor', '2nd-floor', '3rd-floor', 'no-floor'];
      $hasAnyLocations = false;

      foreach ($floorOrder as $floorKey) {
        if (count($floorGroups[$floorKey]['locations']) > 0) {
          $hasAnyLocations = true;
          break;
        }
      }

      if ($hasAnyLocations):
      ?>
        <?php foreach ($floorOrder as $floorKey): ?>
          <?php if (count($floorGroups[$floorKey]['locations']) > 0): ?>
            <div class="floor-group">
              <?php if ($floorKey !== 'no-floor'): ?>
                <h2 class="floor-header"><?= $floorGroups[$floorKey]['label'] ?></h2>
              <?php endif ?>
              <div class="locations-grid">
                <?php foreach ($floorGroups[$floorKey]['locations'] as $location): ?>
                  <a href="<?= $location->url() ?>" class="location-card">
                    <?php if ($location->photo()->isNotEmpty()): ?>
                      <div class="location-card-photo">
                        <?= $location->photo()->toFile() ?>
                      </div>
                    <?php endif ?>
                    <div class="location-card-info">
                      <h3 class="location-card-title"><?= $location->title() ?></h3>
                      <?php if ($location->capacity()->isNotEmpty()): ?>
                        <div class="location-card-capacity">Capacity: <?= $location->capacity() ?> people</div>
                      <?php endif ?>
                      <?php if ($location->address()->isNotEmpty()): ?>
                        <div class="location-card-address"><?= $location->address()->kt() ?></div>
                      <?php endif ?>
                    </div>
                  </a>
                <?php endforeach ?>
              </div>
            </div>
          <?php endif ?>
        <?php endforeach ?>
      <?php else: ?>
        <p>No locations available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>