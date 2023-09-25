export async function getUser() {
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
        return await res.json();
    } else {
        return null;
    }
}