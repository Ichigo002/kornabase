const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Upewnij się, że ścieżka jest poprawna

// Trasa do pobierania wszystkich urządzeń
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM urzadzenia'; // Zapytanie do bazy danych

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Błąd podczas pobierania urządzeń:', err);
            return res.status(500).json({ message: 'Błąd serwera' });
        }

        // Zwracamy wyniki w formacie JSON
        res.json(results);
    });
});

// Trasa do pobierania urządzenia po ID
router.get('/:id', (req, res) => {
    const { id } = req.params; // Pobieramy ID urządzenia z parametru URL
    const sql = 'SELECT * FROM urzadzenia WHERE id = ?';

    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('❌ Błąd podczas pobierania urządzenia:', err);
            return res.status(500).json({ message: 'Błąd serwera' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Urządzenie nie znalezione' });
        }

        // Zwracamy dane urządzenia
        res.json(results[0]);
    });
});

module.exports = router;
