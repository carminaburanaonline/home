function wordsAndSyllables(div) {
  // Attach the punctuation marks to the word spans
  $(div).find("span.pc").each(function(){
    if ($(this).hasClass('pre')) {
      next = $(this).next("span");
      if (next.hasClass("word")) { next.prepend($(this)); }
      else { next.find("span.word:first").prepend($(this)); }
    }
    else {
      prev = $(this).prev("span");
      if (prev.hasClass("word")) { prev.append($(this)); }
      else { prev.find("span.word:last").append($(this)); }
    }
  });

  // Attach the punctuation marks to syl-text
  $(div).find("span.pc").each(function(){
    if ($(this).hasClass('pre')) {
      next_syl = $(this).next(".neumed-syll");
      next_syl.find(".syl > .syl-text").prepend($(this));
    }
    else {
      prev_syl = $(this).prev(".neumed-syll");
      prev_syl.find(".syl > .syl-text").append($(this));
    }
  });

  //Assign data-word attribute to each word
  $(div).find("span.word").each(function(){
    var word = "";
    $(this).find("span.syl-text").each(function(){
      word += $(this).text().toLowerCase();
    });
    $(this).attr("data-word", word);
  });
}