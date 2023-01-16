
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

  // Your web app's Firebase configuration
  const firebaseConfig = {
  apiKey: "AIzaSyBKinWxC0cifRXppOz8Mchz7B0bq_0k3RU",
  authDomain: "ambiente-y-comunicaciones.firebaseapp.com",
  projectId: "ambiente-y-comunicaciones",
  storageBucket: "ambiente-y-comunicaciones.appspot.com",
  messagingSenderId: "839284570504",
  appId: "1:839284570504:web:7b9ea4b5d910367007223d"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Se listan todos los eventos ambientales que estan cargados en la página actualmente
  const getEventosAmbientales = () => db.collection('eventos-ambientales').get();

  window.addEventListener('DOMContentLoaded', async (e) => {

    const eventos_ambientales = await getEventosAmbientales();

    eventos_ambientales.forEach(doc => {
      console.log(doc.data())
      console.log(doc.id)

      $("#ventanas-modales").append(`
      <div class="modal fade" id="${ 'i' + doc.id }" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <div class="row sin-m d-flex justify-content-end pb-3">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="row sin-m d-flex justify-content-center">
              <div class="col-11 col-sm-10  col-md-7 d-flex align-items-center justify-content-center">
                <div>
                  <h2 class="pb-3 text-center text-md-start">${doc.data().titulo_evento}</h2>
                  <p class="text-justify pb-2 pb-md-3">${doc.data().descripcion_evento}</p>
                  <br>
                  <div class="d-flex justify-content-center justify-content-md-start">
                    <a href="${doc.data().link_evento}" target="_blank" class="text-center text-md-start">AGÉNDATE AL EVENTO</a>
                  </div>
                </div>
              </div>
              <div class="col-11 col-sm-10 col-md-5 d-flex align-items-center">
                <img src="${doc.data().imagen_evento}" class="w-100" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      `);

      $('#slider-eventos').append(`
      <div class="swiper-slide">
        <img src="${doc.data().imagen_evento}" data-bs-toggle="modal" data-bs-target="#${ 'i' + doc.id }">
        <button data-bs-toggle="modal" data-bs-target="#${ 'i' + doc.id }">Ver más</button>
      </div>
    `);

    });
      
});




