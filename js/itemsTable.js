$.getJSON("json/items.json", function(items) {
  let rows = ""
  for (var x in items) {
    rows += `<tr>
      <td><a href="abstract_item/${items[x].abstract_item}">${items[x].abstract_item}</a></td>
      <td><a href="item/${items[x].file}">${items[x].title}</a></td>
      <td><a href="source/${items[x].source}">${items[x].source}</td>
      </td>`
      //TODO: change source pk to source id
  }
  console.log(rows);
  $('#itemsTable').append(rows);
});

