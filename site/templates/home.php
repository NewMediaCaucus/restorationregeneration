<?php snippet('header') ?>

<main class="home-page">
  <!-- Welcome Section -->
  <?php if ($page->welcome()->isNotEmpty()): ?>
    <section class="welcome section">
      <div class="container">
        <h2>Welcome!</h2>
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
        <h2>Our 2026 Theme</h2>
        <div class="content">
          <?= $page->theme()->kt() ?>
        </div>
      </div>
    </section>
  <?php endif ?>

  <!-- Our Keynote Speaker Section -->
  <?php if ($page->keynote_promo()->isNotEmpty() || $page->keynote_headshot()->isNotEmpty() || $page->keynote_bio()->isNotEmpty()): ?>
    <section class="keynote-speaker section">
      <div class="container">
        <h2>Our Keynote Speaker</h2>
        
        <?php if ($page->keynote_promo()->isNotEmpty()): ?>
          <div class="keynote-promo">
            <?= $page->keynote_promo()->kt() ?>
          </div>
        <?php endif ?>

        <?php if ($page->keynote_headshot()->isNotEmpty()): ?>
          <div class="keynote-headshot">
            <?= $page->keynote_headshot()->toFile() ?>
          </div>
        <?php endif ?>

        <?php if ($page->keynote_bio()->isNotEmpty()): ?>
          <div class="keynote-bio">
            <?= $page->keynote_bio()->kt() ?>
          </div>
        <?php endif ?>
      </div>
    </section>
  <?php endif ?>

  <!-- Event Location -->
  <section class="event-location section">
    <div class="container">
      <h2>Event Location</h2>

      <?php if ($page->event_location_image()->isNotEmpty()): ?>
        <div class="event-location-image">
          <?= $page->event_location_image()->toFile() ?>
        </div>
      <?php endif ?>

      <?php if ($page->event_address()->isNotEmpty()): ?>
        <?php
        // Build Google Maps URL from address components
        $googleMapsUrl = '';
        $addressParts = [];

        foreach ($page->event_address()->toStructure() as $address) {
          if ($address->street_address()->isNotEmpty()) {
            $addressParts[] = $address->street_address();
          }
          if ($address->city()->isNotEmpty()) {
            $addressParts[] = $address->city();
          }
          if ($address->state()->isNotEmpty()) {
            $addressParts[] = $address->state();
          }
          if ($address->zip_code()->isNotEmpty()) {
            $addressParts[] = $address->zip_code();
          }
          if ($address->building_name()->isNotEmpty()) {
            $addressParts[] = $address->building_name();
          }
        }

        if (!empty($addressParts)) {
          $googleMapsUrl = 'https://maps.google.com/?q=' . urlencode(implode(', ', $addressParts));
        }
        ?>



        <div class="event-location">
          <div class="location-details">
            <?php if ($page->university_name()->isNotEmpty()): ?>
              <div class="university-name">
                <strong><?= $page->university_name() ?></strong>
              </div>
            <?php endif ?>
            <?php foreach ($page->event_address()->toStructure() as $address): ?>
              <?php if ($address->building_name()->isNotEmpty()): ?>
                <?php if ($address->building_url()->isNotEmpty()): ?>
                  <a href="<?= $address->building_url() ?>" target="_blank" class="building-link">
                    <?= $address->building_name() ?>
                    <img src="/assets/icons/external-link.svg" alt="External link" class="external-link-icon">
                  </a>
                <?php else: ?>
                  <?= $address->building_name() ?><br>
                <?php endif ?>
              <?php endif ?>
              <?php if ($address->room_number()->isNotEmpty()): ?>
                <?= $address->room_number() ?><br>
              <?php endif ?>
              <?php if ($address->street_address()->isNotEmpty()): ?>
                <?php
                // Build Google Maps URL from street address
                $streetAddress = $address->street_address();
                $city = $address->city()->isNotEmpty() ? $address->city() : '';
                $state = $address->state()->isNotEmpty() ? $address->state() : '';
                $zip = $address->zip_code()->isNotEmpty() ? $address->zip_code() : '';

                $googleMapsUrl = '';
                $addressParts = [];

                if ($streetAddress) {
                  $addressParts[] = $streetAddress;
                }
                if ($city) {
                  $addressParts[] = $city;
                }
                if ($state) {
                  $addressParts[] = $state;
                }
                if ($zip) {
                  $addressParts[] = $zip;
                }

                if (!empty($addressParts)) {
                  $googleMapsUrl = 'https://maps.google.com/?q=' . urlencode(implode(', ', $addressParts));
                }
                ?>

                <?php if (!empty($googleMapsUrl)): ?>
                  <a href="<?= $googleMapsUrl ?>" target="_blank" class="address-link">
                  <?php endif ?>

                  <div class="address-with-pin">
                    <div class="location-icon">
                      <img src="/assets/icons/map-pin.svg" alt="Location" class="map-pin-icon">
                    </div>
                    <div class="address-details">
                      <div class="street-text">
                        <?= $address->street_address() ?>
                      </div>
                      <?php if ($address->city()->isNotEmpty()): ?>
                        <div class="city-state-zip">
                          <?= $address->city() ?>, <?= $address->state() ?> <?= $address->zip_code() ?>
                        </div>
                      <?php endif ?>
                    </div>
                  </div>

                  <?php if (!empty($googleMapsUrl)): ?>
                  </a>
                <?php endif ?>
              <?php endif ?>
            <?php endforeach ?>
          </div>
        </div>

        <?php if (!empty($googleMapsUrl)): ?>
          </a>
        <?php endif ?>
      <?php endif ?>
    </div>
  </section>

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
  <?php if ($page->save_the_date()->isNotEmpty() || $page->event_date()->isNotEmpty() || $page->memory_game_enabled()->isTrue()): ?>
    <section class="save-the-date section">
      <div class="container">
        <h2>Save the Date!</h2>
        <div class="save-the-date-grid">
          <!-- Text Block -->
          <?php if ($page->save_the_date()->isNotEmpty()): ?>
            <div class="save-the-date-block text-block">
              <div class="content">
                <?= $page->save_the_date()->kt() ?>
              </div>
            </div>
          <?php endif ?>

          <!-- Countdown Block -->
          <?php if ($page->event_date()->isNotEmpty()): ?>
            <div class="save-the-date-block countdown-block">
              <div class="countdown-timer">
                <div class="countdown-title">Countdown to the Symposium</div>
                <div class="countdown-single">
                  <div class="countdown-item">
                    <div class="countdown-number" id="days">--</div>
                    <div class="countdown-label">Days</div>
                  </div>
                </div>
                <div class="countdown-date">
                  <?= $page->event_date()->toDate('F j, Y') ?>
                </div>
              </div>
            </div>
          <?php endif ?>

          <!-- Memory Game Block -->
          <?php if ($page->memory_game_enabled()->isTrue()): ?>
            <div class="save-the-date-block game-block">
              <div class="memory-game">
                <div class="game-title">New Media Memory</div>
                <div class="game-container">
                  <div class="game-info">
                    <div class="game-status">Time: <span id="game-time">216</span>s</div>
                    <div class="game-score">Pairs: <span id="game-pairs">0</span>/8</div>
                  </div>
                  <div class="game-description">
                    Need to burn off some nervous energy while waiting for start of the symposium?
                  </div>
                  <div class="game-board" id="memory-board"></div>
                  <div class="game-controls">
                    <button id="new-game-btn" class="btn btn-primary">New Game</button>
                    <button id="shuffle-btn" class="btn btn-secondary">Shuffle</button>
                  </div>
                </div>
              </div>
            </div>
          <?php endif ?>
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