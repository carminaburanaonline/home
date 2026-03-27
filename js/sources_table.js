var sources;
$.when(
  $.getJSON("json/sources.json", function(data) {
    sources = data;
  })
).then(function() {
  var rows = ""
  for (var x in sources) {
    var bib_id = sources[x].bib_id;
    if (sources[x].nick_name) {
      bib_id += ` ('${sources[x].nick_name}')`
    }
    rows += `<tr>
      <td><a href="source?pk=${sources[x].pk}">${sources[x].country}</a></td>
      <td><a href="source?pk=${sources[x].pk}">${sources[x].location}</a></td>
      <td><a href="source?pk=${sources[x].pk}">${bib_id}</td>
      </td>`;
  }
  $('#sourcesTable').append(rows);
});