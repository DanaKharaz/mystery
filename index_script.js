'use strict';

const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));

/** TITLE **/
const title = document.querySelector('#index-title');
async function titleBlink() {
    const skip = 50;
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

    await delay(500);
    for (let i = 0; i < 5; i++) {
        await delay(80);
        title.textContent = '';
        await delay(80);
        title.textContent = 'MIS\u00A0ERY';
    }

    await delay(500);
    title.style.display = 'none';

    newLine(true);
    showIntroText();
}

/** INTRO SCREEN **/
const introScreen = document.querySelector('#intro-screen');

const introLines = [];
const introText = "hello,\u00A0you.\u00A0how\u00A0did\u00A0you\u00A0end\u00A0up\u00A0here?\u00A0well..\u00A0there\u00A0is\u00A0no\u00A0escape\u00A0now\u00A0would\u00A0you\u00A0like\u00A0to\u00A0play\u00A0a\u00A0game?\u00A0Or\u00A0maybe\u00A0a\u00A0few.\u00A0But\u00A0be\u00A0prepared,\u00A0it\u00A0might\u00A0not\u00A0be\u00A0easy.\u00A0Especially\u00A0in\u00A0the\u00A0beginning.\u00A0But\u00A0we\'ll\u00A0help\u00A0you\u00A0So,\u00A0let\'s\u00A0start.\nRight\u00A0away\u00A0I'll\u00A0give\u00A0you\u00A0a\u00A0hint:\u00A0read\u00A0between\u00A0the\u00A0lines\u00A0stars";
const introTextWords = introText.split('\u00A0');

const maxCharPerLine = 66;
let charI = 0;
let wordI = 0;
let lineI = 0;
let charsInLine = 0;

// add longer pauses after certain characters
const defaultPause = 100;
const charPauses = new Array(introText.length).fill(defaultPause); // cantains pauses in millis (100 by default)
// pauses
charPauses[6] = 1000;
charPauses[11] = 1000;
charPauses[36] = 1000;
charPauses[43] = 1000;
charPauses[67] = 1000;
charPauses[98] = 1000;
charPauses[114] = 1000;
charPauses[182] = 1000;
charPauses[201] = 1000;
charPauses[219] = 1000;
charPauses[273] = 1000;

// add html text effects
// strikethrough effect {index of last char affected : length affected} - the word is written then striked
const charStrikes = {};
charStrikes[272] = 5;

newLine(true);
function newLine(starting = false) {
    if (!starting) introLines[lineI].style.animation = 'none'; // remove blinking bar from previous line
    const l = document.createElement('div');
    l.classList.add('intro-txt-line');
    introScreen.appendChild(l);
    introLines.push(l);

    charsInLine = 0;
}

async function showIntroText() {
    while (charI < introText.length) {
        await delay(charPauses[charI]);

        if (introText[charI] == '\n') { // line break within text
            newLine();
            lineI++;
            charI++;
            continue;

        }
        if (charsInLine == maxCharPerLine) { // no more space, so start new line
            newLine();
            lineI++;
        }

        if (introText[charI] == '\u00A0') {
            wordI++; // starting next word
            
            // next word will not fit, so start new line
            if (charsInLine + introTextWords[wordI].length > maxCharPerLine) {
                newLine();
                lineI++;
            }

            // should not start line with a blank space
            if (introLines[lineI].textContent.length == 0) { // using textContent here as it is unrelated to text effects
                charI++;
                continue;
            }
        }

        introLines[lineI].innerHTML += introText[charI]; // innerHTML and not textContent to allow for text effects

        if (charStrikes[charI]) { // add strikethrough effect
            await delay(charPauses[charI + 1]); // wait before srtriking out the word

            // get the part before soon-to-be striked out phrase
            const n = introLines[lineI].innerHTML.length;
            const withoutStrike = introLines[lineI].innerHTML.substring(0, n - charStrikes[charI]);

            // strike out the phrase character by character
            const strike = introText.substring(charI + 1 - charStrikes[charI], charI + 1);
            for (let i = 1; i < strike.length + 1; i++) {
                introLines[lineI].innerHTML = withoutStrike + '<s>' + strike.substring(0, i) + '</s>' + strike.substring(i);
                await delay(defaultPause);
            }
        }

        charI++
        charsInLine++;
    }
    await delay(1000);

    // hide intro text
    introScreen.animate({
        opacity: [1, 0],
        easing: ['ease-in', 'ease-out']
    }, 2000);
    await delay(2000);
    introScreen.style.display = 'none';

    // show background and start button
    generalBackground(); // stars, graveyard, initial doll
    dotGameBackground(); // connectable dots
    document.querySelector('#start-screen-container').classList.remove('start-screen-hidden');
    document.querySelector('#start-screen-container').animate({
        opacity: [0, 1],
        easing: ['ease-in', 'ease-out']
    }, 2000);
}

/** BACKGROUND **/

const canvas = document.querySelector('#intro-canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

const skyH = window.innerHeight / 2.5; // part of the screen covered with stars
const hBg = window.innerWidth / 5 * 3; // background height
const xBg = window.innerHeight - hBg; // X of the background
let dollX = window.innerWidth * 0.3; // initial X of the doll
const dollY = window.innerHeight - window.innerWidth * 0.2;
const dollSize = window.innerWidth * 0.15; // img is square, so both W and H

function generalBackground() {
    ctx.strokeStyle = '#3b3b3b';
    ctx.fillStyle = '#666666';
    for (let i = 0; i < 200; i++) {
        let x, y;
        x = Math.random() * window.innerWidth;
        y = Math.random() * skyH;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
    ctx.fillStyle = '#3b3b3b';
    for (let i = 0; i < 150; i++) {
        let x, y;
        x = Math.random() * window.innerWidth;
        y = Math.random() * skyH;

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
    const imgStars = new Image();
    imgStars.src = 'index_res/stars.png';
    imgStars.onload = function() {
        for (let i = 0; i < 40; i++) {
            let x, y;
            x = Math.random() * window.innerWidth;
            y = Math.random() * skyH;

            if (Math.floor(Math.random() * 3) % 2 == 1) ctx.drawImage(imgStars, 0, 0, 500, 500, x - 7.5, y - 7.5, 15, 15);
            else ctx.drawImage(imgStars, 550, 0, 300, 500, x - 4.5, y - 7.5, 9, 15);
        }
    }
    
    ctx.drawImage(imgBg, 0, xBg, window.innerWidth, hBg);
    ctx.drawImage(imgDollWalk, 0, 0, 500, 500, dollX, dollY, dollSize, dollSize); // initial position of the doll
}

/** START BUTTON **/

const startBtn = document.querySelector('#start-btn');
const startBtnContainer = document.querySelector('#start-btn-container');
startBtn.addEventListener('click', transitionFirstGame);

async function transitionFirstGame(event) {
    startBtnContainer.classList.add('start-btn-container-moving');
    startBtn.removeEventListener('click', transitionFirstGame); // prevent second click during animation
    startBtn.animate({
        opacity: [1, 0],
        easing: ['ease-in', 'ease-out']
    }, 3000);
    await delay(3000);

    startBtnContainer.style.display = 'none';
    startBtn.style.display = 'none';

    dotGame(); // start the game
}

/** CONNECT DOTS **/

const mainContainer = document.querySelector('#start-screen-container');

// arrays of dot connections for each letter [['xa,ya', ['xb,yb','xc,yc']], ...] - point (xa,ya) connects to points (xb,yb) and (xc,yc)

// define connections one way for now to not redraw same objects during setup ([A, [B]] included while [B, [A]] not included as it is redundant)
const dots1 = [['12.18756,8.88335',['15.23271,9.31279']], ['2.58692,8.13617',['20.776,8.23396']], ['6.69413,14.88373',['13.44169,3.05105', '11.97483,1.97535']], ['20.67826,3.34443',['15,15', '18.03791,15.3727']], ['6.4986,6.27816',['20,10', '12.56163,9.79862']], ['14.61523,7.54944',['18.42907,10.18979']], ['7.28092,9.0163',['21.65617,10.28758']], ['12.3958,2.84147',['7.30317,12.23804']], ['5.67032,13.83747',['7.16187,9.82739']], ['20.01854,5.35323',['16.44497,15.72295', '17.81697,13.1704']], ['16.03019,14.47858',['21.93295,4.45984']]];
const dots2 = [['36,4',['24,6']], ['25.69795,3.27929',['32.14313,3.72598', '26.27228,4.93844', '22.6349,17.47782', '24.70884,10.45832']], ['27.51664,2.32208',['22.95397,18.37121']], ['24.93219,8.0015',['34.15326,11.00074']], ['34.15326,11.73459',['24.29405,8.41629']], ['28.60147,10.45832',['26.62325,8.12912', '32.49411,12.02176']], ['32.33457,10.07544',['26.20846,9.66065']], ['28.00005,4.00001',['25.21935,12.91515']], ['24.58121,17.3821',['24.38977,15.30816', '35.46144,14.15951']], ['34.88712,13.649',['26.8466,16.20155', '32.4622,15.91439']], ['36.80153,14.5424',['24.07071,18.27549', '29.55868,16.23346']], ['23.78354,17.70117',['28.47385,15.14863', '28.60147,17.41401']]];
const dots3 = [['51.70201,14.22333',['40,18']], ['40.08793,18.7541',['50.7129,14.92528']], ['52.49969,15.0529',['46,16']], ['41.3323,11.83032',['43.82103,18.37121', '41.55564,19.42414']], ['43.91675,3.08785',['41.04514,17.03113', '41.52374,10.23497']], ['41.04514,14.5743',['41.84281,3.47073']], ['42.41713,5.64039',['42.19378,16.32918']], ['40.75797,15.88248',['41.20467,5.38514', '43.43815,7.74624']]];
const dots4 = [['51.44676,16.93541',['62.8375,4.55556']], ['52.1168,17.60545',['62.90131,5.89565']], ['58,12',['61.9122,4.71509']], ['60.25304,12.56417',['57.98766,9.11824', '67.27254,12.50036']], ['53.80787,17.09494',['55.14795,13.52138']], ['56.64757,12.11748',['65.74102,6.78904']], ['56.55185,13.87235',['60.44448,11.51125']], ['59.77444,11.00074',['62.55033,13.23422']], ['66.63441,11.06455',['63.3161,13.68091', '64.81572,14.06379']], ['68.32547,9.02251',['67.33636,14.5424', '65.99627,14.28714']], ['66.69822,14.47858',['67.36827,7.65052']], ['67.62352,9.27777',['60.63593,5.51276', '63.98614,5.44895']], ['66.88966,7.01238',['66.47487,8.99061']]];
const dots5 = [['17.4976,36.6378',['20.14944,46.27621','20,40']], ['21.93433,47.29615',['20.09844,41.94147', '21.98533,42.19646']], ['19.28249,36.79079',['19.07851,44.69531', '21.16938,43.06341']], ['28.56393,42.55344',['15,35', '26.72804,40.51356']], ['16.78365,35.26088',['25.91209,40.20758']], ['21.93433,38.37169',['24.48418,40.76855']], ['26.83003,31.6401',['23.20925,40.46257', '25.30013,38.11671']], ['25.09614,36.6888',['29.12489,31.58911']], ['31.01178,30.36518',['27.64598,32.20107', '32.3377,47.34714']], ['30,30',['33.25564,45.25627', '31.92972,35.41387']], ['33.35763,43.01241',['30.6038,37.50475', '32.54168,38.77967']]];
const dots6 = [['35.19352,45.76624',['40.29321,29.34524']], ['38.61031,38.11671',['36.57044,44.18534']], ['46.36184,30.41618',['35.80548,40.71755', '39.32427,35.20989']], ['48.50371,47.29615',['34.78555,41.99247']], ['34.88754,44.08334',['40,45']], ['42.74106,45.97023',['38.50832,43.98135']], ['48.24872,46.22521',['38.20234,44.95029', '44.78093,47.09216']], ['39.47726,36.48481',['48.24872,40.20758', '41.05816,38.2697']], ['43.81199,37.35176',['39.73224,38.42269', '48.40171,38.72867']], ['47.53477,37.60674',['43.96498,38.93266']], ['52.12449,35.20989',['41.46614,30.46718']], ['40.95617,31.18113',['47.17779,32.09908']], ['50.33959,33.425',['44.57695,32.91503']], ['50,35',['42.94505,30.0592']], ['43.14903,31.94609',['37.79436,34.59792', '40.14022,32.20107']], ['37.43738,36.43381',['38.04935,42.60443']]];

// choose dots
let connectionsN = 0;
const dotsInitial = {};
for (const dotsN of [dots1, dots2, dots3, dots4, dots5, dots6]) {
    let n = Math.floor(Math.random() * 4 + 4); // choose 4 to 7 connection points for each (it will actually be more points as for now connecitons are one-sided)

    dotsN.sort(() => 0.5 - Math.random()); // randomly sort the array

    for (let i = 0; i < n; i++) {
        dotsInitial[dotsN[i][0]] = dotsN[i][1];
        connectionsN += dotsN[i][1].length;
    }
}

// store values for this window in dictionaries (calculated in setup)
const dots = {}; // {A:[B,C], ...}
const dotsBack = {}; // {B:A, C:A, ...} - connections can be made in either direction

function dotGameBackground() {
    for (const d in dotsInitial) { // set up the dots on canvas
        const width = skyH / 50 * 70;
        const offX = (window.innerWidth - width) / 2;

        let dot = d.split(',');
        const x1 = Math.round(parseFloat(dot[0]) / 70 * width) + offX;
        const y1 = Math.round(parseFloat(dot[1]) / 50 * skyH);

        ctx.fillStyle = '#3b3b3b';
        ctx.beginPath();
        ctx.arc(x1, y1, 3, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        dots[x1 + ',' + y1] = [];

        for (let i = 0; i < dotsInitial[d].length; i++) {
            dot = dotsInitial[d][i].split(',');
            const x2 = Math.round(parseFloat(dot[0]) / 70 * width) + offX;
            const y2 = Math.round(parseFloat(dot[1]) / 50 * skyH);

            ctx.beginPath();
            ctx.arc(x2, y2, 3, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.closePath();

            dots[x1 + ',' + y1].push(x2 + ',' + y2);

            if (dotsBack[x2 + ',' + y2]) dotsBack[x2 + ',' + y2].push(x1 + ',' + y1);
            else dotsBack[x2 + ',' + y2] = [x1 + ',' + y1];
        }
    }
    Object.assign(dots, dotsBack); // merge the dictionaries for easier searching later
}

function dotGame() {
    // show number of connections
    const dotCounter = document.querySelector('#dot-counter');
    dotCounter.style.display = 'inherit';
    dotCounter.textContent = 0 + ' / ' + connectionsN;

    const clicked = [];
    const redrawn = []; // array of coordinates [[x,y], ...]
    window.addEventListener('mousemove', function(event) {
        ctx.fillStyle = '#3b3b3b';
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

            if (x1 - 3 <= event.clientX && x1 + 3 >= event.clientX &&
                y1 - 3 <= event.clientY && y1 + 3 >= event.clientY) { // the dots are small so checking a square is sufficient
                found = true;

                // highlight the dots it connects to
                for (const con of dots[d]) {
                    dot = con.split(',');
                    const x2 = parseInt(dot[0]);
                    const y2 = parseInt(dot[1]);

                    ctx.fillStyle = '#ffffff';
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

    let connectedN = 0;
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

                connectedN++;
                dotCounter.textContent = connectedN + ' / ' + connectionsN;

                if (Object.keys(dots).length === 0) startAnimation(); // all dots are connected, so move on to starting animation

                clicked.splice(0, 2); // remove both
            } else clicked.splice(0, 1); // remove only one - next guess compared with latest click
        }
    });
}

/** DOLL ANIMATION **/

async function startAnimation() {
    const redrawBgX = window.innerHeight - window.innerWidth / 5 * 3;
    const redrawBgH = window.innerWidth / 5 * 3;

    const clearX = window.innerHeight / 3 * 2; // no need to clear and redraw the sky
    const clearH = window.innerHeight / 3;

    const finalDollX = window.innerWidth * 0.46;

    // hand animation
    await delay(1500);
    for (let i = 0; i < 4; i++) {
        ctx.clearRect(0, clearX, window.innerWidth, clearH);
        ctx.drawImage(imgBg, 0, xBg, window.innerWidth, hBg);
        ctx.drawImage(imgHand, i * 2000, 0, 2000, 1200, 0, xBg, window.innerWidth, hBg); // same dimensions as background
        ctx.drawImage(imgDollWalk, 0, 0, 500, 500, dollX, dollY, dollSize, dollSize); // initial position of the doll
        await delay(170);
    }

    // doll animation
    let frame = 0;
    let i = 0;
    dollWalk();
    async function dollWalk() {
        if (frame % 7 == 0) { // change sprite and move
            ctx.clearRect(0, clearX, window.innerWidth, clearH);
            ctx.drawImage(imgBg, 0, xBg, window.innerWidth, hBg);
            ctx.drawImage(imgHand, 6000, 0, 2000, 1200, 0, xBg, window.innerWidth, hBg); // last hand
            ctx.drawImage(imgDollWalk, i * 500, 0, 500, 500, dollX, dollY, dollSize, dollSize);

            if (i == 3) i = 0;
            else i++;
            frame = 0;
            dollX += 7; // move right
        }
        frame++;
        if (dollX < finalDollX) window.requestAnimationFrame(dollWalk);
        else { // reached needed place
            // doll reaches to the hand
            await delay(100);
            ctx.clearRect(0, clearX, window.innerWidth, clearH);
            ctx.drawImage(imgBg, 0, xBg, window.innerWidth, hBg);
            ctx.drawImage(imgHand, 6000, 0, 2000, 1200, 0, xBg, window.innerWidth, hBg); // last hand
            ctx.drawImage(imgDollReach, 0, 0, 500, 500, finalDollX, dollY, dollSize, dollSize); // standing pose (sprite 1)
            await delay(100)
            ctx.clearRect(0, clearX, window.innerWidth, clearH);
            ctx.drawImage(imgBg, 0, xBg, window.innerWidth, hBg);
            ctx.drawImage(imgHand, 6000, 0, 2000, 1200, 0, xBg, window.innerWidth, hBg);
            ctx.drawImage(imgDollReach, 500, 0, 500, 500, finalDollX, dollY, dollSize, dollSize); // sprite 2
            await delay(100)
            ctx.clearRect(0, clearX, window.innerWidth, clearH);
            ctx.drawImage(imgBg, 0, xBg, window.innerWidth, hBg);
            ctx.drawImage(imgHand, 6000, 0, 2000, 1200, 0, xBg, window.innerWidth, hBg);
            ctx.drawImage(imgDollReach, 1000, 0, 500, 500, finalDollX, dollY, dollSize, dollSize); // sprite 3
            await delay(100)
            ctx.clearRect(0, clearX, window.innerWidth, clearH);
            ctx.drawImage(imgBg, 0, xBg, window.innerWidth, hBg);
            ctx.drawImage(imgHand, 6000, 0, 2000, 1200, 0, xBg, window.innerWidth, hBg);
            ctx.drawImage(imgDollReach, 1500, 0, 500, 500, finalDollX, dollY, dollSize, dollSize); // sprite 4

            // doll 'pulled' underground
            await delay(50)
            ctx.clearRect(0, clearX, window.innerWidth, clearH);
            ctx.drawImage(imgBg, 0, xBg, window.innerWidth, hBg);
            ctx.drawImage(imgHand, 6000, 0, 2000, 1200, 0, xBg, window.innerWidth, hBg); // last hand
            ctx.drawImage(imgDollPull, 0, 0, 500, 500, finalDollX, dollY, dollSize, dollSize); // sprite 1
            await delay(50)
            ctx.clearRect(0, clearX, window.innerWidth, clearH);
            ctx.drawImage(imgBg, 0, xBg, window.innerWidth, hBg);
            ctx.drawImage(imgHand, 6000, 0, 2000, 1200, 0, xBg, window.innerWidth, hBg); // last hand
            ctx.drawImage(imgDollPull, 500, 0, 500, 500, finalDollX, dollY, dollSize, dollSize); // sprite 2
            await delay(50)
            ctx.clearRect(0, clearX, window.innerWidth, clearH);
            ctx.drawImage(imgBg, 0, xBg, window.innerWidth, hBg);
            ctx.drawImage(imgHand, 4000, 0, 2000, 1200, 0, xBg, window.innerWidth, hBg); // second to last hand
            ctx.drawImage(imgDollPull, 1000, 0, 500, 500, finalDollX, dollY, dollSize, dollSize); // sprite 3
            await delay(50)
            ctx.clearRect(0, clearX, window.innerWidth, clearH);
            ctx.drawImage(imgBg, 0, xBg, window.innerWidth, hBg);
            ctx.drawImage(imgHand, 4000, 0, 2000, 1200, 0, xBg, window.innerWidth, hBg); // second last hand
            ctx.drawImage(imgDollPull, 1500, 0, 500, 500, finalDollX, dollY, dollSize, dollSize); // sprite 4

            // abruptly cut to first official game
            await delay(25);
            mainContainer.style.display = 'none';
            await delay(50); // stay 'in the dark' for another moment
            window.location.replace('general.html');
        }
    }
}

/** PUTTING EVERYTHING TOGETHER **/

// load all images
let loaded = 0;

const imgBg = new Image();
imgBg.src = 'index_res/graveyard.png';

const imgDollWalk = new Image();
imgDollWalk.src = 'index_res/doll_walk.png';
const imgDollReach = new Image();
imgDollReach.src = 'index_res/doll_reach.png';
const imgDollPull = new Image();
imgDollPull.src = 'index_res/doll_pull.png';

const imgHand = new Image();
imgHand.src = 'index_res/hand.png';

imgBg.onload = loadImages;
imgDollWalk.onload = loadImages;
imgDollReach.onload = loadImages;
imgDollPull.onload = loadImages;
imgHand.onload = loadImages;

function loadImages() { // start once all images are loaded
    loaded++;
    if (loaded == 5) titleBlink();
}