export default class FilterSortDropdown {
    constructor(triggerId, menuId) {
      this.button = document.getElementById(triggerId);
      this.menu = document.getElementById(menuId);
  
      if (this.button && this.menu) {
        this.init();
      } else {
        console.warn(`Dropdown init gagal: #${triggerId} atau #${menuId} tidak ditemukan.`);
      }
    }
  
    init() {
      // Toggle menu on button click
      this.button.addEventListener('click', (e) => {
        e.stopPropagation();
        this.menu.classList.toggle('hidden');
      });
  
      // Close menu when clicking outside
      window.addEventListener('click', (e) => {
        if (!this.menu.contains(e.target) && !this.button.contains(e.target)) {
          this.menu.classList.add('hidden');
        }
      });
    }
  }