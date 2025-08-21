'use strict';

import { initRubricDetailsToggle } from './rubric-details-toggle.js';
import { initSmoothScrolling } from './smooth-scrolling.js';
import { initBackToTopButton } from './back-to-top.js';
import { initDynamicNavbar } from './dynamic-navbar.js';
import { initLightbox } from './lightbox.js';
import { initMobileNavbar } from './mobile-navbar.js'; // New import

document.addEventListener('DOMContentLoaded', function() {
  initRubricDetailsToggle();
  initSmoothScrolling();
  initBackToTopButton();
  initDynamicNavbar();
  initLightbox();
  initMobileNavbar(); // New function call
});