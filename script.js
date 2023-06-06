const timer = document.getElementById("timer");
const nextTimer = document.getElementById("nextTimer");
const startPauseButton = document.getElementById("pausa-start");
const resetButton = document.getElementById("reset");
const skipButton = document.getElementById("skip");

let seconds = 1500; 
let intervalId;
let running = false;

function updateTimer () {
    if (seconds === 0) {
        clearInterval(intervalId);
    } else {
    seconds--;
    }
    timer.textContent = formatSeconds(seconds);
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
function startTimer () {
    if (!running) {
        intervalId = setInterval(function () {updateTimer(seconds)}, 1000);
        running = true;
    } else {
        clearInterval(intervalId);
        running = false;
    }
}

//This function its given to a button to reset the timer 
function resetTimer () {
    clearInterval(intervalId);
    seconds = 1500;
    timer.textContent = "25:00";
}

startPauseButton.addEventListener('click', startTimer);
// Change the text from the button pausa-start
startPauseButton.addEventListener('click', function () {
    if (startPauseButton.textContent === "S t a r t") {
        startPauseButton.textContent = "P a u s e";
    } else {
        startPauseButton.textContent = "S t a r t";
    }
})
resetButton.addEventListener('click', resetTimer);

