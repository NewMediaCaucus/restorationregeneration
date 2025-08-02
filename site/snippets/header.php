<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= $page->title() ?> | restoration/regeneration</title>

  <!-- Favicons -->
  <link rel="apple-touch-icon" sizes="180x180" href="<?= url('assets/icons/apple-touch-icon.png') ?>">
  <link rel="icon" type="image/png" sizes="32x32" href="<?= url('assets/icons/favicon-32x32.png') ?>">
  <link rel="icon" type="image/png" sizes="16x16" href="<?= url('assets/icons/favicon-16x16.png') ?>">
  <link rel="icon" type="image/x-icon" href="<?= url('assets/icons/favicon.ico') ?>">
  <link rel="manifest" href="<?= url('assets/icons/site.webmanifest') ?>">
  <meta name="theme-color" content="#000000">

  <!-- Preload CSS -->
  <link rel="preload" href="<?= url('assets/css/style.css') ?>" as="style">
  <link rel="stylesheet" href="<?= url('assets/css/style.css') ?>">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

  <?php if ($page->isHomePage()): ?>
    <!-- Three.js Library - Only on home page -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>

    <!-- Dynamic Animation Loader - Only on home page -->
    <script src="<?= url('assets/js/animation-loader.js') ?>" defer></script>
  <?php endif ?>

  <!-- Countdown Timer -->
  <script src="<?= url('assets/js/countdown-timer.js') ?>" defer></script>

  <!-- Memory Game -->
  <script src="<?= url('assets/js/memory-game.js') ?>" defer></script>
</head>

<body>
  <?php
  // Get the home page content for hero overlay
  $homePage = site()->find('home');
  ?>

  <?php if ($page->isHomePage()): ?>
    <!-- Dynamic Regeneration Header Animation - Only on home page -->
    <div class="header-animation">
      <canvas id="regeneration-canvas"></canvas>

      <!-- Hero Section Overlay -->
      <div class="hero-overlay">
        <div class="container">
          <?php if ($homePage->hero_title()->isNotEmpty()): ?>
            <h1 class="hero-title"><?= $homePage->hero_title() ?></h1>
          <?php endif ?>

          <?php if ($homePage->hero_subtitle()->isNotEmpty()): ?>
            <h2 class="hero-subtitle"><?= $homePage->hero_subtitle() ?></h2>
          <?php endif ?>

          <?php if ($homePage->dates_subtitle()->isNotEmpty()): ?>
            <h3 class="dates-subtitle"><?= $homePage->dates_subtitle() ?></h3>
          <?php endif ?>
          <?php if ($homePage->university_name()->isNotEmpty()): ?>
            <h3 class="university-name-subtitle">
              <?= $homePage->university_name() ?></h3>
            </h3>
          <?php endif ?>

          <?php if ($homePage->hero_image()->isNotEmpty()): ?>
            <div class="hero-image">
              <?= $homePage->hero_image()->toFile() ?>
            </div>
          <?php endif ?>
        </div>
      </div>
    </div>
  <?php else: ?>
    <!-- Static Header for other pages -->
    <div class="static-header">
      <?php
      $today = new DateTime();
      $dayOfMonth = $today->format('j');
      $isEvenDay = $dayOfMonth % 2 === 0;
      $backgroundImage = $isEvenDay ? 'assets/icons/header-background-even.png' : 'assets/icons/header-background-odd.png';
      ?>
      <div class="static-header-background" style="background-image: url('<?= url($backgroundImage) ?>');">
        <div class="hero-overlay">
          <div class="container">
            <?php if ($homePage->hero_title()->isNotEmpty()): ?>
              <h1 class="hero-title"><?= $homePage->hero_title() ?></h1>
            <?php endif ?>

            <?php if ($homePage->hero_subtitle()->isNotEmpty()): ?>
              <h2 class="hero-subtitle"><?= $homePage->hero_subtitle() ?></h2>
            <?php endif ?>

            <?php if ($homePage->dates_subtitle()->isNotEmpty()): ?>
              <h3 class="dates-subtitle"><?= $homePage->dates_subtitle() ?></h3>
            <?php endif ?>
            <?php if ($homePage->university_name()->isNotEmpty()): ?>
              <h3 class="university-name-subtitle">
                <?= $homePage->university_name() ?></h3>
              </h3>
            <?php endif ?>

            <?php if ($homePage->hero_image()->isNotEmpty()): ?>
              <div class="hero-image">
                <?= $homePage->hero_image()->toFile() ?>
              </div>
            <?php endif ?>
          </div>
        </div>
      </div>
    </div>
  <?php endif ?>