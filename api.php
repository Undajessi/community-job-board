<?php
// api.php - returns JSON array of jobs; supports ?q=search&type=&location=
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db/db.php';

$q = trim($_GET['q'] ?? '');
$type = trim($_GET['type'] ?? '');
$location = trim($_GET['location'] ?? '');

try {
    $pdo = get_db();
    $sql = 'SELECT id, title, company, location, type, description, posted_at FROM jobs WHERE 1=1';
    $params = [];
    if ($q !== '') {
        $sql .= ' AND (title LIKE :q OR company LIKE :q OR description LIKE :q)';
        $params[':q'] = "%$q%";
    }
    if ($type !== '') {
        $sql .= ' AND type = :type';
        $params[':type'] = $type;
    }
    if ($location !== '') {
        $sql .= ' AND location LIKE :location';
        $params[':location'] = "%$location%";
    }
    $sql .= ' ORDER BY posted_at DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['ok' => true, 'jobs' => $jobs], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
