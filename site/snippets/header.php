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

  <!-- Neural Regeneration Animation -->
  <script src="<?= url('assets/js/neural-regeneration.js') ?>" defer></script>
</head>

<body>
  <!-- Neural Regeneration Header Animation -->
  <div class="header-animation">
    <canvas id="neural-regeneration-canvas" height="800"></canvas>
  </div>