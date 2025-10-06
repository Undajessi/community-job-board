<?php
// db/db.php - simple PDO SQLite helper

function get_db_path(): string
{
    $cfg = require __DIR__ . '/../config.php';
    $path = $cfg['db_path'];
    $dir = dirname($path);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $path;
}

function get_db(): PDO
{
    $path = get_db_path();
    $pdo = new PDO('sqlite:' . $path);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Ensure table exists (idempotent)
    $pdo->exec("CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT,
        type TEXT,
        description TEXT,
        posted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");

    return $pdo;
}
