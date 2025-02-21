const connection = require('./db');

const createTables = `
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

CREATE TABLE IF NOT EXISTS uzytkownicy (
  id INT(9) NOT NULL AUTO_INCREMENT,
  login TEXT NOT NULL,
  imie TEXT NOT NULL,
  nazwisko TEXT NOT NULL,
  ranga TEXT NOT NULL,
  haslo TEXT NOT NULL,  -- Zmieniłem "has" na "haslo" dla czytelności
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin2;

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

connection.query(createTables, (err, results) => {
    if (err) {
        console.error('❌ Błąd tworzenia tabel:', err);
    } else {
        console.log('✅ Tabele zostały utworzone.');
    }
    connection.end();
});
