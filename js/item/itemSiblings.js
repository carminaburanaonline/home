export async function initItemSiblings({ tableContainer, titleContainer, selectedContainer, itemId, openItem }) {
  const [items, sources] = await Promise.all([
    fetch('json/items.json').then(r => r.json()),
    fetch('json/sources.json').then(r => r.json())
  ]);

  const current = items.find(i => i.file === itemId);
  if (!current) return;

  const siblings = items.filter(i => (i.file !== itemId) && (i.abstract_item === current.abstract_item)).map(i => ({
    item: i,
    source: sources.find(s => s.id === i.source)
  }));
  const other_rows = items.filter(i => (i.file !== itemId) && (i.abstract_item !== current.abstract_item)).map(i => ({
    item: i,
    source: sources.find(s => s.id === i.source)
  }));

  if (siblings.length) {
    tableContainer.innerHTML = `<table>${siblings.map(r => `
      <tr>
        <td>${r.item.abstract_item}</td>
        <td><a href="#" data-item="${r.item.file}">${r.item.title}</a></td>
        <td>${r.source.bib_id}</td>
      </tr>`).join('')}<tr><td colspan='3'><hr/></td></tr>${other_rows.map(r => `
      <tr>
        <td>${r.item.abstract_item}</td>
        <td><a href="#" data-item="${r.item.file}">${r.item.title}</a></td>
        <td>${r.source.bib_id}</td>
      </tr>`).join('')}</table>`;
  }
  else {
    tableContainer.innerHTML = `<table>${other_rows.map(r => `
      <tr>
        <td>${r.item.abstract_item}</td>
        <td><a href="#" data-item="${r.item.file}">${r.item.title}</a></td>
        <td>${r.source.bib_id}</td>
      </tr>`).join('')}</table>`;
  }

  tableContainer.querySelectorAll('[data-item]').forEach(a => {
    a.addEventListener('click', async e => {
      e.preventDefault();
      const item = items.find(i => i.id == a.dataset.item);
      const source = sources.find(s => s.id == item.source);
      openItem(item);
      titleContainer.querySelector("a").innerHTML = `${item.abstract_item} ${item.title}, ${source.bib_id}`;
      titleContainer.querySelector("a").setAttribute("href", `item?id=${item.id}`);
      titleContainer.style.display = 'block';
      selectedContainer.style.display = 'block';
      tableContainer.style.display = 'none';
    });
  });
}
