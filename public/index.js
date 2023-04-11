//console.log("linked");

const $body = $(`body`);
const $container = $(`.container`);
let $aside = $(`<aside class="menu is-small"></aside>`);
let $submit = $(`<button id="submit" class="button">Submit</button>`);
var consoleId = 0;

$(document).ready(function () {
  createMenu();
  createInput();
  createTable(consoleId);
});

async function createInput() {
  //let $div = $(`<div class="navbar-end"></div>`);
  let $gamename = $(`<input class="input" id="gamename"></input>`);
  let $genre = await createGenres();
  let $console = await createConsoles();

  $container.append($gamename);
  $container.append($genre);
  $container.append($console);
  $container.append($submit);
  //$aside.append($div);
}

$submit.on("click", function () {
  let gamename = $(`#gamename`).val();
  let genreid = $(`#genres`).val();
  let consoleid = $(`#consoles`).val();

  let gameJson = { gameName: gamename, genreId: genreid, consoleId: consoleid };

  //console.log(gameJson);
  //console.log(gamename, genreid, consoleid);

  fetch(`/api/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(gameJson),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
});

//Create Genre Select
async function createGenres() {
  let $select = $(`<select class="select" id="genres"></select>`);

  //Get genre list from API
  let results = await fetch(`/api/genres`);
  let genres = await results.json();
  //console.log(genres);

  for (let x = 0; x < genres.length; x++) {
    let $option = $(
      `<option value=${genres[x].id}>${genres[x].genrename}</option>`
    );
    $select.append($option);
  }

  return $select;
}

//Create Console Select
async function createConsoles() {
  let $select = $(`<select class="select" id="consoles"></select>`);

  let results = await fetch(`/api/consoles`);
  let consoles = await results.json();
  //console.log(genres);

  for (let x = 0; x < consoles.length; x++) {
    let $option = $(
      `<option value=${consoles[x].id}>${consoles[x].consolename}</option>`
    );
    $select.append($option);
  }

  return $select;
}

//Create Game Table
async function createTable(id) {
  let $table = $(`.table`);
  let $thead = $(`<thead></thead>`);
  let $game = $(`<th>Game Name</th>`);
  let $genre = $(`<th>Genre</th>`);
  let $console = $(`<th>Console</th>`);
  let $button = $(`<th>Delete</th>`);
  let results;

  $table.empty();

  $thead.append($game);
  $thead.append($genre);
  $thead.append($console);
  $thead.append($button);
  $table.append($thead);

  if (consoleId === 0) {
    results = await fetch("api/games");
  } else {
    results = await fetch(`api/games/console/${consoleId}`);
  }

  let gamelist = await results.json();
  //console.log("results:" + results);
  console.log(gamelist);

  for (let x = 0; x < gamelist.length; x++) {
    let $tr = $(`<tr></tr>`);
    let $gamename = $(`<td>${gamelist[x].gamename}</td>`);
    let $genrename = $(`<td>${gamelist[x].genrename}</td>`);
    let $consolename = $(`<td>${gamelist[x].consolename}</td>`);
    let $delete = $(`<button class="delete">Delete</td>`);
    $delete.on("click", () => {
      //Run delete on gameid
      fetch(`/api/games/${gamelist[x].id}`, {
        method: "DELETE",
      }).then(() => console.log("Deleted"));

      //console.log(gamelist[x].id);
      createTable();
    });
    $tr.append($gamename);
    $tr.append($genrename);
    $tr.append($consolename);
    $tr.append($delete);
    console.log(x);
    $table.append($tr);
  }
  //console.log($table);
}

async function createMenu() {
  let $menu = $(`<p class="menu-label">Consoles</p>`);
  let $ul = $(`<ul class="menu-list"></ul>`);

  let results = await fetch(`/api/consoles`);
  let consoles = await results.json();
  //console.log(genres);

  for (let x = 0; x < consoles.length; x++) {
    let $li = $(`<li><a>${consoles[x].consolename}</a></li>`);
    $li.on("click", () => {
      consoleId = consoles[x].id;
      createTable(consoleId);
      console.log(`Clicked ${consoles[x].consolename} `);
    });
    $ul.append($li);
  }
  $menu.append($ul);
  $aside.append($menu);
  $aside.insertBefore(".container");
  //$body.append($aside);
}
