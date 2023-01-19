// signup variables
const formSignup = document.getElementById('signup-form');
const submitBtn = document.getElementById('button-submit');
const username = document.getElementById('username-signup');
const email = document.getElementById('email-signup');
const email2 = document.getElementById('confirm-email-signup');
const password = document.getElementById('password-signup');
const usernameError = document.getElementById('signup-username-error');
const passwordError = document.getElementById('signup-password-error');
const emailError = document.getElementById('signup-email-error');
const emailError2 = document.getElementById('signup-email-error2');
let signupValidation;


// ------------>iterate localStorage
let registeredUsers = [];
for (let i = 0; i < localStorage.length; i++) {

    // set iteration key name
    let key = localStorage.key(i);

    // use key name to retrieve the corresponding value
    let value = JSON.parse(localStorage.getItem(key));
    registeredUsers.push(value);
}
console.log(registeredUsers);
//--------------> chceck if username already exists in local storage (gets the index)

function checkUsernameAvailability(login) {
    userIndexLocalStorage = registeredUsers.findIndex(name => name.username == login.value);
    return userIndexLocalStorage;
}

//----------------------> check if the input is email format
function ValidateEmail(input) {
    let validRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (input.match(validRegex)) {
        console.log('this is email');
        return true;
    } else {
        console.log('this must be login');
        return false;
    }
}
//----------------------------------> validate username (only letters and numbers)
function ValidateLogin(input) {
    let validRegex = /^[A-Za-z0-9]*$/;
    if (input.match(validRegex)) {
        return true;
    } else {
        return false;
    }
}


//username signupValidation
const usernamesignupValidation = (e) => {
    e.preventDefault();
    usernameError.innerText = '';
    username.classList.remove('wrong-input');
    signupValidation = true;
    if (username.value === "" || username.value === null) {
        usernameError.innerText = 'Nazwa użytkownika jest wymagana';
        username.classList.add('wrong-input');
        signupValidation = false;
    }
    else if (ValidateLogin(username.value) == false) {
        usernameError.innerText = 'W nazwie użytkownika dozwolone są tylko litery i cyfry';
        username.classList.add('wrong-input');
        signupValidation = false;
    }
    else if (username.value.length < 6) {
        usernameError.innerText = 'Nazwa użytkownika musi mieć minimum 6 znaków';
        username.classList.add('wrong-input');
        signupValidation = false;
    }
    else if (username.value.length > 16) {
        usernameError.innerText = 'Maksymalna ilość znaków to 16';
        username.classList.add('wrong-input');
        signupValidation = false;
    }
    else if (checkUsernameAvailability(username) != -1) {
        usernameError.innerText = 'Wybrana nazwa użytkownika jest już zajęta';
        username.classList.add('wrong-input');

    }
    console.log(checkUsernameAvailability(username));
}
// password signupValidation
const passwordsignupValidation = (e) => {
    e.preventDefault();
    passwordError.innerText = '';
    password.classList.remove('wrong-input');
    if (password.value === "" || password.value === null) {
        passwordError.innerText = 'Hasło jest wymagane';
        password.classList.add('wrong-input');
        signupValidation = false;
    }
    else if (password.value.length < 6) {
        passwordError.innerText = 'Hasło musi składać się minimum z 6 znaków';
        password.classList.add('wrong-input');
        signupValidation = false;
    }
}

// email signupValidation
const emailsignupValidation = (e) => {
    e.preventDefault();
    emailError.innerText = '';
    email.classList.remove('wrong-input');
    if (email.value === "" || email.value === null) {
        emailError.innerText = 'Adres email jest wymagany';
        email.classList.add('wrong-input');
        signupValidation = false;
    } else if (ValidateEmail(email.value) == false) {
        emailError.innerText = 'Podana wartość nie jest emailem';
        email.classList.add('wrong-input');
        signupValidation = false;
    } else if (localStorage.getItem(email.value.toLowerCase()) !== null) {
        emailError.innerText = 'Użytkownik o takim adresie email jest już zarejestrowany';
        email.classList.add('wrong-input');
        signupValidation = false;
    }
}

// email confirmation signupValidation
const email2signupValidation = (e) => {
    e.preventDefault();
    emailError2.innerText = '';
    email2.classList.remove('wrong-input');
    if (email2.value === "" || email2.value === null) {
        emailError2.innerText = 'Potwierdź adres email';
        email2.classList.add('wrong-input');
        signupValidation = false;
    }
    else if (email2.value !== email.value) {
        emailError2.innerText = 'Adres email różni się od podanego wcześniej';
        email2.classList.add('wrong-input');
        email.classList.add('wrong-input');
        signupValidation = false;
    }
};

// call validation funtions

formSignup.addEventListener('submit', usernamesignupValidation);
formSignup.addEventListener('submit', passwordsignupValidation);
formSignup.addEventListener('submit', emailsignupValidation);
formSignup.addEventListener('submit', email2signupValidation);

//-------------------------------------------------------> sign up function

const signupFunc = (e) => {
    if (signupValidation) {
        e.preventDefault();
        let User = {
            email: email.value.toLowerCase(),
            username: username.value,
            password: password.value,
        }
        let jsonUser = JSON.stringify(User);
        localStorage.setItem(email.value.toLowerCase(), jsonUser); //converts a JavaScript value to a JSON string
        console.log('dziala');
        console.log(User);

        // go to the content page and add user to local storage

        window.location.href = "../content/content.html";

        // add user to session storage
        let loggedUser = {
            email: email.value,
            login: username.value,
            password: password.value,
        }
        let jsonLoggedUser = JSON.stringify(loggedUser);
        sessionStorage.setItem('user', jsonLoggedUser);

        username.value = "";
        password.value = "";
        email.value = "";
        email2.value = "";

    }
}
formSignup.addEventListener('submit', signupFunc);

// login button
const goToLogin = () => {
    window.location.href = "../login/login.html";
}