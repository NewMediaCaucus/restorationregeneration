<?php snippet('header') ?>

<main class="listings-page">
  <div class="container">
    <article class="listings-content">

      <div class="listings-header">
        <h1>Performances</h1>
      </div>

      <?php
      // Get all performances
      $performances = $site->index()->filterBy('intendedTemplate', 'performance');

      if ($performances->count() > 0):
      ?>
        <div class="events-grid">
          <?php foreach ($performances as $performance): ?>
            <div class="event-card">
              <div class="event-info">
                <h3 class="event-name">
                  <a href="<?= $performance->url() ?>"><?= $performance->title() ?></a>
                </h3>
                <?php if ($performance->type()->isNotEmpty()): ?>
                  <div class="event-type">
                    Type: <?= $performance->type() ?>
                  </div>
                <?php endif ?>
                <?php if ($performance->location()->isNotEmpty()): ?>
                  <?php
                  $location = $performance->location()->toPage();
                  if ($location):
                  ?>
                    <div class="event-location">
                      Location: <a href="<?= $location->url() ?>"><?= $location->title() ?></a>
                    </div>
                  <?php endif ?>
                <?php endif ?>
                <?php if ($performance->description()->isNotEmpty()): ?>
                  <div class="event-description-preview">
                    <?= $performance->description()->excerpt(150) ?>
                  </div>
                <?php endif ?>
              </div>
            </div>
          <?php endforeach ?>
        </div>
      <?php else: ?>
        <p>No performances available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>