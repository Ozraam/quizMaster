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
            console.log(data);
        });
    }
});
