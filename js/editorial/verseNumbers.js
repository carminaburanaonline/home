// Show verse numbers only every N verses (default: 5)

export function normalizeVerseNumbers(root, step) {
  root.querySelectorAll('.strophe, .refrain').forEach(block => {
    block.querySelectorAll('.verse-number').forEach((v, i) => {
      if ((i + 1) % step !== 0) v.style.visibility = 'hidden';
    });
  });
}