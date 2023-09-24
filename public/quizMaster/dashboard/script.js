/// <reference lib="dom" />

//get token in local storage
var token = localStorage.getItem('token');

fetch('/API/getUser', {
    method: 'GET',
    headers: { 
        'Authorization': 'Bearer ' + token,
    },
}).then((response) => {
    if (response.status === 404 || response.status === 401) {
        window.location.replace('/login');
    } else if (response.status === 200) {
        response.json().then((data) => {
            document.querySelector('#username').innerHTML = data.username;
            document.querySelector('#username-info').innerHTML = data.username;
            document.querySelector('#date-info').innerHTML = new Date(data.created).toLocaleDateString();
        });
    }
});
