import Dropdown from "./sidebardropdown.js";
import FilterSortDropdown from './sortdropdown.js';

document.addEventListener("DOMContentLoaded", () => {
  new Dropdown("dropdownBtn", "dropdownMenu");
});

document.addEventListener('DOMContentLoaded', () => {
  new FilterSortDropdown('filterBtn', 'filterMenu');
  new FilterSortDropdown('sortBtn', 'sortMenu');
});