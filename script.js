const timer = document.getElementById("timer");
const nextTimer = document.getElementById("nextTimer");
const startPauseButton = document.getElementById("pausa-start");
const resetButton = document.getElementById("reset");
const skipButton = document.getElementById("skip");
const ringSound = document.getElementById("ringSound");

let seconds = 1500; 
let intervalBigTimer;
let running = false;
let intervalNextTimer;
let secondsTimer = 1500;
let breakTimer = 1;

function updateTimer () {
    if (seconds === 0) {
        changeTimer();
    } else {
    seconds--;
    }
    timer.textContent = formatSeconds(seconds);
}

//This section does everything that has to do the timers
function changeTimer () {
    if (breakTimer === 4) {
        breakTimer = 0;
        clearInterval(intervalBigTimer);
        seconds = 10;
        secondsTimer = 900;
        running = false;
        startPauseButton.textContent = "S t a r t";
        timer.textContent = "15:00";
        nextTimer.textContent = "25:00";
        changeSound();
    } else if (secondsTimer === 1500) {        
        clearInterval(intervalBigTimer);
        seconds = 300;
        secondsTimer = 300;
        running = false;
        startPauseButton.textContent = "S t a r t";
        timer.textContent = "5:00";
        nextTimer.textContent = "25:00";
        changeSound();
    } else if (secondsTimer === 300 || secondsTimer === 900) {
        clearInterval(intervalBigTimer);
        seconds = 1500;
        secondsTimer = 1500;
        running = false;
        startPauseButton.textContent = "S t a r t";
        timer.textContent = "25:00";
        nextTimer.textContent = "5:00";
        breakTimer++;
        changeSound();
    }
}

function changeSound() {
    ringSound.currentTime = 0;
    ringSound.volume = 1;
    ringSound.play();
}

function formatSeconds () {
    let minutes = Math.floor(seconds / 60);
    let secondsInMinute = seconds % 60;
    return `${leftZero(minutes)}:${leftZero(secondsInMinute)}`;
}

function leftZero (number) {
    return number < 10 ? "0" + number : number;
}

//This function is for start and stop the timer 
function startBigTimer () {
    if (!running) {
        intervalBigTimer = setInterval(updateTimer, 1000);
        running = true;
    } else {
        clearInterval(intervalBigTimer);
        running = false;
    }
}

//This function its given to a button to reset the timer 
function resetBigTimer () {
    clearInterval(intervalBigTimer);
    running = false;
    startPauseButton.textContent = "S t a r t";
    seconds = secondsTimer;
    if (secondsTimer === 1500) {
        timer.textContent = "25:00";
    } else if (secondsTimer === 300) {
        timer.textContent = "5:00";
    } else if (secondsTimer === 900) {
        timer.textContent = "15:00";
    }
    
}

startPauseButton.addEventListener('click', startBigTimer);
// Change the text from the button pausa-start
startPauseButton.addEventListener('click', function () {
    if (startPauseButton.textContent === "S t a r t") {
        startPauseButton.textContent = "P a u s e";
    } else {
        startPauseButton.textContent = "S t a r t";
    }
})
resetButton.addEventListener('click', resetBigTimer);
skipButton.addEventListener('click', changeTimer)

