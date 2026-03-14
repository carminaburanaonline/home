var items, sources;
$.when(
  $.getJSON("json/items.json", function(data) {
    items = data;
  }),
  $.getJSON("json/sources.json", function(data) {
    sources = data;
  })
).then(function() {
  console.log(items);

  var rows = ""
  for (var x in items) {
    source = sources.find((element) => element.pk == items[x].source);
    if (items[x].source == "106" || items[x].source == "107") {
      rows += `<tr style="background-color: Linen;">`
    }
    else {
      rows += `<tr>`
    }
    rows += `<td><a href="abstract_item.html?id=${items[x].abstract_item}">${items[x].abstract_item}</a></td>
      <td><a href="item.html?id=${items[x].file}">${items[x].title}</a></td>
      <td><a href="source.html?pk=${items[x].source}">${source.bib_id}</td>
      </td>`;
  }
  console.log(rows);
  $('#itemsTable').append(rows);
});




