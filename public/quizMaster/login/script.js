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
        window.location.replace('/dashboard');
    }
});