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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

  <!-- Game of Life Animation -->
  <script src="<?= url('assets/js/game-of-life.js') ?>" defer></script>
</head>

<body>
  <!-- Game of Life Header Animation -->
  <div class="header-animation">
    <div class="container">
      <canvas id="game-of-life-canvas" width="1440" height="400"></canvas>
    </div>
  </div>