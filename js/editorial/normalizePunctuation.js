/*
 * normalizePunctuation.js
 * -----------------------
 * Editorial post-processing for punctuation placement.
 *
 * Rules:
 * - By default, punctuation (.pc) is attached to the PREVIOUS word
 *   in document order.
 * - If a punctuation element has class "pre", it is attached to the
 *   NEXT word in document order.
 *
 * Usage:
 *   import { normalizePunctuation } from './editorial-punctuation.js';
 *   normalizePunctuation(container);
 */

function findPreviousWord(node) {
  let current = node.previousElementSibling;

  while (current) {
    if (current.classList?.contains('word')) {
      return current;
    }

    const words = current.querySelectorAll?.('.word');
    if (words && words.length) {
      return words[words.length - 1];
    }

    current = current.previousElementSibling;
  }

  return null;
}

function findNextWord(node) {
  let current = node.nextElementSibling;

  while (current) {
    if (current.classList?.contains('word')) {
      return current;
    }

    const words = current.querySelectorAll?.('.word');
    if (words && words.length) {
      return words[0];
    }

    current = current.nextElementSibling;
  }

  return null;
}

export function normalizePunctuation(root) {
  if (!root) return;

  root.querySelectorAll('.pc').forEach(pc => {

    // PRE‑posed punctuation => attach to NEXT word
    if (pc.classList.contains('pre')) {
      const nextWord = findNextWord(pc);
      if (!nextWord) return;

      const firstSylText = nextWord.querySelector('.syl-text');
      if (firstSylText) {
        // Preferred: inside first syllable
        firstSylText.insertBefore(pc, firstSylText.firstChild);
      } else {
        // Fallback: word has no syllables
        nextWord.insertBefore(pc, nextWord.firstChild);
      }
      return;
    }

    // Post‑posed punctuation => attach to PREVIOUS word
    const prevWord = findPreviousWord(pc);
    if (!prevWord) return;

    const sylTexts = prevWord.querySelectorAll('.syl-text');
    if (sylTexts.length) {
      // Preferred: inside last syllable
      sylTexts[sylTexts.length - 1].appendChild(pc);
    } else {
      // Fallback: word has no syllables
      prevWord.appendChild(pc);
    }
  });
}
