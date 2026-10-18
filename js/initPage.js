import { includeHTML } from './includes.js';
import { loadLang, initLangSwitcher, updateActiveButton, applyTranslations } from './lang.js';
import { initializeBibliographyRefs } from './bibliography-ref.js';
import { initializeSourceRefs } from './source-ref.js';

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

  // --- render the bib-ref and source-ref elements ---
  initializeBibliographyRefs();
  initializeSourceRefs();

  // --- fill text of elements according to language ---
  applyTranslations();
}