import Alpine from 'alpinejs';

window.Alpine = Alpine;
Alpine.store('profile_photo', {
  url: '',
  set(newUrl) {
    this.url = newUrl;
  },
});

Alpine.start();

document.addEventListener('touchstart', () => {}, true);
