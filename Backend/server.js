const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

// Express server port
const PORT = 5000;

// PostgreSQL connection config (correct port is 5432)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Majora9',
  password: 'Narendra@2005',
  port: 5432, // ✅ Corrected PostgreSQL port
});

// Test DB connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error connecting to DB:', err.stack);
  }
  console.log('✅ Connected to PostgreSQL');
  release();
});

// Initialize Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// GET all students
app.get('/students', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST a new student
app.post('/students', async (req, res) => {
  const { enroll_no, name, dob, enroll_year, email, mobile_no, address } = req.body;
  try {
    await pool.query(
      `INSERT INTO students (enroll_no, name, dob, enroll_year, email, mobile_no, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [enroll_no, name, dob, enroll_year, email, mobile_no, address]
    );
    res.status(201).send('✅ Student added successfully');
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).send('Error inserting student');
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
