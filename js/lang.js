// --- state ---
let LANG = {};
let currentLang = 'en';

// --- load language file ---
export async function loadLang(lang) {
  LANG = await fetch(`json/lang/${lang}.json`).then(r => r.json());
  currentLang = lang;

  localStorage.setItem('lang', lang);
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
  // Translate elements according to the dictionary
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  // Hide elements in other languages
  document.querySelectorAll('[data-lang]').forEach(el => {
    console.log(el);
    if (el.dataset.lang != currentLang) {
      el.classList.add('hidden');
    }
    else {
      el.classList.remove('hidden');
    }
  });
}

// --- UI helpers ---
export function updateActiveButton(lang) {
  document.querySelectorAll('#lang-switch button')
    .forEach(btn => {
      btn.classList.toggle('active', btn.dataset.language === lang);
    });
}

// --- setup switcher ---
export function initLangSwitcher() {
  const buttons = document.querySelectorAll('#lang-switch button');

  buttons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const lang = btn.dataset.language;

      await loadLang(lang);
      updateActiveButton(lang);

      applyTranslations();   // trigger page redraw
    });
  });
}