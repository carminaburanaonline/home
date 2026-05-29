export function initWordHighlighting({ container, input }) {
  if (!container || !input) return;

  input.addEventListener('input', () => {
    const filter = input.value.toLowerCase();
    container.querySelectorAll('span.word').forEach(w => {
      const val = w.dataset.word || '';
      w.classList.toggle('highlighted', filter && val.includes(filter));
    });
  });
}
