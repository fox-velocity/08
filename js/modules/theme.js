// theme.js

export function initializeTheme() {
    const body = document.body;
    body.setAttribute('data-theme', 'light');
}

export function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);

     const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
     sunIcon.style.display = sunIcon.style.display === 'none' ? 'block' : 'none';
   moonIcon.style.display = moonIcon.style.display === 'none' ? 'block' : 'none';
}
