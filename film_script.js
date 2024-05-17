'use strict';

window.addEventListener('message', function(event) {
    //event.data
    // TODO : listen for 'sound-on', 'sound-off'
});

/** FILM GRID & SCORE **/

const root = document.querySelector(':root');
const filmFrames = Array.from(document.querySelectorAll('.film-frame'));

let clickedFrames, countTaken, guesses, moves;
let frameKeys; // index of frame in filmFrames : index of image in imagesChosen
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

const movesTxt = document.querySelector('#film-moves-left');
const guessedTxt = document.querySelector('#film-guessed');

let imagesChosen, isAnimating, guessedFrames;

function startGame() {
    clickedFrames = [];
    frameKeys = []; // index of frame in filmFrames : index of image in imagesChosen
    countTaken = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    guesses = 0;
    moves = 20;

    imagesAll.sort(() => 0.5 - Math.random()); // randomly sort the array

    // send chosen movies to parent (for info panel)
    window.parent.postMessage('picking-films', '*');
    for (let i = 0; i < 12; i++) window.parent.postMessage(imagesAll[i], "*");
    window.parent.postMessage('picking-films', '*');

    imagesChosen = imagesAll.slice(0, 12);
    for (let i = 1; i <= 12; i++) root.style.setProperty('--img' + i, 'url("film_res/' + imagesChosen[i] + '.png")');
    isAnimating = false;
    guessedFrames = [];

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

        filmFrames[i].classList.remove('film-frame-done'); // in case restarting - pointer when hovering
    }

    showGuessesAndMovesLeft(); // in case restarting - reset to default values
}

startGame();

const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));

const animDur = 375;
const animationVals = {
    duration: animDur,
    iterations: 1,
    fill: 'forwards'
}

async function revealOrHideFrame(event) {
    if (isAnimating) { // not to interrupt other animation
        await delay(10);
    }

    const chosenFrame = event.target;
    const index = filmFrames.indexOf(chosenFrame);

    // action
    if (clickedFrames.includes(index)) { // this one is already clicked, so ignore
        return;
    } else { // reveal frame
        chosenFrame.animate([ // turn halfway (perpendicular to screen)
            {transform: 'rotateY(180deg)', opacity: 1, easing: 'ease-in'},
            {transform: 'rotateY(90deg)', content: 'url(film_res/film_back.png)', opacity: 1},
        ], animationVals);
        await delay(animDur);
        chosenFrame.animate([ // turn fully, showing image behind
            {transform: 'rotateY(90deg)', content: 'url("film_res/' + imagesChosen[frameKeys[index]] + '.png")', opacity: 0},
            {transform: 'rotateY(0)', content: 'url("film_res/' + imagesChosen[frameKeys[index]] + '.png")', opacity: 1, easing: 'ease-out'},
        ] , animationVals);
        
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

            guessedFrames.push(clickedFrames[0]);
            guessedFrames.push(clickedFrames[1]);

            // restart guess
            clickedFrames.splice(0, 2);

            guesses++;
        } else { // wrong guess
            isAnimating = true;

            await delay(750);

            // define content from the start animation as otherwise reverts to default (back of film) in Chrome

            // turn both halfway (perpendicular to screen)
            filmFrames[clickedFrames[0]].animate([
                {transform: 'rotateY(0)', content: 'url("film_res/' + imagesChosen[frameKeys[clickedFrames[0]]] + '.png")', opacity: 1, easing: 'ease-in'},
                {transform: 'rotateY(90deg)', content: 'url("film_res/' + imagesChosen[frameKeys[clickedFrames[0]]] + '.png")', opacity: 1},
            ], animationVals);
            filmFrames[clickedFrames[1]].animate([
                {transform: 'rotateY(0)', content: 'url("film_res/' + imagesChosen[frameKeys[clickedFrames[1]]] + '.png")', opacity: 1, easing: 'ease-in'},
                {transform: 'rotateY(90deg)', content: 'url("film_res/' + imagesChosen[frameKeys[clickedFrames[1]]] + '.png")', opacity: 1},
            ], animationVals);

            await delay(animDur); // wait for prev animation to end

            // turn both fully
            filmFrames[clickedFrames[0]].animate([
                {transform: 'rotateY(90deg)', content: 'url(film_res/film_back.png)', opacity: 0},
                {transform: 'rotateY(180deg)', content: 'url(film_res/film_back.png)', opacity: 1, easing: 'ease-out'},
            ] , animationVals);
            filmFrames[clickedFrames[1]].animate([ // turn fully
                {transform: 'rotateY(90deg)', content: 'url(film_res/film_back.png)', opacity: 0},
                {transform: 'rotateY(180deg)', content: 'url(film_res/film_back.png)', opacity: 1, easing: 'ease-out'},
            ] , animationVals);

            isAnimating = false;
            clickedFrames.splice(0, 2);
        }
        moves--;

        showGuessesAndMovesLeft();
    }

    // if done
    if (guesses === 12) {
        for (let frame of filmFrames) {
            frame.removeEventListener('click', revealOrHideFrame);
            frame.classList.add('film-frame-done'); // remove pointer when hovering
        }
        nextBtn.textContent = 'proceed'; // change button text
    }
    if (moves === 0) {
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
let animating = false;
async function nextBtnClick(event) {
    if (animating) return;

    if (guesses == 12) {
        // 'close' button animation
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
        window.parent.postMessage('film-won', '*');
    } else {
        animating = true;
        // close open frame if clicked mid guess
        if (clickedFrames.length === 1) {
            filmFrames[clickedFrames[0]].animate([ // turn halfway (perpendicular to screen)
                {transform: 'rotateY(0)', content: 'url("film_res/' + imagesChosen[frameKeys[clickedFrames[0]]] + '.png")', opacity: 1, easing: 'ease-in'},
                {transform: 'rotateY(90deg)', content: 'url("film_res/' + imagesChosen[frameKeys[clickedFrames[0]]] + '.png")', opacity: 1},
            ], animationVals);

            await delay(animDur); // wait for prev animation to end

            filmFrames[clickedFrames[0]].animate([ // turn fully
                {transform: 'rotateY(90deg)', content: 'url(film_res/film_back.png)', opacity: 0},
                {transform: 'rotateY(180deg)', content: 'url(film_res/film_back.png)', opacity: 1, easing: 'ease-out'},
            ] , animationVals);
        }
        // close guessed frames
        for (const i of guessedFrames) {
            filmFrames[i].animate([ // turn halfway (perpendicular to screen)
                {transform: 'rotateY(0)', content: 'url("film_res/' + imagesChosen[frameKeys[i]] + '.png")', opacity: 1, easing: 'ease-in'},
                {transform: 'rotateY(90deg)', content: 'url("film_res/' + imagesChosen[frameKeys[i]] + '.png")', opacity: 1},
            ], animationVals);
        }
        await delay(animDur); // wait for prev animation to end
        for (const i of guessedFrames) {
            filmFrames[i].animate([ // turn fully
                {transform: 'rotateY(90deg)', content: 'url(film_res/film_back.png)', opacity: 0},
                {transform: 'rotateY(180deg)', content: 'url(film_res/film_back.png)', opacity: 1, easing: 'ease-out'},
            ] , animationVals);
        }

        // 'close' and 'open' button animation
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

        // restart the game
        startGame();

        animating = false;
    }
}