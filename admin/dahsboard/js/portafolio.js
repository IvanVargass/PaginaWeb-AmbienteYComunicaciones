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
  const getPortafolio = () => db.collection('portafolio').get();
  window.addEventListener('DOMContentLoaded', async (e) => {

    firebase.auth().onAuthStateChanged(function(user) {
      if (!user){
        window.location.replace("https://www.ambienteycomunicaciones.com/admin/");
      } 
    });

    const portafolio = await getPortafolio();
    portafolio.forEach( doc => {
      $("#portafolio").append(`
      <div class="col-10 col-sm-6 col-lg-4 col-xl-3 pb-4" id="${doc.id}">
        <div class="card" style="width: 100%">
          <img src="https://play-lh.googleusercontent.com/9XKD5S7rwQ6FiPXSyp9SzLXfIue88ntf9sJ9K250IuHTL7pmn2-ZB0sngAX4A2Bw4w" class="card-img-top" alt="...">
          <div class="card-body">
            <a href="${doc.data().url}" target="_blank">Clic aquí para ver el portafolio</a>
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
  //fileText.innerHTML = fileName;
}

async function uploadImage() {

  if(fileName !== 'portafolio.pdf'){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Por favor, nombre el archivo como "portafolio.pdf"',
    });

    return;
  }else if(fileItem == null){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Seleccione un archivo PDF para subir',
    });

    return;
  }

  console.log(fileName)

    let storageRef = firebase.storage().ref("portafolio/" + fileName);
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

          const portafolioRef = db.collection('portafolio').doc('SgUkeykOJWqURvTMhz7E');
          const res = await portafolioRef.update({
            titulo: fileName,
            url: url
          });

          let commentsQuery = await db.collection('portafolio').where('titulo', '==', fileName);
          let result = await commentsQuery.get();

          const urlPDF = result._snapshot.docChanges[0].doc.proto.fields.url.stringValue;

          $('#portafolio').empty();

          $("#portafolio").append(`
          <div class="col-10 col-sm-6 col-lg-4 col-xl-3 pb-4" id="${result.docs[0].id}">
            <div class="card" style="width: 100%">
              <img src="https://play-lh.googleusercontent.com/9XKD5S7rwQ6FiPXSyp9SzLXfIue88ntf9sJ9K250IuHTL7pmn2-ZB0sngAX4A2Bw4w" class="card-img-top" alt="...">
              <div class="card-body">
                <a href="${urlPDF}" target="_blank">Clic aquí para ver el portafolio</a>
              </div>
            </div>
          </div>
            `);

          Swal.fire({
            icon: 'success',
            title: 'Portafolio actualizado',
            text: 'El portafolio fue actualizado con éxito.',
          });
        }
      })
    })
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
