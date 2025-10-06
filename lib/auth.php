<?php
// lib/auth.php - simple auth helpers using SQLite
require_once __DIR__ . '/../db/db.php';

function start_session_once(){
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function ensure_users_table(){
    $pdo = get_db();
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
}

function register_user(string $username, string $password): bool{
    ensure_users_table();
    $pdo = get_db();
    $hash = password_hash($password, PASSWORD_DEFAULT);
    try{
        $stmt = $pdo->prepare('INSERT INTO users (username, password_hash) VALUES (:u, :p)');
        $stmt->execute([':u'=>$username, ':p'=>$hash]);
        return true;
    }catch(Exception $e){
        return false;
    }
}

function verify_user(string $username, string $password){
    ensure_users_table();
    $pdo = get_db();
    $stmt = $pdo->prepare('SELECT id, username, password_hash FROM users WHERE username = :u LIMIT 1');
    $stmt->execute([':u'=>$username]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return false;
    if (password_verify($password, $row['password_hash'])){
        return ['id'=>$row['id'],'username'=>$row['username']];
    }
    return false;
}

function login_user_session(array $user){
    start_session_once();
    // regenerate session id to avoid fixation
    session_regenerate_id(true);
    $_SESSION['user'] = $user;
}

function logout_user(){
    start_session_once();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }
    session_destroy();
}

function current_user(){
    start_session_once();
    return $_SESSION['user'] ?? null;
}

function is_logged_in(): bool{
    start_session_once();
    return !empty($_SESSION['user']);
}

function require_login(){
    start_session_once();
    if (!is_logged_in()){
        $return = urlencode($_SERVER['REQUEST_URI'] ?? '/');
        header('Location: /login.php?return=' . $return);
        exit;
    }
}
