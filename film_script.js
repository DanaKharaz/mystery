'use strict';

window.addEventListener('message', function(event) {
    //event.data
    // TO-DO : listen for 'sound-on', 'sound-off'
});

/** FILM GRID & SCORE **/

const root = document.querySelector(':root');
const filmFrames = Array.from(document.querySelectorAll('.film-frame'));
const clickedFrames = [];
const frameKeys = []; // index of frame in filmFrames : index of image in imagesChosen
const countTaken = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let guesses = 0;
let moves = 20;
const imagesAll = ['A Nightmare on Elm Street (1984)',
                'A Quite Place (2018)',
                'Alien (1979)',
                'Beetlejuice (1988)',
                'Frankenstein (1931)',
                'Get Out (2017)',
                'Halloween (1978)',
                'Hereditary (2018)',
                'It (2017)',
                'Let Me In (2010)',
                'Mama (2013)',
                'Midsommar (2019)',
                'Nosferatu (1922)',
                'Psycho (1960)',
                'Ready or Not (2019)',
                'Sweeny Todd - The Demon Barber of Fleet Street (2007)',
                'Talk to Me (2023)',
                'The Exorcist (1973)',
                'The Shining (1980)',
                'The Silence of the Lambs (1991)',
                'The Texas Chainsaw Massacare (1974)',
                'The VVitch (2015)',
                'Us (2019)',
                'X (2022)'];
imagesAll.sort(() => 0.5 - Math.random()); // randomly sort the array

// send chosen movies to parent (for info panel)
window.parent.postMessage('picking-films', '*');
for (let i = 0; i < 12; i++) window.parent.postMessage(imagesAll[i], "*");
window.parent.postMessage('picking-films', '*');

const imagesChosen = imagesAll.slice(0, 12);
for (let i = 1; i <= 12; i++) root.style.setProperty('--img' + i, 'url("film_res/' + imagesChosen[i] + '.png")');
let isAnimating = false;
const guessedFrames = [false, false, false, false, false, false, false, false, false, false, false, false];
const movesTxt = document.querySelector('#film-moves-left');
const guessedTxt = document.querySelector('#film-guessed');

for (let i = 0; i < filmFrames.length; i++) {
    filmFrames[i].addEventListener('click', revealOrHideFrame)
    filmFrames[i].textContent = i;
    // split frames in pairs
    let randomKey;
    do {
        randomKey = Math.floor(Math.random() * 12);
    } while (countTaken[randomKey] == 2);
    frameKeys.push(randomKey);
    countTaken[randomKey]++;
}

const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));

async function revealOrHideFrame(event) {
    if (isAnimating) { // not to interrupt other animation
        await delay(10);
    }

    const chosenFrame = event.target;
    const index = filmFrames.indexOf(chosenFrame);
    // !!! const key = frameKeys.indexOf(index) + 1;

    // action
    if (clickedFrames.includes(index)) { // this one is already clicked, so ignore
        return;
    } else { // reveal frame
        root.style.setProperty('--currImg', 'url("film_res/' + imagesChosen[frameKeys[index]] + '.png")');
        chosenFrame.classList.add('reveal-frame');
        chosenFrame.classList.remove('hide-frame');
        /* !!! chosenFrame.classList.add('reveal-frame' + key);
        chosenFrame.classList.remove('hide-frame' + key); */
        clickedFrames.push(index);
    }

    // check guess
    if (clickedFrames.length === 2) {
        if (frameKeys[clickedFrames[0]] === frameKeys[clickedFrames[1]]) { // correct guess
            // 'freeze' correctly guessed images
            filmFrames[clickedFrames[0]].removeEventListener('click', revealOrHideFrame);
            filmFrames[clickedFrames[1]].removeEventListener('click', revealOrHideFrame);

            // remove pointers
            filmFrames[clickedFrames[0]].classList.add('film-frame-done');
            filmFrames[clickedFrames[1]].classList.add('film-frame-done');

            guessedFrames[clickedFrames[0]] = true;
            guessedFrames[clickedFrames[1]] = true;

            // restart guess
            clickedFrames.splice(0, 2);

            guesses++;
        } else { // wrong guess
            isAnimating = true;
            // !!! await delay(1000);
            await delay(500);
            filmFrames[clickedFrames[0]].classList.remove('reveal-frame');
            root.style.setProperty('--prevImg', 'url("film_res/' + imagesChosen[frameKeys[clickedFrames[0]]] + '.png")');
            filmFrames[clickedFrames[0]].classList.add('hide-frame');
            await delay(375);
            filmFrames[clickedFrames[1]].classList.remove('reveal-frame');
            root.style.setProperty('--prevImg', 'url("film_res/' + imagesChosen[frameKeys[clickedFrames[1]]] + '.png")');
            filmFrames[clickedFrames[1]].classList.add('hide-frame');
            await delay(375);
            /* !!! const k0 = frameKeys.indexOf(clickedFrames[0]) + 1;
            const k1 = frameKeys.indexOf(clickedFrames[1]) + 1;
            filmFrames[clickedFrames[0]].classList.remove('reveal-frame' + k0);
            filmFrames[clickedFrames[0]].classList.add('hide-frame' + k0);
            filmFrames[clickedFrames[1]].classList.remove('reveal-frame' + k1);
            filmFrames[clickedFrames[1]].classList.add('hide-frame' + k1);
            await delay(375); */
            isAnimating = false;
            clickedFrames.splice(0, 2);
        }
        moves--;

        showGuessesAndMovesLeft();
    }

    // if done
    if (guesses === 12) {
        // TO-DO : game won
        console.log('You have won!');
        for (let frame of filmFrames) {
            frame.removeEventListener('click', revealOrHideFrame);
            frame.classList.add('film-frame-done'); // remove pointer when hovering
        }
    }
    if (moves === 0) {
        // TO-DO : game over
        console.log("Game Over!");
        for (let frame of filmFrames) {
            frame.removeEventListener('click', revealOrHideFrame);
            frame.classList.add('film-frame-done'); // remove pointer when hovering
        }
    }
}

function showGuessesAndMovesLeft() {
    if (moves < 10) {movesTxt.textContent = 'attempts left: \u00A0' + moves;} // 2 spaces instead of 1 for cleaner look
    else {movesTxt.textContent = 'attempts left: ' + moves;}

    if (guesses < 10) {guessedTxt.textContent = 'detected: \u00A0' + guesses + ' / 12';} // 2 spaces instead of 1 for cleaner look
    else {guessedTxt.textContent = 'detected: ' + guesses + ' / 12';}
}

/** 'NEXT' BUTTON **/

// set initial background
const nextBtnAnim = document.querySelector('#film-next-btn');
const context = nextBtnAnim.getContext('2d');
const btnBackground = new Image();
btnBackground.src = 'film_res/next_btn.png';
const em = parseFloat(getComputedStyle(nextBtnAnim || document.documentElement).fontSize);
btnBackground.onload = function() {
    context.drawImage(btnBackground, 0, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
};

// buttom click
const nextBtn = document.querySelector('#film-next-btn-text');
nextBtn.addEventListener('click', nextBtnClick);
async function nextBtnClick(event) {
    if (guesses == 12) {
        await delay(40);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(btnBackground, 1050, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
        await delay(40);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(btnBackground, 2100, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
        await delay(40);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(btnBackground, 3150, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
        await delay(40);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(btnBackground, 4200, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
        nextBtn.removeEventListener('click', nextBtnClick);
        await delay(40);
        
        // notify parent
        window.parent.postMessage('film-won', '*'); // https://javascriptbit.com/transfer-data-between-parent-window-and-iframe-postmessage-api/
    } else {
        await delay(40);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(btnBackground, 1050, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
        await delay(40);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(btnBackground, 2100, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
        await delay(40);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(btnBackground, 3150, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
        await delay(40);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(btnBackground, 4200, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
        await delay(40);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(btnBackground, 3150, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
        await delay(40);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(btnBackground, 2100, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
        await delay(40);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(btnBackground, 1050, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
        await delay(40);
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(btnBackground, 0, 0, 1050, 1079, 0, 0, 12 * em, 9 * em);
    }
}