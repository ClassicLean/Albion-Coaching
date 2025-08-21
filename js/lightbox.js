export function initLightbox() {
  const videoThumbnails = document.querySelectorAll('.video-thumbnail');
  console.log('Found video thumbnails:', videoThumbnails.length);
  const lightboxOverlay = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightbox-content');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxVideoContainer = document.getElementById('lightbox-video-container');
  const mainContent = document.querySelector('main');
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');

  // Add null checks for lightbox elements
  if (!lightboxOverlay || !lightboxContent || !lightboxClose || !lightboxVideoContainer) {
    console.warn("Lightbox elements not found. Lightbox functionality may be limited.");
    return; // Exit if essential elements are missing
  }

  let previouslyFocusedElement = null; // To store the element that opened the lightbox

  // Define trapTabKey in a scope accessible by both openLightbox and closeLightbox
  const trapTabKey = (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  videoThumbnails.forEach(thumbnail => {
      thumbnail.setAttribute('tabindex', '0');
      thumbnail.addEventListener('click', function() {
          openLightbox(this.dataset.videoId, this);
      });

      thumbnail.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
              openLightbox(this.dataset.videoId, this);
          }
      });
  });

  function openLightbox(videoId, opener) {
      previouslyFocusedElement = opener;
      const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

      lightboxVideoContainer.innerHTML = `<iframe src="${youtubeEmbedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
              lightboxOverlay.classList.add('lightbox--is-open');
      lightboxOverlay.setAttribute('aria-hidden', 'false');
      if (mainContent) mainContent.setAttribute('aria-hidden', 'true');
      if (header) header.setAttribute('aria-hidden', 'true');
      if (footer) footer.setAttribute('aria-hidden', 'true');

      // Focus management: Move focus to the lightbox content or close button
      lightboxClose.focus();

      // Trap focus within the lightbox
      const focusableElements = lightboxContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const firstFocusableElement = focusableElements[0];
      const lastFocusableElement = focusableElements[focusableElements.length - 1];

      lightboxOverlay.addEventListener('keydown', trapTabKey);
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', function(e) {
    if (e.target === lightboxOverlay) { // Close only if clicking on the overlay itself
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightboxOverlay.classList.remove('lightbox--is-open'); // Use class for lightbox state
    lightboxOverlay.setAttribute('aria-hidden', 'true');
    if (mainContent) mainContent.setAttribute('aria-hidden', 'false');
    if (header) header.setAttribute('aria-hidden', 'false');
    if (footer) footer.setAttribute('aria-hidden', 'false');
    lightboxVideoContainer.innerHTML = ''; // Clear the video to stop playback

    // Remove keydown listener for focus trapping
    lightboxOverlay.removeEventListener('keydown', trapTabKey);

    // Focus management: Return focus to the element that opened the lightbox
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }

  // Close lightbox with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightboxOverlay.classList.contains('lightbox--is-open')) { // Check class for lightbox state
      closeLightbox();
    }
  });
}