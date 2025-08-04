<?php if ($file): ?>
  <div class="keynote-headshot-image">
    <img src="<?= $file->url() ?>" 
         alt="<?= $file->alt()->isNotEmpty() ? $file->alt() : 'Keynote speaker headshot' ?>"
         class="responsive-image">
    <?php if ($file->caption()->isNotEmpty()): ?>
      <div class="image-caption">
        <?= $file->caption()->kt() ?>
      </div>
    <?php endif ?>
    <?php if ($file->credits()->isNotEmpty()): ?>
      <div class="image-credits">
        Photo: <?= $file->credits() ?>
      </div>
    <?php endif ?>
  </div>
<?php endif ?> 