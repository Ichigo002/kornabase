const mysql = require('mysql2');
require('dotenv').config(); // Obsługuje zmienne z pliku .env

// Tworzenie połączenia z bazą danych
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Łączenie z bazą danych
connection.connect(err => {
    if (err) {
        console.error('❌ Błąd połączenia z MySQL:', err);
        process.exit(1);
    } else {
        console.log('✅ Połączono z bazą danych MySQL');
    }
});

module.exports = connection; // Eksportujemy połączenie
