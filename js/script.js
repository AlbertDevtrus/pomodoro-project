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
    errorMessage,
    iaContainer,
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
        if(goals.length > 0) {
            generateHTMLGoal();
            goalIA();
        }
    });
    addGoal.addEventListener("click", createGoal);
    
    themeButton.addEventListener('click', changeTheme);
}

function changeTheme() {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme') || 'light';

    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    const info = document.querySelector('#info');

    if(newTheme === 'light') {
        info.style.backgroundImage = 'url(/styles/img/wave.svg)';
        themeButton.innerHTML = '<i class="fa-solid fa-moon"></i>';
        
    } else {
        info.style.backgroundImage = 'url(/styles/img/wave-dark.svg)';
        themeButton.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    root.setAttribute("data-theme", newTheme);
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
        counterContainer.style.borderColor = "var(--blue2)"; 
        counterContainer.style.boxShadow = "inset 0px 0px 39px 0px var(--blue1)";
        favicon.href = "/styles/icons/favicon-neutral.svg";
    } else if (stageSeconds === 1500) {
        counterContainer.style.borderColor = "rgba(255, 0, 0, 0.8)";
        counterContainer.style.boxShadow = "inset 0px 0px 39px 32px rgba(255, 0, 0, 0.20)";
        favicon.href = "/styles/icons/favicon-work.svg";
    } else if (stageSeconds === 300 || stageSeconds === 900) {
        favicon.href = "/styles/icons/favicon-rest.svg";
        counterContainer.style.borderColor = "rgb(0, 189, 60)";
        counterContainer.style.boxShadow = "inset 0px 0px 39px 32px rgba(0, 189, 60, 0.20)";
    }
}

function createGoal() {
    const descriptionGoal = inputGoal.value;

    if (descriptionGoal.trim() !== "" && todolist.children.length < 10 && descriptionGoal.length <= 100) {
        errorMessage.style.display = 'none';

        const goalObj = {
            id: Date.now(),
            text: descriptionGoal,
            state: false,
            ai: ''
        }

        goals = [...goals, goalObj];

        generateHTMLGoal();
        goalIA();

        inputGoal.value = "";

        syncStorage();

    } else if (todolist.children.length >= 10) {
        errorMessage.style.display = 'inline';
    }
}

function generateHTMLGoal() {
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

    generateHTMLGoal();
    goalIA();
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

function goalIA() {
    clearHTMLAI();

    if(goals.length <= 3) {
    
        for(let i = 0; i < goals.length; i++) {
            const { id, text, ai } = goals[i];

            generateHTMLIa(id, text, ai);
        }

    } else {

        for(let i = 0; i < 3; i++) {
            const { id, text, ai } = goals[i];
            generateHTMLIa(id, text, ai);
        }

    }

}

function generateHTMLIa(id, goal, ai) {
    const details = document.createElement('details');
    details.dataset.id = id;

    const summary = document.createElement('summary');
    summary.classList.add('goal-details');
    

    summary.addEventListener('click', callAPI);
    
    summary.innerHTML = `${goal} <span ></span>`;

    const adviceIa = document.createElement('p');
    adviceIa.classList.add('ia-details');
    
    adviceIa.textContent = ai;
    
    details.appendChild(summary);
    details.appendChild(adviceIa);

    iaContainer.appendChild(details);
}

function callAPI(e) {

    const iaElement = e.target.parentNode.children[1];

    if(iaElement.parentNode.open) return;

    const id = parseInt(e.target.parentNode.dataset.id);

    const goal = goals.find(goal => goal.id === id);
    
    if (goal.ai === '') {
    
        const spinner = `
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
        `;
        
        iaElement.innerHTML = spinner;

        const requestData = {
            goal: goal.text 
        }
        
        fetch('http://127.0.0.1:3000/get-advice', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
                body: JSON.stringify(requestData),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                clearElement(iaElement);
                setAiResponse(data.advice.content, id, iaElement);
            })
            .catch(error => {
                console.error('Error fetching advice:', error);
                clearElement(iaElement);
                alertIa(iaElement);
            });

    }
}

function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function alertIa(element) {
    clearElement(element);

    element.classList.add('error-2');

    element.textContent = 'Error generating your advice :(';

    setTimeout(() => {
        element.classList.remove('error-2');
        element.textContent = '';
        element.parentNode.open = false;
    }, 3000);
}

function clearHTMLAI() {
    while(iaContainer.firstChild) {
        iaContainer.removeChild(iaContainer.firstChild);
    }
    const aiParagraph = document.createElement('p');
    aiParagraph.textContent = 'Here you can use the AI to take advices about your goals, with a simple click you get a customized IA response to your task.';

    iaContainer.appendChild(aiParagraph);
}

function setAiResponse(response, id, element) {

    goals.forEach(goal => {
        if (goal.id === id) {
            goal.ai = response;
        } 
    })

    element.innerHTML = response;

    syncStorage();
}