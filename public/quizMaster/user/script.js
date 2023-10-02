function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

const userid = getURLParameter('id');

fetch('/API/getUserWithId', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: userid
    })
}).then(res => res.json().then((user) => {
    console.log(user);
    document.getElementById('username').value = user.username;
    document.getElementById('date').value = new Date(user.created).toISOString().slice(0,10);;
}))

document.querySelector('.user-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;

    fetch('/API/updateUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: userid,
            username: username,
        })
    }).then(res => res.json().then((user) => {
        console.log(user);
        window.location.href = '/admin';
    }))
});