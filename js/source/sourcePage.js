// Entry point for the page source.html (detail of a single source)

import { linkify } from '../utils.js';


export async function renderSourcePage() {
  const sourceId = new URLSearchParams(location.search).get('id');

  const [items, sources] = await Promise.all([
    fetch("json/items.json").then(r => r.json()),
    fetch("json/sources.json").then(r => r.json())
  ]);

  const source = sources.find(s => s.id == sourceId);
  const selectedItems = items.filter(i => i.source == sourceId);

  const h3Title = document.createElement('h3');
  h3Title.textContent = source.rism;

  const p = document.createElement('p');
  p.textContent = `${source.city}, ${source.library} (${source.country})`;

  document.getElementById('metadata').append(h3Title, p);

  if (source.notes) {
    const notes = document.createElement('p');
    notes.textContent = linkify(source.notes);
    document.getElementById('metadata').appendChild(notes);
  }

  let table = document.getElementById('concordancesTable');

  source.concordances.forEach(concordance => {
    const tr = document.createElement('tr');
    const item = selectedItems.find(i => i.abstract_item == concordance.abstract_item);

    const tdCB = document.createElement('td');
    const tdTitle = document.createElement('td');
    const tdFolio = document.createElement('td');
    tdFolio.textContent = `${concordance.foliation}`;

    if (item) {
      // There is an edited item
      const CBLink = document.createElement('a');
      CBLink.href = `abstract_item?id=${concordance.abstract_item}`;
      CBLink.textContent = `${concordance.abstract_item}`;
      tdCB.append(CBLink);

      const titleLink = document.createElement('a');
      titleLink.href = `item?id=${item.id}`;
      titleLink.textContent = `${item.title}`;
      tdTitle.append(titleLink);
    }

    else {
      // No edited item
      tdCB.textContent = `${concordance.abstract_item}`;
    }

    tr.append(tdCB, tdTitle, tdFolio);
    table.appendChild(tr);

  });
}