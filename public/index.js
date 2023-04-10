console.log("linked");

const $body = $(`body`);
const $container = $(`.container`);

$(document).ready(function () {
  createInput();
});

function createInput() {
  let $genre = createGenres();
  $container.append($genre);
}

//Create Genre Select
function createGenres() {
  let $select = $(`<select id="genres"></select>`);

  //Get genre list from API
  fetch(`api/genres`, (data) => {
    data.forEach((result) => {
      let $option = $(`<option value=${data.id}>${data.genreName}</option>`);
      $select.append($option);
    });
  });

  return $select;
}

//Create Console Select
function createConsoles() {}
