export default class Dropdown {
    constructor(buttonId, menuId) {
      this.button = document.getElementById(buttonId);
      this.menu = document.getElementById(menuId);
  
      if (this.button && this.menu) {
        this.init();
      } else {
        console.warn('Dropdown elements not found!');
      }
    }
  
    init() {
      // Toggle menu
      this.button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent window listener from firing immediately
        this.menu.classList.toggle('hidden');
      });
  
      // Close if clicked outside
      window.addEventListener('click', (e) => {
        if (!this.menu.contains(e.target) && !this.button.contains(e.target)) {
          this.menu.classList.add('hidden');
        }
      });
    }
  }