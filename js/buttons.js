// Control the behaviour of different classes of buttons
$(document).ready(function() {
  $(".activable").click(function() {
    $(this).addClass('active');
  });
  $(".toggleable").click(function() {
    $(this).toggleClass('active');
  });
});