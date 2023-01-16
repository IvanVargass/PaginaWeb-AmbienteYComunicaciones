
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const signupEmail = document.querySelector('#email').value;
    const signupPassword = document.querySelector('#password').value;

    const auth = firebase.auth();

    auth.signInWithEmailAndPassword(signupEmail, signupPassword).then(userCredential => {
        console.log('Ingreso con éxito');
    });
    
    console.log('enviando...');
});