// Entry point for the page abstract_item.html

export async function renderAbstractItemPage() {
  const abstractItemId = new URLSearchParams(location.search).get('id');

  const [items, sources] = await Promise.all([
    fetch("json/items.json").then(r => r.json()),
    fetch("json/sources.json").then(r => r.json())
  ]);

  const selectedItems = items.filter(i => i.abstract_item == abstractItemId);

  const h3Title = document.createElement('h3');
  h3Title.textContent = abstractItemId;

  document.getElementById('metadata').append(h3Title);

  let table = document.getElementById('concordancesTable');

  selectedItems.forEach(item => {
    const source = sources.find(s => s.id == item.source);
    const tr = document.createElement('tr');

    const tdSource = document.createElement('td');
    const tdTitle = document.createElement('td');
    const tdFolio = document.createElement('td');

    const SourceLink = document.createElement('a');
    SourceLink.href = `source?id=${source.id}`;
    SourceLink.textContent = `${source.rism}`;
    tdSource.append(SourceLink);

    const titleLink = document.createElement('a');
    titleLink.href = `item?id=${item.id}`;
    titleLink.textContent = `${item.title}`;
    tdTitle.append(titleLink);

    tdFolio.textContent = item.foliation;

    tr.append(tdSource, tdTitle, tdFolio);
    table.appendChild(tr);
  });
}