const message = document.getElementById('message');
const list = document.getElementById('tilesList');
const allTiles = Array.from({ length: 40 }, (_, i) => i + 1);
var boardTiles;
var sortedTiles;

const createTile = (index, seasonNum) => {
    const listItem = document.createElement('li');
    const div = document.createElement('div');
    div.className = 'tile';

        div.dataset.sortid = index;
        div.dataset.tileid = seasonNum;

    const img = document.createElement('img');
    img.className = "tile-logo";
    img.src = "logos/" + seasonNum + ".png";

    div.appendChild(img);

    listItem.appendChild(div);
    return listItem;
};

function newGame() {
    allTiles.sort(() => Math.random() - 0.5);
    boardTiles = allTiles.slice(0, 20);
    sortedTiles = boardTiles.map(tile => tile);
    sortedTiles.sort(compareNumbers);

    console.log(boardTiles);
    console.log(sortedTiles);
    boardInit();
}

function compareNumbers(a, b) {
    return a - b;
  }

function boardInit() {
    message.innerHTML = '';
    list.innerHTML = '';

    boardTiles.forEach((tile, i) => {
        const tileDiv = createTile(i, tile);
        list.appendChild(tileDiv);
    });
}

newGame();
document.getElementById('checkWinButton').addEventListener('click', checkWin);
document.getElementById('resetButton').addEventListener('click', boardInit);
document.getElementById('newGameButton').addEventListener('click', newGame);

function checkWin() {
    message.textContent = '';
    var win = true;

    var tileNum = 0;
    document.querySelectorAll('#tilesList .tile').forEach(tile => {
        console.log(tile);
        //var tile = slot.querySelector('.tile');

        //tile.textContent += tile.dataset.tileid;


        if (tileNum != sortedTiles.indexOf(parseInt(tile.dataset.tileid))) {
            tile.classList.add('incorrect');
            win = false;
        }
        else {
            tile.classList.add('correct');
        }
        tileNum++;
    });

    if (win) {
        message.textContent = 'Congratulations!';
    }
    else {
        message.textContent = 'WRONG!';
    }
}


/* JavaScript */
function onClickMenu() {
    document.getElementById("menu").classList.toggle("change");
    document.getElementById("nav").classList.toggle("change");
}

const sortable = new Draggable.Sortable(document.querySelectorAll('.tiles'), {
    draggable: 'li',
    mirror: {
        constrainDimensions: true,
    },
    plugins: [Draggable.Plugins.SortAnimation],
    swapAnimation: {
      duration: 200,
      easingFunction: 'ease-in-out',
    },
  });
// JavaScript
// document.getElementById('start-game-button').addEventListener('click', function() {
//     document.getElementById('splash-page').classList.add('hide');
// });