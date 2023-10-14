export default defineEventHandler(async (event) => {
    const url = getRequestURL(event)

    if (!url.pathname.startsWith('/api/ADMIN')) {
        return
    }

    const token = getHeader(event, 'Authorization')?.replace('Bearer ', '')

    if (!token) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    const user = await Auth.getUser(token)

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized'
        })
    }

    if (user.isAdmin || user.isSuperAdmin) {
        return
    }

    throw createError({
        statusCode: 403,
        message: 'Forbidden'
    })
})
