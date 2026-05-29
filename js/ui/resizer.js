export function initResizer({ resizerId }) {
  const r = document.getElementById(resizerId);
  if (!r) return;

  const left = r.previousElementSibling;
  let startX, startWidth;

  const move = e => {
    const dx = e.clientX - startX;
    left.style.width = ((startWidth + dx) * 100 / r.parentNode.clientWidth) + '%';
    document.body.style.cursor = 'col-resize';
  };

  const stop = () => {
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', stop);
    document.body.style.removeProperty('cursor');
  };

  r.addEventListener('mousedown', e => {
    startX = e.clientX;
    startWidth = left.getBoundingClientRect().width;
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stop);
  });
}
