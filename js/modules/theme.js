// theme.js

export function initializeTheme() {
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Vérifie si un thème est déjà enregistré dans localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.removeAttribute('data-theme'); // Le thème sombre n'utilise pas d'attribut data-theme
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        body.setAttribute('data-theme', 'light');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}

export function toggleTheme() {
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const currentTheme = body.getAttribute('data-theme');

    if (currentTheme === 'light') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    } else {
        body.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    }
}