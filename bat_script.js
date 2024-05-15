'use strict';

let isPaused = false;
window.addEventListener('message', function(event) {
    console.log(event.data, isPaused);
    switch(event.data) {
        case 'pause-clicked':
            isPaused = !isPaused;
            if (!isPaused && gamePlaying) gamePlaying = false; // space key will restart animation
    }
});

const timer = document.querySelector('#bat-timer');
let timeOut = false;
const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));
async function timeGame() { // count down
    for (let i = 89; i >= 0; i--) {
        await delay(1000);
        let m;
        if (i >= 60) m = '01';
        else m = '00';
        const s = i % 60;
        if (s < 10) timer.textContent = m + ':0' + s;
        else timer.textContent = m + ':' + s;

        if (!gamePlaying) return;
    }
    timeOut = true;
    gamePlaying = false;
    gameOver();
}

const canvas = document.querySelector('#bat-canvas');
const ctx = canvas.getContext('2d');

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

// grave dimensions
const w = window.innerHeight / 5;
let scale = w / 370;
const hT = scale * 230; // top part height
const h = scale * 70; // base and middle part height
const offM = scale * 3; // middle part offset

// cloud dimensions
const cloudW = window.innerHeight / 3;
const cloudH = cloudW / 955 * 540;
const minDistY = cloudH / 3;

// bat dimensions
const batW = window.innerHeight / 7;
const batH = batW / 300 * 231;
//const batX = window.innerWidth / 3; // not in the middle to allow some time at the start of the game
const batX = w * 2; // FIXME
let currY = (window.innerHeight - batH) / 2;
let currBat = 1; // not 0 to start animation right away
let goingUp = false;
let batDispl = 0;

// 'gravity' effect for bat's movement
const accel = 0.2; // acceleration down (px per frame^2)
let y0 = (window.innerHeight - batH) / 2; // starting position (px), resets whenever starting to go upward
let v0 = 0; // initial velocity (px per frame)
const upFrames = 60; // how long upward movement lasts
let velUp = (batH - 0.5 * accel * upFrames**2) / upFrames; // initial velocity when going upward (px per frame)
let time = 0; // time passed since start of movement (frames), resets whenever starting to go upward

/* collision masks : - arrays of poit coordinates, if a line of bat mask intersects a line of grave mask, then a collision happened
                     - arrays of slopes of the lines connecting neighbouring points */
// the masks are not exactly on the edge of the images to give the player a bit of leeway, not counting microscopic collisions
/* graves : - first 3 for collision with left side of base where x added to img's x (same for each part) and y constant (right side not needed, it is impossible to collide with)
            - other 8 for top part where x added to img's x (same for each part) and y added to top img's y (4 for left - entry; 4 for right -exit)
            -3rd and 4th for long left side (right side not needed, it is impossible to collide with) */
const colGravesUp = [[15 * scale, 15 * scale], [16 * scale, 55 * scale], [44 * scale, 55 * scale],
                     [45 * scale, 145 * scale], [61 * scale, 178 * scale], [89 * scale, 202 * scale], [125 * scale, 215 * scale],
                     [245 * scale, 215 * scale], [281 * scale, 202 * scale], [309 * scale, 178 * scale], [325 * scale, 145 * scale]];
// in colGravesUp adding more to y in top part as the img points down (its lower part is the edge of collision)
const colGravesDown = [[15 * scale, window.innerHeight - 15 * scale], [16 * scale, window.innerHeight - 55 * scale], [44 * scale, window.innerHeight - 55 * scale],
                       [45 * scale, 85 * scale], [61 * scale, 52 * scale], [89 * scale, 28 * scale], [125 * scale, 15 * scale],
                       [245 * scale, 15 * scale], [281 * scale, 28 * scale], [309 * scale, 52 * scale], [325 * scale, 85 * scale]];
// in colGravesDown adding less to y in top part as the img points up (its upper part is the edge of collision)
/* bats : - different for each sprite, some vertical lines connecting neighbouring points pass left of the img
            (e.g. leftmost point of wing connecting directly with tip of tail)
            as there is no backward movement
          - both x and y added to img's x and y */
scale = batW / 1800;
const colBats = [[[474 * scale, 942 * scale], [589 * scale, 928 * scale], [607 * scale, 495 * scale], [686 * scale, 237 * scale], [813 * scale, 158 * scale], [1064 * scale, 229 * scale], [1173 * scale, 476 * scale], [1193 * scale, 847 * scale], [1410 * scale, 948 * scale], [1478 * scale, 1078 * scale], [1312 * scale, 1083 * scale], [1155 * scale, 1156 * scale], [939 * scale, 1170 * scale], [736 * scale, 997 * scale]],
                 [[486 * scale, 947 * scale], [600 * scale, 900 * scale], [634 * scale, 379 * scale], [655 * scale, 308 * scale], [814 * scale, 258 * scale], [987 * scale, 373 * scale], [1080 * scale, 589 * scale], [1135 * scale, 829 * scale], [1337 * scale, 843 * scale], [1473 * scale, 893 * scale], [1450 * scale, 957 * scale], [1166 * scale, 1146 * scale], [1043 * scale, 1185 * scale], [910 * scale, 1133 * scale], [671 * scale, 955 * scale], [491 * scale, 1002 * scale]],
                 [],
                 [],
                 [],
                 [],
                 [],
                 [],
                 [],
                 [],
                 []]; // FIXME

// move gravestones and clouds across the screen
const nMidsMax = Math.floor((window.innerHeight - 2 * (h + hT)) / h) - 4; // non-inclusive
const graves = []; // list of {x, upT, [upMids], upTopY, downT, downTopY, [downMids]}
const clouds = []; // list of {x, y, sx} where sx is to decide which cloud is used

// prepare all images
let loaded = 0;
const imgBases = new Image();
imgBases.src = 'bat_res/grave_bases.png';
imgBases.onload = imgOnLoad;
const imgMids = new Image();
imgMids.src = 'bat_res/grave_middles.png';
imgMids.onload = imgOnLoad;
const imgTops = new Image();
imgTops.src = 'bat_res/grave_tops.png';
imgTops.onload = imgOnLoad;
const imgClouds = new Image();
imgClouds.src = 'bat_res/clouds.png';
imgClouds.onload = imgOnLoad;
const imgBats = [];
for (let i = 0; i < 11; i++) {
    const img = new Image();
    img.src = 'bat_res/bat' + i + '.png';
    img.onload = imgOnLoad;
    imgBats.push(img);
}
function imgOnLoad() {
    loaded++;
    if (loaded === 15) { // all images are loaded
        // create initial clouds
        let cloudX = 20; // start slightly away from the edge
        let prevY = Math.floor(Math.random() * window.innerHeight) - cloudH / 2;
        while (cloudX < window.innerWidth) { // make enough clouds to cover the entire screen
            const x = cloudX;
            cloudX += Math.floor(Math.random() * cloudW) + cloudW / 2;

            let y;
            do {y = Math.floor(Math.random() * (window.innerHeight - cloudH / 2)) - cloudH / 4;} while (Math.abs(y - prevY) < minDistY); // max 1/4 of the cloud height is offscreen
            prevY = y;
            if (y < -cloudH / 4 || y > window.innerHeight - 3*cloudH / 4) console.log(y);
            
            const sx = (Math.floor(Math.random() * 3) % 2) * 955; // 0 (regular cloud) is more likely than 955 (frowning cloud)

            clouds.push({'x':x - 1, 'y':y, 'sx':sx}); // 'x-1' because the initial position is drawn now and animated later

            // initial position
            ctx.drawImage(imgClouds, sx, 0, 955, 540, x, y, cloudW, cloudH);
        }

        // create initial graves
        let graveX = window.innerWidth / 2;
        for (let i = 0; i < Math.ceil(window.innerWidth / (2 * w)) / 2; i++) { // make enough graves to cover right half of the screen
            const x = graveX;
            graveX += 2 * w;

            const upT = (Math.floor(Math.random() * 13) % 3) * 240;

            let nUpMids;
            if (i == 0) nUpMids = Math.floor(Math.random() * nMidsMax); // the first grave
            else do {nUpMids = Math.floor(Math.random() * nMidsMax);} while (Math.abs(graves[i - 1]['nUpMids'] - nUpMids) > nMidsMax - 4); // must make sure the change in height from previous grave is fine
            const upMids = [];
            if (nUpMids != 0) {
                let prevMid = Math.floor(Math.random() * 13) % 3 * 82;
                upMids.push(prevMid);
                for (let k = 1; k < nUpMids; k++) {
                    let nextMid;
                    do {nextMid = Math.floor(Math.random() * 13) % 3 * 82;} while (nextMid == prevMid);
                    prevMid = nextMid;
                    upMids.push(nextMid);
                }
            }

            const upTopY = h + nUpMids * (h - offM);

            const downT = 720 + (Math.floor(Math.random() * 13) % 3) * 240 + 5;

            const nDownMids = 13 - nUpMids;
            const downMids = [];
            if (nDownMids != 0) {
                let prevMid = Math.floor(Math.random() * 13) % 3 * 82;
                downMids.push(prevMid);
                for (let k = 1; k < nDownMids; k++) {
                    let nextMid;
                    do {nextMid = Math.floor(Math.random() * 13) % 3 * 82;} while (nextMid == prevMid);
                    prevMid = nextMid;
                    downMids.push(nextMid);
                }
            }

            const downTopY = window.innerHeight - h - hT - nDownMids * (h - offM);

            graves.push({'x':x - 1, 'upT':upT, 'upMids':upMids, 'upTopY':upTopY, 'downT':downT, 'downMids':downMids, 'downTopY':downTopY}); // 'x-1' because the initial position is drawn now and animated later

            // inital position
            // up
            ctx.drawImage(imgBases, 0, 0, 370, 70, x, 0, w, h);
            for (let k = 0; k < nUpMids; k++) ctx.drawImage(imgMids, 0, upMids[k], 370, 82, x, (k + 1) * h - k * offM, w, h);
            ctx.drawImage(imgTops, 0, upT, 370, 235, x, upTopY, w, hT);
            // down
            ctx.drawImage(imgBases, 0, 70, 370, 70, x, window.innerHeight - h, w, h);
            for (let k = 0; k < nDownMids; k++) ctx.drawImage(imgMids, 0, downMids[k], 370, 82, x, window.innerHeight - h - (k + 1)*h + k*offM, w, h);
            ctx.drawImage(imgTops, 0, downT, 370, 235, x, downTopY, w, hT);
        }

        // draw initial bat
        ctx.drawImage(imgBats[0], batX, currY, batW, batH);
    }
}

// animation
let frameState = 0; // 0,2,4 - clouds move; 0,3 - change bat sprite; 0,1,2,3,4,5 - graves move
const step = 2;
function moveBackground() {
    if (isPaused || !gamePlaying) return; // no animation

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // CLOUDS
    
    for (let i = 0; i < clouds.length; i++) {
        ctx.drawImage(imgClouds, clouds[i]['sx'], 0, 955, 540, clouds[i]['x'], clouds[i]['y'], cloudW, cloudH);

        if (frameState % 2 === 0) clouds[i]['x'] -= step; // the clouds should move slower than the graves
    }

    if (clouds[clouds.length - 1]['x'] < window.innerWidth - cloudW / 2) { // generate new cloud (coming from the right side of the screen)
        const x = clouds[clouds.length - 1]['x'] + Math.floor(Math.random() * cloudW) + cloudW / 2;

        let y;
        do {y = Math.floor(Math.random() * window.innerHeight) - cloudH / 2;} while (Math.abs(y - clouds[clouds.length - 1]['y']) < minDistY);
        
        const sx = (Math.floor(Math.random() * 3) % 2) * 955; // 0 (regular cloud) is more likely than 955 (frowning cloud)

        clouds.push({'x':x, 'y':y, 'sx':sx});
    }

    if (clouds[0]['x'] < -cloudW) clouds.shift(); // remove the cloud that has exited the screen

    // GRAVES

    let currGrave;
    for (let i = 0; i < graves.length; i++) { // move graves  
        // UP
        // base
        ctx.drawImage(imgBases, 0, 0, 370, 70, graves[i]['x'], 0, w, h);
        // middles
        for (let k = 0; k < graves[i]['upMids'].length; k++) ctx.drawImage(imgMids, 0, graves[i]['upMids'][k], 370, 82, graves[i]['x'], (k + 1) * h - k * offM, w, h);
        // top
        ctx.drawImage(imgTops, 0, graves[i]['upT'], 370, 235, graves[i]['x'], graves[i]['upTopY'], w, hT);

        // DOWN
        // base
        ctx.drawImage(imgBases, 0, 70, 370, 70, graves[i]['x'], window.innerHeight - h, w, h);
        // middles
        for (let k = 0; k < graves[i]['downMids'].length; k++) ctx.drawImage(imgMids, 0, graves[i]['downMids'][k], 370, 82, graves[i]['x'], window.innerHeight - h - (k + 1)*h + k*offM, w, h);
        // top
        ctx.drawImage(imgTops, 0, graves[i]['downT'], 370, 235, graves[i]['x'], graves[i]['downTopY'], w, hT);

        // move grave left
        graves[i]['x'] -= step;

        // see if this grave is passed by the bat
        if (graves[i]['x'] <= batX + batW && graves[i]['x'] + w >= batX) currGrave = i;
    }
    
    if (graves[graves.length - 1]['x'] < window.innerWidth - 2 * w) { // generate new grave (coming from the right side of the screen)
        const x = graves[graves.length - 1]['x'] + 2 * w;

        const upT = (Math.floor(Math.random() * 13) % 3) * 240;

        let nUpMids;
        do {nUpMids = Math.floor(Math.random() * nMidsMax);} while (Math.abs(graves[graves.length - 1]['nUpMids'] - nUpMids) > nMidsMax - 4); // must make sure the change in height from previous grave is fine
        const upMids = [];
        if (nUpMids != 0) {
            let prevMid = Math.floor(Math.random() * 13) % 3 * 82;
            upMids.push(prevMid);
            for (let k = 1; k < nUpMids; k++) {
                let nextMid;
                do {nextMid = Math.floor(Math.random() * 13) % 3 * 82;} while (nextMid == prevMid);
                prevMid = nextMid;
                upMids.push(nextMid);
            }
        }

        const upTopY = h + nUpMids * (h - offM);

        const downT = 720 + (Math.floor(Math.random() * 13) % 3) * 240 + 5;

        const nDownMids = 13 - nUpMids;
        const downMids = [];
        if (nDownMids != 0) {
            let prevMid = Math.floor(Math.random() * 13) % 3 * 82;
            downMids.push(prevMid);
            for (let k = 1; k < nDownMids; k++) {
                let nextMid;
                do {nextMid = Math.floor(Math.random() * 13) % 3 * 82;} while (nextMid == prevMid);
                prevMid = nextMid;
                downMids.push(nextMid);
            }
        }

        const downTopY = window.innerHeight - h - hT - nDownMids * (h - offM);

        graves.push({'x':x, 'upT':upT, 'upMids':upMids, 'upTopY':upTopY, 'downT':downT, 'downMids':downMids, 'downTopY':downTopY});
    }

    if (graves[0]['x'] < -w) graves.shift(); // remove the grave that has exited the screen

    // BAT

    // draw bat
    ctx.drawImage(imgBats[currBat], batX, currY, batW, batH);
    const prevY = currY;
    if (goingUp) { // 'shoot' up
        y0 = currY;
        v0 = velUp;
        time = 0;
        goingUp = false;
    }
    currY = y0 + v0 * time + 0.5 * accel * time**2; // calculate needed position
    if (frameState % 3 === 0) currBat = (currBat + 1) % 11; // change sprite
    time++;

    // CHECK FOR FALL AND COLLISION
    if (currY > window.innerHeight + 3 * batH) { // fall below screen
        gamePlaying = false;
        gameOver();
    }
    // TODO : optimize calculations (?)
    if (currGrave) { // bat is passing one of the graves
        let collided = false;
        for (let b = 0; b < colBats[currBat].length - 1; b++) {
            // coordinates
            const bx1 = colBats[currBat][b][0] + batX;
            const by1 = colBats[currBat][b][1] + currY;
            const bx2 = colBats[currBat][b + 1][0] + batX;
            const by2 = colBats[currBat][b + 1][1] + currY;
            // line equation
            const bm = (by2 - by1) / (bx2 - bx1);
            const bc = by1 - bm * bx1;

            for (let g = 0; g < colGravesUp.length - 1; g++) { // upper graves
                // coordinates
                const gx1 = graves[currGrave]['x'] + colGravesUp[g][0];
                const gx2 = graves[currGrave]['x'] + colGravesUp[g + 1][0];
                let gy1, gy2;
                if (g < 3) gy1 = colGravesUp[g][1]; // base point
                else gy1 = graves[currGrave]['upTopY'] + colGravesUp[g][1]; // top point
                if (g < 2) gy2 = colGravesUp[g + 1][1]; // base point
                else gy2 = graves[currGrave]['upTopY'] + colGravesUp[g + 1][1] // top point
                // line equation
                const gm = (gy2 - gy1) / (gx2 - gx1);
                const gc = gy1 - gm * gx1;

                // intersection point
                const ix = (gc - bc) / (bm - gm);
                const iy = gm * ix + gc;
                    
                // if intersection on the segments, then collision happened
                if (ix <= Math.max(bx1, bx2) && ix >= Math.min(bx1, bx2) &&
                    iy <= Math.max(by1, by2) && iy >= Math.min(by1, by2) &&
                    ix <= Math.max(gx1, gx2) && ix >= Math.min(gx1, gx2) &&
                    iy <= Math.max(gy1, gy2) && iy >= Math.min(gy1, gy2)) {
                    collided = true;
                    break;
                }
            }

            for (let g = 0; g < colGravesDown.length - 1; g++) { // lower graves
                // coordinates
                const gx1 = graves[currGrave]['x'] + colGravesDown[g][0];
                const gx2 = graves[currGrave]['x'] + colGravesDown[g + 1][0];
                let gy1, gy2;
                if (g < 3) gy1 = colGravesDown[g][1]; // base point
                else gy1 = graves[currGrave]['upDownY'] + colGravesDown[g][1]; // top point
                if (g < 2) gy2 = colGravesDown[g + 1][1]; // base point
                else gy2 = graves[currGrave]['upDownY'] + colGravesDown[g + 1][1]; // top point
                // line equation
                const gm = (gy2 - gy1) / (gx2 - gx1);
                const gc = gy1 - gm * gx1;

                // intersection point
                const ix = (gc - bc) / (bm - gm);
                const iy = gm * ix + gc;

                // if intersection on the segments, then collision happened
                if (ix <= Math.max(bx1, bx2) && ix >= Math.min(bx1, bx2) &&
                    iy <= Math.max(by1, by2) && iy >= Math.min(by1, by2) &&
                    ix <= Math.max(gx1, gx2) && ix >= Math.min(gx1, gx2) &&
                    iy <= Math.max(gy1, gy2) && iy >= Math.min(gy1, gy2)) {
                    collided = true;
                    break;
                }
            }

            if (collided) { // game lost
                gamePlaying = false;
                gameOver();
                break;
            }
        }
    }

    // PROGRESS ANIMATION
    frameState = (frameState + 1) % 6;
    window.requestAnimationFrame(moveBackground);
}

let gamePlaying = false;
let started = false;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (gamePlaying) goingUp = true;

        if (!gamePlaying && loaded === 15 && !timeOut) {
            gamePlaying = true;
            moveBackground();
        }

        if (!started && loaded === 15) {
            started = true;
            timeGame();
        }
    }
});

function gameOver() {
    console.log('game over');
}