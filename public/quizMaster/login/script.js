import { Auth } from "../Auth.js";

document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const data = { username, password };
    const response = await fetch('/API/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    // status code 404 = user not found, 401 = incorrect password
    if (response.status === 404) {
        document.querySelector('.error').innerHTML = 'Username not found';
    } else if (response.status === 401) {
        document.querySelector('.error').innerHTML = 'Incorrect password';
    } else if (response.status === 200) {
        const token = await response.json();
        localStorage.setItem('token', token.token);
        window.location.replace('/dashboard');
    }
});

function switchForm() {
    const login = document.querySelector('.login-form');
    const signup = document.querySelector('.signup-form');
    const container = document.querySelector('.container');

    container.animate([
        { filter: 'blur(0px)' },
        { filter: 'blur(15px)' },
    ], {
        duration: 250,
        forwards: true,
    }).addEventListener('finish', () => {
        login.classList.toggle('hide');
        signup.classList.toggle('hide');
        container.animate([
                { filter: 'blur(15px)' },
                { filter: 'blur(0px)' },
            ],
            {
                duration: 250,
                forwards: true,
            })
    })
}

document.querySelector('.switch-btn').addEventListener('click', () => switchForm())

document.querySelector('.signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.querySelector('#username-sign').value;
    const password = document.querySelector('#password-sign').value;
    const data = { username, password };
    const response = await fetch('/API/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    // status code 409 = username already exists
    console.log(response.status);
    if (response.status === 409) {
        document.querySelector('.error').innerHTML = 'Username already exists';
    } else if (response.status === 201) {
        switchForm();
        // display success message
        document.querySelector('.error').innerHTML = 'Account created successfully';
    }
});

Auth.getUser().then((user) => {
    if (user) {
        window.location.replace('/dashboard');
    }
})