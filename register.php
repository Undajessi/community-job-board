<?php
require_once __DIR__ . '/lib/auth.php';
require_once __DIR__ . '/lib/csrf.php';
start_session_once();
$error='';
if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    $password2 = $_POST['password2'] ?? '';
    if ($username === '' || $password === ''){
        $error = 'Missing fields';
    } elseif ($password !== $password2){
        $error = 'Passwords do not match';
    } else {
        $ok = register_user($username, $password);
        if ($ok){
            header('Location: login.php');
            exit;
        } else {
            $error = 'Could not register (username may be taken)';
        }
    }
}
?>
<!doctype html>
<html><head><meta charset="utf-8"><title>Register</title><link rel="stylesheet" href="assets/css/styles.css"></head>
<body><main class="container"><h1>Register</h1>
<?php if($error): ?><p style="color:red"><?php echo htmlspecialchars($error) ?></p><?php endif; ?>
<form method="post">
  <label>Username<br><input name="username" required></label>
  <label>Password<br><input name="password" type="password" required></label>
  <label>Repeat Password<br><input name="password2" type="password" required></label>
  <?php echo csrf_field(); ?>
  <button type="submit">Register</button>
</form>
<p>Have an account? <a href="login.php">Login</a></p>
</main></body></html>
