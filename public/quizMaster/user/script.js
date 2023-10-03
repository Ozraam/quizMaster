import { Auth } from "../Auth.js";

function getURLParameter(name) {
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

const userid = getURLParameter('id');

if(userid === 'ID') {
    window.location.href = '/admin';
}

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

    // display roles
    fetch('/API/SUPERADMIN/getRoles', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        }
    }).then((res) => {
        if(res.ok) {
            res.json().then((roles) => {
                const roleList = document.getElementById('role');
                roleList.innerHTML = '';
                for(const role in roles) {
                    if(!isNaN(role)) continue;
                    const option = document.createElement('li');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = role;
                    checkbox.checked = user.role & roles[role];
                    checkbox.value = roles[role];
                    checkbox.classList.add('role-checkbox');

                    const label = document.createElement('label');
                    label.htmlFor = role;
                    label.innerText = role;
                    option.appendChild(checkbox);
                    option.appendChild(label);

                    roleList.appendChild(option);
                }
            });
        } else {
            console.error('Failed to load roles');
        }
    });

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
    }).then(res => {
        if (res.ok) {
            window.location.href = '/admin';
        } else {
            console.error('Failed to update user');
        }
    });
});

document.querySelector('.delete').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    const user = await Auth.getUser();
    console.log(user);
    fetch('/API/ADMIN/deleteUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.token,
        },
        body: JSON.stringify({
            id: userid,
        })
    }).then(res => {
        window.location.href = '/admin';
    });
});

document.querySelector('.save-role').addEventListener('click', () => {
    let role = 0;
    const rolesChekboxes = document.querySelectorAll('.role-checkbox');
    for(const checkbox of rolesChekboxes) {
        if(checkbox.checked) {
            role += parseInt(checkbox.value);
        }
    }

    fetch('/API/SUPERADMIN/updateUserRole', {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: userid,
            role: role,
        })
    })

});