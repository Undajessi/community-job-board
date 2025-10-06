<?php
require_once __DIR__ . '/db.php';

try{
    $pdo = get_db();
    $title = 'CLI test job ' . time();
    $stmt = $pdo->prepare('INSERT INTO jobs (title, company, location, type, description) VALUES (:t, :c, :l, :y, :d)');
    $stmt->execute([':t'=>$title, ':c'=>'CLI Tester', ':l'=>'Local', ':y'=>'Contract', ':d'=>'Inserted by test script']);
    $id = $pdo->lastInsertId();
    echo "Inserted job id: $id\n";
    $stmt = $pdo->prepare('SELECT id, title, company FROM jobs WHERE id = :id');
    $stmt->execute([':id'=>$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    print_r($row);
}catch(Exception $e){
    echo 'Error: ' . $e->getMessage() . "\n";
}
