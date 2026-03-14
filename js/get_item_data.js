var items, abstract_items, sources;
$.when(
  $.getJSON("json/items.json", function(data) {
    items = data;
  }),
  $.getJSON("json/sources.json", function(data) {
    sources = data;
  }),
  $.getJSON("json/abstract_items.json", function(data) {
    abstract_items = data;
  })
).then(function() {
  const params = new URLSearchParams(document.location.search);
  const id = params.get("id");
  item = items.find((element) => element.file = id);
  console.log(item.file);
});