import { applyTranslations } from './lang.js';

let bibliographyLookup = null;

export async function initializeBibliographyRefs() {
  if (!bibliographyLookup) {
    const response = await fetch("json/bibliography.json");
    const bibliography = await response.json();
    bibliographyLookup = {};
    bibliography.forEach(item => {
      bibliographyLookup[item.id] = item;
    });
  }

  attachCitationHandlers();
}

function attachCitationHandlers() {
  const tooltip = createTooltip();
  document.querySelectorAll(".bib-ref").forEach(ref => {
    const id = ref.dataset.bibId;
    const item = bibliographyLookup[id];
    if (!item) {
      console.warn(`Unknown bibliography id: ${id}`);
      return;
    }

    ref.setAttribute("href", `bibliography.html?id=${encodeURIComponent(id)}`);

    ref.addEventListener("mouseenter", event => {
        showTooltip(tooltip, item, event.currentTarget);
    });

    ref.addEventListener("mouseleave", () => {
        hideTooltip(tooltip);
      }
    );
  });
}

function createTooltip() {
  const tooltip = document.createElement("div");
  tooltip.className = "bib-tooltip";
  document.body.appendChild(tooltip);
  return tooltip;
}

function showTooltip(tooltip, item, target) {
  tooltip.innerHTML = item.formattedHTML;
  tooltip.style.display = "block";
  const rect = target.getBoundingClientRect();
  tooltip.style.position = "fixed";
  tooltip.style.left = `${rect.left}px`;
  tooltip.style.top = `${rect.bottom + 8}px`;
  applyTranslations();
}

function hideTooltip(tooltip) {
  tooltip.style.display = "none";
  tooltip.dataset.activeId = "";
}