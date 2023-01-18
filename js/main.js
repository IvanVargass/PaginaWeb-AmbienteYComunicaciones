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
    apiKey: "AIzaSyAJa-7tque1FoKvU1-D8yhWiLKD2aHeonA",
    authDomain: "ambienteycomunicaciones-fff72.firebaseapp.com",
    projectId: "ambienteycomunicaciones-fff72",
    storageBucket: "ambienteycomunicaciones-fff72.appspot.com",
    messagingSenderId: "314379260317",
    appId: "1:314379260317:web:1cc0044642407f1b54df74",
    measurementId: "G-MX7B93P0H2"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Se listan todos los banners principales que estan cargados en la página actualmente
  const getBannersPrincipales = () => db.collection('banners-principales').get();

  // Se listan todos los eventos ambientales que estan cargados en la página actualmente
  const getEventosAmbientales = () => db.collection('eventos-ambientales').get();

  // Se listan todos los banners principales que estan cargados en la página actualmente
  const getBannersInferiores = () => db.collection('banners-inferiores').get();

  window.addEventListener('DOMContentLoaded', async (e) => {

    const banners_principales = await getBannersPrincipales();
    const eventos_ambientales = await getEventosAmbientales();
    const banners_inferiores = await getBannersInferiores();

    banners_principales.forEach( async (doc) => {
      let commentsQuery = await db.collection('eventos-ambientales').where('titulo_evento', '==', doc.data().titulo_banner);
      let result = await commentsQuery.get();

      $("#banners-principales").append(`
        <div class="carousel-item active">
          <img src="${doc.data().imagen_banner}" class="d-block w-100" alt="${doc.data().titulo_banner}" data-bs-toggle="modal" data-bs-target="#${'i' + result.docs[0].id}">
        </div>
      `);
    });

    eventos_ambientales.forEach(doc => {

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

    banners_inferiores.forEach( async (doc) => {
      $("#banner-inferior").append(`
        <a href="${doc.data().link_banner}" target="_blank">
          <img src="${doc.data().imagen_banner}" alt="${doc.data().titulo_banner}" class="banner-promocional">
        </a>
      `);
    });
});




