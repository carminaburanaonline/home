// Entry point for the page sources.html (list of sources)

import { t, applyTranslations } from '../lang.js';

let bibliography = [];
let currentSort = "author";

export async function renderBibliographyPage() {
  const response = await fetch("json/bibliography.json");
  bibliography = await response.json();

  document.getElementById("bib-search").addEventListener("input", renderBibliography);

  document.getElementById("sort-author").addEventListener("click", () => {
      currentSort = "author";
      renderBibliography();
      updateActiveButton();
  });

  document.getElementById("sort-year").addEventListener("click", () => {
      currentSort = "year";
      renderBibliography();
      updateActiveButton();
  });

  document.getElementById("sort-title").addEventListener("click", () => {
      currentSort = "title";
      renderBibliography();
      updateActiveButton();
  });

  updateActiveButton();
  renderBibliography();

  const id =
  new URLSearchParams(window.location.search).get("id");

  if (id) {
    const entry = document.getElementById(`bib-${id}`);

    if (entry) {
      entry.classList.add("bib-highlight");
      entry.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }
}

function renderBibliography() {

    const container = document.getElementById("bib-results");

    const query = document.getElementById("bib-search").value.trim().toLowerCase();

    let entries = bibliography.filter(item =>
        item.searchText.includes(query)
    );

    switch (currentSort) {

        case "year": entries.sort((a, b) => b.sortYear - a.sortYear); break;

        case "title": entries.sort((a, b) => a.sortTitle.localeCompare(b.sortTitle)); break;

        default: entries.sort((a, b) => a.sortAuthor.localeCompare(b.sortAuthor));
    }

    container.innerHTML = entries.map(item => `<div class="bib-entry" id="bib-${item.id}">${item.formattedHTML}</div>`).join("");
    applyTranslations();
}

function updateActiveButton() {

    document.querySelectorAll(".bib-sort-button").forEach(button =>
        button.classList.remove("active")
    );

    document.getElementById(`sort-${currentSort}`).classList.add("active");
}



