// hacky way to make DaisyUI button animations work on iOS
document.addEventListener('touchstart', () => {}, true);

// dark mode script
const setTheme = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute(
    'data-theme',
    prefersDark ? 'cupcake_dark' : 'cupcake',
  );
};

// auto switch when system switches
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', setTheme);

// Initial load
setTheme();
