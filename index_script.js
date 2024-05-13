'use strict';

const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));

//const introScreen = Array.from(document.querySelectorAll('.intro-txt-line'));
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

function newLine(starting = false) {
    if (!starting) introLines[lineI].style.animation = 'none'; // remove blinking bar from previous line
    const l = document.createElement('div');
    l.classList.add('intro-txt-line');
    introScreen.appendChild(l);
    introLines.push(l);
}
newLine(true);

showIntroText();
async function showIntroText() {
    while (charI < introText.length) {
        await delay(charPauses[charI]);
        //await delay(20); // FIXME test
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
    console.log(wordI);
}

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