// --- state ---
let LANG = {};
let currentLang = 'en';

// --- load language file ---
export async function loadLang(lang) {
  LANG = await fetch(`json/lang/${lang}.json`).then(r => r.json());
  currentLang = lang;

  localStorage.setItem('lang', lang);
  console.log(LANG);
}

// --- translation function ---
export function t(key, vars = {}) {
  let str = LANG[key] || key;

  for (const k in vars) {
    str = str.replace(`{${k}}`, vars[k]);
  }

  return str;
}

// --- fill textContent of all elements with attribute data-lang ---
export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
}

// --- UI helpers ---
export function updateActiveButton(lang) {
  document.querySelectorAll('#lang-switch button')
    .forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// --- setup switcher ---
export function initLangSwitcher() {
  const buttons = document.querySelectorAll('#lang-switch button');

  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const lang = btn.dataset.lang;

      await loadLang(lang);
      updateActiveButton(lang);

      applyTranslations();   // trigger page redraw
    });
  });
}