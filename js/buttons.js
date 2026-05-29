document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.activable').forEach(el =>
    el.addEventListener('click', () => el.classList.add('active'))
  );

  document.querySelectorAll('.toggleable').forEach(el =>
    el.addEventListener('click', () => el.classList.toggle('active'))
  );
});
