export async function includeHTML() {

  const elements = document.querySelectorAll('[data-include]');

  const promises = Array.from(elements).map(async el => {
    const file = el.getAttribute('data-include');

    const res = await fetch(`templates/${file}.html`);
    const html = await res.text();

    el.innerHTML = html;
  });

  await Promise.all(promises);
}