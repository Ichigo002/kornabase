const express = require('express');
const router = express.Router();
const connection = require('../config/db'); // Upewnij się, że ścieżka jest poprawna

// Trasa do pobierania wszystkich wydarzeń
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM wydarzenia'; // Zapytanie do bazy danych

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('❌ Błąd podczas pobierania wydarzeń:', err);
            return res.status(500).json({ message: 'Błąd serwera' });
        }

        // Zwracamy wyniki w formacie JSON
        res.json(results);
    });
});

// Trasa do pobierania wydarzenia po ID
router.get('/:id', (req, res) => {
    const { id } = req.params; // Pobieramy ID wydarzenia z parametru URL
    const sql = 'SELECT * FROM wydarzenia WHERE id = ?';

    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('❌ Błąd podczas pobierania wydarzenia:', err);
            return res.status(500).json({ message: 'Błąd serwera' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Wydarzenie nie znalezione' });
        }

        // Zwracamy dane wydarzenia
        res.json(results[0]);
    });
});

// Trasa do wstawiania nowego wydarzenia
router.post('/', (req, res) => {
    const { id_urzadzenia, data, typ_wydarzenia, opis, status, ip, user, dataczas } = req.body;

    // Sprawdzamy, czy wszystkie wymagane pola zostały dostarczone
    if (!id_urzadzenia || !typ_wydarzenia || !opis || !status) {
        return res.status(400).json({ message: 'Wszystkie wymagane pola muszą być wypełnione.' });
    }

    // Przygotowanie zapytania SQL
    const sql = `
        INSERT INTO wydarzenia (id_urzadzenia, data, typ_wydarzenia, opis, status, ip, user, dataczas)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Wykonanie zapytania SQL
    connection.query(sql, [id_urzadzenia, data, typ_wydarzenia, opis, status, ip, user, dataczas], (err, result) => {
        if (err) {
            console.error('❌ Błąd podczas wstawiania wydarzenia:', err);
            return res.status(500).json({ message: 'Błąd serwera.' });
        }

        // Odpowiedź po pomyślnym dodaniu wydarzenia
        res.status(201).json({ message: 'Wydarzenie zostało dodane pomyślnie!', id: result.insertId });
    });
});

// Trasa do edytowania wydarzenia po ID
router.put('/:id', (req, res) => {
    const { id } = req.params; // Pobieramy ID wydarzenia z parametru URL
    const { id_urzadzenia, data, typ_wydarzenia, opis, status, ip, user, dataczas } = req.body;

    // Sprawdzamy, czy wymagane pola zostały dostarczone
    if (!id_urzadzenia || !typ_wydarzenia || !opis || !status) {
        return res.status(400).json({ message: 'Wszystkie wymagane pola muszą być wypełnione.' });
    }

    const sql = `
        UPDATE wydarzenia SET
            id_urzadzenia = ?, data = ?, typ_wydarzenia = ?, opis = ?, status = ?, ip = ?, user = ?, dataczas = ?
        WHERE id = ?
    `;
    connection.query(sql, [id_urzadzenia, data, typ_wydarzenia, opis, status, ip, user, dataczas, id], (err, result) => {
        if (err) {
            console.error('❌ Błąd podczas edytowania wydarzenia:', err);
            return res.status(500).json({ message: 'Błąd serwera' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Wydarzenie nie zostało znalezione' });
        }

        // Zwracamy dane zaktualizowanego wydarzenia
        res.json({
            id,
            id_urzadzenia,
            data,
            typ_wydarzenia,
            opis,
            status,
            ip,
            user,
            dataczas,
            message: 'Wydarzenie zostało zaktualizowane'
        });
    });
});

// DELETE - Usuwanie wydarzenia
router.delete('/:id', (req, res) => {
    const { id } = req.params; // Pobieramy ID wydarzenia z parametru URL

    // Zapytanie SQL do usunięcia wydarzenia na podstawie ID
    const sql = 'DELETE FROM wydarzenia WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('❌ Błąd podczas usuwania wydarzenia:', err);
            return res.status(500).json({ message: 'Błąd serwera.' });
        }

        // Jeśli żadna linia nie została usunięta, to oznacza, że wydarzenie o danym ID nie istnieje
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Wydarzenie nie zostało znalezione.' });
        }

        // Odpowiedź po pomyślnym usunięciu wydarzenia
        res.json({ message: 'Wydarzenie zostało usunięte pomyślnie!' });
    });
});

module.exports = router;
