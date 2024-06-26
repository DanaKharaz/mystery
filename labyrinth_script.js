'use strict';

const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));

const canvas = document.querySelector('#labyrinth-canvas')
const ctx = canvas.getContext('2d');

const jareth = document.querySelector('#labyrinth-jareth');
const jarethBubble = document.querySelector('#jareth-bubble');
async function startGame() {
    await delay(1000);
    jareth.style.display = 'initial';
    jarethBubble.style.display = 'initial';
    await delay(4000);
    jarethBubble.textContent = 'Well go ahead, find your way out of this maze. But even sTArting might Be trickier than it looks.';
    await delay(15000); 
    jarethBubble.style.display = 'none'; 
}
startGame();

/* ********************************************************************************************** */

/** RANDOM MAZE **/

const size = 25;

const maze = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]

function createMaze(cellX, cellY) {
    maze[cellY][cellX] = 0; // add a path

    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
    while (directions.length > 0) {
        // randomly choose direction
        const index = Math.floor(Math.random() * directions.length);
        let dir = directions[index];
        directions.splice(index, 1);

        // choose next cell not adjacent to allow for proper walls
        const nextX = cellX + dir[0]*2;
        const nextY = cellY + dir[1]*2;

        // the choice is valid iff  it's within the bounds of the grid and  there is a wall between us and it
        let validChoice = false;
        if (nextX >= 0 && nextX < size && nextY >= 0  && nextY < size) validChoice = (maze[nextY][nextX] === 1);

        if (validChoice) {
            // break the wall between us and next cell, then continue from next cell
            maze[cellY + dir[1]][cellX + dir[0]] = 0;
            createMaze(nextX, nextY);
        }
    }
}

// generate the maze
createMaze(1, 1);
// add entrance and exit
maze[1][0] = 0;
maze[size - 2][size - 1] = 0;

// find crossroads
for (let col = 1; col < size - 1; col++) {
    for (let row = 1; row < size - 1; row++) {
        // path cells with more than 2 possible next steps are crossroads
        if ([maze[row - 1][col], maze[row][col - 1], 
            maze[row + 1][col], maze[row][col + 1]].filter((v) => v == 0).length > 2 && 
            maze[row][col] == 0) maze[row][col] = 8;
    }
}

// more complexity to the maze - need to collect 5 items before leaving
let items = [];
while (items.length < 20) {
    const itemRow = Math.floor(Math.random()*size);
    const itemCol = Math.floor(Math.random()*size);
    if (!items.includes([itemRow, itemCol]) && maze[itemRow][itemCol] != 1 && ![0, size - 1].includes(itemCol)) items.push([itemRow, itemCol]);
}

/* ********************************************************************************************** */

/** INITIAL LAYOUT **/

canvas.width = window.innerHeight;
canvas.height = window.innerHeight*0.8;

const frac = 31;
let x = canvas.width/frac;
let y = canvas.width/frac;
const radius = (canvas.width/frac)*0.4;
const offX = (canvas.width/frac)*0.1;
const offY = (canvas.width/frac)*0.1;

// draw the maze
ctx.fillStyle = '#666666';
ctx.fillRect(3*x, 0, size*x, size*y);
for (let col = 0; col < size; col++) {
    for (let row = 0; row < (frac - 6); row++) {
        if (maze[row][col] === 0 || maze[row][col] === 8) {
            ctx.clearRect((col + 3)*x - 0.5, row*y - 0.5, x + 1, y + 1); // '+3' to accomodate for emty space before the maze, '-0.5' and '+1' to eliminate thin lines between cells
        }
    }
}
// 'clean up' the maze entry and exit (there is a thin gray line there otherwise)
ctx.clearRect(3*x - 2, 1*y, 4, y);
ctx.clearRect((size + 3)*x - 2, (size - 2)*y, 4, y);

// place items in the maze
ctx.fillStyle = '#ffffff';
items.forEach((pos) => {
    ctx.beginPath();
    ctx.arc((pos[1] + 4)*x - radius/2 - offX*3, (pos[0] + 1)*y - radius/2 - offY*3, radius/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
});

// draw the moving circle at the maze entrance
ctx.fillStyle = '#3b3b3b';
ctx.beginPath();
ctx.arc(2*x - radius - offX, 2*y - radius - offY, radius, 0, Math.PI * 2); // initial position
ctx.fill();
ctx.closePath();

/* ********************************************************************************************** */

/** GAME ANIMATION **/

// animate circle movement activated by arrow keys
let started = false;
let currI = 0;
let currJ = 1;
let prevI, prevJ;

let isAnimating = false;

let dx, dy, arcX, arcY, finalArcX, finalArcY, clearX, clearY;
async function drawCircle(dx, dy, entering = false, exiting = false) {
    isAnimating = true;

    if (entering) prevI = -2; // start  from a non-existing cell before maxe entrance
    if (exiting) currI = frac - 6 + 1; // end at  a non-existing cell after maze exit

    // initial circle position
    arcX = (prevI + 4)*x - radius - offX;
    arcY = (prevJ + 1)*y - radius - offY;
    finalArcX = (currI + 4)*x - radius - offX;
    finalArcY = (currJ + 1)*y - radius - offY
    clearX = (prevI + 3)*x;
    clearY = prevJ*y;

    // move circle until needed position is reached
    while (dx > 0 && arcX <= finalArcX ||
           dx < 0 && arcX >= finalArcX ||
           dy > 0 && arcY <= finalArcY ||
           dy < 0 && arcY >= finalArcY) {
        await delay(3);
        ctx.clearRect(clearX, clearY, x, y);

        arcX += dx;
        arcY += dy;
        clearX += dx;
        clearY += dy;

        ctx.beginPath();
        ctx.arc(arcX, arcY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    // draw at final position (in case of discreptancies due to adding/subtracting steps)
    ctx.clearRect((currI + 3)*x, currJ*y, x, y);
    ctx.beginPath();
    ctx.arc((currI + 4)*x - radius - offX, (currJ + 1)*y - radius - offY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    isAnimating = false;
}

window.addEventListener('keydown', moveCircle);

async function moveCircle(event) {
    if (isAnimating) return; // should not interrupt current animation

    // initinal position
    prevI = currI;
    prevJ = currJ;

    const step = 2;

    const itemsNew = [];

    // move based on pressed key
    switch(event.code) {
        case 'ArrowRight':
            if (maze[currJ][currI + 1] === 1) break; // can't go in this direction because of a wall
            currI++; // start moving (here beacause loop below won't move from crossroad)
            while (maze[currJ][currI] === 0) currI++;
            if (maze[currJ][currI] != 8) currI--; // will go into a wall otherwise
            if (!started) {
                drawCircle(step, 0, true);
                started = true;
            }
            else if (currI == (frac - 6 - 1) && currJ == (frac - 6 - 2)) {
                drawCircle(step, 0, false, true);
                mazeSolved();
            } else {
                drawCircle(step, 0);
            }

            for (let k = 0; k < items.length; k++) { // check if any items were collected
                if (!(prevI < items[k][1] && items[k][1] <= currI && currJ === items[k][0])) itemsNew.push(items[k]);
            }
            items = itemsNew;

            break;
        case 'ArrowDown':
            if (maze[currJ + 1][currI] === 1) break; // can't go in this direction because of a wall
            currJ++; // start moving (here beacause loop below won't move from crossroad)
            while (maze[currJ][currI] === 0) currJ++;
            if (maze[currJ][currI] != 8) currJ--; // will go into a wall otherwise
            drawCircle(0, step);

            for (let k = 0; k < items.length; k++) { // check if any items were collected
                if (!(prevJ < items[k][0] && items[k][0] <= currJ && currI === items[k][1])) itemsNew.push(items[k]);
            }
            items = itemsNew;

            break;
        case 'ArrowLeft':
            if (maze[currJ][currI - 1] === 1 || (currI == 0 && currJ == 1)) break; // can't go in this direction because of a wall
            currI--; // start moving (here beacause loop below won't move from crossroad)
            while (maze[currJ][currI] === 0) currI--;
            if (maze[currJ][currI] != 8) currI++; // will go into a wall otherwise
            drawCircle(-step, 0);

            for (let k = 0; k < items.length; k++) { // check if any items were collected
                if (!(prevI > items[k][1] && items[k][1] >= currI && currJ === items[k][0])) itemsNew.push(items[k]);
            }
            items = itemsNew;

            break;
        case 'ArrowUp':
            if (maze[currJ - 1][currI] === 1) break; // can't go in this direction because of a wall
            currJ--; // start moving (here beacause loop below won't move from crossroad)
            while (maze[currJ][currI] === 0) currJ--;
            if (maze[currJ][currI] != 8) currJ++; // will go into a wall otherwise
            drawCircle(0, -step);

            for (let k = 0; k < items.length; k++) { // check if any items were collected
                if (!(prevJ > items[k][0] && items[k][0] >= currJ && currI === items[k][1])) itemsNew.push(items[k]);
            }
            items = itemsNew;

            break;
    }
}

async function mazeSolved() {
    if (items.length === 0) {
        jarethBubble.textContent = 'Look at you all happy that you solved the maze. You think you beat me already? Did you really think it would be that easy? Well then I have an amazing surprise for you. I don\'t think you\'ll find it \'amazing\' though.';
        jarethBubble.style.display = 'initial';
        await delay(15000);
        canvas.style.display = 'none';
        jarethBubble.textContent = 'I heard you\'ve been collecting puzzle pieces during this journey. You probably have enough to escape now. And I know a perfect place to sit down and assemble your puzzle, you should go there. But you might just go insane trying, we\'ll see.';
        await delay(10000);
        jarethBubble.style.display = 'none';
        jareth.style.display = 'none';
        startRelativity();
    } else {
        jarethBubble.textContent = 'I knew it, you can\'t beat my maze. But lucky for you, I\'m feeling quite generous today, so I\'ll pretend it never happened. You can try again';
        jarethBubble.style.display = 'initial';
        await delay(10000);
        window.location.reload();
    }
}

/** 3D MAZE **/

const videoIntro = document.querySelector('#labyrinth-3d-intro');
videoIntro.defaultPlaybackRate = 0.2;
const videoA = document.querySelector('#labyrinth-3d-a');
videoA.defaultPlaybackRate = 0.2;
const videoAB = document.querySelector('#labyrinth-3d-a-b');
videoAB.defaultPlaybackRate = 0.2;
const videoAC = document.querySelector('#labyrinth-3d-a-c');
videoAC.defaultPlaybackRate = 0.2;
const videoBD = document.querySelector('#labyrinth-3d-b-d');
videoBD.defaultPlaybackRate = 0.2;
const videoBE = document.querySelector('#labyrinth-3d-b-e');
videoBE.defaultPlaybackRate = 0.2;
const videoCD = document.querySelector('#labyrinth-3d-c-d');
videoCD.defaultPlaybackRate = 0.2;
const videoCF = document.querySelector('#labyrinth-3d-c-f');
videoCF.defaultPlaybackRate = 0.2;

const keysImg = document.querySelector('#labyrinth-3d-keys');

let currPlace = 'intro';
let animating3D = false;

async function startRelativity() {
    keysImg.style.display = 'initial';

    animating3D = true;

    window.addEventListener('keydown', move3D);

    // in case of restart (no need to reset BD and CD, as they don't lead to restart)
    videoIntro.currentTime = 0;
    videoA.currentTime = 0;
    videoAB.currentTime = 0;
    videoAC.currentTime = 0;
    videoBE.currentTime = 0;
    videoCF.currentTime = 0;

    videoIntro.style.display = 'initial';
    await delay(1000);
    videoIntro.currentTime = 0;
    videoIntro.play();
    await delay(200);
    keysImg.src = 'labyrinth_res/up.png';
    animating3D = false;
}

async function move3D(event) {
    if (animating3D) return;

    if (event.key == 'ArrowUp') {
        if (currPlace == 'intro') {
            animating3D = true;
            videoA.style.display = 'initial';
            videoIntro.style.display = 'none';
            videoA.play();
            await delay(3000);
            currPlace = 'A';
            keysImg.src = 'labyrinth_res/sides.png';
            animating3D = false;
            return;
        }
        if (currPlace == 'B') {
            // lost
            animating3D = true;
            videoBE.style.display = 'initial';
            videoAB.style.display = 'none';
            videoBE.play();
            await delay(6000);
            // restart
            currPlace = 'intro';
            animating3D = false;
            keysImg.src = 'labyrinth_res/none.png';
            videoBE.style.display = 'none';
            startRelativity();
            return;
        }
    }

    if (event.key == 'ArrowLeft') {
        if (currPlace == 'A') {
            animating3D = true;
            videoAC.style.display = 'initial';
            videoA.style.display = 'none';
            videoAC.play();
            await delay(3000);
            currPlace = 'C';
            keysImg.src = 'labyrinth_res/sides.png';
            animating3D = false;
            return;
        }
        if (currPlace == 'C') {
            // lost
            animating3D = true;
            videoCF.style.display = 'initial';
            videoAC.style.display = 'none';
            videoCF.play();
            await delay(3000);
            // restart
            currPlace = 'intro';
            animating3D = false;
            keysImg.src = 'labyrinth_res/none.png';
            videoCF.style.display = 'none';
            startRelativity();
            return;
        }
    }

    if (event.key == 'ArrowRight') {
        if (currPlace == 'A') {
            animating3D = true;
            videoAB.style.display = 'initial';
            videoA.style.display = 'none';
            videoAB.play();
            await delay(6000);
            currPlace = 'B';
            keysImg.src = 'labyrinth_res/up_right.png';
            animating3D = false;
            return;
        }
        if (currPlace == 'B') {
            animating3D = true;
            videoBD.style.display = 'initial';
            videoAB.style.display = 'none';
            videoBD.play();
            await delay(6000);

            // notify parent
            window.parent.postMessage('labyrinth-won', '*');
        }
        if (currPlace == 'C') {
            animating3D = true;
            videoCD.style.display = 'initial';
            videoAC.style.display = 'none';
            videoCD.play();
            await delay(6000);

            // notify parent
            window.parent.postMessage('labyrinth-won', '*');
        }
    }
}