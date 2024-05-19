'use strict';

const canvas = document.querySelector('#scream-canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const board = document.querySelector('#scream-phrase-container');

const symbols = [',', '\'', '.', '!', ':', '\"', '?', '-'];
const phrases = ['NO,\u00A0PLEASE\u00A0DON\'T\u00A0KILL\u00A0ME,\u00A0MR.\u00A0GHOSTFACE,\u00A0I\u00A0WANNA\u00A0BE\u00A0IN\u00A0THE\u00A0SEQUEL!',
                 'AND\u00A0NUMBER\u00A0THREE:\u00A0NEVER,\u00A0EVER,\u00A0EVER\u00A0UNDER\u00A0ANY\u00A0CIRCUMSTANCES\u00A0SAY,\u00A0\"I\'LL\u00A0BE\u00A0RIGHT\u00A0BACK\"\u00A0BECAUSE\u00A0YOU\u00A0WON\'T\u00A0BE\u00A0BACK.',
                 'DID\u00A0YOU\u00A0REALLY\u00A0CALL\u00A0THE\u00A0POLICE?\u00A0MY\u00A0MOM\u00A0AND\u00A0DAD\u00A0ARE\u00A0GONNA\u00A0BE\u00A0SO\u00A0MAD\u00A0AT\u00A0ME!',
                 'THERE\u00A0ARE\u00A0CERTAIN\u00A0RULES\u00A0THAT\u00A0ONE\u00A0MUST\u00A0ABIDE\u00A0BY\u00A0IN\u00A0ORDER\u00A0TO\u00A0SUCCESSFULLY\u00A0SURVIVE\u00A0A\u00A0HORROR\u00A0MOVIE.',
                 'DON\'T\u00A0YOU\u00A0BLAME\u00A0THE\u00A0MOVIES.\u00A0MOVIES\u00A0DON\'T\u00A0CREATE\u00A0PSYCHOS.\u00A0MOVIES\u00A0MAKE\u00A0PSYCHOS\u00A0MORE\u00A0CREATIVE!',
                 'LUCKY\u00A0FOR\u00A0YOU\u00A0THERE\'S\u00A0A\u00A0BONUS\u00A0ROUND,\u00A0BUT\u00A0POOR\u00A0STEVE...\u00A0I\'M\u00A0AFRAID\u00A0HE\'S\u00A0OUT!',
                 'CAREFUL.\u00A0THIS\u00A0IS\u00A0THE\u00A0MOMENT\u00A0WHEN\u00A0THE\u00A0SUPPOSEDLY\u00A0DEAD\u00A0KILLER\u00A0COMES\u00A0BACK\u00A0TO\u00A0LIFE,\u00A0FOR\u00A0ONE\u00A0LAST\u00A0SCARE.',
                 'NEVER\u00A0SAY\u00A0\"WHO\'S\u00A0THERE?\"\u00A0DON\'T\u00A0YOU\u00A0WATCH\u00A0SCARY\u00A0MOVIES?\u00A0IT\'S\u00A0A\u00A0DEATH\u00A0WISH.',
                 'YOU\u00A0MIGHT\u00A0AS\u00A0WELL\u00A0COME\u00A0OUT\u00A0TO\u00A0INVESTIGATE\u00A0A\u00A0STRANGE\u00A0NOISE\u00A0OR\u00A0SOMETHING.',
                 '-YOU\u00A0STILL\u00A0HAVEN\'T\u00A0TOLD\u00A0ME\u00A0YOUR\u00A0NAME.\u00A0-WHY\u00A0DO\u00A0YOU\u00A0WANT\u00A0TO\u00A0KNOW\u00A0MY\u00A0NAME?\u00A0-BECAUSE\u00A0I\u00A0WANT\u00A0TO\u00A0KNOW\u00A0WHO\u00A0I\'M\u00A0LOOKING\u00A0AT.',
                 '-WHAT\'S\u00A0YOUR\u00A0MOTIVE?\u00A0BILLY\'S\u00A0GOT\u00A0ONE.\u00A0WHAT\u00A0ARE\u00A0YOU\u00A0GOING\u00A0TO\u00A0TELL\u00A0THEM?\u00A0-PEER\u00A0PRESSURE.\u00A0I\'M\u00A0FAR\u00A0TOO\u00A0SENSITIVE',
                 'IF\u00A0YOU\u00A0WERE\u00A0THE\u00A0ONLY\u00A0SUSPECT\u00A0IN\u00A0A\u00A0SENSELESS\u00A0BLOODBATH,\u00A0WOULD\u00A0YOU\u00A0BE\u00A0STANDING\u00A0IN\u00A0THE\u00A0HORROR\u00A0SECTION?',
                 'IF\u00A0I\'M\u00A0RIGHT\u00A0ABOUT\u00A0THIS,\u00A0I\u00A0COULD\u00A0SAVE\u00A0A\u00A0MAN\'S\u00A0LIFE.\u00A0DO\u00A0YOU\u00A0KNOW\u00A0WHAT\u00A0THAT\u00A0WOULD\u00A0DO\u00A0FOR\u00A0MY\u00A0BOOK\u00A0SALES?',
                 'SYDNEY,\u00A0HOW\u00A0DOES\u00A0IT\u00A0FEEL\u00A0TO\u00A0BE\u00A0ALMOST\u00A0BRUTALLY\u00A0BUTCHERED?\u00A0PEOPLE\u00A0WANT\u00A0TO\u00A0KNOW.',
                 '-LOOK,\u00A0I\u00A0AM\u00A0TWO\u00A0SECONDS\u00A0AWAY\u00A0FROM\u00A0CALLING\u00A0THE\u00A0POLICE!\u00A0-THEY\'LL\u00A0NEVER\u00A0MAKE\u00A0IT\u00A0IN\u00A0TIME.'];

//TODO intro : what's the matter [sydney] you look like you've seen a ghost
//TODO host : and don't forget, we all go a little mad sometimes

const idx = Math.floor(Math.random() * phrases.length);
const words = phrases[idx].split('\u00A0');

const maxCharsInLine = Math.ceil((phrases[idx].length) / 3); // max 3 lines
console.log(maxCharsInLine);
let charsInLine = 0;
let currLine = document.createElement('div');
board.appendChild(currLine);

const letterDir = {}; // {'A':[0,3,4,9], ...} means letter A should be in the elems of letterElems indexed 0, 3, 4, and 9

let letterIdx = 0;
for (const w of words) {
    // continue to next line for dialogue or if it would be uneven according to maxCharsInLine (unless it is the last word)
    if ((charsInLine + w.length > maxCharsInLine || w[0] == '-') && words.indexOf(w) != words.length - 1) {
        charsInLine = 0;
        currLine = document.createElement('div');
        board.innerHTML += '\n';
        board.appendChild(currLine);
    }

    if (charsInLine != 0) {
        let elem = document.createElement('div');
        elem.classList.add('scream-symbol');
        elem.textContent = '\u00A0';
        currLine.appendChild(elem);
        charsInLine++;
    }

    for (const char of w) {
        let elem = document.createElement('div');
        currLine.appendChild(elem);
        if (symbols.includes(char)) { // show characters
            elem.classList.add('scream-symbol');
            elem.textContent = char;
        }
        else { // don't show letters (use empty spaces)
            elem.classList.add('scream-letter');
            elem.innerHTML = '&nbsp;';
            if (letterDir[char]) letterDir[char].push(letterIdx);
            else letterDir[char] = [letterIdx];
            letterIdx++;
        }
        charsInLine++;
    }
}

// convert to array to use indexOf later on
const letterElems = Array.from(document.querySelectorAll('.scream-letter')); // define here rather than creating elems to keep content editable (?)

// wheel
const wheelVals = ['key', 15, 25, 10, 0, 5, 'plus', 20, 'lose', 15, 'x2', 5, 'x4', 20, 0, 10]; // rotate by 22.5*i to get wheelVals[i]
let currIdx = 0;

const wheel = document.querySelector('#scream-wheel');
const wheelFrame = document.querySelector('#scream-wheel-frame');

const spinVals = {
    duration: 2000,
    iterations: 1,
    fill: 'forwards',
    easing: 'cubic-bezier(0.04, -0.02, 0.02, 1.12)' // starts spinning quickly, slows down by the end surpassing the target slightly and rolling back to it
}
wheelFrame.addEventListener('click', spinWheel);

async function spinWheel(event) {
    if (event && turn != 0) return; // not our turn, can't do anything

    wheelFrame.style.cursor = 'default'; // will change to pointer in play() if needed

    const newIdx = Math.floor(Math.random() * 16); // where to land
    const r = Math.floor(Math.random() * 2 + 1); // full rotations before

    wheel.animate({
        transform: ['rotate(' + (currIdx * 22.5 + 11.25) + 'deg)', 'rotate(' + (newIdx * 22.5 + 11.25 + 360 * r) + 'deg']
    }, spinVals);
    currIdx = newIdx;
    await delay(2000); // wait for animation to end

    play();
}

const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));

async function play() {
    switch(wheelVals[currIdx]) { // TODO
        case 'key': // choose 1 key out of 10, win the game if chosen correctly
            //
            break;
        case 'plus': // show the letter at a chosen position
            letterElems.forEach((elem) => elem.style.cursor = 'pointer');
            isPlus = true;
            break;
        case 0: // skip turn 
            //
            break;
        case 'lose': // lose all points
            //
            break;
        default: // for +N, *2, *4 : make a guess and get points if it is correct
            guessing = true;
    }
    console.log(wheelVals[currIdx], turn);

    // TODO check if won

    //FIXMEturn = (turn + 1) % 3;

    // TODO : animations

    if (turn != 0) { //TODO unplayable character spins the wheel
        //await delay(2500);
        //FIXMEspinWheel();
    } else wheelFrame.style.cursor = 'pointer'; // show that wheel is clickable once again
}

// game
//FIXME let turn = Math.floor(Math.random() * 3); // 0, 1, 2 to know who is playing, first player is random
let turn = 0;
wheelFrame.style.cursor = 'pointer';

let isPlus = false;
letterElems.forEach((elem) => elem.addEventListener('click', addLetter));
function addLetter(event) {
    if (!isPlus) return;

    const idx = letterElems.indexOf(event.target);
    
    for (const l in letterDir) {
        if (letterDir[l].includes(idx)) { // show the letter and remove this spot from directory
            event.target.textContent = l;
            if (letterDir[l].length == 1) delete letterDir[l];
            else letterDir[l] = letterDir[l].filter((i) => i != idx);
            break;
        }
    }

    isPlus = false;
    letterElems.forEach((elem) => elem.style.cursor = 'default');
}

let guessing = false;
window.addEventListener('keydown', guessLetter);
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
function guessLetter(event) {
    if (!guessing) return;

    // TODO : guess animation

    let rightGuess = false;
    if (letters.includes(event.key)) {
        const key = event.key.toUpperCase();
        console.log(event.key, letterDir[event.key.toUpperCase()]);
        if (letterDir[key]) {
            letterDir[key].forEach((i) => letterElems[i].textContent = key);
            delete letterDir[key];
            rightGuess = true;
        }

        if (rightGuess) { // TODO
            //
        }

        if (Object.keys(letterDir).length == 0) console.log('guessed all'); // TODO
    }

    guessing = false;
}

//const t = {key: 'A'}; t.key for unplayable chars