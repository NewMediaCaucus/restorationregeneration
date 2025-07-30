<?php

return [
  'debug' => true,
  'panel' => [
    'install' => true
  ],
  'hooks' => [
    'route:before' => function ($route, $path, $method) {
      // Add any custom route handling here
    }
  ]
];
