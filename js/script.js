const themeButton = document.querySelector("#theme-button");
const timer = document.querySelector("#timer");
const nextTimer = document.querySelector("#next-timer");
const startPauseButton = document.querySelector("#pausa-start");
const resetButton = document.querySelector("#reset");
const skipButton = document.querySelector("#skip");
const ringSound = document.querySelector("#ring-sound");
const counterContainer = document.querySelector("#counter-container");

const addGoal = document.querySelector("#add-goal");
const inputGoal = document.querySelector("#input-goal");
const todolist = document.querySelector("#todolist");
const counterGoals = document.querySelector("#goals-completed");
const listItem = document.querySelectorAll(".list-item");
const favicon = document.querySelector("#favicon");

let seconds = 1500; 
let intervalBigTimer;
let running = false;
let intervalNextTimer;
let secondsTimer = 1500;
let breakTimer = 1;
let goalsCompleted = 0;
let darkTheme = false;

//change the theme of the page
// function changeTheme () {
//     if (!darkTheme) {        
//         document.documentElement.style.setProperty("--fontColor", "white");
//         document.documentElement.style.setProperty("--backgroundColorGray", "#000000");
//         document.documentElement.style.setProperty("--borderColor", "#4A4A4A");
//         document.documentElement.style.setProperty("--backgroundColorWhite", "#101010");
//         document.documentElement.style.setProperty("--counterBackground", "#000000");
//         document.documentElement.style.setProperty("--gradientList", "#1e1e1e")
//         darkTheme = true;
//     } else {
//         document.documentElement.style.setProperty("--fontColor", "rgb(34, 34, 34)");
//         document.documentElement.style.setProperty("--backgroundColorGray", "rgba(206, 206, 206, 0.452)");
//         document.documentElement.style.setProperty("--borderColor", "rgba(156, 156, 156, 1)");
//         document.documentElement.style.setProperty("--backgroundColorWhite", "#ececec");
//         document.documentElement.style.setProperty("--hoverBackground", "#080808");
//         document.documentElement.style.setProperty("--hoverColor", "white");
//         document.documentElement.style.setProperty("--counterBackground", "#DDDDDD"); 
//         document.documentElement.style.setProperty("--gradientList", "rgba(160, 160, 160, 0.4)")  
//         darkTheme = false;
//     }
// }

function updateTimer () {
    if (seconds === 0) {
        changeTimer();
    } else {
    seconds--;
    }
    timer.textContent = formatSeconds(seconds);
}

//change between the work time and the break time
function changeTimer () { 
    changeSound();
    if (breakTimer === 4) {
        breakTimer = 0;
        seconds = 900;
        secondsTimer = 900;
        timer.textContent = "15:00";
        nextTimer.textContent = "25:00";
    } else if (secondsTimer === 1500) {        
        seconds = 300;
        secondsTimer = 300;
        timer.textContent = "5:00";
        nextTimer.textContent = "25:00";
    } else if (secondsTimer === 300 || secondsTimer === 900) {
        seconds = 1500;
        secondsTimer = 1500;
        timer.textContent = "25:00";
        breakTimer++;
        if (breakTimer === 4) {
            nextTimer.textContent = "15:00";
        } else {
            nextTimer.textContent = "5:00";
        }
    }
    running = false;        
    startPauseButton.textContent = "S t a r t";        
    clearInterval(intervalBigTimer);
    changeColor(secondsTimer);
}

//play the alarm for the end
function changeSound() {
    ringSound.currentTime = 0;
    ringSound.volume = 1;
    ringSound.play();
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
        changeColor(secondsTimer);
    } else {
        clearInterval(intervalBigTimer);
        running = false;
        changeColor(secondsTimer);
    }
}

//This function reset the timer 
function resetBigTimer () {
    clearInterval(intervalBigTimer);
    running = false;
    startPauseButton.textContent = "S t a r t";
    seconds = secondsTimer;
    changeColor(secondsTimer);
    timer.textContent = formatSeconds(secondsTimer);
}

//change the color of the count
function changeColor(stageSeconds) {
    if (!running) {
        counterContainer.style.borderColor = "#75c4f8"; 
        counterContainer.style.boxShadow = "inset 0px 0px 39px 32px #bde4fb";
        favicon.href = "/styles/favicon-neutral.svg";
    } else if (stageSeconds === 1500) {
        counterContainer.style.borderColor = "rgba(255, 0, 0, 0.8)";
        counterContainer.style.boxShadow = "inset 0px 0px 39px 32px rgba(255, 0, 0, 0.20)";
        favicon.href = "/styles/favicon-work.svg";
    } else if (stageSeconds === 300 || stageSeconds === 900) {
        favicon.href = "/styles/favicon-rest.svg";
        counterContainer.style.borderColor = "rgb(0, 189, 60)";
        counterContainer.style.boxShadow = "inset 0px 0px 39px 32px rgba(0, 189, 60, 0.20)";
    }
}

startPauseButton.addEventListener('click', startBigTimer);
startPauseButton.addEventListener('click', function () {
    if (startPauseButton.textContent === "S t a r t") {
        startPauseButton.textContent = "P a u s e";
    } else {
        startPauseButton.textContent = "S t a r t";
    }
});
resetButton.addEventListener('click', resetBigTimer);
skipButton.addEventListener('click', changeTimer);

//todo list functions

function createGoal() {
    const descriptionGoal = inputGoal.value;
    if (descriptionGoal.trim() !== "") {
        const goalItem = document.createElement("li");
        const description = document.createElement('p');
        description.textContent = descriptionGoal;
        const check = createCheck();
        const edit = createEdit();
        const deleter = createDelete();
        const div = document.createElement('div');
        div.appendChild(edit);
        div.appendChild(deleter);
        goalItem.appendChild(check);
        goalItem.appendChild(description);
        goalItem.appendChild(div);

        goalItem.setAttribute("class", "goal-item");
        todolist.appendChild(goalItem);
        counterGoals.textContent = checkPorcentaje(todolist.children.length, goalsCompleted);
        inputGoal.value = "";
    }        
}

function createCheck() {
    const completeGoal = document.createElement("input");
    const label = document.createElement('label');
    const span = document.createElement('span');
    label.appendChild(completeGoal);
    label.appendChild(span);
    label.setAttribute("class", "complete-goal");
    completeGoal.setAttribute("type", "checkbox");
    //class for the visual icon

    //agregar eventlistener para revisar el check del checkbox
    completeGoal.addEventListener("checked", (e) => {
        console.log(e)
        goalsCompleted++;
        counterGoals.textContent = checkPorcentaje(todolist.children.length, goalsCompleted);
    });

    completeGoal.addEventListener("select", () => {
        goalsCompleted--;
        counterGoals.textContent = checkPorcentaje(todolist.children.length, goalsCompleted);
    });
    return label;
}

function createDelete() {
    const deleteGoal = document.createElement("button");
    deleteGoal.setAttribute("class", "delete-goal");
    deleteGoal.classList.add("buttons-goal");
    //class for the visual icon
    const iconDelete = document.createElement("i");
    iconDelete.classList.add("fa-solid", "fa-trash");
    deleteGoal.appendChild(iconDelete);

    deleteGoal.addEventListener("click", () => {
        const item = deleteGoal.parentNode;
        item.remove();
    })
    return deleteGoal;
}

function createEdit() {
    const editGoal = document.createElement("button");
    editGoal.setAttribute("class", "edit-goal");
    editGoal.classList.add("buttons-goal");
    //class for the visual icon
    const iconEdit = document.createElement("i");
    iconEdit.classList.add("fa-solid", "fa-pen-to-square");
    editGoal.appendChild(iconEdit);
    editGoal.addEventListener("click", () => {
        const content = editGoal.previousElementSibling;
        inputGoal.value = content.textContent;
        const item = editGoal.parentNode;
        item.remove();
    })
    return editGoal;
}

function checkPorcentaje(total, completed) {
    return (100 / total) * completed;
}

addGoal.addEventListener("click", createGoal);