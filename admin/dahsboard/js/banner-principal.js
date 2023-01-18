(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
    
    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$(".sidebar").hasClass("toggled")) {
      $("body").addClass("sidebar-toggled");
      $(".sidebar").addClass("toggled");
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

  // Se listan todos los eventos ambientales que estan cargados en la página actualmente
  const getBannersPrincipales = () => db.collection('banners-principales').get();
  window.addEventListener('DOMContentLoaded', async (e) => {

    firebase.auth().onAuthStateChanged(function(user) {
      if (!user){
        window.location.replace("https://www.ambienteycomunicaciones.com/admin/");
      } 
    });

    const banners_principales = await getBannersPrincipales();
    banners_principales.forEach( doc => {

      $("#banners-principales").append(`
      <div class="col-10 col-sm-6 col-lg-4 col-xl-3 pb-4" id="${doc.id}">
        <div class="card" style="width: 100%">
          <img src="${doc.data().imagen_banner}" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title"><b>${doc.data().titulo_banner}</b> </h5>
            <button class="btn btn-danger" id="${doc.id}" onClick="EliminarBanner(this.id)">Eliminar</button>
          </div>
        </div>
      </div>
        `);
    });
  });

})(jQuery); // End of use strict


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

var fileText = document.querySelector(".fileText");
var uploadPercentage = document.querySelector(".uploadPercentage");
var progress =  document.querySelector(".progress");
var percentVal;
var fileItem;
var fileName;
var img = document.querySelector(".img");

function getFile(e){
  fileItem = e.target.files[0];
  fileName = fileItem.name;
  fileText.innerHTML = fileName;
}

async function uploadImage() {

  const titulo_banner = document.querySelector('#titulo-banner').value;

  if(titulo_banner == ''){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Complete el campo título del banner',
    })

    return;
  } else if(fileItem == null){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Seleccione una imagen para subir',
    });

    return;
  }

  // Con esta función se verifica que el evento no exista previamente
  let commentsQuery = await db.collection('banners-principales').where('titulo_banner', '==', titulo_banner);
  let result = await commentsQuery.get();

  if(result.docs.length == 1){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El banner principal que intenta subir ya se encuentra agregado!',
    });

    return;
  } else {
    let storageRef = firebase.storage().ref("banners-principales/" + fileName);
    let uploadTask = storageRef.put(fileItem);
  
    uploadTask.on("state_changed", (snapshot) => {
      console.log(snapshot);
      percentVal = Math.floor((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      console.log(percentVal);

      uploadPercentage.innerHTML = percentVal + "%";
      progress.style.width = percentVal + "%";
    }, (error) => {
      console.log("Error is ", error);
    }, () => {
  
      uploadTask.snapshot.ref.getDownloadURL().then( async (url) => {
        console.log("URL", url);
        if (url != "") {
          const imagen_banner = url;
  
          const response = await db.collection('banners-principales').doc().set({
            titulo_banner,
            imagen_banner,
          });

          let commentsQuery = await db.collection('banners-principales').where('titulo_banner', '==', titulo_banner);
          let result = await commentsQuery.get();

          $("#banners-principales").append(`
          <div class="col-10 col-sm-6 col-lg-4 col-xl-3 pb-4" id="${result.docs[0].id}">
            <div class="card" style="width: 100%">
              <img src="${imagen_banner}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title"><b>${titulo_banner}</b> </h5>
                <button class="btn btn-danger" id="${result.docs[0].id}" onClick="EliminarBanner(this.id)">Eliminar</button>
              </div>
            </div>
          </div>
            `);

          Swal.fire({
            icon: 'success',
            title: 'Banner principal agregado',
            text: 'El banner principal se agrego con éxito.',
          });
        }
      })
    })
  }
}

async function EliminarBanner(id){
  const db = firebase.firestore();
  const result = await db.collection('banners-principales').doc(id).delete();

  Swal.fire({
    icon: 'success',
    title: 'Banner principal eliminado',
    text: 'El banner principal se elimino con éxito.',
  });

  // Se elimina el elemento HTML
  $("#" + id).remove();

  console.log(result);
}

$('#btn-logout').click( () => {
  firebase.auth().signOut()
  .then(function() {
      window.location.replace("https://www.ambienteycomunicaciones.com/admin/");
  })
  .catch(function(error) {
    // An error happened
  });

});
