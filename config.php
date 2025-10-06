<?php
// config.php - central config with environment fallback
if (file_exists(__DIR__ . '/.env')) {
    // naive env loader for small demo
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        [$k, $v] = array_map('trim', explode('=', $line, 2) + [1=>'']);
        if ($k) putenv(sprintf('%s=%s', $k, $v));
    }
}

return [
    'db_path' => getenv('DB_PATH') ?: __DIR__ . '/data/jobs.sqlite',
    'per_page_default' => (int)(getenv('PER_PAGE_DEFAULT') ?: 10),
];
