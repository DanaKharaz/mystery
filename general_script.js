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
    isPaused = !isPaused;
}

/* PAUSE SCREEN CANVAS */
// TO-DO

/* SOUND */
const soundBtn = document.querySelector('#sound-btn');
let isMuted = false;
soundBtn.addEventListener('click', soundBtnClick);
function soundBtnClick(event) {
    if (isMuted) {
        soundBtn.src = 'icons/sound_on_btn.svg';
        // TO-DO : turn the sound on - send message to iframe
        minigame.contentWindow.postMessage('sound-on', "*");
    } else {
        soundBtn.src = 'icons/sound_off_btn.svg';
        // TO-DO : turn the sound off
        minigame.contentWindow.postMessage('sound-off', "*");
    }
    isMuted = !isMuted;
}

/* INFO */
const infoBtn = document.querySelector('#info-btn');
const sidePanel = document.querySelector('#side-panel');
let infoPanelShown = false;
infoBtn.addEventListener('click', infoBtnOnClick);
async function infoBtnOnClick(event) {
    // TO-DO : display a small side window with info about how to play (no hints!) and sound/reference info (?) - for refs make small sep html page (new tab)??

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
        switch(currGame) { // TO-DO : arrange in proper order (for readability)
            case 'film':
                // TO-DO
                let references = '';
                filmsIncl.sort();
                for (let i = 0; i < 12; i++) references += '<i>' + filmsIncl[i].slice(0, -6) + '</i>' + filmsIncl[i].slice(-6) + ', <br>';
                references = references.slice(0, -6);
                sidePanel.innerHTML = '<b>game rules</b>: each piece of film has a movie scene on the other side, there are 12 pairs of scenes; click on any 2 pieces to temporarily reveal the scenes behind; find all pairs before running out of moves<br><br><b>references</b>:<br>' + references + '<br><br><b>music</b>: ???';
                break;
            case 'blackout':
                // TO-DO
                sidePanel.innerHTML = '<b>game rules</b>: click on "X" and move the cursor to reveal hiddent messages that will lead you to the next game<br><br><b>references</b>: The Addams Family<br><br><b>music</b>: ???';
                break;
            case 'labyrinth1': // 2d maze
                // TO-DO
                sidePanel.innerHTML = '<b>game rules</b>: use the arrow keys to move through the maze, make sure to collect all items (white circles) before exiting<br><br><b>reference</b>: <i>Labyrinth</i> (1986)<br><br><b>music</b>: ???';
                break
            case 'labyrinth2': // relativity stairs
                // TO-DO
                break;
            default: // before the game starts
                // TO-DO
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
            // TO-DO : propose a game to get hints
            sidePanel.innerHTML = 'you have no hints left :(<br>click here to win more hints!'
            // TO-DO : click on panel (+ cursor pointer)
        } else {
            hintGiven = true;
            hintTooltip.textContent = 'hints left: ' + (hints - 1)
            switch(currGame) {
                case 'labyrinth1':
                    sidePanel.innerHTML = 'to start the game click the "Tab" key, afterwards simply move through the maze'
                    break;
                default: // for all game that don't have hints
                    sidePanel.innerHTML = 'this game is completely trick-free! so do not waste you hints :)';
                    hintGiven = false; // no hint actially given here
            }
        }

        sidePanel.classList.remove('closing-side-panel');
        sidePanel.classList.add('opening-side-panel');
    }
    hintPanelShown = !hintPanelShown;
}

/* PUZZLE PIECES */
let completed = 0;
// TO-DO : arrange puzzle pieces in a random order in toolbar and hide all of them for now
const puzzlePieces = document.querySelectorAll('.puzzle-piece');
const usedPieces = [];
for (let i = 0; i < puzzlePieces.length; i++) {
    let k;
    do {
        k = Math.floor(Math.random()*puzzlePieces.length) + 1; // '+1' as images are numbered from 1, not 0
    } while (usedPieces.includes(k));
    usedPieces.push(k);
    puzzlePieces[i].style.backgroundImage = 'url(puzzle_res/' + k + '.png)';
    puzzlePieces[i].style.transform = 'translateY(0.4em) rotate(' + Math.floor(Math.random()*4)*90 + 'deg)'; // must repeat 'translate'
}
console.log(usedPieces);

/* ********************************************************************************************** */

/** MINIGAME INSIDE **/

const minigame = document.querySelector('#minigame');
let currGame = 'labyrinth1'; // !!! CHANGE !!!
minigame.src = 'labyrinth.html'; // !!! CHANGE !!!

const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));

// different game attributes
const filmsIncl = [];
let pickingFilms = false;

window.addEventListener('message', async function(event) {
    switch(event.data) { // TO-DO : organize all messages (game transitions and other)
        case 'film-won':
            // continue to blackout !!! FOR NOW !!!
            currGame = 'blackout';
        
            // hide info panel, in case it is open
            infoPanel.classList.remove('opening-info-panel');
            infoPanel.classList.add('closing-info-panel');
            infoPanelShown = false;

            // transition between minigames
            transition('blackout.html');

            // puzzle pieces
            completed++;
            updateProgress();

            // hints
            if (hintGiven) hints--;
            hintGiven = false;

            break;
        case 'picking-films':
            pickingFilms = !pickingFilms;
            break;

        // TO-DO : the rest of cases

        default:
            if (pickingFilms) {filmsIncl.push(event.data);}
    }
});
async function transition(nextGame) {
    minigame.classList.remove('transition-game-in');
    minigame.classList.add('transition-game-out');
    await delay(750); // wait for transition to end
    minigame.src = nextGame;
    minigame.classList.remove('transtion-game-out');
    minigame.classList.add('transition-game-in');
    await delay(750); // wait for transition to end
}
function updateProgress() {
    // TO-DO
}