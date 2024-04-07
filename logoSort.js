const message = document.getElementById('message');
const list = document.getElementById('tilesList');
const allTiles = Array.from({ length: 40 }, (_, i) => i + 1);
const journeyTiles = [7, 29, 5, 26, 1, 28, 14, 9, 32, 4, 35, 11, 13, 19, 12, 18, 23, 37, 31, 34];

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

function getBoardTilesFromShareId(numTiles, regenerate = false) {
    var params = new URLSearchParams(window.location.search);
    var base64 = params.get('shareId');
    if (base64 && !regenerate) {
        try {
            return convertBase64ToBoardTiles(base64);
        } catch (error) {
            console.error('Failed to retrieve game board from url', error);
            allTiles.sort(() => Math.random() - 0.5);
            return allTiles.slice(0, numTiles);
        }
    } else {
        allTiles.sort(() => Math.random() - 0.5);
        return allTiles.slice(0, numTiles);
    }
}

function startNewGame(numTiles, isNewGame = false) {
    boardTiles = getBoardTilesFromShareId(numTiles, isNewGame);
    sortedTiles = boardTiles.map(tile => tile);
    sortedTiles.sort(compareNumbers);
    boardInit();
}

function startJourneyGame() {
    boardTiles = journeyTiles.map(tile => tile);
    sortedTiles = boardTiles.map(tile => tile);
    sortedTiles.sort(compareNumbers);
    boardInit();
}

function compareNumbers(a, b) {
    return a - b;
}

function boardInit() {
    list.innerHTML = '';

    var checkWinButton = document.getElementById('checkWinButton');
    checkWinButton.disabled = false;
    checkWinButton.addEventListener('click', checkWin);

    boardTiles.forEach((tile, i) => {
        const tileDiv = createTile(i, tile);
        tileDiv.classList.add('unselectable');
        list.appendChild(tileDiv);
    });

    if (boardTiles.length === 9) {
        document.getElementById('tilesList').classList.add('three-by-three');
    }
    else {  
        document.getElementById('tilesList').classList.remove('three-by-three');
    }

    document.querySelectorAll('.tile').forEach(function (tile) {
        tile.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        });
    });
}

function openHelpModal() {
    var card = document.getElementById('howToCard');
    var closeButton = document.getElementById('howToCloseButton');
    var modalBackground = document.getElementById('modalBackground');

    card.classList.add('show');
    modalBackground.style.display = 'flex';

    closeButton.onclick = function () {
        card.classList.remove('show');
        modalBackground.style.display = 'none';
    };
}
var correctCount = 0;

function checkWin() {
    var win = true;

    var tileNum = 0;
    correctCount = 0;
    document.querySelectorAll('#tilesList .tile').forEach(tile => {
        const span = document.createElement('div');
        span.classList.add('answer-details');
        span.innerHTML = (sortedTiles.indexOf(parseInt(tile.dataset.tileid)) + 1) + "<br>Season: " + tile.dataset.tileid;

        if (tileNum != sortedTiles.indexOf(parseInt(tile.dataset.tileid))) {
            span.classList.add('incorrect');
            win = false;
        }
        else {
            span.classList.add('correct');
            correctCount++;
        }

        tile.appendChild(span);

        tileNum++;
    });

    var checkWinButton = document.getElementById('checkWinButton');
    checkWinButton.disabled = true;
    checkWinButton.removeEventListener('click', checkWin);

    document.getElementById('generateLinkButton').removeEventListener('click', shareGame);
    document.getElementById('generateLinkButton').addEventListener('click', shareGame);

    setTimeout(function () {
        var card = document.getElementById('resultsCard');
        var closeButton = document.getElementById('closeButton');
        var modalBackground = document.getElementById('modalBackground');
        var score = document.getElementById('score');
        var resultText = document.getElementById('resultText');

        if (correctCount == boardTiles.length) {
            resultText.innerHTML = '🎉You win!🎉<br>Congratulations!';
        }
        else {
            resultText.innerHTML = 'Sorry, you didn\'t dig deep enough.<br>😔<br>Try again!';
        }

        score.textContent = correctCount + ' / ' + boardTiles.length;

        card.classList.add('show');
        modalBackground.style.display = 'flex';

        closeButton.onclick = function () {
            card.classList.remove('show');
            modalBackground.style.display = 'none';
        };
    }, 500);
}

function shareGame() {
    var scoreText = "I scored " + correctCount + "/" + boardTiles.length + " on the Season Sorting Challenge on Outwit Games";

    if (navigator.share) {
        navigator.share({
            title: 'Outwit🔥Games - Season Sorting Challenge',
            text: scoreText,
            url: generateShareLink(),
        }).catch((err) => {
            document.getElementById('copyOutcome').textContent = 'Could not share message';
        });
    } else {
        scoreText += "\n\nPlay here: " + generateShareLink();
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(scoreText).then(function () {
            document.getElementById('copyOutcome').textContent = 'Share message copied to Clipboard!';
        }, function (err) {
            document.getElementById('copyOutcome').textContent = 'Could not copy message to clipboard';
        });
    }
}

function generateShareLink() {
    var base64 = convertBoardTilesToBase64();
    var params = new URLSearchParams(window.location.search);
    params.set('shareId', base64);
    return window.location.origin + window.location.pathname + '?' + params.toString();
}

function convertBoardTilesToBase64() {
    var json = JSON.stringify(boardTiles);
    var base64 = btoa(unescape(encodeURIComponent(json)));
    return base64;
}

function convertBase64ToBoardTiles(base64) {
    var json = decodeURIComponent(escape(atob(base64)));
    var boardTiles = JSON.parse(json);
    return boardTiles.map(Number);
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

let mirror = false;

sortable.on("mirror:create", (e) => {
    if (mirror) {
        e.cancel();
        return;
    }
    mirror = true;
});

sortable.on("mirror:destroy", () => {
    mirror = false
})


function clickPlay(numTiles, newGame = false) {
    startNewGame(numTiles, newGame);
    hideSplash();
}

function clickJourney() {
    startJourneyGame();
    hideSplash();
}

function clickNewGame() {
    removeShareIdFromUrl();
    showSplash();
}

function hideSplash() {
    document.getElementById('splash-page').classList.add('hide');
    document.getElementById('splash-page').classList.remove('show');
}

function showSplash() {
    showHideShareItems();
    document.getElementById('splash-page').classList.add('show');
    document.getElementById('splash-page').classList.remove('hide');
}

function removeShareIdFromUrl() {
    let url = new URL(window.location.href);
    url.searchParams.delete('shareId');
    window.history.replaceState({}, document.title, url.toString());
}

document.addEventListener('DOMContentLoaded', function () {
    showHideShareItems();
});

function showHideShareItems(){
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('shareId')) {
        document.getElementById('start-shared-game-button').style.display = '';
        document.getElementById('share-list-item').style.display = '';
    }
    else{
        document.getElementById('start-shared-game-button').style.display = 'none';
        document.getElementById('share-list-item').style.display = 'none';
    }
}



document.getElementById('start-shared-game-button').addEventListener('click', function () { clickPlay(20, false) });
document.getElementById('start-normal-game-button').addEventListener('click', function () { clickPlay(20, true) });
document.getElementById('start-easy-game-button').addEventListener('click', function () { clickPlay(9, true) });
document.getElementById('start-journey-button').addEventListener('click', clickJourney);
document.getElementById('checkWinButton').addEventListener('click', checkWin);
document.getElementById('newGameButton').addEventListener('click', clickNewGame);
document.getElementById('helpButton').addEventListener('click', openHelpModal);
