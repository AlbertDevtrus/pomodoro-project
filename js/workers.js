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
    sendMesage('title-text-content', formatSeconds(seconds));
    sendMesage('timer-text-content', formatSeconds(seconds));
}

//change between the work time and the break time
function changeTimer () { 
    sendMesage('change-sound', true);
    if (breakTimer === 4) {
        breakTimer = 0;
        seconds = 900;
        secondsTimer = 900;
        sendMesage('timer-text-content', '15:00');
        sendMesage('next-timer-text-content', '25:00');
    } else if (secondsTimer === 1500) {        
        seconds = 300;
        secondsTimer = 300;
        sendMesage('timer-text-content', '5:00');
        sendMesage('next-timer-text-content', '25:00');
    } else if (secondsTimer === 300 || secondsTimer === 900) {
        seconds = 1500;
        secondsTimer = 1500;
        sendMesage('timer-text-content', '25:00');
        breakTimer++;
        if (breakTimer === 4) {
            sendMesage('next-timer-text-content', '15:00');
        } else {
            sendMesage('next-timer-text-content', '5:00');
        }
    }
    running = false;
    sendMesage('startbtn-text-content', 'S t a r t');
    clearInterval(intervalBigTimer);
    sendMesage('change-color', secondsTimer);
    sendMesage('title-text-content', 'Pomodoro timer');
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
    } else {
        clearInterval(intervalBigTimer);
        running = false;
        sendMesage('change-color', secondsTimer);
        sendMesage('title-text-content', 'Pomodoro timer');
    }
}

//This function reset the timer 
function resetBigTimer () {
    clearInterval(intervalBigTimer);
    running = false;
    sendMesage('startbtn-text-content', 'S t a r t');
    seconds = secondsTimer;
    sendMesage('change-color', secondsTimer);
    sendMesage('timer-text-content', formatSeconds(secondsTimer));
    sendMesage('title-text-content', 'Pomodoro timer');
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