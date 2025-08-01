<?php

return [
  'debug' => true,
  'url'   => 'https://rr.shimmeringtrashpile.com',
  'cache' => [
    'pages' => [
      'active' => false
    ],
    'templates' => [
      'active' => false
    ],
    'data' => [
      'active' => false
    ]
  ],
  'panel' => [
    'vue' => [
      'compiler' => false
    ],
    'install' => true,
  ],
  'thathoff.git-content.pull' => false, // Set to true to enable pulling first. default is false.
  'thathoff.git-content.push' => false, // Pushing with the plugin is not peformant, but it's a good way to test until a cron job can be setup.
  'thathoff.git-content.branch' => 'main',
  'thathoff.git-content.remote' => 'origin',
  'thathoff.git-content.disableBranchManagement' => true,
  'thathoff.git-content.disable' => false, // Set to true if you want to disable the plugin
];
