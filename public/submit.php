<?php
require_once __DIR__ . '/../lib/auth.php';
require_once __DIR__ . '/../lib/csrf.php';
require_once __DIR__ . '/../db/db.php';

require_login();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method Not Allowed';
    exit;
}

if (!csrf_verify($_POST['csrf_token'] ?? '')){
    header('Location: /employer.php?error=csrf');
    exit;
}

$title = trim($_POST['title'] ?? '');
$company = trim($_POST['company'] ?? '');
$location = trim($_POST['location'] ?? '');
$type = trim($_POST['type'] ?? '');
$description = trim($_POST['description'] ?? '');

if ($title === '' || $company === '') {
    header('Location: /employer.php?error=missing');
    exit;
}

try {
    $pdo = get_db();
    $stmt = $pdo->prepare('INSERT INTO jobs (title, company, location, type, description) VALUES (:title, :company, :location, :type, :description)');
    $stmt->execute([
        ':title' => $title,
        ':company' => $company,
        ':location' => $location,
        ':type' => $type,
        ':description' => $description,
    ]);

    header('Location: /employer.php?success=1');
    exit;
} catch (Exception $e) {
    error_log($e->getMessage());
    header('Location: /employer.php?error=server');
    exit;
}
