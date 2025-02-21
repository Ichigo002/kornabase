const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Upewnij się, że ścieżka jest poprawna

// Trasa do pobierania wszystkich użytkowników
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM uzytkownicy'; // Zapytanie do bazy danych

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Błąd podczas pobierania użytkowników:', err);
            return res.status(500).json({ message: 'Błąd serwera' });
        }

        // Zwracamy wyniki w formacie JSON
        res.json(results);
    });
});

// Trasa do pobierania użytkownika po ID
router.get('/:id', (req, res) => {
    const { id } = req.params; // Pobieramy ID użytkownika z parametru URL
    const sql = 'SELECT * FROM uzytkownicy WHERE id = ?';

    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('❌ Błąd podczas pobierania użytkownika:', err);
            return res.status(500).json({ message: 'Błąd serwera' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }

        // Zwracamy dane użytkownika
        res.json(results[0]);
    });
});

// Trasa do wstawiania nowego użytkownika (wstawianie bez ID)
router.post('/', (req, res) => {
    const { login, imie, nazwisko, ranga, has } = req.body;

    // Sprawdzamy tylko wymagane pola (np. te, które są ustawione jako NOT NULL w bazie)
    if (!login || !imie || !nazwisko || !ranga || !has) {
        return res.status(400).json({ message: 'Wszystkie wymagane pola muszą być wypełnione.' });
    }

    // Przygotowanie zapytania SQL
    const sql = `
        INSERT INTO uzytkownicy (login, imie, nazwisko, ranga, has)
        VALUES (?, ?, ?, ?, ?)
    `;

    // Wykonanie zapytania SQL
    connection.query(sql, [login, imie, nazwisko, ranga, has], (err, result) => {
        if (err) {
            console.error('❌ Błąd podczas wstawiania użytkownika:', err);
            return res.status(500).json({ message: 'Błąd serwera.' });
        }

        // Odpowiedź po pomyślnym dodaniu użytkownika
        res.status(201).json({ message: 'Użytkownik został dodany pomyślnie!', id: result.insertId });
    });
});

// Trasa do edytowania użytkownika po ID (ID będzie w URL, ale nie w ciele zapytania)
router.put('/:id', (req, res) => {
    const { id } = req.params; // Pobieramy ID użytkownika z parametru URL
    const { login, imie, nazwisko, ranga, has } = req.body; // Pobieramy dane z ciała zapytania (req.body)

    // Sprawdzamy tylko wymagane pola (np. te, które są ustawione jako NOT NULL w bazie)
    if (!login || !imie || !nazwisko || !ranga || !has) {
        return res.status(400).json({ message: 'Wszystkie wymagane pola muszą być wypełnione.' });
    }

    const sql = `
        UPDATE uzytkownicy SET
            login = ?, imie = ?, nazwisko = ?, ranga = ?, has = ?
        WHERE id = ?
    `;

    connection.query(sql, [login, imie, nazwisko, ranga, has, id], (err, result) => {
        if (err) {
            console.error('❌ Błąd podczas edytowania użytkownika:', err);
            return res.status(500).json({ message: 'Błąd serwera' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Użytkownik nie został znaleziony' });
        }

        // Zwracamy dane zaktualizowanego użytkownika
        res.json({
            id,
            login,
            imie,
            nazwisko,
            ranga,
            has,
            message: 'Użytkownik został zaktualizowany'
        });
    });
});


// Trasa do usuwania użytkownika po ID
router.delete('/:id', (req, res) => {
    const { id } = req.params; // Pobieramy ID użytkownika z parametru URL

    // Zapytanie SQL do usunięcia użytkownika na podstawie ID
    const sql = 'DELETE FROM uzytkownicy WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('❌ Błąd podczas usuwania użytkownika:', err);
            return res.status(500).json({ message: 'Błąd serwera.' });
        }

        // Jeśli żadna linia nie została usunięta, to oznacza, że użytkownik o danym ID nie istnieje
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Użytkownik nie został znaleziony.' });
        }

        // Odpowiedź po pomyślnym usunięciu użytkownika
        res.json({ message: 'Użytkownik został usunięty pomyślnie!' });
    });
});

module.exports = router;
