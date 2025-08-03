<?php

/**
 * Kirby Plainkit
 */

// Suppress deprecation warnings for PHP 8.1+ compatibility
error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);

require 'kirby/bootstrap.php';

echo (new Kirby())->render();
