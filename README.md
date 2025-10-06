# Community Job Board

A minimal Community Job Board where employers can post jobs using PHP forms and students can search and filter job posts using JavaScript. All posts are stored in a SQLite database for easy local testing.

## Features
- Employer-facing PHP form to submit jobs (`employer.php`).
- Submission handler in PHP (`submit.php`) that stores jobs in SQLite securely (prepared statements).
- JSON API endpoint (`api.php`) that serves job posts with basic server-side filters.
- Student-facing `index.html` with JavaScript search and client-side filters (`assets/js/main.js`).
- DB initialization helper (`db/init_db.php`) — creates the SQLite database and table if missing.

## Requirements
- PHP 7.4+ with PDO SQLite enabled (most PHP distributions include this).

## Quick start (Windows PowerShell)

1. Open PowerShell in the project folder:

```powershell
cd 'C:\Users\223045756\Documents\community-job-board'
```

2. (Optional) Initialize database (it will also auto-initialize on first submit or API call):

```powershell
php db/init_db.php
```

3. Start PHP's built-in web server:

```powershell
php -S localhost:8000 -t .
```

4. Open in a browser:
- Employer submission form: http://localhost:8000/employer.php
- Student search UI: http://localhost:8000/index.html

## Notes
- This is a minimal, local-friendly demo. For production use, switch to a proper RDBMS (MySQL/Postgres), add authentication, CSRF protection, input sanitization, file upload handling, and rate limiting.
