/**
 * editorial-metrics.js
 * --------------------
 * Populate per-verse metrical and rhyme information
 * from strophe/refrain-level data attributes.
 *
 * Mirrors legacy item_core_view.js behavior (lines 141–158)
 * without jQuery.
 */

export function fillVerseMetrics(root) {
  if (!root) return;

  // Process both strophes and refrains
  root.querySelectorAll('.strophe, .refrain').forEach(block => {

    ['met', 'rhyme'].forEach(key => {
      const data = block.dataset[key];
      if (!data) return;

      const values = data.split('/');
      const verseInfoSpans = block.querySelectorAll(`.verse-${key}`);
      const verses = block.querySelectorAll('.verse');

      for (let i = 0; i < verses.length; i++) {
        const verse = verses[i];
        const infoSpan = verseInfoSpans[i];
        if (!infoSpan) continue;

        // If verse-specific data exists, prefer it
        if (infoSpan.dataset[key]) {
          verse.dataset[key] = infoSpan.dataset[key];
          infoSpan.innerHTML = `<b>${infoSpan.dataset[key]}</b>`;
        } else if (values[i]) {
          verse.dataset[key] = values[i];
          infoSpan.textContent = values[i];
        }
      }
    });
  });
}