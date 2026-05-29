document.addEventListener('DOMContentLoaded', async () => {
  const elements = document.querySelectorAll('[data-include]');

  await Promise.all([...elements].map(async el => {
    const name = el.dataset.include;
    const res = await fetch(`templates/${name}.html`);
    el.innerHTML = await res.text();
  }));
});
