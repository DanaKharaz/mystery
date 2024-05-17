'use strict';

const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));

/** TITLE **/
const title = document.querySelector('#index-title');
async function titleBlink() {
    const skip = 0;//FIXME100;
    for (let i = 0; i < 4; i++) {
        await delay(skip);
        title.textContent = 'M\u00A0STERY';
        await delay(skip);
        title.textContent = 'MYSTERY';
        await delay(skip);
        title.textContent = 'M\u00A0STERY';
        await delay(skip);
        title.textContent = 'MISTERY';
        await delay(skip);
        title.textContent = 'M\u00A0STERY';
        await delay(skip);
        title.textContent = 'MYS\u00A0ERY';
        await delay(skip);
        title.textContent = 'M\u00A0STERY';
        await delay(skip);
        title.textContent = 'MIS\u00A0ERY';
    }

    /*await delay(500);
    for (let i = 0; i < 5; i++) {
        await delay(80);
        title.textContent = '';
        await delay(80);
        title.textContent = 'MIS\u00A0ERY';
    }

    await delay(500);*/
    title.style.display = 'none';
    //await delay(500);

    newLine(true);
    showIntroText();
}
titleBlink();

/** INTRO SCREEN **/
const introScreen = document.querySelector('#intro-screen');

const introLines = [];
// TODO : write intro text
//const introText = "hello,\u00A0you.\u00A0how\u00A0did\u00A0you\u00A0end\u00A0up\u00A0here?\u00A0well..\u00A0there\u00A0is\u00A0no\u00A0escape\u00A0now\u00A01\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A01\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A02\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A03\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A04\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A05\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A06\u00A02345678\u00A07\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A08\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A09";
const introText = 'sample\u00A0text\u00A0123456789'
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

//FIXMEnewLine(true);
function newLine(starting = false) {
    if (!starting) introLines[lineI].style.animation = 'none'; // remove blinking bar from previous line
    const l = document.createElement('div');
    l.classList.add('intro-txt-line');
    introScreen.appendChild(l);
    introLines.push(l);
}

//FIXMEshowIntroText();
async function showIntroText() {
    while (charI < introText.length) {
        //await delay(charPauses[charI]);
        await delay(0); // FIXME test
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
    //FIXMEawait delay(1000);

    // show background and start button
    introScreen.style.display = 'none';
    // TODO background
    document.querySelector('#start-screen-container').classList.remove('start-screen-hidden');
}

/** BACKGROUND **/ //TODO

const canvas = document.querySelector('#intro-canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

ctx.fillStyle = '#3b3b3b';
for (let i = 0; i < 300; i++) {
    let x, y;
    x = Math.random() * window.innerWidth;
    y = Math.random() * window.innerHeight;

    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}
ctx.fillStyle = '#666666';
for (let i = 0; i < 400; i++) {
    let x, y;
    x = Math.random() * window.innerWidth;
    y = Math.random() * window.innerHeight;

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}
const img = new Image();
img.src = 'index_res/stars.png';//h500,w850
img.onload = function() {
    for (let i = 0; i < 200; i++) {
        let x, y;
        x = Math.random() * window.innerWidth;
        y = Math.random() * window.innerHeight;

        if (Math.floor(Math.random() * 3) % 2 == 1) ctx.drawImage(img, 0, 0, 500, 500, x - 7.5, y - 7.5, 15, 15);
        else ctx.drawImage(img, 550, 0, 300, 500, x - 4.5, y - 7.5, 9, 15);
    }
}


/** START BUTTON **/

const startBtn = document.querySelector('#start-btn');
const startBtnContainer = document.querySelector('#start-btn-container');
startBtn.addEventListener('click', transitionFirstGame);

async function transitionFirstGame(event) {
    startBtnContainer.classList.add('start-btn-container-moving');
    startBtn.removeEventListener('click', transitionFirstGame); // prevent second click during animation
    
    const delay = millis => new Promise((resolve, reject) => {setTimeout(_ => resolve(), millis)});
    await delay(3500);
    startBtnContainer.style.display = 'none'; // not visible anymore - no need to keep rotation

    startBtn.style.display = 'none';
}

/** CONNECT DOTS **/ //TODO

const mainContainer = document.querySelector('#start-screen-container');
// dictionary of dots (stars) that can be connected (will be filled from dots) - dot:number of dots it still needs to connect to (game done when all are 0)
//const connecitons = {};
// dictionary of dot connections {'xa,ya':['xb,yb','xc,yc'], 'xb,yb':['xa,ya'], ...] - point (xa,ya) connects to points (xb,yb) and (xc,yc)
//const dotsInitial = {'12.18756,41.11665':['15.23271,40.68721'], '15.23271,40.68721':['12.18756,41.11665'], '2.58692,41.86383':['20.776,41.76604'], '20.776,41.76604':['2.58692,41.86383'], '11.97483,48.02465':['6.69413,35.11627'], '13.44169,46.94895':['6.69413,35.11627'], '6.69413,35.11627':['13.44169,46.94895', '11.97483,48.02465']}; // TODO
const dots = {}; // A:[B,C]
const dotsBack = {}; // B:A, C:A
// define connections one way for now to not redraw same objects during set up (A:[B] included while B:[A] not included as it is redundant)
const dotsInitial = {'12.18756,41.11665':['15.23271,40.68721'], '2.58692,41.86383':['20.776,41.76604'], '6.69413,35.11627':['13.44169,46.94895', '11.97483,48.02465']}; // TODO : 70-x and 50-y
/*for (let i = 0; i < connections.length; i++) {
    const x1 = Math.round(connections[i][0]/70*window.innerWidth);
    const y1 = Math.round(connections[i][1]/50*window.innerHeight);
    const x2 = Math.round(connections[i][2]/70*window.innerWidth);
    const y2 = Math.round(connections[i][3]/50*window.innerHeight);

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(x1, y1, 3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(x2, y2, 3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    ctx.strokeStyle='green'; //FIXME
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

    if (!dots.includes([x1, y1])) dots.push([x1, y1]);
    if (!dots.includes([x2, y2])) dots.push([x2, y2]);

    connections[i] = [x1, y1, x2, y2];
}*/

ctx.strokeStyle = 'red'; // FIXME

for (const d in dotsInitial) { // set up the dots on canvas
    let dot = d.split(',');
    const x1 = Math.round(parseFloat(dot[0])/70*window.innerWidth);
    const y1 = Math.round(parseFloat(dot[1])/50*window.innerHeight);

    ctx.fillStyle = 'red'; // FIXME
    ctx.beginPath();
    ctx.arc(x1, y1, 3, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();

    dots[x1+','+y1] = [];

    for (let i = 0; i < dotsInitial[d].length; i++) {
        dot = dotsInitial[d][i].split(',');
        const x2 = Math.round(parseFloat(dot[0])/70*window.innerWidth);
        const y2 = Math.round(parseFloat(dot[1])/50*window.innerHeight);

        ctx.beginPath();
        ctx.arc(x2, y2, 3, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        dots[x1+','+y1].push(x2+','+y2);

        if (dotsBack[x2+','+y2]) dotsBack[x2+','+y2].push(x1+','+y1);
        else dotsBack[x2+','+y2] = [x1+','+y1];
    }
}
Object.assign(dots, dotsBack); // merge the dictionaries for easier searching later

const clicked = [];
const redrawn = []; // array of coordinates [[x,y], ...]
window.addEventListener('mousemove', async function(event) {
    ctx.fillStyle = 'red'; // FIXME
    for (const [x, y] of redrawn) { // redraw previously highlighted in default color
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
    redrawn.splice(0, redrawn.length);

    let found = false;
    for (const d in dots) {
        let dot = d.split(',');
        const x1 = parseInt(dot[0]);
        const y1 = parseInt(dot[1]);

        if (x1 - 6 <= event.clientX && x1 + 6 >= event.clientX &&
            y1 - 6 <= event.clientY && y1 + 6 >= event.clientY) { // the dots are small so checking a square is sufficient
            found = true;

            // highlight the dots it connects to
            for (const con of dots[d]) {
                dot = con.split(',');
                const x2 = parseInt(dot[0]);
                const y2 = parseInt(dot[1]);

                ctx.fillStyle = 'blue';
                ctx.beginPath();
                ctx.arc(x2, y2, 3, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
                ctx.closePath();

                redrawn.push([x2, y2]);
            }
        }
    }
    if (found) {
        document.querySelector('body').classList.remove('not-dot-btn');
        document.querySelector('body').classList.add('dot-btn');
    } else {
        document.querySelector('body').classList.remove('dot-btn');
        document.querySelector('body').classList.add('not-dot-btn');
    }
});

window.addEventListener('click', function(event) {
    let chosen;
    for (const d in dots) {
        let dot = d.split(',');
        const x1 = parseInt(dot[0]);
        const y1 = parseInt(dot[1]);

        if (x1 - 6 <= event.clientX && x1 + 6 >= event.clientX &&
            y1 - 6 <= event.clientY && y1 + 6 >= event.clientY) {
            chosen = d;
            break;
        }
    }
    if (chosen) clicked.push(chosen)

    if (clicked.length === 2) {
        if (dots[clicked[0]].includes(clicked[1])) {
            let dot = clicked[0].split(',');
            const x1 = parseInt(dot[0]);
            const y1 = parseInt(dot[1]);
            dot = clicked[1].split(',');
            const x2 = parseInt(dot[0]);
            const y2 = parseInt(dot[1]);

            // draw connecting line
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.closePath();

            // remove connection from dictionary (both ways)
            if (dots[clicked[0]].length == 1) delete dots[clicked[0]]; // dot is fully connected now
            else dots[clicked[0]] = dots[clicked[0]].filter((c) => c != clicked[1]);
            if (dots[clicked[1]].length == 1) delete dots[clicked[1]]; // dot is fully connected now
            else dots[clicked[1]] = dots[clicked[1]].filter((c) => c != clicked[0]);

            if (Object.keys(dots).length === 0) console.log('done'); // all dots are connected
        }
        clicked.splice(0, 2);
    }
});

/** DOLL ANIMATION **/ //TODO