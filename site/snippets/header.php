<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $page->title() ?> | restoration/regeneration</title>

  <!-- Preload CSS -->
  <link rel="preload" href="<?= url('assets/css/style.css') ?>" as="style">
  <link rel="stylesheet" href="<?= url('assets/css/style.css') ?>">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

  <!-- Three.js Library -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>

  <!-- Neural Regeneration 3D Animation -->
  <script src="<?= url('assets/js/neural-regeneration-3d.js') ?>" defer></script>
</head>

<body>
  <!-- Neural Regeneration Header Animation -->
  <div class="header-animation">
    <canvas id="neural-regeneration-canvas"></canvas>

    <!-- Hero Section Overlay -->
    <div class="hero-overlay">
      <div class="container">
        <?php if ($page->hero_title()->isNotEmpty()): ?>
          <h1 class="hero-title"><?= $page->hero_title() ?></h1>
        <?php endif ?>

        <?php if ($page->hero_subtitle()->isNotEmpty()): ?>
          <h2 class="hero-subtitle"><?= $page->hero_subtitle() ?></h2>
        <?php endif ?>

        <?php if ($page->dates_subtitle()->isNotEmpty()): ?>
          <h3 class="dates-subtitle"><?= $page->dates_subtitle() ?></h3>
        <?php endif ?>
        <?php if ($page->university_name()->isNotEmpty()): ?>
          <h3 class="university-name-subtitle">
            <?= $page->university_name() ?></h3>
          </h3>
        <?php endif ?>

        <?php if ($page->hero_image()->isNotEmpty()): ?>
          <div class="hero-image">
            <?= $page->hero_image()->toFile() ?>
          </div>
        <?php endif ?>
      </div>
    </div>
  </div>