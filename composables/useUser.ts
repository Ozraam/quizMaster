const user : Ref<any> = ref(null)

export function useUser() {
    return user
}

export function setToken(token: string) {
    localStorage.setItem('token', token)
    fetchUser()
}

async function fetchUser() {
    const token = localStorage.getItem('token')

    if (!token) {
        return null
    }

    const { data, error } = await useFetch('/api/loggedUser', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (error.value) {
        return null
    }

    user.value = data.value
}
