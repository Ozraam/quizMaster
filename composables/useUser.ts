const user : Ref<User> = ref(null)

export function useFetchUser() {
    fetchUser()
}

export function useUser() {
    return user
}

export function useResetSession() {
    localStorage.removeItem('token')
    user.value = null
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

    const res = await fetch('/api/loggedUser', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const data = await res.json()

    if (res.status !== 200) {
        return null
    }

    if (!data) {
        return null
    }

    user.value = data
    user.value.token = token
}
