
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const signupEmail = document.querySelector('#email').value;
    const signupPassword = document.querySelector('#password').value;

    if(signupEmail == ''){
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingrese un correo',
        });

        return;
    } else if(signupPassword == ''){
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor ingrese una contraseña',
        });

        return;
    }

    const auth = firebase.auth();

    auth.signInWithEmailAndPassword(signupEmail, signupPassword).then(userCredential => {
        window.location.replace("https://ivanvargass.github.io/PaginaWeb-AmbienteYComunicaciones/admin/dahsboard/");
    }).catch( error => {
        if(error.code == 'auth/wrong-password'){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Contraseña incorrecta',
            });
        } else if(error.code == 'auth/user-not-found'){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Usuario no registrado',
            });
        } else if(error.code == 'auth/too-many-requests'){
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Cuenta deshabilitada debido a muchos intentos erroneos.',
            });
        }
    });
});