'use strict';

window.addEventListener('message', function (event) {
    console.log(event.data);
    // TODO : listen for 'sound-on', 'sound-off'
});

document.querySelector('body').style.backgroundImage = 'url(blackout_res/hidden_message_demo.png)';

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
    const gradient = ctx.createRadialGradient(x, y, 1, x, y, 13); // x, y - center of each circle
    gradient.addColorStop(0, '#00000000');
    gradient.addColorStop(1, 'black');
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
    const gradient = ctx.createRadialGradient(x, y, 1, x, y, 13); // x, y - center of each circle
    gradient.addColorStop(0, '#00000000');
    gradient.addColorStop(1, 'black');
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear first
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}








const delay = millis => new Promise((resolve, reject) => setTimeout(_ => resolve(), millis));



// start/stop using mic based on https://jsfiddle.net/sasivarunan/2xLbv7n9/ and https://medium.com/hackernoon/creative-coding-using-the-microphone-to-make-sound-reactive-art-part1-164fd3d972f3

async function audio() {
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    })
    .then(stream => {
        window.localStream = stream;
        console.log('start');
    })
    .catch((err) => {
        console.log(err);
    });

    await delay(5000);

    localStream.getAudioTracks()[0].stop();
    console.log('stop');
}
//audio();

class Microphone {
    constructor(_fft) {
        var FFT_SIZE = _fft || 1024;
        this.spectrum = [];
        this.volume = this.vol = 0;
        this.peak_volume = 0;
        var self = this;
        var audioContext = new AudioContext();
        var SAMPLE_RATE = audioContext.sampleRate;

        // this is just a browser check to see
        // if it supports AudioContext and getUserMedia
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        // now just wait until the microphone is fired up
        window.addEventListener('load', init, false);
        function init() {
            try {
                startMic(new AudioContext());
            }
            catch (e) {
                console.error(e);
                alert('Web Audio API is not supported in this browser');
            }
        }
        function startMic(context) {
            navigator.getUserMedia({ audio: true }, processSound, error);
            function processSound(stream) {
                window.localStream = stream;

                // analyser extracts frequency, waveform, etc.
                var analyser = context.createAnalyser();
                analyser.smoothingTimeConstant = 0.2;
                analyser.fftSize = FFT_SIZE;
                var node = context.createScriptProcessor(FFT_SIZE * 2, 1, 1);
                node.onaudioprocess = function () {
                    // bitcount returns array which is half the FFT_SIZE
                    self.spectrum = new Uint8Array(analyser.frequencyBinCount);
                    // getByteFrequencyData returns amplitude for each bin
                    analyser.getByteFrequencyData(self.spectrum);
                    // getByteTimeDomainData gets volumes over the sample time
                    // analyser.getByteTimeDomainData(self.spectrum);
                    self.vol = self.getRMS(self.spectrum);
                    // get peak - a hack when our volumes are low
                    if (self.vol > self.peak_volume) self.peak_volume = self.vol;
                    self.volume = self.vol;
                };
                var input = context.createMediaStreamSource(stream);
                input.connect(analyser);
                analyser.connect(node);
                node.connect(context.destination);

                console.log('mic started', self.vol, self.volume);
                volRecord();
                //stopAudio();
            }
            function error() {
                console.log(arguments);
            }
        }
        //////// SOUND UTILITIES  ////////
        ///// ..... we going to put more stuff here....
        return this;
    }
};
var Mic = new Microphone();
async function volRecord() {
    for (let i = 0; i < 300; i++) {
        await delay(1000);
        console.log(Mic.vol, Mic.volume);
    }
}

async function stopAudio() {
    await delay(5000);
    localStream.getAudioTracks()[0].stop();
    console.log('stop');
}