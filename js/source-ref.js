let sourcesLookup = null;

export async function initializeSourceRefs() {
  if (!sourcesLookup) {
    const response = await fetch("json/sources.json");
    const sources = await response.json();
    sourcesLookup = {};
    sources.forEach(source => {
      sourcesLookup[source.id.toString()] = source;
    });
  }

  attachSourceHandlers();
}

function attachSourceHandlers() {
  const tooltip = createTooltip();
  document.querySelectorAll(".source-ref").forEach(ref => {
    const id = ref.dataset.sourceId;
    const source = sourcesLookup[id];
    if (!source) {
      console.warn(`Unknown source id: ${id}`);
      return;
    }

    ref.setAttribute("href", `source.html?id=${encodeURIComponent(id)}`);

    ref.addEventListener("mouseenter", event => {
        showTooltip(tooltip, source, event.currentTarget);
    });

    ref.addEventListener("mouseleave", () => {
        hideTooltip(tooltip);
      }
    );
  });
}

function createTooltip() {
  const tooltip = document.createElement("div");
  tooltip.className = "source-tooltip";
  document.body.appendChild(tooltip);
  return tooltip;
}

function showTooltip(tooltip, source, target) {
  tooltip.innerHTML = `${source.city}, ${source.library} (${source.country})`;
  tooltip.style.display = "block";
  const rect = target.getBoundingClientRect();
  tooltip.style.position = "fixed";
  tooltip.style.left = `${rect.left}px`;
  tooltip.style.top = `${rect.bottom + 8}px`;
}

function hideTooltip(tooltip) {
  tooltip.style.display = "none";
  tooltip.dataset.activeId = "";
}