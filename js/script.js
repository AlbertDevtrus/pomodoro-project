import { goalIA } from './ai.js';
import { clearElement, changeTheme, changeSound, changeColor, syncStorage } from './utilitys.js';
import { 
    themeButton,
    timer,
    nextTimer,
    startPauseButton,
    resetButton,
    skipButton,
    addGoal,
    inputGoal,
    todolist,
    errorMessage,
    title
} from './selectors.js';

export let goals = [];


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

/*-----------------------------------------------------------------------------------------------*/
/*                                         WEB WORKERS                                           */
/*-----------------------------------------------------------------------------------------------*/

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
            title.textContent = value;
            break;
        default:
            console.warn('Tipo de mensaje desconocido:', event.data.type);
    }
};

/*-----------------------------------------------------------------------------------------------*/
/*                                         GOALS                                                 */
/*-----------------------------------------------------------------------------------------------*/


function createGoal() {
    const descriptionGoal = inputGoal.value;

    if (descriptionGoal.trim() !== "" && todolist.children.length < 10 && descriptionGoal.length <= 100) {

        const goalObj = {
            id: Date.now(),
            text: descriptionGoal,
            ai: ''
        }

        goals = [...goals, goalObj];

        inputGoal.value = "";
        
        generateHTMLGoal();
        goalIA();
        syncStorage();

    } else if (todolist.children.length >= 10) {
        errorMessage.style.display = 'inline';

        setTimeout( () => {
            errorMessage.style.display = 'none';
        }, 3000 );
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