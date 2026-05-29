export function wordsAndSyllables(root) {
  if (!root) return;
  root.querySelectorAll('span.word').forEach(word => {
    if (!word.dataset.word) {
      word.dataset.word = word.textContent.replace(/\s/g, "").toLowerCase();
    }
  });
}
