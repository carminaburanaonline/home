// Entry point for the page neumes.html (list of neumes)

import { t, applyTranslations } from '../lang.js';
import { filterSources, getFilters } from './filters.js';

export async function renderSourcesPage() {
  const sources = await fetch('json/sources.json').then(r => r.json());

  const filters = document.querySelectorAll('.filters input, .filters select');

  filters.forEach(el => {
    el.addEventListener('input', update);
  });

  function update() {
    const filtered = filterSources(sources, getFilters());
    renderTable(filtered);
  }

  update(); // redraw table
}

function renderTable(sources) {
  const tbody = document.querySelector('#sourcesTable tbody');
  tbody.innerHTML = '';

  sources.forEach(source => {

    const tr = document.createElement('tr');
    tr.classList.add('main-row');

    // --- RISM with toggle button ---
    const tdRism = document.createElement('td');

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '▶';
    toggleBtn.classList.add('toggle-btn');

    const rismLink = document.createElement('a');
    rismLink.href = `source.html?id=${source.id}`;
    rismLink.textContent = source.rism || '';
    rismLink.style.marginLeft = '6px';

    tdRism.appendChild(toggleBtn);
    tdRism.appendChild(rismLink);
    tr.appendChild(tdRism);

    // --- other fields ---
    ['country', 'city', 'library'].forEach(field => {
      const td = document.createElement('td');
      td.textContent = source[field] || '';
      tr.appendChild(td);
    });

    // --- Links ---
    const tdLinks = document.createElement('td');

    if (source.links) {
      if (source.links.catalogue) {
        tdLinks.appendChild(createIcon(source.links.catalogue, '📄', 'Catalogue'));
      }
      if (source.links.images) {
        tdLinks.appendChild(createIcon(source.links.images, '🖼', 'Images'));
      }
      if (source.links.iiif) {
        tdLinks.appendChild(createIcon(source.links.iiif, 'img/IIIF_Logo.png', 'IIIF', true));
      }
    }

    tr.appendChild(tdLinks);

    // --- toggle behavior ---
    toggleBtn.addEventListener('click', () => {
      toggleDetailsRow(tr, source, toggleBtn);
    });

    tbody.appendChild(tr);
  });
}

function createIcon(url, iconOrSrc, title, isImage = false) {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.title = title;
  a.style.marginRight = '6px';

  if (isImage) {
    const img = document.createElement('img');
    img.src = iconOrSrc;
    img.alt = title;
    img.style.height = '16px';
    img.style.verticalAlign = 'middle';
    a.appendChild(img);
  } else {
    a.textContent = iconOrSrc;
  }

  return a;
}

function toggleDetailsRow(tr, source, btn) {
  const nextRow = tr.nextElementSibling;

  // already open → close
  if (nextRow && nextRow.classList.contains('details-row')) {
    nextRow.remove();
    btn.textContent = '▶';
    return;
  }

  // create details row
  const detailsTr = document.createElement('tr');
  detailsTr.classList.add('details-row');

  const td = document.createElement('td');
  td.colSpan = tr.children.length;

  td.appendChild(buildDetailsContent(source));

  detailsTr.appendChild(td);

  tr.after(detailsTr);
  btn.textContent = '▼';
}

function buildDetailsContent(source) {
  const container = document.createElement('div');
  container.classList.add('details-box');

  if (source.concordances?.length) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${t("concordances")}:</strong> ` +
      source.concordances.map(c =>
        `<a href=abstract_item?id=${c.abstract_item}>${c.abstract_item}</a>${c.foliation ? ' (' + c.foliation + ')' : ''}`
      ).join(', ');
    container.appendChild(p);
  }

  if (source.notes) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${t("notes")}:</strong> ${linkify(source.notes)}`;
    container.appendChild(p);
  }

  return container;
}

function linkify(text) {
  if (!text) return '';

  const urlPattern = /(https?:\/\/[^\s,)]+)/g;

  return text.replace(urlPattern, url => {
    const display = url.replace(/^https?:\/\//, '');

    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${display}</a>`;
  });
}





