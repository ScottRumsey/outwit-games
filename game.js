const board = document.getElementById('game-board');
const startArea = document.getElementById('start-area');
const message = document.getElementById('message');
const tiles = Array.from({ length: 20 }, (_, i) => i + 1);
tiles.sort(() => Math.random() - 0.5);

const createDiv = (className, id, eventListeners) => {
    const div = document.createElement('div');
    div.className = className;
    if (id) div.id = id;
    Object.entries(eventListeners).forEach(([event, handler]) => {
        div.addEventListener(event, handler);
    });
    return div;
};

tiles.forEach((tile, i) => {
    const tileDiv = createDiv('tile', 'tile-' + i, {
        dragstart: dragStart,
        dragover: dragOver,
        drop: drop,
        touchstart: touchStart,
        touchmove: touchMove,
        touchend: touchEnd,
    });
    tileDiv.textContent = tile;
    tileDiv.draggable = true;

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
    const slotDiv = createDiv('slot', null, {
        dragover: dragOver,
        drop: drop,
    });
    board.appendChild(slotDiv);
}

function checkWin() {
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i] !== i + 1) {
            return;
        }
    }
    message.textContent = 'Congratulations!';
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
    if (e.target.className === 'tile') {
        let temp = e.target;
        let tempParent = e.target.parentNode;
        let draggedParent = draggedItem.parentNode;

        setTimeout(() => {
            draggedParent.insertBefore(temp, draggedParent.firstChild);
            tempParent.insertBefore(draggedItem, tempParent.firstChild);
        }, 0);
    } else if (e.target.className === 'slot') {
        if (e.target.hasChildNodes()) {
            let temp = e.target.removeChild(e.target.firstChild);
            setTimeout(() => {
                draggedItem.parentNode.insertBefore(temp, draggedItem.parentNode.firstChild);
                e.target.insertBefore(draggedItem, e.target.firstChild);
            }, 0);
        } else {
            e.target.insertBefore(draggedItem, e.target.firstChild);
        }
    }
    checkWin();
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

    draggedItem.style.left = ''; // reset the position
    draggedItem.style.top = '';
    checkWin();
}

