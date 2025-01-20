// theme.js

export function initializeTheme() {
    const body = document.body;
    body.setAttribute('data-theme', 'dark');
     const moonIcon = document.querySelector('.moon-icon');
    moonIcon.style.display = 'none';
}

export function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);

    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    if(sunIcon.style.display == 'none') {
     sunIcon.style.display = 'block'
    } else {
        sunIcon.style.display = 'none'
    }
    if(moonIcon.style.display == 'none') {
        moonIcon.style.display = 'block'
       } else {
           moonIcon.style.display = 'none'
       }
}
