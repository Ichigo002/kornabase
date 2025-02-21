const connection = require('./db');

const createTablesUrzadzenia = `
CREATE TABLE IF NOT EXISTS urzadzenia (
    id INT(11) NOT NULL AUTO_INCREMENT,
    uwiw TEXT NOT NULL,
    kategoria TEXT NOT NULL,
    sala TEXT NOT NULL,
    lpwsali TEXT NOT NULL,
    model TEXT NOT NULL,
    wyglad TEXT NOT NULL,
    procesor TEXT NOT NULL,
    ram TEXT NOT NULL,
    plyta TEXT NOT NULL,
    dysk TEXT NOT NULL,
    przekatna TEXT NOT NULL,
    mac TEXT NOT NULL,
    licencje TEXT NOT NULL,
    inne TEXT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin2;
`;

const createTablesUzytkownicy = `
CREATE TABLE IF NOT EXISTS uzytkownicy (
    id INT(9) NOT NULL AUTO_INCREMENT,
    login TEXT NOT NULL,
    imie TEXT NOT NULL,
    nazwisko TEXT NOT NULL,
    ranga TEXT NOT NULL,
    has TEXT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin2;
`;

const createTablesWydarzenia = `
CREATE TABLE IF NOT EXISTS wydarzenia (
    id INT(11) NOT NULL AUTO_INCREMENT,
    id_urzadzenia INT(11) NOT NULL,
    data DATE DEFAULT NULL,
    typ_wydarzenia TEXT NOT NULL,
    opis TEXT NOT NULL,
    status TEXT NOT NULL,
    ip TEXT,
    user TEXT,
    dataczas DATETIME DEFAULT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_urzadzenia) REFERENCES urzadzenia(id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4243 DEFAULT CHARSET=latin2;
`;

connection.query(createTablesUrzadzenia, (err, results) => {
    if (err) {
        console.error('❌ Błąd tworzenia tabeli urzadzenia:', err);
    } else {
        console.log('✅ Tabela urzadzenia została utworzona lub już istnieje.');
    }

    // Tworzenie kolejnej tabeli
    connection.query(createTablesUzytkownicy, (err, results) => {
        if (err) {
            console.error('❌ Błąd tworzenia tabeli uzytkownicy:', err);
        } else {
            console.log('✅ Tabela uzytkownicy została utworzona lub już istnieje.');
        }

        // Tworzenie ostatniej tabeli
        connection.query(createTablesWydarzenia, (err, results) => {
            if (err) {
                console.error('❌ Błąd tworzenia tabeli wydarzenia:', err);
            } else {
                console.log('✅ Tabela wydarzenia została utworzona lub już istnieje.');
            }

        });
    });
});
