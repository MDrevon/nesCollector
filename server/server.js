const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const { Client } = require("pg");
const db = new Client({ connectionString: process.env.DATABASE });

db.connect();

//Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("public"));

app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

app.get("/", (req, res) => {
  res.send("Test");
});

app.get("/api/consoles", (req, res) => {
  db.query("SELECT * FROM consoles ORDER BY consoleName ASC", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result.rows);
  });
});

app.get("/api/consoles/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM consoles WHERE id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result.rows);
  });
});

app.get("/api/games", (req, res) => {
  db.query(
    "SELECT games.id, games.gamename, genres.genrename, consoles.consolename FROM games JOIN genres ON genres.id = games.genreid JOIN consoles ON consoles.id = games.consoleid ORDER BY gamename ASC",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result.rows);
    }
  );
});

app.get("/api/games/:consoleId", (req, res) => {
  const consoleId = req.params.consoleId;
  db.query(
    "SELECT * FROM games WHERE consoleId = $1",
    [consoleId],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result.rows);
    }
  );
});

app.get("/api/games/:genreId", (req, res) => {
  const genreId = req.params.genreId;
  db.query(
    "SELECT * FROM games WHERE genreId = $1",
    [genreId],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result.rows);
    }
  );
});

app.get("/api/games/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM games WHERE id = $1", [id], (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result.rows);
  });
});

app.get("/api/games/:name", (req, res) => {
  const name = req.params.name;
  db.query(
    "SELECT * FROM games WHERE gameName LIKE $1",
    [name],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result.rows);
    }
  );
});

app.post("/api/games", (req, res) => {
  const name = req.body.gameName;
  const genre = req.body.genreId;
  const console = req.body.consoleId;

  db.query(
    "INSERT INTO games (gamename, genreid, consoleid) VALUES ($1, $2, $3)",
    [name, genre, console]
  ).then((result) => {
    res.send(result);
  });
  // ,
  // (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.send("Game added");
  // }
});

app.put("/api/games/:id", (req, res) => {
  let name = req.body.name;
  let genre = req.body.genre;
  let console = req.body.console;

  db.query(
    "UPDATE games SET name = $1, genre = $2, console= $3 WHERE id = $4",
    [name, genre, console, req.params.id],
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send("Game Updated");
    }
  );
});

app.get("/api/genres", (req, res) => {
  db.query("SELECT * FROM genres", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result.rows);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
