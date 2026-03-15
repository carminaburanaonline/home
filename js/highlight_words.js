// This script makes the search work (highlight words)
function highlightWords() {
  let filter = $("#searchInput").val().toLowerCase();
  if (filter.length) {
    $("span.word").each(function() {
      if ($(this).attr("data-word").indexOf(filter) > -1) {
        $(this).addClass("highlighted");
      } else {
        $(this).removeClass("highlighted");
      }
    });
  }
  else {
    $("span.word").each(function() { $(this).removeClass("highlighted"); });
  }
}