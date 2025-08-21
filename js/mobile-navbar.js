export function initMobileNavbar() {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const mobileNav = document.getElementById('mobile-nav');
  const navMenu = document.querySelector('.nav__menu'); // Desktop nav menu

  if (hamburgerMenu && mobileNav && navMenu) {
    hamburgerMenu.addEventListener('click', () => {
      hamburgerMenu.classList.toggle('open');
      mobileNav.classList.toggle('open');
      // Toggle aria-expanded for accessibility
      const isExpanded = hamburgerMenu.classList.contains('open');
      hamburgerMenu.setAttribute('aria-expanded', isExpanded);
      mobileNav.setAttribute('aria-hidden', !isExpanded);

      // The media query in style.css now handles hiding/showing the desktop nav.
      // No explicit JavaScript manipulation of navMenu.style.display is needed here.
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerMenu.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburgerMenu.setAttribute('aria-expanded', false);
        mobileNav.setAttribute('aria-hidden', true);
      });
    });

    // Close mobile nav when clicking outside (optional, but good for UX)
    document.addEventListener('click', (event) => {
      if (!mobileNav.contains(event.target) && !hamburgerMenu.contains(event.target) && mobileNav.classList.contains('open')) {
        hamburgerMenu.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburgerMenu.setAttribute('aria-expanded', false);
        mobileNav.setAttribute('aria-hidden', true);
      }
    });
  }
}