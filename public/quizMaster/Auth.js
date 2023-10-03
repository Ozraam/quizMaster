export class Auth {
    static async getUser() {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }

        const res = await fetch('/API/getUser', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })

        if (res.ok) {
            const user = JSON.parse(await res.text(), reviver);
            user.token = token;
            return user;
        } else {
            return null;
        }
    }
}

function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}