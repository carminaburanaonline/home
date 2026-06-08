import { includeHTML } from './includes.js';
import { loadLang, initLangSwitcher, updateActiveButton, applyTranslations } from './lang.js';

export async function initPage(renderPage = null) {
  await includeHTML();

  // --- determine language ---
  const params = new URLSearchParams(location.search);
  const urlLang = params.get('lang');
  const savedLang = localStorage.getItem('lang');

  const lang = urlLang || savedLang || 'en';

  // --- load language ---
  await loadLang(lang);

  // --- update UI ---
  updateActiveButton(lang);

  // --- setup switcher ---
  initLangSwitcher();

  // --- render the rest of the page ---
  if (renderPage) {
    await renderPage();
  }

  // --- fill text of elements according to language ---
  applyTranslations();
}