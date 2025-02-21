const express = require('express');
const cors = require('cors');
const connection = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Obsługa JSON
app.use(cors()); // Obsługa CORS

// Importowanie tras
const urzadzeniaRoutes = require('./routes/urzadzenia');
const uzytkownicyRoutes = require('./routes/uzytkownicy');
const wydarzeniaRoutes = require('./routes/wydarzenia');

app.use('/api/urzadzenia', urzadzeniaRoutes);
app.use('/api/uzytkownicy', uzytkownicyRoutes);
app.use('/api/wydarzenia', wydarzeniaRoutes);

// Start serwera
app.listen(PORT, () => {
    console.log(`🚀 Serwer działa na http://localhost:${PORT}`);
});
