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

const canvas = document.querySelector('#bat-canvas');
const ctx = canvas.getContext('2d');

ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

// grave dimensions
const w = window.innerHeight / 5;
const scale = w / 370;
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
const batX = window.innerWidth / 3; // not in the middle to allow some time at the start of the game
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

// move gravestones and clouds across the screen
const nMidsMax = Math.floor((window.innerHeight - 2 * (h + hT)) / h) - 4; // non-inclusive
const graves = []; // list of {x, upT, [upMids], downT, [downMids]}
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
/*const imgBats = new Image();
imgBats.src = 'bat_res/bat.png';
imgBats.onload = imgOnLoad;*/
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

            graves.push({'x':x - 1, 'upT':upT, 'upMids':upMids, 'downT':downT, 'downMids':downMids}); // 'x-1' because the initial position is drawn now and animated later

            // inital position
            // up
            ctx.drawImage(imgBases, 0, 0, 370, 70, x, 0, w, h);
            for (let k = 0; k < nUpMids; k++) ctx.drawImage(imgMids, 0, upMids[k], 370, 82, x, (k + 1) * h - k * offM, w, h);
            ctx.drawImage(imgTops, 0, upT, 370, 235, x, h + nUpMids * (h - offM), w, hT);
            // down
            ctx.drawImage(imgBases, 0, 70, 370, 70, x, window.innerHeight - h, w, h);
            for (let k = 0; k < nDownMids; k++) ctx.drawImage(imgMids, 0, downMids[k], 370, 82, x, window.innerHeight - h - (k + 1)*h + k*offM, w, h);
            ctx.drawImage(imgTops, 0, downT, 370, 235, x, window.innerHeight - h - hT - nDownMids * (h - offM), w, hT);
        }

        // draw initial bat
        //ctx.drawImage(imgBats, bats[0], 0, 300, 231, batX, currY, batW, batH);
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

    for (let i = 0; i < graves.length; i++) { // move graves  
        // UP
        // base
        ctx.drawImage(imgBases, 0, 0, 370, 70, graves[i]['x'], 0, w, h);
        // middles
        for (let k = 0; k < graves[i]['upMids'].length; k++) ctx.drawImage(imgMids, 0, graves[i]['upMids'][k], 370, 82, graves[i]['x'], (k + 1) * h - k * offM, w, h);
        // top
        ctx.drawImage(imgTops, 0, graves[i]['upT'], 370, 235, graves[i]['x'], h + graves[i]['upMids'].length * (h - offM), w, hT);

        // DOWN
        // base
        ctx.drawImage(imgBases, 0, 70, 370, 70, graves[i]['x'], window.innerHeight - h, w, h);
        // middles
        for (let k = 0; k < graves[i]['downMids'].length; k++) ctx.drawImage(imgMids, 0, graves[i]['downMids'][k], 370, 82, graves[i]['x'], window.innerHeight - h - (k + 1)*h + k*offM, w, h);
        // top
        ctx.drawImage(imgTops, 0, graves[i]['downT'], 370, 235, graves[i]['x'], window.innerHeight - h - hT - graves[i]['downMids'].length * (h - offM), w, hT);

        // move grave left
        graves[i]['x'] -= step;
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

        graves.push({'x':x, 'upT':upT, 'upMids':upMids, 'downT':downT, 'downMids':downMids});
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

    // check for collision or fall
    if (currY > window.innerHeight + 3 * batH) {
        gamePlaying = false;
        gameOver();
    }

    // PROGRESS ANIMATION
    frameState = (frameState + 1) % 6;
    window.requestAnimationFrame(moveBackground);
}

let gamePlaying = false;

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (gamePlaying) goingUp = true;

        if (!gamePlaying && loaded === 15) {
            gamePlaying = true;
            moveBackground();
        }
    }
});

function gameOver() {
    console.log('game over');
}