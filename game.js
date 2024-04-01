const board = document.getElementById('game-board');
const startArea = document.getElementById('start-area');
const message = document.getElementById('message');
const allTiles = Array.from({ length: 34 }, (_, i) => i + 1);
var tiles;

const createDiv = (className, num, eventListeners) => {
    const div = document.createElement('div');
    div.className = className;

    if (num) {
        div.id = className + "-" + num;
    }

    Object.entries(eventListeners).forEach(([event, handler]) => {
        div.addEventListener(event, handler);
    });
    return div;
};

function newGame() {
    allTiles.sort(() => Math.random() - 0.5);
    tiles = allTiles.slice(0, 20);
    boardInit();
}

function boardInit() {
    board.innerHTML = '';
    startArea.innerHTML = '';
    message.innerHTML = '';

    tiles.forEach((tile, i) => {
        const tileDiv = createDiv('tile', i, {
            dragstart: dragStart,
            dragover: dragOver,
            drop: drop,
            touchstart: touchStart,
            touchmove: touchMove,
            touchend: touchEnd,
        });
        tileDiv.dataset.tileid = tile;
        tileDiv.draggable = true;

        const img = document.createElement('img');
        img.className = "tile-logo";
        img.src = "logos/" + tile + ".png";

        tileDiv.appendChild(img);


        const slot = createDiv('slot', null, {
            dragover: dragOver,
            drop: drop,
            touchmove: touchMove,
            touchend: touchEnd,
        });
        slot.appendChild(tileDiv);
        startArea.appendChild(slot);
    });

    for (let i = 0; i < 20; i++) {
        const slotDiv = createDiv('slot', i + 1, {
            dragover: dragOver,
            drop: drop,
        });
        slotDiv.dataset.slotid = i + 1;
        board.appendChild(slotDiv);
    }
}

newGame();
document.getElementById('checkWinButton').addEventListener('click', checkWin);
document.getElementById('resetButton').addEventListener('click', boardInit);
document.getElementById('newGameButton').addEventListener('click', newGame);

function checkWin() {
    message.textContent = '';
    var win = true;
    document.querySelectorAll('#game-board .slot').forEach(slot => {
        var tile = slot.querySelector('.tile');

        if (tile == null) {
            win = false;
        }
        else {
            if (slot.dataset.slotid != tile.dataset.tileid) {
                tile.classList.add('incorrect');
                win = false;
            }
            else {
                tile.classList.add('correct');
            }
        }

        if (win) {
            message.textContent = 'Congratulations!';
        }
        else {
            message.textContent = 'WRONG!';
        }
    });
}

let draggedItem = null;

function dragStart(e) {
    draggedItem = this;
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    console.log(e.target.className);
    setTimeout(() => {
        if (e.target.className === 'tile') {
            let temp = e.target;
            let tempParent = e.target.parentNode;
            let draggedParent = draggedItem.parentNode;
            draggedParent.insertBefore(temp, draggedParent.firstChild);
            tempParent.insertBefore(draggedItem, tempParent.firstChild);
        } else if (e.target.className === 'slot') {
            e.target.appendChild(draggedItem);
        }
    }, 0);
}

let activeTouch;

function touchStart(e) {
    activeTouch = e.touches[0];
    draggedItem = this;
}

function touchMove(e) {
    e.preventDefault();
    let touch = e.touches[0];
    draggedItem.style.left = `${touch.pageX - 50}px`;
    draggedItem.style.top = `${touch.pageY - 50}px`;
}

function touchEnd(e) {
    e.stopPropagation();
    let touch = e.changedTouches[0];
    let target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && (target.className === 'slot' || target.className === 'tile')) {
        if (target.className === 'tile') {
            let temp = document.createElement("div");
            target.parentNode.insertBefore(temp, target);
            draggedItem.parentNode.insertBefore(target, draggedItem);
            temp.parentNode.insertBefore(draggedItem, temp);
            temp.parentNode.removeChild(temp);
        } else if (target.className === 'slot') {
            target.appendChild(draggedItem);
        }
    }

    draggedItem.style.left = '';
    draggedItem.style.top = '';
}

/* JavaScript */
function onClickMenu() {
    document.getElementById("menu").classList.toggle("change");
    document.getElementById("nav").classList.toggle("change");
}

// JavaScript
document.getElementById('start-game-button').addEventListener('click', function() {
    document.getElementById('splash-page').classList.add('hide');
});