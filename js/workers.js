let seconds = 1500; 
let intervalBigTimer;
let running = false;
let secondsTimer = 1500;
let breakTimer = 1;

function sendMesage(type, value) {
    postMessage({ type: type, value: value, running });
}

function updateTimer () {
    if (seconds === 0) {
        changeTimer();
    } else {
    seconds--;
    }
    sendMesage('timer-text-content', formatSeconds(seconds));
    // timer.textContent = formatSeconds(seconds);
}

//change between the work time and the break time
function changeTimer () { 
    sendMesage('change-sound', true);
    if (breakTimer === 4) {
        breakTimer = 0;
        seconds = 900;
        secondsTimer = 900;
        sendMesage('timer-text-content', '15:00');
        // timer.textContent = "15:00";
        sendMesage('next-timer-text-content', '25:00');
        // nextTimer.textContent = "25:00";
    } else if (secondsTimer === 1500) {        
        seconds = 300;
        secondsTimer = 300;
        sendMesage('timer-text-content', '5:00');
        // timer.textContent = "5:00";
        sendMesage('next-timer-text-content', '25:00');
        // nextTimer.textContent = "25:00";
    } else if (secondsTimer === 300 || secondsTimer === 900) {
        seconds = 1500;
        secondsTimer = 1500;
        sendMesage('timer-text-content', '25:00');
        // timer.textContent = "25:00";
        breakTimer++;
        if (breakTimer === 4) {
            sendMesage('next-timer-text-content', '15:00');
            // nextTimer.textContent = "15:00";
        } else {
            sendMesage('next-timer-text-content', '5:00');
            // nextTimer.textContent = "5:00";
        }
    }
    running = false;
    sendMesage('startbtn-text-content', 'S t a r t');
    // startPauseButton.textContent = "S t a r t";        
    clearInterval(intervalBigTimer);
    sendMesage('change-color', secondsTimer);
    // changeColor(secondsTimer);
}

//convert and represent the minutes and seconds
function formatSeconds () {
    let minutes = Math.floor(seconds / 60);
    let secondsInMinute = seconds % 60;
    return `${leftZero(minutes)}:${leftZero(secondsInMinute)}`;
}

function leftZero (number) {
    return number < 10 ? "0" + number : number;
}

//start and stop the timer 
function startBigTimer () {
    if (!running) {
        intervalBigTimer = setInterval(updateTimer, 1000);
        running = true;
        sendMesage('change-color', secondsTimer);
        // changeColor(secondsTimer);
    } else {
        clearInterval(intervalBigTimer);
        running = false;
        sendMesage('change-color', secondsTimer);
        // changeColor(secondsTimer);
    }
}

//This function reset the timer 
function resetBigTimer () {
    clearInterval(intervalBigTimer);
    running = false;
    sendMesage('startbtn-text-content', 'S t a r t');
    // startPauseButton.textContent = "S t a r t";
    seconds = secondsTimer;
    sendMesage('change-color', secondsTimer);
    // changeColor(secondsTimer);
    sendMesage('timer-text-content', formatSeconds(secondsTimer));
    // timer.textContent = formatSeconds(secondsTimer);
}

onmessage = function(event) {
    if (event.data === 'start') {
        startBigTimer();
    } else if (event.data === 'stop') {
        startBigTimer();
    } else if (event.data === 'reset') {
        resetBigTimer()
    } else if (event.data === 'skip') {
        changeTimer();
    }
};