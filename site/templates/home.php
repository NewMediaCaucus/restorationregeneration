<?php snippet('header') ?>

<main class="home-page">
  <!-- Hero Section -->
  <section class="hero">
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

      <?php if ($page->hero_image()->isNotEmpty()): ?>
        <div class="hero-image">
          <?= $page->hero_image()->toFile() ?>
        </div>
      <?php endif ?>
    </div>
  </section>

  <!-- Welcome Section -->
  <?php if ($page->welcome()->isNotEmpty()): ?>
    <section class="welcome section">
      <div class="container">
        <h2>Welcome</h2>
        <div class="content">
          <?= $page->welcome()->kt() ?>
        </div>
      </div>
    </section>
  <?php endif ?>

  <!-- Theme Section -->
  <?php if ($page->theme()->isNotEmpty()): ?>
    <section class="theme section">
      <div class="container">
        <h2>Theme</h2>
        <div class="content">
          <?= $page->theme()->kt() ?>
        </div>
      </div>
    </section>
  <?php endif ?>

  <!-- About New Media Caucus Section -->
  <?php if ($page->about_new_media_caucus()->isNotEmpty()): ?>
    <section class="about-nmc section">
      <div class="container">
        <h2>About New Media Caucus</h2>
        <div class="content">
          <?= $page->about_new_media_caucus()->kt() ?>
        </div>
      </div>
    </section>
  <?php endif ?>

  <!-- Save the Date Section -->
  <?php if ($page->save_the_date()->isNotEmpty()): ?>
    <section class="save-the-date section">
      <div class="container">
        <h2>Save the Date</h2>
        <div class="content">
          <?= $page->save_the_date()->kt() ?>
        </div>
      </div>
    </section>
  <?php endif ?>

  <!-- Event Details -->
  <section class="event-details section">
    <div class="container">
      <h2>Event Details</h2>

      <?php if ($page->event_date()->isNotEmpty()): ?>
        <div class="event-date">
          <strong>Date:</strong> <?= $page->event_date()->toDate('F j, Y') ?>
        </div>
      <?php endif ?>

      <?php if ($page->event_address()->isNotEmpty()): ?>
        <div class="event-location">
          <strong>Location:</strong><br>
          <?php foreach ($page->event_address()->toStructure() as $address): ?>
            <?php if ($address->street_address()->isNotEmpty()): ?>
              <?= $address->street_address() ?><br>
            <?php endif ?>
            <?php if ($address->city()->isNotEmpty()): ?>
              <?= $address->city() ?>, <?= $address->state() ?> <?= $address->zip_code() ?><br>
            <?php endif ?>
            <?php if ($address->building_name()->isNotEmpty()): ?>
              <?= $address->building_name() ?><br>
            <?php endif ?>
            <?php if ($address->room_number()->isNotEmpty()): ?>
              <?= $address->room_number() ?>
            <?php endif ?>
          <?php endforeach ?>
        </div>
      <?php endif ?>
    </div>
  </section>

  <!-- Travel/Lodging Section -->
  <?php if ($page->travel_lodging()->isNotEmpty()): ?>
    <section class="travel-lodging section">
      <div class="container">
        <h2>Travel & Lodging</h2>
        <div class="content">
          <?= $page->travel_lodging()->kt() ?>
        </div>
      </div>
    </section>
  <?php endif ?>

  <!-- Registration Section -->
  <?php if ($page->registration()->isNotEmpty()): ?>
    <section class="registration section">
      <div class="container">
        <h2>Registration</h2>
        <div class="content">
          <?= $page->registration()->kt() ?>
        </div>
        <?php if ($page->registration_link()->isNotEmpty()): ?>
          <div class="registration-link">
            <a href="<?= $page->registration_link() ?>" class="btn btn-primary">Register Now</a>
          </div>
        <?php endif ?>
      </div>
    </section>
  <?php endif ?>

  <!-- Submission Calls Section -->
  <?php if ($page->submission_calls()->isNotEmpty()): ?>
    <section class="submission-calls section">
      <div class="container">
        <h2>Call for Submissions</h2>
        <div class="content">
          <?= $page->submission_calls()->kt() ?>
        </div>
      </div>
    </section>
  <?php endif ?>

  <!-- Important Dates -->
  <?php if ($page->important_dates()->isNotEmpty()): ?>
    <section class="important-dates section">
      <div class="container">
        <h2>Important Dates</h2>
        <div class="dates-list">
          <?php foreach ($page->important_dates()->toStructure() as $date): ?>
            <div class="date-item">
              <strong><?= $date->date()->toDate('F j, Y') ?></strong>
              <span><?= $date->description() ?></span>
            </div>
          <?php endforeach ?>
        </div>
      </div>
    </section>
  <?php endif ?>

  <!-- Sponsors -->
  <?php if ($page->sponsors()->isNotEmpty()): ?>
    <section class="sponsors section">
      <div class="container">
        <h2>Sponsors</h2>
        <div class="sponsors-grid">
          <?php foreach ($page->sponsors()->toStructure() as $sponsor): ?>
            <div class="sponsor">
              <?php if ($sponsor->logo()->isNotEmpty()): ?>
                <div class="sponsor-logo">
                  <?= $sponsor->logo()->toFile() ?>
                </div>
              <?php endif ?>
              <h3><?= $sponsor->name() ?></h3>
              <?php if ($sponsor->website()->isNotEmpty()): ?>
                <a href="<?= $sponsor->website() ?>" target="_blank">Visit Website</a>
              <?php endif ?>
            </div>
          <?php endforeach ?>
        </div>
      </div>
    </section>
  <?php endif ?>

  <!-- Contact -->
  <?php if ($page->contact_email()->isNotEmpty()): ?>
    <section class="contact section">
      <div class="container">
        <h2>Contact</h2>
        <p>For more information, contact: <a href="mailto:<?= $page->contact_email() ?>"><?= $page->contact_email() ?></a></p>
      </div>
    </section>
  <?php endif ?>
</main>

<?php snippet('footer') ?>