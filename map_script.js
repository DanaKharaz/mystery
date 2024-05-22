'use strict';

/** MAP INPUT **/

const mapBox = document.querySelector('#map-img');

const inputLat = document.querySelector('#map-lat');
inputLat.value = 0;
inputLat.addEventListener('input', setMap);
const inputLong = document.querySelector('#map-long');
inputLong.value = 0;
inputLong.addEventListener('input', setMap);
const inputZoom = document.querySelector('#map-zoom');
inputZoom.value = 0;
inputZoom.addEventListener('input', setMap);

function setMap(event) {
    if (inputLat.value && inputLong.value && inputZoom.value && inputLat.validity.valid && inputLong.validity.valid && inputZoom.validity.valid) {
        mapBox.src = 'https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/' + 
        inputLong.value + ',' + inputLat.value + ',' + inputZoom.value + 
        '/700x700?access_token=pk.eyJ1IjoiZGFuYS1reiIsImEiOiJjbHdobXQ0OHUwMHlqMnFybDQ5aDBoY2g2In0.XL1LVFxFW2Lr-6QtlaXoIg';
    }
}

setMap();

/** CIPHERED COORDINATES **/

// array with coordinates - [[[latitude], [longitude], [zoom]], ...]
// the position of the decimal point is ignored - up to the user to decide (always 1 or 2 possibilities only)
const coordinates = [[[6, 3, 4, 4, 5], [1, 0, 9, 0, 2], [1, 3]],
                     [[4, 1, 9, 8, 7], [7, 2, 5, 4, 5], [1, 3]],
                     [[1, 9, 4, 3, 6], [1, 5, 5, 2, 3, 9], [1, 1]],
                     [[2, 4, 4, 1, 7], [7, 5, 5, 1, 7], [1, 1]],
                     [[5, 0, 6, 0, 4], [1, 6, 5, 9, 7, 3], [1, 2, 9]],
                     [[2, 6, 1, 4], [1, 1, 3, 4], [1, 2]],
                     [[4, 2, 5, 4, 8], [7, 0, 7, 9, 8], [1, 5]]];
// indecies in coordinates of the numbers that should be negative
const negativeLat = [4, 5];
const negativeLong = [1, 2, 3, 6];

const cipheredCoors = []; // alphabetic cipher of each number (A=1, Z=26, 0=0) - ['AAA BBB CCC' ...]
const alphabet = '0ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

for (let c = 0; c < coordinates.length; c++) {
    const lat = coordinates[c][0];
    const long = coordinates[c][1];
    const zoom = coordinates[c][2];

    const coorStrings = ['', '', '']; // lat, long, and zoom ciphered (separately)
    
    // instead of ciphering each digit only (and using just A-I), randomly add double digits where possible
    // this will make the ciphered coordinates more difficult to decipher

    // LATITUDE
    let i = 0;
    while (i < lat.length - 1) {
        // randomly decide if it will be single or double digit (if possible)
        if (Math.random() < 0.5 && lat[i] != 0) {// try double digit
            if (lat[i] * 10 + lat[i + 1] <= 26) { // possible
                coorStrings[0] += alphabet[lat[i] * 10 + lat[i + 1]];
                i += 2;
                continue;
            }
        }

        // decided single-digit, the number is 0, or double-digit not possible
        coorStrings[0] += alphabet[lat[i]];

        i++;
    }
    // the last digit may be left still
    if (i != lat.length) coorStrings[0] += alphabet[lat[lat.length - 1]];
    // add minus if should be negative
    if (negativeLat.includes(c)) coorStrings[0] = '-' + coorStrings[0];

    // LOGNGITUDE
    i = 0;
    while (i < long.length - 1) {
        // randomly decide if it will be single or double digit (if possible)
        if (Math.random() < 0.5 && long[i] != 0) {// try double digit
            if (long[i] * 10 + long[i + 1] <= 26) { // possible
                coorStrings[1] += alphabet[long[i] * 10 + long[i + 1]];
                i += 2;
                continue;
            }
        }

        // decided single-digit, the number is 0, or double-digit not possible
        coorStrings[1] += alphabet[long[i]];

        i++;
    }
    // the last digit may be left still
    if (i != long.length) coorStrings[1] += alphabet[long[long.length - 1]];
    // add minus if should be negative
    if (negativeLong.includes(c)) coorStrings[1] = '-' + coorStrings[1];

    // ZOOM
    i = 0;
    while (i < zoom.length - 1) {
        // randomly decide if it will be single or double digit (if possible)
        if (Math.random() < 0.5) {// try double digit
            if (zoom[i] * 10 + zoom[i + 1] <= 26) { // possible
                coorStrings[2] += alphabet[zoom[i] * 10 + zoom[i + 1]];
                i += 2;
                continue;
            }
        }

        // decided single-digit, the number is 0, or double-digit not possible
        coorStrings[2] += alphabet[zoom[i]];

        i++;
    }
    // the last digit may be left still
    if (i != zoom.length) coorStrings[2] += alphabet[zoom[zoom.length - 1]];
console.log(coorStrings, c);
    coorStrings.sort(() => 0.5 - Math.random()); // shuffle

    cipheredCoors.push(coorStrings.join(' '));
}
console.log(cipheredCoors);

const placeNames = ['HELL', 'HAZARDVILLE', 'VOLCANO', 'CAT ISLAND', 'DISAPPOINTMENT ISLAND', 'USELESS LOOP', 'MISERY ISLAND'];
const placeholders = ['4', '11', '7', '3 6', '14 6', '7 4', '6 6'];

const placeOrder = [0, 1, 2, 3, 4, 5, 6]; // indices of placeNames and cioheredCoodrs
placeOrder.sort(() => 0.5 - Math.random()); // shuffle
console.log(placeOrder);

/** NAME INPUT **/

const nameInputElems = Array.from(document.querySelectorAll('.map-place-name'));
const tooltip = document.querySelector('#map-tooltip');

let completed = 0;

for (let i = 0; i < nameInputElems.length; i++) {
    // show number(s) of letters needed
    nameInputElems[i].placeholder = placeholders[placeOrder[i]];

    // display a tooltip with the ciphered coordinates when hovering over each input box
    nameInputElems[i].addEventListener('mouseover', showTooltip);
    nameInputElems[i].addEventListener('mouseout', () => tooltip.style.display = 'none');

    // check if the input is correct
    nameInputElems[i].addEventListener('input', checkInput);
}

function showTooltip(event) {
    const i = nameInputElems.indexOf(event.target);
    tooltip.textContent = cipheredCoors[placeOrder[i]];
    tooltip.style.top = (6.5 + i * 14.3) + '%';
    tooltip.style.display = 'initial';
}

async function checkInput(event) {
    const i = nameInputElems.indexOf(event.target);
    if (nameInputElems[i].value.toUpperCase() == placeNames[placeOrder[i]]) {
        // change appearance
        nameInputElems[i].classList.add('map-place-name-correct');
        nameInputElems[i].removeEventListener('mouseover', showTooltip);

        // remove focus
        nameInputElems[i].blur();
        nameInputElems[i].addEventListener('focusin', () => nameInputElems[i].blur()); // don't focus on it anymore
        nameInputElems[i].style.cursor = 'default';
        nameInputElems[i].removeEventListener('input', checkInput);

        completed++;
        // check if everything is correct
        if (completed == 7) { // game won
            await new Promise((resolve, reject) => setTimeout(_ => resolve(), 1500));console.log('waited');

            // notify parent
            window.parent.postMessage('map-won', '*');
        }
    }
}