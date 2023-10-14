export default defineNuxtRouteMiddleware(() => {
    const user = useUser()
    if (!user.value) {
        return navigateTo('/user/login')
    }

    if (user.value.isAdmin || user.value.isSuperAdmin) {
        return
    }

    return navigateTo('/user/login')
})
