'use strict';

const canvas = document.querySelector('#labyrinth-canvas')
const ctx = canvas.getContext('2d');

canvas.width = window.innerHeight;
canvas.height = window.innerHeight*0.8;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width*0.1, canvas.height);
ctx.fillRect(canvas.width*0.9, 0, canvas.width*0.1, canvas.height);

const frac = 30;
let x = canvas.width/frac;
let y = canvas.width/frac;
const radius = (canvas.width/frac)*0.45;
const offX = (canvas.width/frac)*0.05;
const offY = (canvas.width/frac)*0.05;

ctx.fillStyle = '#cc000040';
for (let j = 0; j < 30; j++) {
    if (j % 2 == 0) {
        for (let i = 0; i < 30; i += 2) {
            ctx.fillRect(i*x, j*y, x, y);
        }
    } else {
        for (let i = 1; i < 30; i += 2) {
            ctx.fillRect(i*x, j*y, x, y);
        }
    }
}

const maze = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
              [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]; // 24x24

ctx.fillStyle = 'green';
for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 24; j++) {
        if (maze[j][i] == 1) {
            ctx.fillRect((i + 3)*x, j*y, x, y);
        }
    }
}

ctx.beginPath();
ctx.arc(2*x - radius - offX, 2*y - radius - offY, radius, 0, Math.PI * 2); // initial position
ctx.fillStyle = "blue";
ctx.fill();
ctx.closePath();

let currI = 0;
let currJ = 1;

function drawPath(dx, dy) {
    ctx.beginPath();
    ctx.arc((currI + 4)*x - radius - offX + dx, (currJ + 1)*y - radius - offY + dy, radius, 0, Math.PI * 2); // initial position
    ctx.fillStyle = "aqua";
    ctx.fill();
    ctx.closePath();
}
function drawBall() {
    ctx.beginPath();
    ctx.arc((currI + 4)*x - radius - offX, (currJ + 1)*y - radius - offY, radius, 0, Math.PI * 2); // initial position
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
}
function draw(event) {
    //ctx.clearRect(canvas.width*0.1, 0, canvas.width*0.8, canvas.height);
    switch(event.code) {
        case 'ArrowRight':
            if (maze[currJ][currI + 1] != 0) {break;}
            const prevI = currI;
            while (maze[currJ][currI] == 0) {
                const interval = setInterval(function() { // !!! FIX !!!
                    for (let k = 0; k < 10; k++) {
                        //ctx.clearRect((currI + 1)*x, currJ*y, x, y);
                        drawPath(2, 0);
                    }
                }, 10);
                currI++;
            }
            currI--;
            
            drawBall();
            break;
        case 'ArrowDown':
            if (maze[currJ + 1][currI] != 0) {break;}
            while (maze[currJ][currI] == 0) {
                drawBall();
                currJ++;
            }
            currJ--;
            break;
        case 'ArrowLeft':
            if (maze[currJ][currI - 1] != 0 || (currI == 0 && currJ == 1)) {break;}
            while (maze[currJ][currI] == 0) {
                drawBall();
                currI--;
            }
            currI++;
            break;
        case 'ArrowUp':
            if (maze[currJ - 1][currI] != 0) {break;}
            while (maze[currJ][currI] == 0) {
                drawBall();
                currJ--;
            }
            currJ++;
            break;
    }
    console.log(currI, currJ);
}
window.addEventListener('keydown', draw);