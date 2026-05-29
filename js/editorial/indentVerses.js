function countSyllables(s) {
  return s.split('+').reduce((sum, p) => sum + parseInt(p.match(/\d+/)), 0);
}

export function indentVerses(root) {
  root.querySelectorAll('.strophe, .refrain').forEach(block => {
    const met = block.dataset.met.split('/');
    const counts = met.map(countSyllables);
    const unique = [...new Set(counts)].sort((a, b) => b - a);

    block.querySelectorAll('.verse').forEach((verse, i) => {
      const indent = unique.indexOf(counts[i]);
      verse.dataset.indent = indent;
      verse.querySelector('.verse-text')?.style.setProperty('padding-left', `calc(${indent} * 20px)`);
    });
  });
}

export function indentVersesFromDataIndent(container) {
  if (!container) return;
  container.querySelectorAll('.verse').forEach(verse => {
      const indent = verse.dataset.indent;
      verse.querySelector('.verse-text')?.style.setProperty('padding-left', `calc(${indent} * 20px)`);
    });
}
