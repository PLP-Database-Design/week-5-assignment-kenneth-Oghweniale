const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Setup middleware
app.use(cors());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database');
    }
});

// 1. Retrieve all patients and display in table
app.get('/', (req, res) => {
    const query = 'SELECT first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.render('index', { patients: results });
    });
});

// 2. Retrieve all providers and display in table
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.render('providers', { providers: results });
    });
});

// 3. Filter patients by first name and display in table
app.get('/patients/:first_name', (req, res) => {
    const query = 'SELECT first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [req.params.first_name], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.render('index', { patients: results });
    });
});

// 4. Retrieve all providers by specialty and display in table
app.get('/providers/specialty/:specialty', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(query, [req.params.specialty], (err, results) => {
        if (err) {
            return res.status(500).send('Server error');
        }
        res.render('providers', { providers: results });
    });
});

// Listen to the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
