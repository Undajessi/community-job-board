<?php
// employer.php - simple employer submission form
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Employer - Post a Job</title>
  <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
  <main class="container">
    <h1>Post a Job</h1>
    <form action="submit.php" method="post">
      <label>Job Title<br><input name="title" required></label>
      <label>Company<br><input name="company" required></label>
      <label>Location<br><input name="location"></label>
      <label>Type<br>
        <select name="type">
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>
      </label>
      <label>Description<br><textarea name="description" rows="6"></textarea></label>
      <button type="submit">Submit Job</button>
    </form>

    <p><a href="index.html">Go to student search UI</a></p>
  </main>
</body>
</html>
