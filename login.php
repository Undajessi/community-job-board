<?php
require_once __DIR__ . '/lib/auth.php';
require_once __DIR__ . '/lib/csrf.php';
start_session_once();
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    if ($username === '' || $password === ''){
        $error = 'Missing username or password';
    } else {
        $u = verify_user($username, $password);
        if ($u){
            login_user_session($u);
            $return = $_GET['return'] ?? '/employer.php';
            header('Location: ' . $return);
            exit;
        } else {
            $error = 'Invalid credentials';
        }
    }
}
?>
<!doctype html>
<html><head><meta charset="utf-8"><title>Login</title><link rel="stylesheet" href="assets/css/styles.css"></head>
<body><main class="container"><h1>Login</h1>
<?php if($error): ?><p style="color:red"><?php echo htmlspecialchars($error) ?></p><?php endif; ?>
<form method="post">
  <label>Username<br><input name="username" required></label>
  <label>Password<br><input name="password" type="password" required></label>
  <?php echo csrf_field(); ?>
  <button type="submit">Login</button>
</form>
<p>New? <a href="register.php">Register</a></p>
</main></body></html>
