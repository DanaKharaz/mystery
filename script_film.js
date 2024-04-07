'use strict';

/** FILM GRID & SCORE **/

const root = document.querySelector(':root');
const filmFrames = Array.from(document.querySelectorAll('.film-frame'));
const clickedFrames = [];
const frameKeys = []; // index of frame in filmFrames : index of image in imagesChosen
const countTaken = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let guesses = 0;
let moves = 20;
const imagesAll = ["A Nightmare on Elm Street (1984)",
                "A Quite Place (2018)",
                "Alien (1979)",
                "Beetlejuice (1988)",
                "Frankenstein (1931)",
                "Get Out (2017)",
                "Halloween (1978)",
                "Hereditary (2018)",
                "It (2017)",
                "Let Me In (2010)",
                "Mama (2013)",
                "Midsommar (2019)",
                "Nosferatu (1922)",
                "Psycho (1960)",
                "Ready or Not (2019)",
                "Sweeny Todd - The Demon Barber of Fleet Street (2007)",
                "Talk to Me (2023)",
                "The Exorcist (1973)",
                "The Shining (1980)",
                "The Silence of the Lambs (1991)",
                "The Texas Chainsaw Massacare (1974)",
                "The VVitch (2015)",
                "Us (2019)",
                "X (2022)"];
imagesAll.sort(() => 0.5 - Math.random()); // randomly sort the array
const imagesChosen = imagesAll.slice(0, 12);
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

async function revealOrHideFrame(event) {
    const delay = millis => new Promise((resolve, reject) => {setTimeout(_ => resolve(), millis)});

    if (isAnimating) { // not to interrupt other animation
        await delay(10);
    }

    const chosenFrame = event.target;
    const index = filmFrames.indexOf(chosenFrame);

    // action
    if (clickedFrames.includes(index)) { // this one is already clicked, so ignore
        return;
    } else { // reveal frame
        root.style.setProperty('--currImg', 'url("film/' + imagesChosen[frameKeys[index]] + '.png")');
        chosenFrame.classList.add('reveal-frame');
        chosenFrame.classList.remove('hide-frame');
        clickedFrames.push(index);
    }

    // check guess
    if (clickedFrames.length === 2) {
        if (frameKeys[clickedFrames[0]] === frameKeys[clickedFrames[1]]) { // correct guess
            // 'freeze' correctly guessed images and highlight them using border
            filmFrames[clickedFrames[0]].removeEventListener('click', revealOrHideFrame);
            filmFrames[clickedFrames[1]].removeEventListener('click', revealOrHideFrame);

            guessedFrames[clickedFrames[0]] = true;
            guessedFrames[clickedFrames[1]] = true;

            // restart guess
            clickedFrames.splice(0, 2);

            guesses++;
        } else { // wrong guess
            const delay = millis => new Promise((resolve, reject) => {
                setTimeout(_ => resolve(), millis);
            });
            isAnimating = true;
            await delay(500);
            filmFrames[clickedFrames[0]].classList.remove('reveal-frame');
            root.style.setProperty('--prevImg', 'url("film/' + imagesChosen[frameKeys[clickedFrames[0]]] + '.png")');
            filmFrames[clickedFrames[0]].classList.add('hide-frame');
            await delay(375);
            filmFrames[clickedFrames[1]].classList.remove('reveal-frame');
            root.style.setProperty('--prevImg', 'url("film/' + imagesChosen[frameKeys[clickedFrames[1]]] + '.png")');
            filmFrames[clickedFrames[1]].classList.add('hide-frame');
            await delay(375);
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
        for (let frame of filmFrames) {frame.removeEventListener('click', revealOrHideFrame);}
    }
    if (moves === 0) {
        // TO-DO : game over
        console.log("Game Over!");
        for (let frame of filmFrames) {frame.removeEventListener('click', revealOrHideFrame);}
    }
}

function showGuessesAndMovesLeft() {
    if (moves < 10) {movesTxt.textContent = 'attempts left: \u00A0' + moves;} // 2 spaces instead of 1 for cleaner look
    else {movesTxt.textContent = 'attempts left: ' + moves;}

    if (guesses < 10) {guessedTxt.textContent = 'detected: \u00A0' + guesses + ' / 12';} // 2 spaces instead of 1 for cleaner look
    else {guessedTxt.textContent = 'detected: ' + guesses + ' / 12';}
}

/** 'NEXT' BUTTON **/

const nextBtnAnim = document.querySelector('#film-next-btn');
const nextBtn = document.querySelector('#film-next-btn p');

nextBtn.addEventListener('click', nextBtnClick);
async function nextBtnClick(event) {
    const delay = millis => new Promise((resolve, reject) => {setTimeout(_ => resolve(), millis)});
    if (moves == 0 || guesses == 12) {
        await delay(40);
        nextBtnAnim.style.backgroundImage = 'url(film/next_btn_2.png)';
        await delay(40);
        nextBtnAnim.style.backgroundImage = 'url(film/next_btn_3.png)';
        await delay(40);
        nextBtnAnim.style.backgroundImage = 'url(film/next_btn_4.png)';
        await delay(40);
        nextBtnAnim.style.backgroundImage = 'url(film/next_btn_5.png)';
        nextBtn.removeEventListener('click', nextBtnClick);
        // TO-DO : continue to next game
    } else {
        await delay(40);
        nextBtnAnim.style.backgroundImage = 'url(film/next_btn_2.png)';
        await delay(40);
        nextBtnAnim.style.backgroundImage = 'url(film/next_btn_3.png)';
        await delay(40);
        nextBtnAnim.style.backgroundImage = 'url(film/next_btn_4.png)';
        await delay(40);
        nextBtnAnim.style.backgroundImage = 'url(film/next_btn_5.png)';
        await delay(40);
        nextBtnAnim.style.backgroundImage = 'url(film/next_btn_4.png)';
        await delay(40);
        nextBtnAnim.style.backgroundImage = 'url(film/next_btn_3.png)';
        await delay(40);
        nextBtnAnim.style.backgroundImage = 'url(film/next_btn_2.png)';
        await delay(40);
        nextBtnAnim.style.backgroundImage = 'url(film/next_btn_1.png)';
    }
}