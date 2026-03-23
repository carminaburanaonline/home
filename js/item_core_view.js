function itemCoreView(div, item_id) {
  var item;
  $.when(
    $.getJSON("json/items.json", function(data) {
      item = data.find((element) => element.file == item_id);
    })
  ).then(function() {
    console.log(item);
    console.log(item.SVGfiles);
    svg_based = item.SVGfiles;
    if (svg_based) {
      template_name = "templates/item_core_view_svg.html"
    }
    else {
      template_name = "templates/item_core_view.html"
    }
    div.load(template_name, function() {
      $(this).find(".item-specific").each(function() {
        $(this).attr("id", function() { return $(this).attr("id") + "-" + item_id })
      });
      // Now the IDs are assigned, so no need to look only inside $(this)
      // Assign 'onclick' function to each item-specific button
      $(`#dropBtn-${item_id}`).click(function () { $(`#dropdownDiv-${item_id}`).toggle(); });
      $(`#openSvg-${item_id}`).click(function(){
        $(`#openText-${item_id}`).removeClass('active');
        $(`#text-${item_id}`).hide();
        $(`#svg-${item_id}`).css("display", "block");
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
        // Add/remove syllable dashes.
        if ($(this).hasClass('active')) {
          $("span[data-dash='dashed'] > .syl-text").each(function() {
            $(this).text($(this).text().slice(0, -1));
          });
        }
        else {
          $("span[data-dash='dashed'] > .syl-text").each(function() {
            $(this).text($(this).text() + '-');
          });
        }
      });
      $(`#toggleMetricButton-${item_id}`).click(function(){
        $(`#itemCoreView-${item_id} .verse-met`).toggle();
        $(`#itemCoreView-${item_id} .poem-met`).toggle();
      });
      $(`#toggleRhymeButton-${item_id}`).click(function(){
        $(`#itemCoreView-${item_id} .verse-rhyme`).toggle();
      });
      $(`#togglePunctuationButton-${item_id}`).click(function(){
        $(`#itemCoreView-${item_id} .pc`).toggle();
      });
      $(`#toggleCriticalApparatus-${item_id}`).click(function(){
        $(`#apparatusText-${item_id}`).toggle();
        $(`#itemCoreView-${item_id} .app-type-text`).toggleClass("apparatus-active");
        if ($(`#toggleNeumesButton-${item_id}`).hasClass('active')) {
          $(`#apparatusNeume-${item_id}`).toggle();
          $(`#itemCoreView-${item_id} .app-type-neume`).toggleClass("apparatus-active");
        }
      });
      window.onclick = function(event) {
        if (!event.target.matches(`#dropBtn-${item_id}`) && !event.target.matches(`#dropdownDiv-${item_id} > .cbo-button`)) {
          $(`#dropdownDiv-${item_id}`).hide();
        }
      }

      // Adding content
      $(`#formattedText-${item_id}`).append(XSLtransform(`tei/${item_id}.tei`, "xsl/formatted.xsl"));
      $(`#continuousText-${item_id}`).append(XSLtransform(`tei/${item_id}.tei`, "xsl/continuous.xsl"));
      $(`#apparatusText-${item_id}`).append(XSLtransform(`tei/${item_id}.tei`, "xsl/text-apparatus.xsl"));
      // TODO: if notated
      $(`#apparatusNeume-${item_id}`).append("<hr/>");
      $(`#apparatusNeume-${item_id}`).append(XSLtransform(`tei/${item_id}.tei`, "xsl/neume-apparatus.xsl"));

      // Hide verse numbers if not 0 % 5
      $(this).find(".strophe,.refrain").each(function(){
        $(this).find(".verse-number").each(function(index){
          if (index % 5 != 4) {
            $(this).css("visibility", "hidden");
          }
        });
      });

      // Add met and rhyme information to each verse
      $(this).find(".strophe,.refrain").each(function() {
        var lg = $(this);
        ['met', 'rhyme'].forEach(function(key) {
          lg_data = $(lg).data(key).split("/");
          verses = $(lg).find(`div.verse-${key}`);
          for (x = 0; x < lg_data.length; x++) {
            if ($(verses[x]).data(key)) {
              $(verses[x]).html(`<b>${$(verses[x]).data(key)}</b>`);
            }
            else {
              $(verses[x]).html(lg_data[x]);
            }
          }
        });
      });

      // Initial setup of buttons and other typographical things
      $(`#openSvg-${item_id}`).click();
      $(`#openFormattedText-${item_id}`).click();
      $(`#itemCoreView-${item_id} .pc[data-resp='ms']`).hide();
      $(`#itemCoreView-${item_id} .word[data-rend='italic']`).css("font-style", "italic");
      $(`#itemCoreView-${item_id} .verse-met`).hide();
      $(`#itemCoreView-${item_id} .poem-met`).hide();
      $(`#itemCoreView-${item_id} .verse-real`).hide();
      $(`#itemCoreView-${item_id} .verse-rhyme`).hide();
    });
  });
}