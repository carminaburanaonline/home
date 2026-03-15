function addItemId(element, item_id) {
  element.attr("id", function() { return $(this).attr("id") + "-" + item_id });
}

function itemCoreView(div, item_id) {
  div.load("templates/item_core_view.html", function() {
    $(this).find(".item-specific").each(function() {
      $(this).attr("id", function() { return $(this).attr("id") + "-" + item_id })
    });
    // Now the IDs are assigned, so no need to look only inside $(this)
    // Assign 'onclick' function to each item-specific button
    $(`#dropBtn-${item_id}`).click(function () { $(`#dropdownDiv-${item_id}`).toggle(); });
    $(`#openSvg-${item_id}`).click(function(){
      $(`#openText-${item_id}`).removeClass('active');
      $(`#text-${item_id}`).hide();
      $(`#svg-${item.pk}`).css("display", "block");
    });
    $(`#openText-${item_id}`).click(function(){
      $(`#openSvg-${item_id}`).removeClass('active');
      $(`#svg-${item_id}`).hide();
      $(`#text-${item_id}`).css("display", "block");
    });
    $(`#openFormattedText-${item_id}`).click(function(){
      $(`#openContinuousText-${item_id}`).removeClass('active');
      $(`#continuousText-${item_id}`).hide();
      $(`#formattedText-${item_id}`).css("display", "block");
    });
    $(`#openContinuousText-${item_id}`).click(function(){
      $(`#openFormattedText-${item_id}`).removeClass('active');
      $(`#formattedText-${item_id}`).hide();
      $(`#continuousText-${item_id}`).css("display", "block");
    });
    $(`#toggleNeumesButton-${item_id}`).click(function(){
      $(`#itemCoreView-${item_id} .neumes`).toggle();
      if ($(`#toggleCriticalApparatus-${item_id}`).hasClass('active')) {
        $(`#apparatusNeume-${item_id}`).toggle();
        $(`#itemCoreView-${item_id} .app-type-neume`).toggleClass("apparatus-active");
      }
    });
    $(`#toggleSyllablesButton-${item_id}`).click(function(){
      // Add (or remove) syllable dashes. Note: the button is activated before this script is called
      if ($(this).hasClass('active')) {
        $("span[data-dash='dashed'] > .syl-text").each(function() {
          $(this).text($(this).text() + '-');
        });
      }
      else {
        $("span[data-dash='dashed'] > .syl-text").each(function() {
          $(this).text($(this).text().slice(0, -1));
        });
      }
    });
    $(`#toggleMetricButton-${item_id}`).click(function(){
      $(`#itemCoreView-${item_id} .verse-met`).toggle();
      $(`#itemCoreView-${item_id} .verse-real`).toggle();
    });
    $(`#toggleRhymeButton-${item_id}`).click(function(){
      $(`#itemCoreView-${item_id} .verse-rhyme`).toggle();
    });
    $(`#togglePunctuationButton-${item_id}`).click(function(){
      $(`#itemCoreView-${item_id} .pc`).toggle();
    });
    $(`#toggleCriticalApparatus-${item_id}`).click(function(){
      $(`#apparatusText-${item_id}`).toggle();
      if ($(`#toggleNeumesButton-${item_id}`).hasClass('active')) {
        $(`#apparatusNeume-${item_id}`).toggle();
        $(`#itemCoreView-${item.pk} .app-type-neume`).toggleClass("apparatus-active");
      }
      $(`#itemCoreView-${item_id} .app-type-text`).toggleClass("apparatus-active");
    });
    window.onclick = function(event) {
      if (!event.target.matches(`#dropBtn-${item_id}`) && !event.target.matches(`#dropdownDiv-${item_id} > .cbo-button`)) {
        $(`#dropdownDiv-${item_id}`).hide();
      }
    }

    // Initial setup of buttons and other typographical things
    $(`#openSvg-${item_id}`).click();
    $(`#openFormattedText-${item_id}`).click();
    $(`#itemCoreView-${item_id} .pc[data-resp='ms']`).hide();
    $(`#itemCoreView-${item_id} .word[data-rend='italic']`).css("font-style", "italic");
    $(`#itemCoreView-${item_id} .syl-dash`).hide();
    $(`#itemCoreView-${item_id} .verse-met`).hide();
    $(`#itemCoreView-${item_id} .verse-real`).hide();
    $(`#itemCoreView-${item_id} .verse-rhyme`).hide();

    // Adding content
    $(`#formattedText-${item_id}`).append(XSLtransform(`tei/${item_id}.tei`, "xsl/formatted.xsl"));
    $(`#continuousText-${item_id}`).append(XSLtransform(`tei/${item_id}.tei`, "xsl/continuous.xsl"));
    $(`#apparatusText-${item_id}`).append(XSLtransform(`tei/${item_id}.tei`, "xsl/text-apparatus.xsl"));
    // TODO: if notated
    $(`#apparatusNeume-${item_id}`).append("<hr/>");
    $(`#apparatusNeume-${item_id}`).append(XSLtransform(`tei/${item_id}.tei`, "xsl/neume-apparatus.xsl"));
  });
}