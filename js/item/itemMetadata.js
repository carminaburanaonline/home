export async function renderItemMetadata(container, item, source) {
  container.innerHTML = `
    <h1><a href="abstract_item.html?id=${item.abstract_item}">${item.abstract_item}</a></h1>
    <h2>${item.title}</h2>
    <p>Source: <a href="source.html?pk=${source.pk}">${source.bib_id}</a> (${source.location})</p>
    <p>Folio: ${item.foliation}</p>
  `;
}
