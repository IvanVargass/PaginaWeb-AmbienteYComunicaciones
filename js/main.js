
$(document).ready(function () {
  // Configuración para dejar el menú fijo
  var altura = $(".navbar").offset().top;

  $(window).on("scroll", function () {
    if ($(window).scrollTop() > altura)
      $(".navbar").addClass("menu-fixed");
    else
      $(".navbar").removeClass("menu-fixed");
  });

  // Agregar ver más en Eventos Ambientales
  if (screen.width > 1024) {
    $(".eventos-ambientales .swiper-slide img").mouseover(function(e) {
      let id = $(this).attr("id");
      $(".eventos-ambientales .swiper-slide #caja_" + id).removeClass("d-none");
    }).mouseout(function() {
      let id = $(this).attr("id");
      $(".eventos-ambientales .swiper-slide #caja_" + id).addClass("d-none");
    });
   }
})



