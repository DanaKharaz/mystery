'use strict';

/** MINIGAME INSIDE **/

const minigame = document.querySelector('#minigame');
let currGame = 'labyrinth1'; // !!! CHANGE !!!
minigame.src = 'labyrinth.html'; // !!! CHANGE !!!

const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));

/* GAME ATTRIBUTES */
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
            minigame.classList.remove('transition-game-in');
            minigame.classList.add('transition-game-out');
            await delay(750); // wait for transition to end
            minigame.src = 'blackout.html';
            minigame.classList.remove('transtion-game-out');
            minigame.classList.add('transition-game-in');
            await delay(750); // wait for transition to end

            break;
        case 'picking-films':
            pickingFilms = !pickingFilms;
            break;

        // TO-DO : the rest of cases

        default:
            if (pickingFilms) {filmsIncl.push(event.data);}
    }
});

/* ********************************************************************************************** */

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

/* SOUND BUTTON */
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

/* INFO BUTTON */
const infoBtn = document.querySelector('#info-btn');
const infoPanel = document.querySelector('#info-panel');
let infoPanelShown = false;
infoBtn.addEventListener('click', infoBtnOnClick);
async function infoBtnOnClick(event) {
    // TO-DO : display a small side window with info about how to play (no hints!) and sound/reference info (?) - for refs make small sep html page (new tab)??

    // show or hide info panel
    if (infoPanelShown) {
        infoPanel.classList.remove('opening-info-panel');
        infoPanel.classList.add('closing-info-panel');
    } else {
        // set correct text to panel
        switch(currGame) { // TO-DO : arrange in proper order (for readability)
            case 'film':
                // TO-DO
                let references = '';
                filmsIncl.sort();
                for (let i = 0; i < 12; i++) references += '<i>' + filmsIncl[i].slice(0, -6) + '</i>' + filmsIncl[i].slice(-6) + ', <br>';
                references = references.slice(0, -6);
                infoPanel.innerHTML = '<b>game rules</b>: each piece of film has a movie scene on the other side, there are 12 pairs of scenes; click on any 2 pieces to temporarily reveal the scenes behind; find all pairs before running out of moves<br><br><b>references</b>:<br>' + references + '<br><br><b>music</b>: ???';
                break;
            case 'blackout':
                // TO-DO
                break;
            case 'labyrinth1': // 2d maze
                // TO-DO
                infoPanel.innerHTML = '<b>game rules</b>: use the arrow keys to move through the maze, make sure to collect all items (white circles) before exiting<br><br><b>reference</b>: <i>Labyrinth</i> (1986)<br><br><b>music</b>: ???';
                break
            case 'labyrinth2': // relativity stairs
                // TO-DO
                break;
            default: // before the game starts
                // TO-DO
        }

        infoPanel.classList.remove('closing-info-panel');
        infoPanel.classList.add('opening-info-panel');
    }
    infoPanelShown = !infoPanelShown;
}

/* HINT BUTTON */
const hintBtn = document.querySelector('#hint-btn');
hintBtn.addEventListener('click', hintBtnOnClick);
function hintBtnOnClick(event) {
    // TO-DO : no hints left - propose a game to get hints; hints left - give a hint depending on the game
}