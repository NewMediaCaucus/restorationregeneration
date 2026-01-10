<?php snippet('header') ?>

<main class="listings-page">
  <div class="container">
    <article class="listings-content">

      <div class="listings-header">
        <h1>Single-Channel Videos</h1>
      </div>

      <?php
      // Get all videos
      $videos = $site->index()->filterBy('intendedTemplate', 'video');

      if ($videos->count() > 0):
      ?>
        <div class="events-grid">
          <?php foreach ($videos as $video): ?>
            <div class="event-card">
              <div class="event-info">
                <h3 class="event-name">
                  <a href="<?= $video->url() ?>"><?= $video->title() ?></a>
                </h3>
                <?php if ($video->duration()->isNotEmpty()): ?>
                  <div class="event-duration">
                    Duration: <?= $video->duration() ?>
                  </div>
                <?php endif ?>
                <?php if ($video->location()->isNotEmpty()): ?>
                  <?php
                  $location = $video->location()->toPage();
                  if ($location):
                  ?>
                    <div class="event-location">
                      Location: <a href="<?= $location->url() ?>"><?= $location->title() ?></a>
                    </div>
                  <?php endif ?>
                <?php endif ?>
                <?php if ($video->description()->isNotEmpty()): ?>
                  <div class="event-description-preview">
                    <?= $video->description()->excerpt(150) ?>
                  </div>
                <?php endif ?>
              </div>
            </div>
          <?php endforeach ?>
        </div>
      <?php else: ?>
        <p>No videos available at this time.</p>
      <?php endif ?>

    </article>
  </div>
</main>

<?php snippet('footer') ?>