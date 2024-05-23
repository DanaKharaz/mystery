'use strict';

/** TOOLBAR **/

/* OPEN & CLOSE */
const toolbarBtn = document.querySelector('#toolbar-btn');
const toolbarBtnImg = document.querySelector('#toolbar-btn-img');
const toolbarContainer = document.querySelector('#toolbar-container');
let toolbarIsOpen = true;
toolbarBtn.addEventListener('click', toolbarBtnOnClick);
function toolbarBtnOnClick(event) {
    if (toolbarIsOpen) {
        toolbarContainer.classList.remove('opening-toolbar');
        toolbarContainer.classList.add('closing-toolbar');
        toolbarBtnImg.src = 'icons/toolbar_open.svg';
        
    } else {
        toolbarContainer.classList.remove('closing-toolbar');
        toolbarContainer.classList.add('opening-toolbar');
        toolbarBtnImg.src = 'icons/toolbar_close.svg';
    }
    toolbarIsOpen = !toolbarIsOpen;
}

/* PAUSE & UNPAUSE */
const pauseBtn = document.querySelector('#pause-btn');
let isPaused = false;
const pauseScreen = document.querySelector('#pause-screen-hidden');
pauseBtn.addEventListener('click', pauseBtnOnClick);
function pauseBtnOnClick(event) {
    if (isPaused) {
        pauseBtn.src = 'icons/pause_btn.svg';
        pauseScreen.id = 'pause-screen-hidden';
    } else {
        pauseBtn.src = 'icons/play_btn.svg';
        pauseScreen.id = 'pause-screen-shown';
    }
    minigame.contentWindow.postMessage('pause-clicked', "*");
    isPaused = !isPaused;
}

/* PAUSE SCREEN CANVAS */
// TODO !!!

/* SOUND */
const soundBtn = document.querySelector('#sound-btn');
let isMuted = false;
soundBtn.addEventListener('click', soundBtnClick);
function soundBtnClick(event) {
    if (isMuted) {
        soundBtn.src = 'icons/sound_on_btn.svg';
        // TODO : turn the sound on - volume
    } else {
        soundBtn.src = 'icons/sound_off_btn.svg';
        // TODO : turn the sound off - volume
    }
    isMuted = !isMuted;
}

/* INFO */
const infoBtn = document.querySelector('#info-btn');
const sidePanel = document.querySelector('#side-panel');
let infoPanelShown = false;
infoBtn.addEventListener('click', infoBtnOnClick);
async function infoBtnOnClick(event) {
    // TODO : display a small side window with info about how to play (no hints!) and sound/reference info (?) - for refs make small sep html page (new tab)??

    // hide hint panel, in case it is shown
    if (hintPanelShown) {
        sidePanel.classList.remove('opening-side-panel');
        sidePanel.classList.add('closing-side-panel');
        hintPanelShown = false;
        await delay(1100); // wait for animation to end
    }

    // show or hide info panel
    if (infoPanelShown) {
        sidePanel.classList.remove('opening-side-panel');
        sidePanel.classList.add('closing-side-panel');
    } else {
        // set correct text to panel
        switch(currGame) { // TODO : arrange in proper order (for readability) // using innerHTML : a) for appearane (italics, bold); b) data not editable by user
            case 'scream':
                // TODO
                sidePanel.innerHTML = '<b>game rules</b>: ???<br><br><b>references</b>: Scream<br><br><b>music</b>: ???';
                break;
            case 'film':
                // TODO
                let references = '';
                filmsIncl.sort();
                for (let i = 0; i < 12; i++) references += '<i>' + filmsIncl[i].slice(0, -6) + '</i>' + filmsIncl[i].slice(-6) + ', <br>';
                references = references.slice(0, -6);
                sidePanel.innerHTML = '<b>game rules</b>: each piece of film has a movie scene on the other side, there are 12 pairs of scenes; click on any 2 pieces to temporarily reveal the scenes behind; find all pairs before running out of moves<br><br><b>references</b>:<br>' + references + '<br><br><b>music</b>: ???';
                break;
            case 'blackout':
                // TODO
                sidePanel.innerHTML = '<b>game rules</b>: click on "X" and move the cursor to reveal hidden messages, they will lead you to the next game<br><br><b>references</b>: The Addams Family<br><br><b>music</b>: ???';
                break;
            case 'labyrinth1': // 2d maze
                // TODO
                sidePanel.innerHTML = '<b>game rules</b>: use the arrow keys to move through the maze, make sure to collect all items (white circles) before exiting<br><br><b>reference</b>: <i>Labyrinth</i> (1986)<br><br><b>music</b>: ???';
                break
            case 'labyrinth2': // relativity stairs
                // TODO
                break;
            case 'puzzle':
                // TODO
                sidePanel.innerHTML = '<b>game rules</b>: drag puzzle pieces from the toolbar into the white frame; click and drag to move the pieces within the frame, double click to rotate; when positioned correctly, a piece will lock in place<br><br><b>music</b>: <i>Wicked Game</i> by Chris Isaak';
            default: // before the game starts
                // TODO
        }

        sidePanel.classList.remove('closing-side-panel');
        sidePanel.classList.add('opening-side-panel');
    }
    infoPanelShown = !infoPanelShown;
}

/* HINTS */
let hints = 3;
let hintGiven = false; // can see the same hint all throughout the minigame, updates to false when game changed
let hintPanelShown = false;
const hintBtn = document.querySelector('#hint-btn');
const hintTooltip = document.querySelector('#hint-tooltip');
hintBtn.addEventListener('click', hintBtnOnClick);
async function hintBtnOnClick(event) {
    // hide info panel, in case it is shown
    if (infoPanelShown) {
        sidePanel.classList.remove('opening-side-panel');
        sidePanel.classList.add('closing-side-panel');
        infoPanelShown = false;
        await delay(1100); // wait for animation to end
    }

    // show or hide hint panel
    if (hintPanelShown) {
        sidePanel.classList.remove('opening-side-panel');
        sidePanel.classList.add('closing-side-panel');
    } else {
        if (hints === 0) {
            sidePanel.textContent = 'you have no hints left :(';
        } else {
            hintGiven = true;
            hintTooltip.textContent = 'hints left: ' + (hints - 1)
            switch(currGame) {
                case 'scream':
                    // TODO
                    break;
                case 'labyrinth1':
                    sidePanel.textContent = 'to start the game click the "Tab" key, afterwards simply move through the maze';
                    break;
                case 'blackout':
                    sidePanel.textContent = 'they are always listening...';
                    break;
                default: // for all game that don't have hints
                    sidePanel.textContent = 'this game is completely trick-free! so do not waste you hints :)';
                    // no hint actially given here, so not decreasing hint number
                    hintGiven = false;
                    hintTooltip.textContent = 'hints left: ' + hints;
            }
        }

        sidePanel.classList.remove('closing-side-panel');
        sidePanel.classList.add('opening-side-panel');
    }
    hintPanelShown = !hintPanelShown;
}

/* PUZZLE PIECES */
let piecesShown;
if (sessionStorage.getItem('piecesShown')) piecesShown = sessionStorage.getItem('piecesShown'); // in case of refreshing page
else piecesShown = 0; // will be revealed as the games are completed

// arrange puzzle pieces in a random order in toolbar and hide all of them for now
const puzzlePieces = Array.from(document.querySelectorAll('.puzzle-piece'));
const puzzlePiecesUse = Array.from(document.querySelectorAll('.puzzle-piece-use'));
let piecesRotation = new Array(48); // number of ccw 90deg rotations (0, 1, 2, 3)

let pieceOrder = [];
if (sessionStorage.getItem('puzzleBg')) { // retrieve order and transformations (rotation)
    pieceOrder = sessionStorage.getItem('puzzleBg').split(';'); // order of shuffled array
    piecesRotation = sessionStorage.getItem('puzzleRot').split(';'); // array of rotation values
    
    for (let i = 0; i < pieceOrder.length; i++) { // convert to integers for mathematical operations later
        pieceOrder[i] = parseInt(pieceOrder[i]);
        piecesRotation[pieceOrder[i] - 1] = parseInt(piecesRotation[pieceOrder[i] - 1]);
    }
}
else {
    for (let i = 0; i < puzzlePieces.length; i++) {
        let k;
        do {
            k = Math.floor(Math.random()*puzzlePieces.length) + 1; // '+1' as images are numbered from 1, not 0
        } while (pieceOrder.includes(k - 1));
        pieceOrder.push(k - 1);

        const r = Math.floor(Math.random()*4);
        piecesRotation[k - 1] = r;
    }
    
    sessionStorage.setItem('puzzleBg', pieceOrder.join(';'));
    sessionStorage.setItem('puzzleRot', piecesRotation.join(';'));
}

for (let i = 0; i < puzzlePieces.length; i++) { // set backgrounds and rotations
    puzzlePieces[i].style.backgroundImage = 'url(puzzle_res/' + (pieceOrder[i] + 1) + '.png)';
    puzzlePieces[i].style.transform = 'translateY(0.4em) rotate(' + (piecesRotation[pieceOrder[i]]*90) + 'deg)'; // translateY to not lose initial placement
}

// in case of refreshing, show needed number of pieces
for (let i = 0; i < piecesShown; i++) puzzlePieces[i].classList.remove('puzzle-piece-hidden');

/* SOLVING PUZZLE */
function puzzleGame() {
    // reveal puzzle grid
    const puzzleGrid = document.querySelector('#puzzle-grid');
    puzzleGrid.style.display = 'initial';

    puzzleGrid.classList.add('puzzle-grid-start');

    // piece sizes depend on window height
    const frac = window.innerHeight*0.75/1080;
    const h = frac*275 + 'px';
    const centerX = (frac*(719.5 - 137.5)) + 'px';
    const centerY = (frac*(540 - 137.5)) + 'px';

    // drag pieces from toolbar to puzzle grid
    const playablePieces = []; // indexes of pieces dropped into grid
    let draggedPiece;
    let pieceZ = 1;
    for (let i = 0; i < 48; i++) {puzzlePieces[i].addEventListener('dragstart', startDraggingPiece);}
    function startDraggingPiece(event) {
        //remove transluscent image near cursor when dragging (rotation otherwise, showing correct piece orientation when dragging)
        const img = new Image();
        event.dataTransfer.setDragImage(img, 0, 0);

        draggedPiece = event.target;
        draggedPiece.style.cursor = 'draging';
    }
    puzzleGrid.addEventListener('dragover', (event) => event.preventDefault(), false);
    puzzleGrid.addEventListener('drop', (event) => {
        event.preventDefault();

        const i = pieceOrder[puzzlePieces.indexOf(draggedPiece)];

        if (!playablePieces.includes(i)) { // prevent drop of already droppped pieces or already placed pieces (which cannot be moved anymore)
            // reveal piece within grid
            const pieceUse = puzzlePiecesUse[i];
            pieceUse.display = 'inherit';
            pieceUse.style.zIndex = pieceZ;
            pieceZ++;
            pieceUse.style.backgroundImage = 'url(puzzle_res/' + (i + 1) + '.png)';
            pieceUse.style.height = h;
            pieceUse.style.left = centerX;
            pieceUse.style.top = centerY;
            pieceUse.style.transform = 'rotate(' + (piecesRotation[i]*90) + 'deg)'; // keep rotation

            // add 90deg ccw rotation of the piece on double click
            pieceUse.addEventListener('dblclick', (event) => {
                const r = (piecesRotation[i] + 1) % 4;
                piecesRotation[i] = r;
                pieceUse.style.transform = 'rotate(' + (r*90) + 'deg)';
            })
            
            draggedPiece.remove();

            playablePieces.push(i);
        }
    });

    // move pieces inside the puzzle grid
    const ppuPlacements = [[-48, -47], [-48, 131], [-44, 310], [-48, 490], [-44, 673], [-48, 853], [-44, 1031], [-48, 1208],
                           [134, -43], [131, 135], [127, 306], [140, 486], [127, 672], [134, 860], [134, 1032], [140, 1201],
                           [314, -44], [314, 135], [306, 322], [312, 500], [306, 681], [306, 852], [320, 1023], [314, 1201],
                           [494, -44], [493, 135], [493, 307], [484, 493], [484, 673], [492, 844], [492, 1023], [484, 1200],
                           [672, -44], [680, 135], [669, 312], [672, 491], [672, 670], [671, 849], [672, 1028], [672, 1208],
                           [848, -46], [849, 131], [849, 315], [852, 495], [852, 671], [852, 851], [852, 1032], [849, 1210]]; // proper placements for each piece (will be adjusted to window height)

    const piecesPlaced = []; // indexes of already placed pieces
    let offX, offY; // differences between cursor and piece position
    let movingPiece; // element being moved
    let pieceUseIdx = -1; // index of the piece being moved in puzzlePieces
    let isMoving = false;
    const nearFactor = frac*20; // place correctly if moved close enough

    // listeners applied to entire window with if statements within functions
    window.addEventListener('mousedown', startMovingPiece);
    window.addEventListener('mousemove', movePiece);
    window.addEventListener('mouseup', stopMovingPiece);
    function startMovingPiece(event) {
        pieceUseIdx = puzzlePiecesUse.indexOf(event.target);
        if (pieceUseIdx != -1 && playablePieces.includes(pieceUseIdx) && !piecesPlaced.includes(pieceUseIdx)) {
            isMoving = true;
            
            event.target.style.cursor = 'grabbing';

            // determine where withing the pieces the cursor is located (for movePiece)
            const currX = event.target.style.left.slice(0, event.target.style.left.length - 2);
            const currY = event.target.style.top.slice(0, event.target.style.top.length - 2);
            offX = event.clientX - currX;
            offY = event.clientY - currY;

            movingPiece = event.target;
        }
    }
    function movePiece(event) {
        if (isMoving) {
            movingPiece.style.left = (event.clientX - offX) + 'px';
            movingPiece.style.top = (event.clientY - offY) + 'px';
        }
    }
    function stopMovingPiece(event) {
        if (isMoving) {
            // check if the piece is close enough to its true place and correctly rotated
            const currX = movingPiece.style.left.slice(0, movingPiece.style.left.length - 2);
            const currY = movingPiece.style.top.slice(0, movingPiece.style.top.length - 2);
            const trueX = ppuPlacements[pieceUseIdx][1]*frac;
            const trueY = ppuPlacements[pieceUseIdx][0]*frac;
            if (piecesRotation[pieceUseIdx] == 0 && Math.sqrt((trueX - currX)**2 + (trueY - currY)**2) <= nearFactor) { // 'snap' the piece in place, can't be moved anymore
                movingPiece.style.left = trueX + 'px';
                movingPiece.style.top = trueY + 'px';
                movingPiece.style.cursor = 'auto';
                piecesPlaced.push(pieceUseIdx);
                movingPiece.style.zIndex = 0; // show below all active pieces
                if (piecesPlaced.length == 48) {puzzleSolved();}
            } else {movingPiece.style.cursor = 'grab';} // keep it moveable otherwise
            isMoving = false;
        }
    }
    function puzzleSolved() {
        // TODO : finish entire game
        console.log('Puzzle Solved!');

        for (const p of puzzlePiecesUse) p.remove();

        puzzleGrid.style.backgroundImage = 'url(puzzle_res/original.png)';
        puzzleGrid.style.border = '2px solid white';
    }
}

/* ********************************************************************************************** */

/** MINIGAME INSIDE **/

const minigame = document.querySelector('#minigame');
let currGame;
if (sessionStorage.getItem('currGame')) {
    currGame = sessionStorage.getItem('currGame');
    minigame.src = currGame + '.html';
} else {
    sessionStorage.setItem('currGame', 'bat'); // FIXME
    currGame = 'labyrinth'; // FIXME
    minigame.src = 'labyrinth.html'; // FIXME
}

const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));

// different game attributes
const filmsIncl = [];
let pickingFilms = false;

window.addEventListener('message', async function(event) {
    switch(event.data) { // TODO : organize all messages (game transitions and other)
        case 'scream-won':
            gameWon(8);

            // transition between minigames - continue to film
            currGame = 'film';
            transition('film.html');
            sessionStorage.setItem('currGame', 'film');

            break;
        case 'film-won':
            gameWon(8);

            // transition between minigames - continue to blackout
            currGame = 'blackout';
            transition('blackout.html');
            sessionStorage.setItem('currGame', 'blackout');

            break;
        case 'blackout-won':
            gameWon(8);

            // transition between minigames - continue to map
            currGame = 'map';
            transition('map.html');
            sessionStorage.setItem('currGame', 'map');
    
            break;
        case 'map-won':
            gameWon(8);

            // transition between minigames - continue to bat
            currGame = 'bat';
            transition('bat.html');
            sessionStorage.setItem('currGame', 'bat');

            break;
        case 'bat-won':
            gameWon(8);

            // transition between minigames
            currGame = 'labyrinth';
            transition('labyrinth.html');
            sessionStorage.setItem('currGame', 'labyrinth');

            break;
        case 'labyrinth-won':
            gameWon(8);

            // continue to puzzle game : hide iframe and reveal puzzle grid below
            currGame = 'puzzle';
            minigame.style.display = 'none';
            puzzleGame();

            break;
        case 'picking-films':
            pickingFilms = !pickingFilms;
            break;

        // TODO : the rest of cases

        default:
            if (pickingFilms) {filmsIncl.push(event.data);}
    }
});
function gameWon(n) {
    // puzzle pieces
    updateProgress(n);

    // hints
    if (hintGiven) hints--;
    hintGiven = false;

    // hide info panel, in case it is open
    sidePanel.classList.remove('opening-side-panel');
    if (infoPanelShown || hintPanelShown) sidePanel.classList.add('closing-side-panel');
    infoPanelShown = false;
    hintPanelShown = false;
}
async function transition(nextGame) {
    minigame.classList.remove('transition-game-in');
    minigame.classList.add('transition-game-out');
    await delay(750); // wait for transition to end
    minigame.src = nextGame;
    minigame.classList.remove('transtion-game-out');
    minigame.classList.add('transition-game-in');
    await delay(750); // wait for transition to end
}
async function updateProgress(n) {
    // TODO
    for (let i = piecesShown; i < piecesShown + n; i++) { // FIXME : adding 8 pieces
        puzzlePieces[i].classList.remove('puzzle-piece-hidden');
        await delay(200); // show one by one
    }
    piecesShown += n;
    sessionStorage.setItem('piecesShown', piecesShown);
}