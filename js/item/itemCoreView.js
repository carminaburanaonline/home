import { XSLtransform } from '../xml/xslRenderer.js';
import { indentVerses } from '../editorial/indentVerses.js';
import { wordsAndSyllables } from '../editorial/wordsAndSyllables.js';
import { normalizeVerseNumbers } from '../editorial/verseNumbers.js';
import { normalizePunctuation } from '../editorial/normalizePunctuation.js';
import { fillVerseMetrics } from '../editorial/fillVerseMetrics.js';
import { wireWordHighlighter } from '../editorial/wireWordHighlighter.js';


export async function itemCoreView(container, item) {
  if (!container || !item) return;

  const itemId = item.file
  const template = 'templates/item_core_view.html'

  const html = await fetch(template).then(r => r.text());
  container.innerHTML = html;

  container.querySelectorAll('.item-specific').forEach(el => {
    el.id = `${el.id}-${itemId}`;
  });

  // --- XSL-rendered views ---
  await renderXslViews(container, itemId);

  // --- Editorial post‑processing ---
  container.querySelectorAll(".pc[data-resp='ms']").forEach(el => el.classList.add('hidden'));
  indentVerses(container);
  wordsAndSyllables(container);
  normalizeVerseNumbers(container, 5);
  normalizePunctuation(container);
  fillVerseMetrics(container);

  // --- Interaction wiring ---
  wireTabs(container);
  wireViewSwitch(container, itemId);
  wireToggle(container, `toggleNeumesButton-${itemId}`, '.neumes');
  wireToggle(container, `toggleVersificationButton-${itemId}`, '.verse-met, .poem-met, .verse-rhyme');
  wireToggle(container, `togglePunctuationButton-${itemId}`, '.pc');
  wireSyllableToggle(container, itemId);
  wireApparatusToggle(container, itemId);
  wireWordHighlighter(container, itemId);
}

export async function SVGitemCoreView(container, item) {
  if (!container || !item) return;

  const itemId = item.file
  const template = 'templates/item_core_view_svg.html'

  const html = await fetch(template).then(r => r.text());
  container.innerHTML = html;

  container.querySelectorAll('.item-specific').forEach(el => {
    el.id = `${el.id}-${itemId}`;
  });

  // --- SVG-images ---
  addSvgImages(container, item);

  // --- XSL-rendered views ---
  await renderXslViews(container, itemId);

  // --- Editorial post‑processing ---
  container.querySelectorAll(".pc[data-resp='ms']").forEach(el => el.classList.add('hidden'));
  indentVerses(container);
  wordsAndSyllables(container);
  normalizeVerseNumbers(container, 5);
  normalizePunctuation(container);
  fillVerseMetrics(container);

  // --- Interaction wiring ---
  wireTabs(container);
  wireViewSwitch(container, itemId);
  wireToggle(container, `toggleMetricButton-${itemId}`, '.verse-met, .poem-met');
  wireToggle(container, `toggleRhymeButton-${itemId}`, '.verse-rhyme');
  wireToggle(container, `togglePunctuationButton-${itemId}`, '.pc');
  wireApparatusToggle(container, itemId);
  wireWordHighlighter(container, itemId);
}

function textToSvgElement(text) {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("width", "100%");
  wrapper.innerHTML = text;
  const svgEl = wrapper.querySelector("svg");
  svgEl.setAttribute("preserveAspectRatio", "xMinYMin meet");
  return svgEl;



}

async function addSvgImages(container, item) {
  const itemId = item.file

  // Create or find the SVG container
  let svgContainer = container.querySelector(`#svg-${itemId}`);
  if (!svgContainer) {
    return;
  }

  // Clear existing content (important if re-rendering)
  svgContainer.innerHTML = "";

  // Create SVG template
  if (item.SVGfiles == 1) {
    const svgText = await fetch(`img/mzsc/${itemId}.svg`).then(r => r.text());
    svgContainer.appendChild(textToSvgElement(svgText));
  }
  else {
    for (var x = 1; x <= item.SVGfiles; x++) {
      const svgText = await fetch(`img/mzsc/${itemId}-${x}.svg`).then(r => r.text());
      svgContainer.appendChild(textToSvgElement(svgText));
    }
  }
}

async function renderXslViews(container, itemId) {
  const map = [
    [`#formattedText-${itemId}`, 'xsl/formatted.xsl'],
    [`#continuousText-${itemId}`, 'xsl/continuous.xsl'],
    [`#apparatusText-${itemId}`, 'xsl/text-apparatus.xsl'],
    [`#apparatusNeume-${itemId}`, 'xsl/neume-apparatus.xsl']
  ];

  for (const [selector, xsl] of map) {
    const target = container.querySelector(selector);
    if (target) {
      target.append(await XSLtransform(`tei/${itemId}.tei`, xsl));
    }
  }
}

function wireTabs(container) {
  const tabs = container.querySelectorAll('.tablinks');
  const panels = container.querySelectorAll('.tabcontent.right');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const id = tab.dataset.tabTarget;
      panels.forEach(p => p.classList.add('hidden'));
      tabs.forEach(t => t.classList.remove('active'));
      container.querySelector(`#${id}`)?.classList.remove('hidden');
      tab.classList.add('active');
    });
  });

  tabs[0]?.click();
}

function wireViewSwitch(container, itemId) {
  const openFormattedText = container.querySelector(`#openFormattedText-${itemId}`);
  const openContinuousText = container.querySelector(`#openContinuousText-${itemId}`);
  const formattedText = container.querySelector(`#formattedText-${itemId}`);
  const continuousText = container.querySelector(`#continuousText-${itemId}`);

  openFormattedText?.addEventListener('click', () => {
    formattedText?.classList.remove('hidden');
    continuousText?.classList.add('hidden');
    openFormattedText.classList.add('active');
    openContinuousText?.classList.remove('active');
  });

  openContinuousText?.addEventListener('click', () => {
    continuousText?.classList.remove('hidden');
    formattedText?.classList.add('hidden');
    openContinuousText.classList.add('active');
    openFormattedText?.classList.remove('active');
  });

  const openSvg = container.querySelector(`#openSvg-${itemId}`);
  const openText = container.querySelector(`#openText-${itemId}`);
  const svg = container.querySelector(`#svg-${itemId}`);
  const text = container.querySelector(`#text-${itemId}`);

  openSvg?.addEventListener('click', () => {
    svg?.classList.remove('hidden');
    text?.classList.add('hidden');
    openSvg.classList.add('active');
    openText?.classList.remove('active');
  });

  openText?.addEventListener('click', () => {
    text?.classList.remove('hidden');
    svg?.classList.add('hidden');
    openText.classList.add('active');
    openSvg?.classList.remove('active');
  });
}

function wireToggle(container, buttonId, targetsSelector) {
  const button = container.querySelector(`#${buttonId}`);
  if (!button) return;

  const targets = container.querySelectorAll(targetsSelector);
  button.addEventListener('click', () => {
    targets.forEach(t => t.classList.toggle('hidden'));
    button.classList.toggle('active');
  });
}

function wireApparatusToggle(container, itemId) {
  const button = container.querySelector(`#toggleCriticalApparatus-${itemId}`);
  if (!button) return;

  const txt = container.querySelector(`#apparatusText-${itemId}`);
  const neu = container.querySelector(`#apparatusNeume-${itemId}`);
  const targets = container.querySelectorAll(".apparatus-in-text");

  button.addEventListener('click', () => {
    targets.forEach(t => t.classList.toggle('apparatus-active'));
    txt?.classList.toggle('hidden');
    neu?.classList.toggle('hidden');
    button.classList.toggle('active');
  });
}

function wireSyllableToggle(container, itemId) {
  const button = container.querySelector(`#toggleSyllablesButton-${itemId}`);
  if (!button) return;

  const dashedSyllables =
    container.querySelectorAll("span[data-dash='dashed'] .syl-text");

  button.addEventListener("click", () => {
    const isActive = button.classList.toggle("active");

    dashedSyllables.forEach(sylText => {
      const text = sylText.textContent;

      if (isActive) {
        // Add dash if not already present
        if (!text.endsWith("-")) {
          sylText.textContent = text + "-";
        }
      }
      else {
        // Remove trailing dash if present
        if (text.endsWith("-")) {
          sylText.textContent = text.slice(0, -1);
        }
      }
    });
  });
}