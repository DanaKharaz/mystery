const startBtn = document.querySelector('#start-btn');
const startBtnContainer = document.querySelector('#start-btn-container');
startBtn.addEventListener('click', transitionFirstGame);

async function transitionFirstGame(event) {
    startBtnContainer.classList.add('start-btn-container-moving');
    startBtn.removeEventListener('click', transitionFirstGame); // prevent second click during animation
    
    const delay = millis => new Promise((resolve, reject) => {setTimeout(_ => resolve(), millis)});
    await delay(3500);
    startBtnContainer.style.display = 'none'; // not visible anymore - no need to keep rotation

    // TODO : transition to the first game OR intro screen
}