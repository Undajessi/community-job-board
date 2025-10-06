-- db/seed.sql
-- Sample seed data for the jobs table. Import with sqlite3 or run via a DB client.

BEGIN TRANSACTION;
INSERT INTO jobs (title, company, location, type, description) VALUES
('Frontend Developer', 'Community Co', 'Remote', 'Full-time', 'Build UI features for our platform.'),
('Part-time Library Assistant', 'Town Library', 'Springfield', 'Part-time', 'Assist patrons and manage inventory.'),
('Summer Intern - Data', 'EduStart', 'Remote', 'Internship', 'Work with data pipelines and reporting.'),
('Contract Designer', 'Creative Studio', 'Downtown', 'Contract', 'Short-term contract for design work.');

COMMIT;
