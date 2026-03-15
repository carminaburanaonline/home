// Show only every 5th verse number

$(document).ready(function(){
  $(".strophe,.refrain").each(function(){
    $(this).find(".verse-number").each(function(index){
      if (index % 5 != 4) {
        $(this).css("visibility", "hidden");
      }
    });
  });
});