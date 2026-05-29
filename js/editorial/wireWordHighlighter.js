/**
 * Editorial word highlighting (search)
 * ------------------------------------
 * Highlights .word elements whose data-word
 * contains the search string.
 *
 * This mirrors the legacy jQuery logic but
 * uses modern DOM APIs and better semantics.
 */
export function wireWordHighlighter(container, itemId) {
  const input = container.querySelector(`#searchInput-${itemId}`);
  if (!input) return;

  const words = container.querySelectorAll(".word");

  input.addEventListener("input", () => {
    const filter = input.value.trim().toLowerCase();

    words.forEach(word => {
      const key = word.dataset.word || "";
      if (filter && key.includes(filter)) {
        word.classList.add("highlighted");
      } else {
        word.classList.remove("highlighted");
      }
    });
  });
}