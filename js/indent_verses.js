function countSyllables(s) {
  // Count syllables in string s
  hemis = s.split('+');
  count = 0;
  for (var x in hemis) {
    count += parseInt(hemis[x].match(/\d+/));
  }
  return count;
}

function indentVerses(div) {
  // Indent verses of all strophes in this div
  $(div).find("div.strophe,div.refrain").each(function() {
    var met = $(this).data('met').split("/");
    var count = [];
    for (var x in met) {
      count[x] = countSyllables(met[x]);
    }
    var unique_count = Array.from(new Set(count));
    unique_count.sort(function(a, b){return b-a});
    verses = $(this).find("div.verse");
    for (x = 0; x < verses.length; x++) {
      indent = unique_count.indexOf(count[x]);
      $(verses[x]).attr("data-indent", indent);
      $(verses[x]).children(".verse-text").css("padding-left", "calc(" + indent + " * 20px");
    }
  });
}