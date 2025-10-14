const express = require('express');
const sql = require('mssql');
const app = express();

const config = {
  user: 'sa',
  password: 'ulli2023',
  server: 'ULLI_',
  database: 'master',
  options: {
    trustServerCertificate: true
  }
};

app.get('/data', async (req, res) => {
  try {
    await sql.connect(config);
    res.send('Connected to SQL Server successfully!');
  } catch (err) {
    res.status(500).send('Database connection failed: ' + err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));