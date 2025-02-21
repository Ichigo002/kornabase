const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importujemy połączenie z db.js
const db = require('./config/db'); // Upewnij się, że ścieżka jest poprawna

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Importowanie tras API
const devicesRoutes = require('./routes/devices');
const eventsRoutes = require('./routes/events');
const usersRoutes = require('./routes/users');

app.use('/api/devices', devicesRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/users', usersRoutes);

// Sprawdzanie, czy baza danych istnieje, i tworzenie, jeśli nie
db.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``, (err, result) => {
    if (err) {
        console.error('❌ Błąd tworzenia bazy danych:', err);
        process.exit(1);
    }
    console.log('✅ Baza danych jest gotowa.');

    // Importujemy plik, który tworzy tabele, jeśli ich nie ma
    require('./config/db-init');

    // Start serwera po przygotowaniu bazy
    app.listen(PORT, () => {
        console.log(`🚀 Serwer działa na http://localhost:${PORT}`);
    });
});
