<?php
// db/init_db.php
// Initializes SQLite database and jobs table.

$dir = __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'data';
if (!is_dir($dir)) {
    mkdir($dir, 0755, true);
}
$dbFile = $dir . DIRECTORY_SEPARATOR . 'jobs.sqlite';

try {
    $db = new PDO('sqlite:' . $dbFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT,
        type TEXT,
        description TEXT,
        posted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    echo "Initialized database at: $dbFile\n";
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . "\n";
    exit(1);
}
