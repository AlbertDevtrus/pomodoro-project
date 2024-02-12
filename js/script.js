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
    favicon,
    errorMessage,
    iaContainer,
    title
} from './selectors.js';
import { goalIA } from './ai.js';
import { clearElement } from './utilitys.js';


let goals = [];

eventListeners();
function eventListeners() {
    startPauseButton.addEventListener('click', function () {
        if (startPauseButton.textContent === "S t a r t") {
            worker.postMessage('start');
            startPauseButton.textContent = "P a u s e";
        } else {
            worker.postMessage('stop');
            startPauseButton.textContent = "S t a r t";
        }
    });
    resetButton.addEventListener('click', () => {
        worker.postMessage('reset');
    });
    skipButton.addEventListener('click', () => {
        worker.postMessage('skip');
    });
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

worker.onmessage = function(event) {
    const { type, value, running } = event.data;

    switch (type) {
        case 'timer-text-content':
            timer.textContent = value;
            break;
        case 'next-timer-text-content':
            nextTimer.textContent = value;
            break;
        case 'change-color':
            changeColor(value, running);
            break;
        case 'startbtn-text-content':
            startPauseButton.textContent = value;
            break;
        case 'change-sound':
            changeSound();
            break;
        case 'title-text-content':
            title.textContent = `${value} - Pomodoro timer`;
        default:
            console.warn('Tipo de mensaje desconocido:', event.data.type);
    }
};

//change the color of the count
function changeColor(stageSeconds, running) {
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

//play the alarm for the end
function changeSound() {
    ringSound.currentTime = 0;
    ringSound.volume = 1;
    ringSound.play();
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


/*-----------------------------------------------------------------------------------------------*/
/*                                         GOALS                                                 */
/*-----------------------------------------------------------------------------------------------*/


function createGoal() {
    const descriptionGoal = inputGoal.value;

    if (descriptionGoal.trim() !== "" && todolist.children.length < 10 && descriptionGoal.length <= 100) {
        errorMessage.style.display = 'none';

        const goalObj = {
            id: Date.now(),
            text: descriptionGoal,
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
    clearElement(todolist);

    goals.forEach(goal => {
        const goalItem = document.createElement("li");
        const description = document.createElement('p');

        description.textContent = goal.text;

        const check = createCheck(goal.id);
        const edit = createEdit(goal.id);
        const deleter = createDelete(goal.id);

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
}

function createCheck(id) {
    const completeGoal = document.createElement("input");
    const label = document.createElement('label');
    const span = document.createElement('span');
    label.appendChild(completeGoal);
    label.appendChild(span);
    label.setAttribute("class", "complete-goal");
    completeGoal.setAttribute("type", "checkbox");
    completeGoal.onclick = () => {

        const paragraph = completeGoal.parentNode.nextSibling;
        paragraph.classList.add('selected');
        
        setTimeout( () => {
            deleteElement(id);
        }, 1500 );
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

function syncStorage() {
    localStorage.setItem('goals', JSON.stringify(goals));
}