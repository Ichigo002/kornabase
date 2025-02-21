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
const urzadzeniaRoutes = require('./routes/urzadzenia');
// const uzytkownicyRoutes = require('./routes/uzytkownicy');
// const wydarzeniaRoutes = require('./routes/wydarzenia');

app.use('/api/devices', urzadzeniaRoutes);
// app.use('/api/uzytkownicy', uzytkownicyRoutes);
// app.use('/api/wydarzenia', wydarzeniaRoutes);

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
