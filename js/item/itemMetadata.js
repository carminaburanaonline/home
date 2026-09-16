export async function renderItemMetadata(container, item, source) {
  container.innerHTML = `
    <h1><a href="abstract_item.html?id=${item.abstract_item}">${item.abstract_item}</a></h1>
    <h3>${item.title}</h3>
    <p>Source: <a href="source.html?id=${source.id}">${source.rism}</a> (${source.city}, ${source.library})</p>
    <p>Folio: ${item.foliation}</p>
  `;
}
