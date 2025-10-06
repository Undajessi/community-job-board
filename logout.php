<?php
require_once __DIR__ . '/lib/auth.php';
logout_user();
header('Location: /index.html');
exit;
