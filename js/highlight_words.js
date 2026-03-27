// This script makes the search work (highlight words)
function highlightWords(item_id) {
  let filter = $(`#searchInput-${item_id}`).val().toLowerCase();
  if (filter.length) {
    $(`#mainContainer-${item_id} span.word`).each(function() {
      if ($(this).attr("data-word").indexOf(filter) > -1) {
        $(this).addClass("highlighted");
      } else {
        $(this).removeClass("highlighted");
      }
    });
  }
  else {
    $(`#mainContainer-${item_id} span.word`).each(function() { $(this).removeClass("highlighted"); });
  }
}