const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // serve CSS, JS, etc.

// Initialize SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) return console.error(err.message);
  console.log('Connected to SQLite database.');
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)`);

// Handle signup POST request
app.post('/signup', (req, res) => {
  const { fullname, email, username, password } = req.body;
  const sql = `INSERT INTO users (fullname, email, username, password) VALUES (?, ?, ?, ?)`;
  db.run(sql, [fullname, email, username, password], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(400).json({ error: 'User already exists or invalid data.' });
    }
    res.json({ message: 'Signup successful', userId: this.lastID });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
