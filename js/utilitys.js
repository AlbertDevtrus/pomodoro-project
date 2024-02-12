import { themeButton, ringSound, favicon, counterContainer } from './selectors.js';
import { goals } from './script.js';


export function clearElement(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

export function changeSound() {
    ringSound.currentTime = 0;
    ringSound.volume = 1;
    ringSound.play();
}

export function changeTheme() {
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

export function changeColor(stageSeconds, running) {
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

export function syncStorage() {
    localStorage.setItem('goals', JSON.stringify(goals));
}