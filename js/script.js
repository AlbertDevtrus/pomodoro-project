import { 
    themeButton,
    timer,
    nextTimer,
    startPauseButton,
    resetButton,
    skipButton,
    ringSound,
    counterContainer,
    addGoal,
    inputGoal,
    todolist,
    counterGoals,
    favicon,
    errorMessage
} from './selectors.js';

let seconds = 1500; 
let intervalBigTimer;
let running = false;
let secondsTimer = 1500;
let breakTimer = 1;
let goals = [];

eventListeners();
function eventListeners() {
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
    document.addEventListener('DOMContentLoaded', () => {
        goals = JSON.parse(localStorage.getItem('goals')) || [];

        generateHTML();
    });
    addGoal.addEventListener("click", createGoal);
}


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

function createGoal() {
    const descriptionGoal = inputGoal.value;

    if (descriptionGoal.trim() !== "" && todolist.children.length < 10) {
        errorMessage.style.display = 'none';

        const goalObj = {
            id: Date.now(),
            text: descriptionGoal,
            state: false
        }

        goals = [...goals, goalObj];

        generateHTML();

        inputGoal.value = "";

        syncStorage();

    } else if(todolist.children.length >= 10) {
        errorMessage.style.display = 'inline';
    }
}

function generateHTML() {
    clearHTML();

    goals.forEach(goal => {
        const goalItem = document.createElement("li");
        const description = document.createElement('p');

        description.textContent = goal.text;

        const check = createCheck(goal.id, goal.state);
        const edit = createEdit(goal.id);
        const deleter = createDelete(goal.id);
        check.checked = goal.state;

        const div = document.createElement('div');
        div.appendChild(edit);
        div.appendChild(deleter);

        goalItem.appendChild(check);
        goalItem.appendChild(description);
        goalItem.appendChild(div);

        goalItem.setAttribute("class", "goal-item");
        
        todolist.appendChild(goalItem);
    });
    syncStorage();
    checkSelection();
}

function createCheck(id, state) {
    const completeGoal = document.createElement("input");
    const label = document.createElement('label');
    const span = document.createElement('span');
    label.appendChild(completeGoal);
    label.appendChild(span);
    label.setAttribute("class", "complete-goal");
    completeGoal.setAttribute("type", "checkbox");
    completeGoal.checked = state;  
    completeGoal.onclick = () => {
        goals.forEach(goal => {
            if(id === goal.id) {
                completeGoal.checked = !goal.state;
                goal.state = completeGoal.checked;
            }
        });
        syncStorage();
        checkSelection();
    };
    return label;
}

function createDelete(id) {
    const deleteGoal = document.createElement("button");
    deleteGoal.setAttribute("class", "delete-goal");
    deleteGoal.setAttribute('aria-label', 'delete');
    deleteGoal.classList.add("buttons-goal");
    //class for the visual icon
    const iconDelete = document.createElement("i");
    iconDelete.classList.add("fa-solid", "fa-trash");
    deleteGoal.appendChild(iconDelete);

    deleteGoal.onclick = () => {
        deleteElement(id);
    };
    return deleteGoal;
}

function createEdit(id) {
    const editGoal = document.createElement("button");
    editGoal.setAttribute("class", "edit-goal");
    editGoal.setAttribute('aria-label', 'edit');
    editGoal.classList.add("buttons-goal");
    //class for the visual icon
    const iconEdit = document.createElement("i");
    iconEdit.classList.add("fa-solid", "fa-pen-to-square");
    editGoal.appendChild(iconEdit);

    editGoal.onclick = () => {
        const content = editGoal.parentNode.previousElementSibling;
        inputGoal.value = content.textContent;
        const item = editGoal.parentNode.parentNode;
        item.remove();
        goals = goals.filter(goal => goal.id !== id);
        syncStorage();
    };

    return editGoal;
}

function deleteElement(id) {
    goals = goals.filter(goal => goal.id !== id);

    generateHTML();
}

function clearHTML() {
    while(todolist.firstChild) {
        todolist.removeChild(todolist.firstChild);
    }
}

function syncStorage() {
    localStorage.setItem('goals', JSON.stringify(goals));
}

function checkPorcentaje(total, completed) {
    return (100 / total) * completed;
}

function checkSelection() {
    if(goals.length > 0) {
        let goalsCompleted = 0;

        goals.forEach(goal => {
            if(goal.state) goalsCompleted++;
        });

        counterGoals.textContent = `${checkPorcentaje(goals.length, goalsCompleted).toFixed(2)}%`;
    } else {
        counterGoals.textContent = `0%`;
    }
}

