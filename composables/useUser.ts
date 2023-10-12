const user : Ref<User> = ref(null)

export function useFetchUser() {
    fetchUser()
}

export function useUser() {
    return user
}

export async function setToken(token: string) {
    const { update } = await useSession()
    update({ token })
    fetchUser()
}

async function fetchUser() {
    const { session } = await useSession()
    const htw = watch(session, async (session) => {
        const token = session?.token
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

        if (!data.value) {
            return null
        }

        user.value = data.value
        user.value.token = token

        htw()
    }, { immediate: true })
}
