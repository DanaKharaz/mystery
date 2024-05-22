'use strict';

// PAUSE/RESUME GAME
let isPaused = false;
window.addEventListener('message', function(event) {
    console.log(event.data, isPaused);
    switch(event.data) {
        case 'pause-clicked':
            isPaused = !isPaused;
            if (!isPaused && gamePlaying) gamePlaying = false; // space key will restart animation
    }
});

// TIME GAME
const timer = document.querySelector('#bat-timer');
let timeOut = false;
const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));
async function timeGame() { // count down
    await delay(200); // smoother start to timer

    for (let i = 89; i >= 0; i--) {
        let m;
        if (i >= 60) m = '01';
        else m = '00';
        const s = i % 60;
        if (s < 10) timer.textContent = m + ':0' + s;
        else timer.textContent = m + ':' + s;

        if (!gamePlaying) return;

        await delay(1000);
    }
    timeOut = true;
    gamePlaying = false;
    gameOver();
}

// UI
const canvas = document.querySelector('#bat-canvas');
const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

// ELEMENT DIMENSIONS

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
const batW = window.innerHeight / 6;
const batH = batW / 300 * 231;
const batX = w * 2.5;
let currY = (window.innerHeight - batH) / 2;
let currBat = 1; // not 0 to start animation right away
let goingUp = false;
let batDispl = 0;

// GRAVITY AND COLLISIONS

// 'gravity' effect for bat's movement
const accel = 0.2; // acceleration down (px per frame^2)
let y0 = (window.innerHeight - batH) / 2; // starting position (px), resets whenever starting to go upward
let v0 = 0; // initial velocity (px per frame)
const upFrames = 60; // how long upward movement lasts
const velUp = (batH - 0.5 * accel * upFrames**2) / upFrames; // initial velocity when going upward (px per frame)
let time = 0; // time passed since start of movement (frames), resets whenever starting to go upward

/* collision masks : - arrays of poit coordinates, if a line of bat mask intersects a line of grave mask, then a collision happened
                     - arrays of slopes of the lines connecting neighbouring points */
// the masks are not exactly on the edge of the images to give the player a bit of leeway, not counting microscopic collisions
/* graves : - first 3 for collision with left side of base where x added to img's x (same for each part) and y constant (right side not needed, it is impossible to collide with)
            - other 8 for top part where x added to img's x (same for each part) and y added to top img's y (4 for left - entry; 4 for right -exit)
            - 3rd and 4th for long left side (right side not needed, it is impossible to collide with) */
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
scale = batW / 1800; // rescale as bat and grave images are not the same size
const colBats = [[[474 * scale, 942 * scale], [589 * scale, 928 * scale], [607 * scale, 495 * scale], [686 * scale, 237 * scale], [813 * scale, 158 * scale], [1064 * scale, 229 * scale], [1173 * scale, 476 * scale], [1193 * scale, 847 * scale], [1410 * scale, 948 * scale], [1478 * scale, 1078 * scale], [1312 * scale, 1083 * scale], [1155 * scale, 1156 * scale], [939 * scale, 1170 * scale], [736 * scale, 997 * scale]],
                 [[486 * scale, 947 * scale], [600 * scale, 900 * scale], [634 * scale, 379 * scale], [655 * scale, 308 * scale], [814 * scale, 258 * scale], [987 * scale, 373 * scale], [1080 * scale, 589 * scale], [1135 * scale, 829 * scale], [1337 * scale, 843 * scale], [1473 * scale, 893 * scale], [1450 * scale, 957 * scale], [1166 * scale, 1146 * scale], [1043 * scale, 1185 * scale], [910 * scale, 1133 * scale], [671 * scale, 955 * scale], [491 * scale, 1002 * scale]],
                 [[508 * scale, 935 * scale], [364 * scale, 884 * scale], [458 * scale, 881 * scale], [477 * scale, 816 * scale], [635 * scale, 757 * scale], [640 * scale, 522 * scale], [827 * scale, 443 * scale], [924 * scale, 332 * scale], [1136 * scale, 481 * scale], [1227 * scale, 614 * scale], [1248 * scale, 725 * scale], [1316 * scale, 827 * scale], [1373 * scale, 872 * scale], [1380 * scale, 932 * scale], [1431 * scale, 975 * scale], [1384 * scale, 1012 * scale], [1295 * scale, 990 * scale], [1195 * scale, 1034 * scale], [1160 * scale, 1083 * scale], [981 * scale, 1117 * scale], [823 * scale, 1052 * scale], [628 * scale, 895 * scale], [450 * scale, 1050 * scale]],
                 [[340 * scale, 974 * scale], [510 * scale, 913 * scale], [570 * scale, 996 * scale], [679 * scale, 839 * scale], [735 * scale, 849 * scale], [887 * scale, 789 * scale], [973 * scale, 807 * scale], [1042 * scale, 801 * scale], [1133 * scale, 747 * scale], [1241 * scale, 802 * scale], [1316 * scale, 827 * scale], [1373 * scale, 872 * scale], [1431 * scale, 975 * scale], [1457 * scale, 1116 * scale], [1523 * scale, 1190 * scale], [1354 * scale, 1157 * scale], [1177 * scale, 1254 * scale], [1028 * scale, 1149 * scale], [855 * scale, 1184 * scale], [684 * scale, 1024 * scale], [562 * scale, 992 * scale], [429 * scale, 1058 * scale], [359 * scale, 997 * scale]],
                 [[350 * scale, 1100 * scale], [449 * scale, 991 * scale], [570 * scale, 906 * scale], [687 * scale, 821 * scale], [882 * scale, 774 * scale], [1121 * scale, 784 * scale], [1114 * scale, 733 * scale], [1138 * scale, 716 * scale], [1429 * scale, 858 * scale], [1529 * scale, 948 * scale], [1600 * scale, 1050 * scale], [1647 * scale, 1158 * scale], [1663 * scale, 1265 * scale], [1197 * scale, 1292 * scale], [1087 * scale, 1200 * scale], [849 * scale, 1232 * scale], [748 * scale, 1110 * scale], [388 * scale, 1111 * scale]],
                 [[366 * scale, 1185 * scale], [328 * scale, 1165 * scale], [360 * scale, 1036 * scale], [494 * scale, 916 * scale], [647 * scale, 842 * scale], [833 * scale, 772 * scale], [983 * scale, 756 * scale], [1063 * scale, 692 * scale], [1113 * scale, 675 * scale], [1220 * scale, 714 * scale], [1265 * scale, 716 * scale], [1528 * scale, 907 * scale], [1600 * scale, 800 * scale], [1676 * scale, 1253 * scale], [1164 * scale, 1289 * scale], [1031 * scale, 1221 * scale], [815 * scale, 1229 * scale], [382 * scale, 1034 * scale]],
                 [[338 * scale, 1140 * scale], [285 * scale, 1161 * scale], [347 * scale, 1021 * scale], [455 * scale, 919 * scale], [544 * scale, 881 * scale], [622 * scale, 874 * scale], [780 * scale, 649 * scale], [910 * scale, 741 * scale], [1048 * scale, 609 * scale], [1159 * scale, 608 * scale], [1389 * scale, 702 * scale], [1593 * scale, 852 * scale], [1699 * scale, 991 * scale], [1734 * scale, 1118 * scale], [1401 * scale, 1131 * scale], [1245 * scale, 1278 * scale], [940 * scale, 1192 * scale], [838 * scale, 1222 * scale], [363 * scale, 1047 * scale]],
                 [[338 * scale, 1117 * scale], [291 * scale, 1049 * scale], [497 * scale, 932 * scale], [575 * scale, 861 * scale], [688 * scale, 818 * scale], [826 * scale, 689 * scale], [906 * scale, 653 * scale], [987 * scale, 658 * scale], [1046 * scale, 598 * scale], [1119 * scale, 551 * scale], [1210 * scale, 537 * scale], [1287 * scale, 581 * scale], [1388 * scale, 707 * scale], [1405 * scale, 843 * scale], [1478 * scale, 879 * scale], [1480 * scale, 945 * scale], [1543 * scale, 989 * scale], [1496 * scale, 1038 * scale], [1315 * scale, 1029 * scale], [1253 * scale, 1158 * scale], [1197 * scale, 1092 * scale], [1093 * scale, 1114 * scale], [788 * scale, 1025 * scale], [740 * scale, 1009 * scale]],
                 [[361 * scale, 1090 * scale], [286 * scale, 1010 * scale], [450 * scale, 977 * scale], [526 * scale, 871 * scale], [788 * scale, 730 * scale], [880 * scale, 570 * scale], [1158 * scale, 369 * scale], [1316 * scale, 624 * scale], [1216 * scale, 723 * scale], [1500 * scale, 900 * scale], [1502 * scale, 952 * scale], [1562 * scale, 1016 * scale], [1512 * scale, 1056 * scale], [1393 * scale, 1014 * scale], [1251 * scale, 1089 * scale], [1124 * scale, 1102 * scale], [1004 * scale, 1080 * scale], [926 * scale, 1021 * scale]],
                 [[386 * scale, 1186 * scale], [316 * scale, 1044 * scale], [443 * scale, 1044 * scale], [502 * scale, 933 * scale], [649 * scale, 758 * scale], [851 * scale, 580 * scale], [984 * scale, 489 * scale], [967 * scale, 338 * scale], [1050 * scale, 287 * scale], [1185 * scale, 270 * scale], [1282 * scale, 290 * scale], [1268 * scale, 724 * scale], [1341 * scale, 815 * scale], [1482 * scale, 886 * scale], [1502 * scale, 952 * scale], [1554 * scale, 1010 * scale], [1500 * scale, 1042 * scale], [1307 * scale, 1042 * scale], [1298 * scale, 1086 * scale], [1185 * scale, 1143 * scale], [989 * scale, 1124 * scale]],
                 [[459 * scale, 890 * scale], [725 * scale, 774 * scale], [727 * scale, 681 * scale], [815 * scale, 387 * scale], [921 * scale, 250 * scale], [921 * scale, 100 * scale], [1112 * scale, 140 * scale], [1219 * scale, 312 * scale], [1289 * scale, 480 * scale], [1270 * scale, 723 * scale], [1363 * scale, 830 * scale], [1477 * scale, 874 * scale], [1485 * scale, 934 * scale], [1543 * scale, 998 * scale], [1492 * scale, 1039 * scale], [1424 * scale, 1002 * scale], [1186 * scale, 1131 * scale], [991 * scale, 1131 * scale], [774 * scale, 976 * scale], [699 * scale, 953 * scale]]];

// ANIMATION

// gravestones and clouds across the screen
const nMidsMax = Math.floor((window.innerHeight - 2 * (h + hT)) / h) - 5; // non-inclusive
const graves = []; // list of {x, upT, [upMids], upTopY, downT, downTopY, [downMids]}
const clouds = []; // list of {x, y, sx} where sx is to decide which cloud is used

// prepare all images and background
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
    if (restarted) {
        restartBtn.removeEventListener('click', imgOnLoad);
        restartBtn.style.display = 'none';
        // remove previous background and make game playable again
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        document.addEventListener('keydown', fly);
        timer.textContent = '01:30';
    }

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

// animate background and bat
let frameState = 0; // 0,2,4 - clouds move; 0,3 - change bat sprite; 0,1,2,3,4,5 - graves move
const step = 2.5;
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

    let currGrave = 0;
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
    
    let collided = false;
    for (let b = 0; b < colBats[currBat].length - 1; b++) { // collision with relevant grave
        // coordinates
        const bx1 = colBats[currBat][b][0] + batX;
        const by1 = colBats[currBat][b][1] + currY;
        const bx2 = colBats[currBat][b + 1][0] + batX;
        const by2 = colBats[currBat][b + 1][1] + currY;
        // line equation
        const bm = (by2 - by1) / (bx2 - bx1);
        const bc = by1 - bm * bx1;

        for (let g = 0; g < colGravesUp.length - 1; g++) { // upper grave collision
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

        for (let g = 0; g < colGravesDown.length - 1; g++) { // lower grave collision
            // coordinates
            const gx1 = graves[currGrave]['x'] + colGravesDown[g][0];
            const gx2 = graves[currGrave]['x'] + colGravesDown[g + 1][0];
            let gy1, gy2;
            if (g < 3) gy1 = colGravesDown[g][1]; // base point
            else gy1 = graves[currGrave]['downTopY'] + colGravesDown[g][1]; // top point
            if (g < 2) gy2 = colGravesDown[g + 1][1]; // base point
            else gy2 = graves[currGrave]['downTopY'] + colGravesDown[g + 1][1]; // top point
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

    // PROGRESS ANIMATION
    frameState = (frameState + 1) % 6;
    window.requestAnimationFrame(moveBackground);
}

// GAME START AND END

let gamePlaying = false;
let started = false;

document.addEventListener('keydown', fly);
function fly(event) {
    if (event.code === 'Space') {
        if (gamePlaying) goingUp = true; // 'jump' up

        if (!gamePlaying && loaded === 15 && !timeOut) { // resume game
            gamePlaying = true;
            moveBackground();
        }

        if (!started && loaded === 15) { // start game
            started = true;
            timeGame();
        }
    }
}

const restartBtn = document.querySelector('#bat-restart');
let restarted = false;

async function gameOver() {
    document.removeEventListener('keydown', fly);

    if (timeOut) { // game won, move on to next
        await delay(500);

        restartBtn.style.display = 'initial';
        restartBtn.cursor = 'default';
        restartBtn.textContent = 'CONGRATULATIONS'

        await delay(1500);

        // notify parent
        window.parent.postMessage('bat-won', '*');
    } else { // game lost, restart
        restarted = true;

        // reset vars
        timeOut = false;
        currY = (window.innerHeight - batH) / 2;
        currBat = 1;
        goingUp = false;
        batDispl = 0;
        y0 = (window.innerHeight - batH) / 2;
        v0 = 0;
        time = 0;
        graves.splice(0, graves.length);
        clouds.splice(0, clouds.length);
        frameState = 0;
        gamePlaying = false;
        started = false;

        loaded = 14;
        restartBtn.style.display = 'initial';
        restartBtn.addEventListener('click', imgOnLoad);
    }
}