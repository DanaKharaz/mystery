"use strict";

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
        // TO-DO : turn the sound on
    } else {
        soundBtn.src = 'icons/sound_off_btn.svg';
        // TO-DO : turn the sound off
    }
    isMuted = !isMuted;
}

/* INFO BUTTON */
const infoBtn = document.querySelector('#info-btn');
infoBtn.addEventListener('click', infoBtnOnClick);
function infoBtnOnClick(event) {
    // TO-DO : display a small side window with info about how to play (no hints!) and sound info (?)
}

/* HINT BUTTON */
const hintBtn = document.querySelector('#hint-btn');
hintBtn.addEventListener('click', hintBtnOnClick);
function hintBtnOnClick(event) {
    // TO-DO : no hints left - propose a game to get hints; hints left - give a hint depending on the game
}

/* ********************************************************************************************** */

/** ... **/

const minigame = document.querySelector('#minigame');
minigame.src = 'blackout.html'; // !!! CHANGE !!!

window.addEventListener('message', function(event) {
    if (event.data === 'film-won') {
        // continue to blackout !!! FOR NOW !!!
        minigame.src = 'blackout.html';
    }
});