'use strict';

document.querySelector('body').style.backgroundImage = 'url(blackout/hidden_message_demo.png)';

const canvas = document.querySelector('#blackout-canvas')
const ctx = canvas.getContext('2d');

const scaleX = canvas.width / window.innerWidth;
const scaleY = canvas.height / window.innerHeight;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const startBtn = document.querySelector('#blackout-start-btn');
startBtn.addEventListener('click', revealHiddenMessage);

function revealHiddenMessage(event) {
    startBtn.style.display = 'none'; // hide btn

    // show gradient right away
    const x = event.clientX * scaleX;
    const y = event.clientY * scaleY;
    const gradient = ctx.createRadialGradient(x, y, 1, x, y, 10); // x, y - center of each circle
    gradient.addColorStop(0, '#00000000');
    gradient.addColorStop(0.9, 'black');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear first
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    window.addEventListener('mousemove', translateGradient);
}

// move gradient based on mouse
function translateGradient(event) {
    console.log(event, event.clientX, event.clientY);
    const x = event.clientX * scaleX;
    const y = event.clientY * scaleY;
    const gradient = ctx.createRadialGradient(x, y, 1, x, y, 10); // x, y - center of each circle
    gradient.addColorStop(0, '#00000000');
    gradient.addColorStop(0.9, 'black');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear first
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}