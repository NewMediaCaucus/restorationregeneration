<?php snippet('header') ?>

<main class="listings-page">
  <div class="container">
    <article class="listings-content">

      <div class="listings-header">
        <h1>Expanded Media</h1>
      </div>

      <?php
      // Get all expanded media
      $expandedMedia = $site->index()->filterBy('intendedTemplate', 'expanded-media');

      if ($expandedMedia->count() > 0):
      ?>
        <div class="events-grid">
          <?php foreach ($expandedMedia as $item): ?>
            <div class="event-card">
              <div class="event-info">
                <h3 class="event-name">
                  <a href="<?= $item->url() ?>"><?= $item->title() ?></a>
                </h3>
                <?php if ($item->type()->isNotEmpty()): ?>
                  <div class="event-type">
                    Type: <?= $item->type() ?>
                  </div>
                <?php endif ?>
                <?php if ($item->location()->isNotEmpty()): ?>
                  <?php
                  $location = $item->location()->toPage();
                  if ($location):
                  ?>
                    <div class="event-location">
                      Location: <a href="<?= $location->url() ?>"><?= $location->title() ?></a>
                    </div>
                  <?php endif ?>
                <?php endif ?>
                <?php if ($item->description()->isNotEmpty()): ?>
                  <div class="event-description-preview">
                    <?= $item->description()->excerpt(150) ?>
                  </div>
                <?php endif ?>
              </div>
            </div>
          <?php endforeach ?>
        </div>
      <?php else: ?>
        <p>No expanded media available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>