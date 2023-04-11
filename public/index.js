//console.log("linked");

const $body = $(`body`);
const $container = $(`.container`);

let $main = $(`<div class="columns"></div>`);
$container.append($main);
const $columns = $(`.columns`);

let $submit = $(`<br/><button id="submit" class="button">Submit</button>`);
var consoleId = 0;

$(document).ready(function () {
  //Search Bar goes here
  createPage();
});

async function createPage() {
  await createMenu();
  await createInput();
}

async function createInput() {
  //let $columns = $(`.columns`);
  //let $column = $(`<div class="column"></div>`);
  let $div = $(`<div id="form" class="column"></div>`);
  let $form = $(`<div class="field"></div>`);
  let $gamelabel = $(`<label class="label">Game Name</label>`);
  let $gamename = $(
    `<div class="control"><input class="input" id="gamename"></input></div>`
  );
  let $genrelabel = $(`<label class="label">Genre</label>`);
  let $genre = await createGenres();
  let $consolelabel = $(`<label class="label">Console</label>`);
  let $console = await createConsoles();

  $form.append($gamelabel);
  $form.append($gamename);
  $form.append($genrelabel);
  $form.append($genre);
  $form.append($consolelabel);
  $form.append($console);
  $form.append($submit);
  $div.append($form);
  $columns.append($div);

  await createTable(consoleId);

  // $div.append($gamename);
  // $div.append($genre);
  // $div.append($console);

  //$container.append($div);
  //$aside.append($div);
}

$submit.on("click", function () {
  let gamename = $(`#gamename`).val();
  let genreid = $(`#genres`).val();
  let consoleid = $(`#consoles`).val();

  let gameJson = { gameName: gamename, genreId: genreid, consoleId: consoleid };

  $(`#gamename`).val("");

  //console.log(gameJson);
  //console.log(gamename, genreid, consoleid);

  fetch(`/api/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(gameJson),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));

  redrawTable(consoleId);
});

//Create Genre Select
async function createGenres() {
  let $select = $(`<select class="select" id="genres"></select>`);

  //Get genre list from API
  let results = await fetch(`/api/genres`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
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

  let results = await fetch(`/api/consoles`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
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
  let $form = $(`#form`);
  let $table = $(`<table id="table" class="table is-striped"></table>`);
  let $thead = $(`<thead></thead>`);
  let $game = $(`<th>Game Name</th>`);
  let $genre = $(`<th>Genre</th>`);
  let $console = $(`<th>Console</th>`);
  let $button = $(`<th>Delete</th>`);
  let results;

  $thead.append($game);
  $thead.append($genre);
  $thead.append($console);
  $thead.append($button);
  $table.append($thead);

  if (consoleId === 0) {
    results = await fetch("api/games", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } else {
    results = await fetch(`api/games/console/${consoleId}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
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
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }).then(() => console.log("Deleted"));

      //console.log(gamelist[x].id);
      redrawTable(id);
    });
    $tr.append($gamename);
    $tr.append($genrename);
    $tr.append($consolename);
    $tr.append($delete);
    console.log(x);
    $table.append($tr);
  }
  $form.append($table);
  //console.log($table);
}

async function createMenu() {
  //let $columns = $(`.columns`);
  let $aside = $(`<div class="column is-3 menu is-small"></div>`);
  let $menu = $(`<div class="column"><p class="menu-label">Consoles</p></div>`);
  let $ul = $(`<ul class="menu-list"></ul>`);

  let results = await fetch(`/api/consoles`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  let consoles = await results.json();
  //console.log(genres);

  for (let x = 0; x < consoles.length; x++) {
    let $li = $(`<li><a>${consoles[x].consolename}</a></li>`);
    $li.on("click", () => {
      consoleId = consoles[x].id;
      redrawTable(consoleId);
      console.log(`Clicked ${consoles[x].consolename} `);
    });
    $ul.append($li);
  }
  $menu.append($ul);
  $aside.append($menu);
  //$aside.insertBefore(".container");
  $columns.append($aside);
}

async function redrawTable(id) {
  let $form = $(`#form`);
  let $table = $(`#table`);
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
    results = await fetch("api/games", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  } else {
    results = await fetch(`api/games/console/${consoleId}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
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
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }).then(() => console.log("Deleted"));

      //console.log(gamelist[x].id);
      redrawTable(id);
    });
    $tr.append($gamename);
    $tr.append($genrename);
    $tr.append($consolename);
    $tr.append($delete);
    console.log(x);
    $table.append($tr);
  }
  $form.append($table);
}
