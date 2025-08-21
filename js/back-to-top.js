import { debounce } from './utils.js';

export function initBackToTopButton() {
  const backToTopBtns = document.querySelectorAll('[id^="backToTopBtn"]');

  const toggleBackToTopButtons = () => {
    backToTopBtns.forEach(backToTopBtn => {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.visibility = "visible";
                backToTopBtn.style.opacity = "1";
      } else {
        backToTopBtn.style.visibility = "hidden";
                backToTopBtn.style.opacity = "0";
      }
    });
  };

  // Initial check
  toggleBackToTopButtons();

  // When the user scrolls, show/hide the buttons (debounced for performance)
  window.addEventListener('scroll', debounce(toggleBackToTopButtons, 100));

  backToTopBtns.forEach(backToTopBtn => {
    // When the user clicks on the button, scroll to the top of the document
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
}