function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

document.addEventListener('DOMContentLoaded', function() {

  // Rubric Details Toggle Logic - Encapsulated
  function initRubricDetailsToggle() {
    const rubricDetails = document.querySelector('details');
    if (rubricDetails) { // Check if rubricDetails element exists
      const rubricSummary = rubricDetails.querySelector('summary');
      // rubricSummary is a child of rubricDetails, so it should exist if rubricDetails exists.
      // No need for an extra check here.

      function updateRubricSummaryText() {
        if (rubricDetails.open) {
          rubricSummary.textContent = 'Hide rubric details';
        } else {
          rubricSummary.textContent = 'Show rubric details';
        }
      }

      // Set initial text
      updateRubricSummaryText();

      // Update text on toggle
      rubricDetails.addEventListener('toggle', updateRubricSummaryText);
    }
  }

  // Initialize Rubric Details Toggle
  initRubricDetailsToggle();

  // Smooth scrolling for anchor links - Encapsulated
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) { // Add null check for targetElement
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Initialize Smooth Scrolling
  initSmoothScrolling();

  // Back to Top Button logic - Encapsulated
  function initBackToTopButton() {
    const backToTopBtn = document.getElementById("backToTopBtn");

    if (backToTopBtn) { // Add null check for backToTopBtn
      const toggleBackToTopButton = () => {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          backToTopBtn.style.display = "block";
        } else {
          backToTopBtn.style.display = "none";
        }
      };

      // Initial check
      toggleBackToTopButton();

      // When the user scrolls, show/hide the button (debounced for performance)
      window.addEventListener('scroll', debounce(toggleBackToTopButton, 100));

      // When the user clicks on the button, scroll to the top of the document
      backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // Initialize Back to Top Button
  initBackToTopButton();

  // Dynamic Navigation Bar logic
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

  // Lightbox Logic - Encapsulated
  function initLightbox() {
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxVideoContainer = document.getElementById('lightbox-video-container');

    // Add null checks for lightbox elements
    if (!lightboxOverlay || !lightboxContent || !lightboxClose || !lightboxVideoContainer) {
      console.warn("Lightbox elements not found. Lightbox functionality may be limited.");
      return; // Exit if essential elements are missing
    }

    let previouslyFocusedElement = null; // To store the element that opened the lightbox

    videoThumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', function() {
        previouslyFocusedElement = this; // Store the element that opened the lightbox
        const videoId = this.dataset.videoId;
        const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;


        lightboxVideoContainer.innerHTML = `<iframe src="${youtubeEmbedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
        lightboxOverlay.classList.add('is-open'); // Use class for lightbox state

        // Focus management: Move focus to the lightbox content or close button
        lightboxClose.focus();
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxOverlay.addEventListener('click', function(e) {
      if (e.target === lightboxOverlay) { // Close only if clicking on the overlay itself
        closeLightbox();
      }
    });

    function closeLightbox() {
      lightboxOverlay.classList.remove('is-open'); // Use class for lightbox state
      lightboxVideoContainer.innerHTML = ''; // Clear the video to stop playback

      // Focus management: Return focus to the element that opened the lightbox
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    }

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightboxOverlay.classList.contains('is-open')) { // Check class for lightbox state
        closeLightbox();
      }
    });
  }

  // Initialize Lightbox
  initLightbox();

});