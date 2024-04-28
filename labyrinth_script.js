'use strict';

const delay = millis => new Promise((resolve, reject) => {setTimeout(_ => resolve(), millis)});

const canvas = document.querySelector('#labyrinth-canvas')
const ctx = canvas.getContext('2d');

// TO-DO : to start the game must press Tab, add a simple riddle for it - reason: makes keydown work in iframe

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
while (items.length < 5) {
    const  itemRow = Math.floor(Math.random()*size);
    const itemCol = Math.floor(Math.random()*size);
    if (!items.includes([itemRow, itemCol]) && maze[itemRow][itemCol] != 1) items.push([itemRow, itemCol]);
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
ctx.fillRect(3*x, 0, (frac - 6)*x, (frac - 6)*y);
for (let col = 0; col < (frac - 6); col++) {
    for (let row = 0; row < (frac - 6); row++) {
        if (maze[row][col] === 0 || maze[row][col] === 8) {
            ctx.clearRect((col + 3)*x, row*y, x, y);
        }
    }
}

// place items in the maze
ctx.fillStyle = '#ffffff';
items.forEach((pos) => {
    ctx.beginPath();
    ctx.arc((pos[1] + 4)*x - radius/2 - offX*3, (pos[0] + 1)*y - radius/2 - offY*3, radius/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
});

// draw the moving circle at the maze entrance
ctx.fillStyle = '#3b3b3b'; // for the moving circle
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

async function drawCircle(dx, dy, entering = false, exiting = false) { // TO-DO : redraw items when overlapping ???
    isAnimating = true;

    if (entering) prevI = -2; // start  from a non-existing cell before maxe entrance
    if (exiting) currI = frac - 6 + 1; // end at  a non-existing cell after maze exit

    // initial circle position
    let arcX = (prevI + 4)*x - radius - offX;
    let arcY = (prevJ + 1)*y - radius - offY;
    let clearX = (prevI + 3)*x;
    let clearY = prevJ*y;

    // move circle until needed position is reached
    while (dx > 0 && arcX <= (currI + 4)*x - radius - offX ||
           dx < 0 && arcX >= (currI + 4)*x - radius - offX ||
           dy > 0 && arcY <= (currJ + 1)*y - radius - offY ||
           dy < 0 && arcY >= (currJ + 1)*y - radius - offY) {
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

window.addEventListener('keydown', circleMovement);

async function circleMovement(event) {
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

function mazeSolved() {
    if (items.length === 0) console.log('game won');
    else console.log('game lost');
    // TO-DO : transtion to next part of the game
}