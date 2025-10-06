<?php
// lib/csrf.php - very small CSRF token helper
function csrf_start(){
    if (session_status() === PHP_SESSION_NONE) session_start();
}

function csrf_token(){
    csrf_start();
    if (empty($_SESSION['csrf_token'])){
        $_SESSION['csrf_token'] = bin2hex(random_bytes(24));
    }
    return $_SESSION['csrf_token'];
}

function csrf_field(){
    $t = htmlspecialchars(csrf_token(), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    return "<input type=\"hidden\" name=\"csrf_token\" value=\"$t\">";
}

function csrf_verify($token): bool{
    csrf_start();
    return hash_equals($_SESSION['csrf_token'] ?? '', (string)$token);
}
