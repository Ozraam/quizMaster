export default defineEventHandler((event) => {
    const authHeader = getHeader(event, 'Authorization')
    if (!authHeader) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const token = authHeader.replace('Bearer ', '')

    const user = Auth.getUser(token)

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    return user
})
