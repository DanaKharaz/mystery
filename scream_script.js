'use strict';

const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));

/* SETTING THE PHRASE BOARD */
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
const openLetterElems = [];

/* SETTING THE WHEEL */
const wheelVals = ['key', 15, 25, 10, 0, 5, 'plus', 20, 'lose', 15, 'x2', 5, 'x4', 20, 0, 10]; // rotate by 22.5*i to get wheelVals[i]
let currWheelIdx = 0;

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
    if (event && (turn != 0 || !chooseFirst && !started)) return; // not our turn or not started, can't do anything

    if (!started) chooseFirst = false; // must do here and not in main if (!started) due to delay for animation (prevent immediate second spin on click)
    
    wheelFrame.style.cursor = 'default'; // will change to pointer in play() if needed

    //FIXME
    let newIdx;
    if (!started) newIdx = Math.floor(Math.random() * 16); // where to land
    else newIdx = 8;
    //const newIdx = Math.floor(Math.random() * 16); // where to land
    const r = Math.floor(Math.random() * 2 + 1); // full rotations before

    wheel.animate({
        transform: ['rotate(' + (currWheelIdx * 22.5 + 11.25) + 'deg)', 'rotate(' + (newIdx * 22.5 + 11.25 + 360 * r) + 'deg']
    }, spinVals);
    currWheelIdx = newIdx;
    await delay(2000); // wait for animation to end

    if (!started) { // spin to decide who goes first
        if (['key', 'plus', 'lose', 'x2', 'x4'].includes(wheelVals[currWheelIdx])) { // not a number, so spin again
            hostSpeechBubble.innerHTML = 'Please spin again, ' + names[turn] + '.';

            if (turn == 0) { // allow user to spin again
                wheelFrame.style.cursor = 'pointer';
                chooseFirst = true;
            } else { // unplayable character spins again
                await delay(1500);
                spinWheel();
            }
        } else {
            decideFirst[turn] = wheelVals[currWheelIdx];
            
            charSpeechBubbles[turn].style.display = 'initial';
            charSpeechBubbles[turn].textContent = 'I got ' + wheelVals[currWheelIdx] + '!';

            if (turn == 2) { // everyone got their number
                await delay(1500);

                turn = 0;
                let maxSpin = decideFirst[0];
                charSpeechBubbles[0].style.display = 'none';

                for (let i = 1; i < 3; i++) {
                    if (decideFirst[i] > maxSpin) {
                        maxSpin = decideFirst[i];
                        turn = i;
                    }
                    charSpeechBubbles[i].style.display = 'none'; // hide their speech bubbles
                }

                if (decideFirst.filter((elem) => elem == maxSpin).length != 1) { // multiple max values, so spin again
                    hostSpeechBubble.innerHTML = 'It appears that we have a tie, so we\'ll try again. Watcher, please spin the wheel.'
                    turn = 0;
                    wheelFrame.style.cursor = 'pointer';
                    chooseFirst = true;
                } else {
                    hostSpeechBubble.innerHTML = names[turn] + ' got the heighest number! They will go first.';
                    if (started) for (let i = 0; i < 3; i++) charSpeechBubbles[i].style.display = 'none'; // hide characters' speech bubbles
                    started = true;
                    turn = 0;//FIXME
                }

            } else {
                turn++;
                hostSpeechBubble.innerHTML = 'Now, ' + names[turn] + ', please spin the wheel.';
                await delay(1500);
                spinWheel();
            }
        }
        return;
    }

    play();
}

async function play() {
    switch(wheelVals[currWheelIdx]) {
        case 'key': // TODO choose 1 key out of 10, win the game if chosen correctly
            //
            break;
        case 'plus': // show the letter at a chosen position
            hostSpeechBubble.style.display = 'initial';
            hostSpeechBubble.innerHTML = names[turn] + ', which letter you would like to reveal?';

            if (turn == 0) { // the user can click on any of the letters hidden
                letterElems.filter((item) => !openLetterElems.includes(item)).forEach((elem) => elem.style.cursor = 'pointer');
                isPlus = true;
            }
            else {
                let pos;
                do {
                    pos = Math.floor(Math.random() * letterElems.length);
                } while (openLetterElems.includes(letterElems[pos]));

                await delay(1500);
                addLetter(pos, true);
            } //TODO host and show
            break;
        case 0: // TODO skip turn 
            //
            break;
        case 'lose':
            // TODO differentiate and randomize the phrases
            hostSpeechBubble.innerHTML = 'In a tragic turn of events, you lose all of your points, ' + names[turn] + '.';
            await delay(1500);
            scores[turn] = 0;
            charScores[turn].innerHTML = '<i>score:</i><br>0';
            
            nextTurn();
            break;
        default: // for +N, *2, *4 : make a guess and get points if it is correct
            if (turn == 0) guessing = true;
            else {
                //TODO
            }
    }
}

/* THE GAME */
const charContexts = [document.querySelector('#scream-canvas1').getContext('2d'),
                      document.querySelector('#scream-canvas2').getContext('2d'),
                      document.querySelector('#scream-canvas3').getContext('2d')];
const charScores = [document.querySelector('#scream-score1'),
                    document.querySelector('#scream-score2'),
                    document.querySelector('#scream-score3')];
const charSpeechBubbles = [document.querySelector('#scream-bubble1'),
                           document.querySelector('#scream-bubble2'),
                           document.querySelector('#scream-bubble3')];
const hostSpeechBubble = document.querySelector('#scream-bubble-host');
const hostSpeechBubbleNext = document.querySelector('#scream-bubble-host-next');

const names = ['Watcher', 'Golem', 'Reaper'];

const scores = [0, 0, 0]; // 0 - playable character; 1, 2 - unplayable characters
let turn = 0;

// START GAME
// TODO
let started = false;
let chooseFirst = false;
const decideFirst = [0, 0, 0];

const hostStartPhrases = ['Wlecome to <i>The Wheel of Misfortune</i> - your favorite game show airing on any TV chanel here in the Abyss every single night for the rest of forever!',
                    'I am your host - Scream. Let me briefly explain the rules:',
                    'You, the Watcher, will be playing against Golem...',
                    '... and Reaper',
                    'If you win, you get the prize hidden in this tresure chest!',
                    'And if you lose... I guess you\'ll have to stay here forever.',
                    'So, you can win by decoding the phrase seen on the board,',
                    'when it is your turn, you can guess one letter and see every spot where this letter is present in the phrase.',
                    'Of course, you don\'t have to wait until all letters have been revealed, you can also guess the whole phrase, once you\'re confident in your guess.',
                    'However! You can only do that twice in the game.',
                    'Each turn, you spin our <i>Wheel of Misfortune</i>,',
                    'if you land on 5, 10, 15, 20, or 25, a correct guess will give you that amount of points,',
                    'x2 or x4 will double or quadruple your score if you guess the right letter,',
                    'the \'+\' allows you to reveal the letter in a specific spot, but only there -',
                    'other places with that same letter will remain hidden.',
                    'Landing on the key is your ticket to an immediate win!',
                    'You will be presented with 10 keys, one of which opens the tresure chest,',
                    'so if you pick the correct one, you\'ll win the game without having to guess the phrase on the board.',
                    'But of course it isn\'t all rainbows and sunshine here!',
                    'Landing on 0 means you have to skip your turn: you won\'t make a guess or get any points.',
                    'And worst of all, you can not only skip your turn, but also lose ALL your points if you land on the skull!',
                    'This concludes the rules, so let\'s start!',
                    'To decide who will go first, each player will spin the wheel and whoever gets the highest number will start.',
                    'Watcher will spin first!'];
let hostStartPhraseIdx = 0;
const skippedPhrases = new Array(hostStartPhrases.length).fill(false);

async function startGame() {
    let pause = 6000;

    //await delay(1000);
    hostSpeechBubble.style.display = 'initial';
    hostSpeechBubbleNext.style.display = 'initial';

    hostSpeechBubbleNext.addEventListener('click', function () {
        if (hostStartPhraseIdx == 23) return; // wait for the user to spin the wheel
        skippedPhrases[hostStartPhraseIdx] = true;
    });

    while (hostStartPhraseIdx < 24) {
        hostSpeechBubble.innerHTML = hostStartPhrases[hostStartPhraseIdx];
        
        if (hostStartPhraseIdx == 23) break;

        let t = 0;
        while (t <= pause && !skippedPhrases[hostStartPhraseIdx]) { // wait unless the user clicks the 'next' arrow
            await delay(10);
            t += 10;
        }

        hostStartPhraseIdx++;
    }

    hostSpeechBubbleNext.style.display = 'none';
    
    // allow to spin
    chooseFirst = true;
    wheelFrame.style.cursor = 'pointer';
}

startGame();

// MAKE A GUESS
let guessing = false;
window.addEventListener('keydown', guessLetter);
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
function guessLetter(event, unplayableGuess = false) { //TODOconst t = {key: 'A'}; t.key for unplayable chars
    if (!guessing && !unplayableGuess) return;

    // TODO : guess animation

    let rightGuess = false;
    if (letters.includes(event.key)) {
        const key = event.key.toUpperCase();
        if (letterDir[key]) {
            letterDir[key].forEach((i) => letterElems[i].textContent = key);
            delete letterDir[key];
            rightGuess = true;
        }

        if (rightGuess) {
            // add to score
            if (wheelVals[currWheelIdx] == 'x2') scores[turn] *= 2;
            else if (wheelVals[currWheelIdx] == 'x4') scores[turn] *= 4;
            else scores[turn] += wheelVals[currWheelIdx];

            // TODO : animations
        }

        if (Object.keys(letterDir).length == 0) console.log('guessed all'); // TODO
    }

    guessing = false;
}

// REVEAL LETTER
let isPlus = false;
letterElems.forEach((elem) => elem.addEventListener('click', addLetter));
async function addLetter(event, unplayablePlus = false) {
    if (!isPlus && !unplayablePlus) return;

    let idx;
    if (unplayablePlus) idx = event; // a number was passed, not an event
    else idx = letterElems.indexOf(event.target);

    charSpeechBubbles[turn].style.display = 'initial';
    let ending = 'th';
    if ((idx + 1) % 10 == 1 && (idx + 1) % 100 != 11) ending = 'st';
    else if ((idx + 1) % 10 == 2 && (idx + 1) % 100 != 12) ending = 'nd';
    else if ((idx + 1) % 10 == 3 && (idx + 1) % 100 != 13) ending = 'rd';
    charSpeechBubbles[turn].innerHTML = 'Reveal the ' + (idx + 1) + ending + ' letter!'
    
    for (const l in letterDir) {
        if (letterDir[l].includes(idx)) { // show the letter and remove this spot from directory
            await delay(1500);

            if (letterDir[l].length == 1) delete letterDir[l];
            else letterDir[l] = letterDir[l].filter((i) => i != idx);
            
            letterElems[idx].textContent = l;
            letterElems[idx].removeEventListener('click', addLetter);
            openLetterElems.push(letterElems[idx]);

            hostSpeechBubble.innerHTML = 'The ' + (idx + 1) + ending + ' letter is... ' + l + '!';
            await delay(2500);
            charSpeechBubbles[turn].style.display = 'none';

            break;
        }
    }

    isPlus = false;
    letterElems.forEach((elem) => elem.style.cursor = 'default');

    if (Object.keys(letterDir).length == 0) {
        console.log('guessed all');
        return;
    } // TODO

    nextTurn();
}

async function nextTurn() {
    turn = (turn + 1) % 3;
    // TODO differentiate and randomize the phrases
    hostSpeechBubble.innerHTML = 'Now, ' + names[turn] + ', it\'s your turn, please spin the wheel.';

    if (turn == 0) wheelFrame.style.cursor = 'pointer';
    else {
        await delay(1500);
        spinWheel();
    }
}

// 