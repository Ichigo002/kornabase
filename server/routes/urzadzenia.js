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

// Trasa do wstawiania nowego urządzenia
router.post('/', (req, res) => {
    const { uwiw, kategoria, sala, lpwsali, model, wyglad, procesor, ram, plyta, dysk, przekatna, mac, licencje, inne } = req.body;

    // Sprawdzamy tylko wymagane pola (np. te, które są ustawione jako NOT NULL w bazie)
    if (!uwiw || !kategoria || !sala || !lpwsali || !model || !wyglad) {
        return res.status(400).json({ message: 'Wszystkie wymagane pola muszą być wypełnione.' });
    }

    // Przygotowanie zapytania SQL
    const sql = `
        INSERT INTO urzadzenia (uwiw, kategoria, sala, lpwsali, model, wyglad, procesor, ram, plyta, dysk, przekatna, mac, licencje, inne)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Wykonanie zapytania SQL
    connection.query(sql, [uwiw, kategoria, sala, lpwsali, model, wyglad, procesor, ram, plyta, dysk, przekatna, mac, licencje, inne], (err, result) => {
        if (err) {
            console.error('❌ Błąd podczas wstawiania urządzenia:', err);
            return res.status(500).json({ message: 'Błąd serwera.' });
        }

        // Odpowiedź po pomyślnym dodaniu urządzenia
        res.status(201).json({ message: 'Urządzenie zostało dodane pomyślnie!', id: result.insertId });
    });
});

// Trasa do edytowania urządzenia po ID
router.put('/:id', (req, res) => {
    const { id } = req.params; // Pobieramy ID urządzenia z parametru URL
    const {
        uwiw, kategoria, sala, lpwsali, model, wyglad, procesor,
        ram, plyta, dysk, przekatna, mac, licencje, inne
    } = req.body; // Pobieramy dane z ciała zapytania (req.body)

    // Sprawdzamy, czy wszystkie dane zostały przesłane
    if (!uwiw || !kategoria || !sala || !lpwsali || !model || !wyglad || !procesor || 
        !ram || !plyta || !dysk || !przekatna || !mac || !licencje || !inne) {
        return res.status(400).json({ message: 'Wszystkie pola są wymagane.' });
    }

    const sql = `
        UPDATE urzadzenia SET
            uwiw = ?, kategoria = ?, sala = ?, lpwsali = ?, model = ?, wyglad = ?, procesor = ?, 
            ram = ?, plyta = ?, dysk = ?, przekatna = ?, mac = ?, licencje = ?, inne = ?
        WHERE id = ?
    `;
    connection.query(sql, [uwiw, kategoria, sala, lpwsali, model, wyglad, procesor,
                           ram, plyta, dysk, przekatna, mac, licencje, inne, id], (err, result) => {
        if (err) {
            console.error('❌ Błąd podczas edytowania urządzenia:', err);
            return res.status(500).json({ message: 'Błąd serwera' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Urządzenie nie zostało znalezione' });
        }

        // Zwracamy dane zaktualizowanego urządzenia
        res.json({
            id,
            uwiw,
            kategoria,
            sala,
            lpwsali,
            model,
            wyglad,
            procesor,
            ram,
            plyta,
            dysk,
            przekatna,
            mac,
            licencje,
            inne,
            message: 'Urządzenie zostało zaktualizowane'
        });
    });
});



module.exports = router;
