document.querySelector("#clearQuiz").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the quiz?")) {
        document.querySelector("#clearQuiz").disabled = true;
        fetch("/API/SUPERADMIN/clearQuizzes", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        .then((res) => {
            if(res.ok) {
                alert("Quiz cleared successfully");
                document.querySelector("#clearQuiz").disabled = false;
            } else {
                alert("There was an error clearing the quiz");
                document.querySelector("#clearQuiz").disabled = false;
            }
        });
    }
});

document.querySelector("#clearUsers").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the Users?")) {
        document.querySelector("#clearUsers").disabled = true;
        fetch("/API/SUPERADMIN/clearUsers", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
        .then((res) => {
            if(res.ok) {
                alert("Users cleared successfullyUsers");
                document.querySelector("#clear").disabled = false;
            } else {
                alert("There was an error clearing the Users");
                document.querySelector("#clearUsers").disabled = false;
            }
        });
    }
});

fetch('/API/getUsers', {
    method: 'GET'
}).then((res) => {
    if (res.ok) {
        res.json().then((users) => {
            console.log(users);
            users.unshift({
                id: 'ID',
                username: 'Name'
            });
            const userList = document.querySelector('.user-list');
            const userCardTemplate = document.querySelector('.user-card-template');
            for (const user of users) {
                const userCard = document.importNode(userCardTemplate.content, true);
                userCard.querySelector('.user-card-title').innerText = user.username;
                userCard.querySelector('.user-card-button').href = `/user/?id=${user.id}`;
                userCard.querySelector('.user-card-button').innerText = 'View User ' + user.id;
                userList.appendChild(userCard);
            }
        });
    } else {
        console.error('Failed to load users');
    }
});