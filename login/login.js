const userLogin = document.getElementById('login-email');
const passwordLogin = document.getElementById('login-password');
const formLogin = document.getElementById('form-login');
const freeEmailMessage = document.getElementById('notification');
let loginUsernameError = document.getElementById('login-username-error');
let loginPasswordError = document.getElementById('login-password-error');
const loginBtn = document.getElementById('login-btn');
let userIndexLocalStorage;
let loginValidation = true;
let proceedWithEmail = false;
let proceedWithUsername = false;

// -------->iterate localStorage to get all registered users
let registeredUsers = [];
for (let i = 0; i < localStorage.length; i++) {

    // set iteration key name
    let key = localStorage.key(i);

    // use key name to retrieve the corresponding value
    let value = JSON.parse(localStorage.getItem(key));
    registeredUsers.push(value);
}

// -------------->Chech if given value is email format
function ValidateEmail(input) {
    let validRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (input.match(validRegex)) {
        return true;
    } else {
        return false;
    }
}

// ------------->Case: email as input. Check if email is registered

const emailAvailability = (e) => {
    freeEmailMessage.innerText = "";
    passwordLogin.removeAttribute('disabled');

    if (ValidateEmail(userLogin.value)) {
        if (localStorage.getItem(userLogin.value.toLowerCase()) !== null) {
            proceedWithEmail = true;

        } else {
            freeEmailMessage.innerText = "Podany adres email nie jest jeszcze zarejestrowany. Załóż konto już teraz!";
            passwordLogin.setAttribute('disabled', true);
            proceedWithEmail = false;
        }
    }
}
userLogin.addEventListener('change', emailAvailability);

// ------------------------------------> Case: username as input. Check if username exists
const checkLogin = (e) => {
    e.preventDefault();
    if (ValidateEmail(userLogin.value) == false) {
        userIndexLocalStorage = registeredUsers.findIndex(name => name.username == userLogin.value); // check if username exists in localstorage and return its index

        if (userIndexLocalStorage != -1) {
            proceedWithUsername = true;
        }
        else {
            loginUsernameError.innerText = 'Błędna nazwa użytkownika';
            userLogin.classList.add("wrong-input");
            proceedWithUsername = false;
        }
    }
}
//----------------> login with email function

const loginWithEmail = (e) => {
    e.preventDefault();
    if (proceedWithEmail) {
        const emailIndexLocalStorage = registeredUsers.findIndex(mail => mail.email == userLogin.value.toLowerCase());
        if (registeredUsers[emailIndexLocalStorage].password == passwordLogin.value) {
            window.location.href = "../content/content.html";
            userLogin.value = "";
            passwordLogin.value = "";
            // add user to session storage
            let loggedUser = {
                email: registeredUsers[emailIndexLocalStorage].email,
                login: registeredUsers[emailIndexLocalStorage].username,
                password: registeredUsers[emailIndexLocalStorage].password,
            }
            let jsonLoggedUser = JSON.stringify(loggedUser);
            sessionStorage.setItem('user', jsonLoggedUser); //converts a JavaScript value to a JSON string
            userLogin.value = "";
            passwordLogin.value = "";
        }
        else {
            loginPasswordError.innerText = "Błędne hasło";
            passwordLogin.classList.add("wrong-input");
        }
    }
}

// ------------> login with username function

const loginWithUsername = (e) => {
    e.preventDefault();

    if (proceedWithUsername) {
        userIndexLocalStorage = registeredUsers.findIndex(name => name.username == userLogin.value);
        if (registeredUsers[userIndexLocalStorage].password == passwordLogin.value) {
            window.location.href = "../content/content.html";

            // add user to session storage
            let loggedUser = {
                email: registeredUsers[userIndexLocalStorage].email,
                login: registeredUsers[userIndexLocalStorage].username,
                password: registeredUsers[userIndexLocalStorage].password,
            }
            let jsonLoggedUser = JSON.stringify(loggedUser);
            sessionStorage.setItem('user', jsonLoggedUser); //converts a JavaScript value to a JSON string
            userLogin.value = "";
            passwordLogin.value = "";
        }
        else {
            loginPasswordError.innerText = "Błędne hasło";
            passwordLogin.classList.add("wrong-input");
        }
    }
}

// call funtions

formLogin.addEventListener('submit', checkLogin);
formLogin.addEventListener('submit', loginWithEmail);
formLogin.addEventListener('submit', loginWithUsername);

// clear error messages
const clearUsernameMessages = () => {
    loginUsernameError.innerText = "";
    userLogin.classList.remove("wrong-input");
}
userLogin.addEventListener('change', clearUsernameMessages);

const clearPasswordMessages = () => {
    loginPasswordError.innerText = "";
    passwordLogin.classList.remove("wrong-input");
}
passwordLogin.addEventListener('change', clearPasswordMessages);

// signup button 
const goToSignup = () => {
    window.location.href = "../signup/signup.html";
}