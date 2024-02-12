import { clearElement } from './utilitys.js';
import { iaContainer } from './selectors.js';
import { goals } from './script.js';

export function goalIA() {
    clearElement(iaContainer);

    const aiParagraph = document.createElement('p');
    aiParagraph.textContent = 'Here you can use the AI to take advices about your goals, with a simple click you get a customized IA response to your task.';

    iaContainer.appendChild(aiParagraph);

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

function setAiResponse(response, id, element) {

    goals.forEach(goal => {
        if (goal.id === id) {
            goal.ai = response;
        } 
    })

    element.innerHTML = response;

    syncStorage();
}