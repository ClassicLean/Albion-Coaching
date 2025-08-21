import { debounce } from './utils.js';

export function initRubricDetailsToggle() {
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