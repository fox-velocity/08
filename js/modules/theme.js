// theme.js

export function initializeTheme() {
     const body = document.body;
     body.setAttribute('data-theme', 'light');
     const sunIcon = document.querySelector('.sun-icon');
     const moonIcon = document.querySelector('.moon-icon');
      sunIcon.style.display = 'block';
       moonIcon.style.display = 'none';
}

export function toggleTheme() {
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
     sunIcon.style.display = sunIcon.style.display === 'none' ? 'block' : 'none';
   moonIcon.style.display = moonIcon.style.display === 'none' ? 'block' : 'none';
  }
   window.toggleTheme = toggleTheme;
