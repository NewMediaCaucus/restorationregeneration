<?php

return [
  'debug' => true,
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
    'install' => false
  ],
  'roots' => [
    'content' => __DIR__ . '/../../content'
  ],
  'thathoff.git-content.commit' => true,
  'thathoff.git-content.pull' => true, // Set to true so devs get the latest content.
  'thathoff.git-content.push' => false, // Dev content should not push to main. Server pushes will happen via cron job.
  'thathoff.git-content.branch' => 'main',
  'thathoff.git-content.remote' => 'origin',
  'thathoff.git-content.disableBranchManagement' => false, // Set to true to on prod.
  'thathoff.git-content.disable' => true, // Set to true to disable git-content.

];
