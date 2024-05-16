'use strict';

const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));

/** TITLE **/
const title = document.querySelector('#index-title');
async function titleBlink() {
    const skip = 100;
    for (let i = 0; i < 4; i++) {
        await delay(skip);
        title.textContent = 'M\u00A0STERY';
        await delay(skip);
        title.textContent = 'MYSTERY';
        await delay(skip);
        title.textContent = 'M\u00A0STERY';
        await delay(skip);
        title.textContent = 'MISTERY';
        await delay(skip);
        title.textContent = 'M\u00A0STERY';
        await delay(skip);
        title.textContent = 'MYS\u00A0ERY';
        await delay(skip);
        title.textContent = 'M\u00A0STERY';
        await delay(skip);
        title.textContent = 'MIS\u00A0ERY';
    }

    await delay(500);
    for (let i = 0; i < 5; i++) {
        await delay(80);
        title.textContent = '';
        await delay(80);
        title.textContent = 'MIS\u00A0ERY';
    }

    await delay(500);
    title.style.display = 'none';
    await delay(500);

    newLine(true);
    showIntroText();
}
titleBlink();

/** INTRO SCREEN **/
const introScreen = document.querySelector('#intro-screen');

const introLines = [];
// TODO : write intro text
const introText = "hello,\u00A0you.\u00A0how\u00A0did\u00A0you\u00A0end\u00A0up\u00A0here?\u00A0well..\u00A0there\u00A0is\u00A0no\u00A0escape\u00A0now\u00A01\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A01\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A02\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A03\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A04\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A05\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A06\u00A02345678\u00A07\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A08\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A09";
const introTextWords = introText.split('\u00A0');

const maxCharPerLine = 66;
let charI = 0;
let wordI = 0;
let lineI = 0;
let charInLines = 0;

// add longer pauses after certain characters
const charPauses = []; // cantains pauses in millis
for (let i = 0; i < introText.length; i++) charPauses.push(100); // default value
// TODO : add needed pauses
charPauses[6] = 1000;
charPauses[11] = 1000;
charPauses[36] = 1000;
charPauses[43] = 1000;
charPauses[67] = 1000;

//FIXMEnewLine(true);
function newLine(starting = false) {
    if (!starting) introLines[lineI].style.animation = 'none'; // remove blinking bar from previous line
    const l = document.createElement('div');
    l.classList.add('intro-txt-line');
    introScreen.appendChild(l);
    introLines.push(l);
}

//FIXMEshowIntroText();
async function showIntroText() {
    while (charI < introText.length) {
        //await delay(charPauses[charI]);
        await delay(20); // FIXME test
        if (introText[charI] == '\n') { // line break within text
            newLine();
            lineI++;
            charI++;
            charInLines++;
            continue;
        }
        if (charInLines % maxCharPerLine == 0) { // no more space, so start new line
            newLine();
            lineI++;
        }
        if (introText[charI] == '\u00A0') {
            wordI++; // next word
            
            if (charInLines % maxCharPerLine + introTextWords[wordI].length > maxCharPerLine) { // next word will not fit, so start new line
                newLine();
                lineI++;
                charInLines = 0; // exact value does not matter, as always taken modulo maxCharPerLine
            }

            if (introLines[lineI].textContent.length == 0) { // should not start line with a blank space
                charI++;
                charInLines++;
                continue;
            }
        }
        introLines[lineI].textContent += introText[charI];
        charI++;
        charInLines++;
    }
    await delay(1000);

    // show background and start button
    introScreen.style.display = 'none';
    // TODO background
    document.querySelector('#start-screen-container').classList.remove('start-screen-hidden');
}

/** BACKGROUND **/ //TODO

/** START BUTTON **/

const startBtn = document.querySelector('#start-btn');
const startBtnContainer = document.querySelector('#start-btn-container');
startBtn.addEventListener('click', transitionFirstGame);

async function transitionFirstGame(event) {
    startBtnContainer.classList.add('start-btn-container-moving');
    startBtn.removeEventListener('click', transitionFirstGame); // prevent second click during animation
    
    const delay = millis => new Promise((resolve, reject) => {setTimeout(_ => resolve(), millis)});
    await delay(3500);
    startBtnContainer.style.display = 'none'; // not visible anymore - no need to keep rotation

    // TODO : transition to the first game OR intro screen
}

/** CONNECT DOTS **/ //TODO

// array of dots (stars) that can be connected with parallel array with number of connections for each (both will be filled from connections)
const dots = [];
const nConnected = []; // after each connection, the number will decrease - game done when all are 0
// array of connections [[A,B]..]
const connections = []; // TODO

// TODO : add dots (stars) to positionns above and listen for mouseclicks near them
// playable are buttons (pointer on hover) OR on mousemove, change pointer if near playable dot (easier to load?)
// on click, the dot(s) current one connects to 'flash'
// when 2 connecting clicked consecutively, a line between is drawn

/** DOLL ANIMATION **/ //TODO