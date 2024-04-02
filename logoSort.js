const message = document.getElementById('message');
const list = document.getElementById('tilesList');
const allTiles = Array.from({ length: 40 }, (_, i) => i + 1);
const episodeTiles = [7,29,5,26,1,28,14,9,32,4,35,11,13,19,12,18,23,37,31,34];

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

function getBoardTilesFromShareId(regenerate = false) {
    var params = new URLSearchParams(window.location.search);
    var base64 = params.get('shareId');
    if (base64 && !regenerate) {
        try {
            return convertBase64ToBoardTiles(base64);
        } catch (error) {
            console.error('Failed to retrieve game board from url', error);
            allTiles.sort(() => Math.random() - 0.5);
            return allTiles.slice(0, 20);
        }
    } else {
        allTiles.sort(() => Math.random() - 0.5);
        return allTiles.slice(0, 20);
    }
}

function newGame(isNewGame = false) {
    boardTiles = getBoardTilesFromShareId();
    sortedTiles = boardTiles.map(tile => tile);
    sortedTiles.sort(compareNumbers);

    boardInit();
}

function compareNumbers(a, b) {
    return a - b;
  }

function boardInit() {
    list.innerHTML = '';

    boardTiles.forEach((tile, i) => {
        const tileDiv = createTile(i, tile);
        list.appendChild(tileDiv);
    });
}

function startEpisodeGame() {
    boardTiles = episodeTiles.map(tile => tile);
    sortedTiles = boardTiles.map(tile => tile);
    sortedTiles.sort(compareNumbers);
    boardInit();
}

newGame();
document.getElementById('checkWinButton').addEventListener('click', checkWin);
document.getElementById('resetButton').addEventListener('click', startEpisodeGame);
document.getElementById('newGameButton').addEventListener('click', function(){ newGame(true)});
document.getElementById('shareButton').addEventListener('click', shareGame);

function checkWin() {
    //message.textContent = '';
    var win = true;

    var tileNum = 0;
    document.querySelectorAll('#tilesList .tile').forEach(tile => {
        const span = document.createElement('div');
        span.innerHTML = (sortedTiles.indexOf(parseInt(tile.dataset.tileid)) + 1) + "<br>Season: " + tile.dataset.tileid;

        if (tileNum != sortedTiles.indexOf(parseInt(tile.dataset.tileid))) {
            span.className = 'answer-details incorrect';

            win = false;
        }
        else {
            span.className = 'answer-details correct';

        }

        tile.appendChild(span);
        
        tileNum++;
    });

    if (win) {
        //message.textContent = 'Congratulations!';
    }
    else {
        //message.textContent = 'WRONG!';
    }

    var card = document.getElementById('card');
    var closeButton = document.getElementById('closeButton');
    var modalBackground = document.getElementById('modalBackground');

    card.classList.add('show');
    modalBackground.style.display = 'block';

    closeButton.onclick = function() {
        card.classList.remove('show');
        modalBackground.style.display = 'none';
    };
}

function shareGame() {
    console.log(generateShareLink());
}

/* JavaScript */
function generateShareLink() {
    var base64 = convertBoardTilesToBase64();
    var params = new URLSearchParams(window.location.search);
    params.set('shareId', base64);
    return window.location.origin + window.location.pathname + '?' + params.toString();
}

/* JavaScript */
function convertBoardTilesToBase64() {
    var json = JSON.stringify(boardTiles);
    var base64 = btoa(unescape(encodeURIComponent(json)));
    return base64;
}

function convertBase64ToBoardTiles(base64) {
    var json = decodeURIComponent(escape(atob(base64)));
    var boardTiles = JSON.parse(json);
    return boardTiles.map(Number); // Convert elements to numbers
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