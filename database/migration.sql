DROP TABLE IF EXISTS consoles CASCADE;
DROP TABLE IF EXISTS games CASCADE;
DROP TABLE IF EXISTS genre CASCADE;
DROP TABLE IF EXISTS genres CASCADE;

CREATE TABLE consoles (
    id serial PRIMARY KEY,
    consoleName varchar(255) NOT NULL
);

CREATE TABLE genres (
    id serial PRIMARY KEY,
    genreName varchar(255) NOT NULL
);

CREATE TABLE games (
    id serial PRIMARY KEY,
    gameName varchar(255) NOT NULL,
    genreId int NOT NULL,
    consoleId int NOT NULL,
    FOREIGN KEY (genreId) REFERENCES genres(id),
    FOREIGN KEY (consoleId) REFERENCES consoles(id)
);

