import { debounce } from './utils.js';

export function initDynamicNavbar() {
  const navHeader = document.querySelector('.nav');
  if (navHeader) { // Add null check for navHeader
    const scrollThreshold = 50; // Adjust this value as needed

    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        navHeader.classList.add('scrolled-nav');
      } else {
        navHeader.classList.remove('scrolled-nav');
      }
    };

    window.addEventListener('scroll', debounce(handleScroll, 100)); // Debounce the scroll event
  }
}