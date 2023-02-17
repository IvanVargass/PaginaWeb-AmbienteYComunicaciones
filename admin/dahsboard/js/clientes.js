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

  // Se listan todos los clientes que estan cargados en la página actualmente
  const getClientes = () => db.collection('logos-clientes').get();
  window.addEventListener('DOMContentLoaded', async (e) => {

    firebase.auth().onAuthStateChanged(function(user) {
      if (!user){
        window.location.replace("https://www.ambienteycomunicaciones.com/admin/");
      } 
    });

    const clientes = await getClientes();
    clientes.forEach( doc => {
      $("#clientes").append(`
      <div class="col-10 col-sm-6 col-lg-4 col-xl-2 col-xxl-2 pb-4" id="${doc.id}">
        <div class="card" style="width: 100%;">
          <div class="card-body">
          <p class="card-text"> <b>Logo 1:</b> </p>
          <img src="${doc.data().logo_1}" class="card-img-top" alt="...">
          <br>
          <hr>
          <p class="card-text pt-2"> <b>Logo 2:</b> </p>
          <img src="${doc.data().logo_2}"" class="card-img-top" alt="...">
            <h5 class="card-title pt-3 pb-2"><b>${doc.data().nombre_cliente}</b> </h5>
            <button class="btn btn-danger" id="${doc.id}" name="${doc.data().nombre_cliente}" onClick="EliminarCliente(this.id, this.name)">Eliminar</button>
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

var fileItem_1;
var fileName_1;

var fileItem_2;
var fileName_2;

var img = document.querySelector(".img");

function getFile_1(e){
  fileItem_1 = e.target.files[0];
  fileName_1 = fileItem_1.name;
  console.log(fileName_1)
}

function getFile_2(e){
  fileItem_2 = e.target.files[0];
  fileName_2 = fileItem_2.name;
  console.log(fileName_2)
}

async function uploadImage() {

  const nombre_cliente = document.querySelector('#nombre-cliente').value;

  if(nombre_cliente == ''){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Complete el campo nombre del cliente',
    })

    return;
  } else if(fileItem_1 == null){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Seleccione una imagen para subir el logo 1',
    });

    return;
  } else if(fileItem_2 == null){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Seleccione una imagen para subir el logo 2',
    });

    return;
  }

  // Con esta función se verifica que el cliente no exista previamente
  let commentsQuery = await db.collection('logos-clientes').where('nombre_cliente', '==', nombre_cliente);
  let result = await commentsQuery.get();

  if(result.docs.length == 1){
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El cliente que intenta agregar ya existe!',
    });

    return;
  } else {

    let storageRef = firebase.storage().ref("logos-clientes/" + nombre_cliente + ' 1');
    let uploadTask = storageRef.put(fileItem_1);
  
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

          let storageRef_2 = firebase.storage().ref("logos-clientes/" + nombre_cliente + ' 2');
          let uploadTask_2 = storageRef_2.put(fileItem_2);

          uploadTask_2.on("state_changed", (snapshot) => {

          }, (error) => {
            console.log("Error is ", error);
          }, () => {
            uploadTask_2.snapshot.ref.getDownloadURL().then( async (url_2) => {
              console.log("URL", url_2);
      
              if (url_2 != "") {
                const logo_1 = url;
                const logo_2 = url_2;
        
                const response = await db.collection('logos-clientes').doc().set({
                  nombre_cliente,
                  logo_1,
                  logo_2,
                });
      
                let commentsQuery = await db.collection('logos-clientes').where('nombre_cliente', '==', nombre_cliente);
                let result = await commentsQuery.get();
      
                $("#clientes").append(`
                <div class="col-10 col-sm-6 col-lg-4 col-xl-2 col-xxl-2 pb-4" id="${result.docs[0].id}">
                  <div class="card" style="width: 100%">
                    <div class="card-body">
                    <p class="card-text"> <b>Logo 1:</b> </p>
                    <img src="${logo_1}" class="card-img-top" alt="...">
                    <hr>
                    <p class="card-text"> <b>Logo 2:</b> </p>
                    <img src="${logo_2}" class="card-img-top" alt="...">
                      <h5 class="card-title pt-3 pb-2"><b>${nombre_cliente}</b> </h5>
                      <button class="btn btn-danger" id="${result.docs[0].id}" name="${nombre_cliente}" onClick="EliminarCliente(this.id, this.name)">Eliminar</button>
                    </div>
                  </div>
                </div>
                  `);
      
                Swal.fire({
                  icon: 'success',
                  title: 'Cliente agregado',
                  text: 'El cliente se agrego con éxito.',
                });
              }

            })
          })
        }
      })
    })

  }
}

async function EliminarCliente(id, nombre_cliente){
  const db = firebase.firestore();
  const result = await db.collection('logos-clientes').doc(id).delete();

  // Se elimina la Imagen del Storage
  let storageRef = firebase.storage().ref();
  const fileRef = storageRef.child("logos-clientes/" + nombre_cliente + " 1");

  // Eliminar archivo de Firebase Storage
  fileRef.delete().then(() => {

      let storageRef_2 = firebase.storage().ref();
      const fileRef_2 = storageRef_2.child("logos-clientes/" + nombre_cliente + " 2");

      fileRef_2.delete().then(() => {

        // Se elimina el elemento HTML
        $("#" + id).remove();

        Swal.fire({
          icon: 'success',
          title: 'Cliente eliminado',
          text: 'El cliente se elimino con éxito.',
        });
      }).catch((error) => {
        console.error(`Error al eliminar archivo ${filePath}:`, error);
      });

  }).catch((error) => {
      console.error(`Error al eliminar archivo ${filePath}:`, error);
  });

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
