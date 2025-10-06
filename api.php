<?php
// api.php - returns JSON array of jobs; supports ?q=search&type=&location=
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db/db.php';

$q = trim($_GET['q'] ?? '');
$type = trim($_GET['type'] ?? '');
$location = trim($_GET['location'] ?? '');
$page = max(1, (int)($_GET['page'] ?? 1));
$per_page = max(1, min(100, (int)($_GET['per_page'] ?? 20)));

try {
    $pdo = get_db();
    $where = ' WHERE 1=1';
    $params = [];
    if ($q !== '') {
        $where .= ' AND (title LIKE :q OR company LIKE :q OR description LIKE :q)';
        $params[':q'] = "%$q%";
    }
    if ($type !== '') {
        $where .= ' AND type = :type';
        $params[':type'] = $type;
    }
    if ($location !== '') {
        $where .= ' AND location LIKE :location';
        $params[':location'] = "%$location%";
    }

    // total count
    $countStmt = $pdo->prepare('SELECT COUNT(*) as cnt FROM jobs' . $where);
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $offset = ($page - 1) * $per_page;
    $sql = 'SELECT id, title, company, location, type, description, posted_at FROM jobs' . $where . ' ORDER BY posted_at DESC LIMIT :l OFFSET :o';
    $stmt = $pdo->prepare($sql);
    foreach ($params as $k => $v) $stmt->bindValue($k, $v);
    $stmt->bindValue(':l', $per_page, PDO::PARAM_INT);
    $stmt->bindValue(':o', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'ok' => true,
        'jobs' => $jobs,
        'meta' => ['total' => $total, 'page' => $page, 'per_page' => $per_page]
    ], JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
}
