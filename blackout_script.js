'use strict';

/** CHANGE IMAGES WITH CLUES **/

const bg = document.querySelector('#blackout-hidden');
const bgImg = document.querySelector('#blackout-img-bg');
const canvas = document.querySelector('#blackout-canvas');
const message = document.querySelector('#blackout-message');

let startedBg = false;
let bgIdx = 0;
canvas.addEventListener('dblclick', function() {
    if (startedBg && bgIdx < 6) {
        bgIdx += 1;
        bgImg.src = 'blackout_res/bg' + bgIdx + '.png';
        if (bgIdx == 6) canvas.style.cursor = 'default';
    }
});

/** CANVAS WITH RADIAL GRADIENT **/

const ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

ctx.fillStyle = 'black';
ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

const startBtn = document.querySelector('#blackout-start-btn');
startBtn.addEventListener('click', revealHiddenMessage);
let started = false;

let gradientSize = 50;

let x = window.innerWidth / 2;
let y = window.innerHeight / 2;

async function revealHiddenMessage(event) {
    if (microphone.initialized) {
        started = true;

        startBtn.style.display = 'none'; // hide btn

        canvas.style.cursor = 'pointer'; // pointer to change backgrounds
        startedBg = true;

        x = event.clientX;
        y = event.clientY;

        window.addEventListener('mousemove', translateGradient);
    } else {
        startBtn.animate({
            color: ['white', 'grey', 'white'],
            easing: ['ease-in', 'ease-out']
        }, 1000);
    }
}

// move gradient based on mouse
function translateGradient(event) {
    x = event.clientX;
    y = event.clientY;
}

/** ANALYSING AUDIO IN REAl TIME **/

// based on parts of this tutorial - https://www.youtube.com/watch?v=qNEb9of714U&list=WL&index=1&t=2232s
//     - specifically, taking volume from the microphone in real time was adapted from the video
//     - the rest (animation, volume analysis, etc) was NOT from this tutorial

class Microphone {
    constructor() {
        this.initialized = false;
        navigator.mediaDevices.getUserMedia({audio:true})
        .then(function(stream) {
            this.audioContext = new AudioContext();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 512;
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength); // half of fftSize
            this.microphone.connect(this.analyser);
            this.initialized = true;
        }.bind(this)).catch(function(error) { // no permission to use mic
            console.log(error);
        });
    }
    getVolume() {
        this.analyser.getByteTimeDomainData(this.dataArray);
        let norSamp = Array.from(this.dataArray).map(elem => elem / 128 - 1); // convert to -1 <= x <= 1, for easier use later

        // rms of samples
        let sum = 0;
        for (let i = 0; i < norSamp.length; i++) sum += (norSamp[i])**2;
        let volume = Math.sqrt(sum / norSamp.length);
        return volume;
    }
}

const microphone = new Microphone();
let peaked = false;
let firstPeak;
let peakCount = 0; // want 3 pairs consequitively
let prevVol;
function sizeFromVolume() {
    if (microphone.initialized && started) {
        let volume = microphone.getVolume();
        if (!prevVol) prevVol = volume;
        if (Math.abs(volume - prevVol) > 0.02) { // sound peak
            console.log('peak', Math.abs(volume - prevVol));
            // snaps - 2 peaks about 1s apart
            if (peaked) { // this is the second peak
                const diff = Date.now() - firstPeak;
                console.log(diff);
                if (diff >= 500 && diff <= 2500) {
                    // two snaps with a more-or-less correct interval - very lenient
                    peakCount++;
                    firstPeak = Date.now();
                    if (peakCount == 3) { // 3 in a row
                        // notify parent
                        window.parent.postMessage('blackout-won', '*');
                        return;
                    }
                } else if (diff > 100) { // difference shorter is most likely unintentional, so ignore
                    peakCount = 0;
                    peaked = false; // wrong timing
                }
            } else { // this is the first peak
                firstPeak = Date.now();
                peaked = true;
            }
        }
        
        gradientSize = 50 + volume * 5000;
        prevVol = volume;
        
        const gradient = ctx.createRadialGradient(x, y, 1, x, y, gradientSize); // x, y - center of each circle
        gradient.addColorStop(0, '#00000000');
        gradient.addColorStop(1, 'black');
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight); // clear first
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }
    window.requestAnimationFrame(sizeFromVolume);
}
sizeFromVolume();