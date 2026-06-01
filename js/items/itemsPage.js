// Entry point for the page items.html (table of edited items)

export async function initItemsPage() {
  const [items, sources] = await Promise.all([
    fetch("json/items.json").then(r => r.json()),
    fetch("json/sources.json").then(r => r.json())
  ]);

  const table = document.getElementById('itemsTable');
  const rows = items.map(i => ({
    item: i,
    source: sources.find(s => s.id == i.source)
  }));

  rows.forEach(r => table.appendChild(createRow(r)));
}

function createRow(r) {
  const tr = document.createElement('tr');

  if (r.source.id == 106 || r.source.id == 107) {
    tr.classList.add('highlight-row');
  }

  const makeCell = (href, text) => {
    const td = document.createElement('td');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    td.appendChild(a);
    return td;
  };

  tr.appendChild(makeCell(
    `abstract_item?id=${r.item.abstract_item}`,
    r.item.abstract_item
  ));

  tr.appendChild(makeCell(
    `item?id=${r.item.id}`,
    r.item.title
  ));

  tr.appendChild(makeCell(
    `source?pk=${r.source.id}`,
    r.source.bib_id
  ));

  return tr;
}