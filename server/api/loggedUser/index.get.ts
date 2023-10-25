/* eslint-disable no-console */
export default defineEventHandler((event) => {
    const authHeader = getHeader(event, 'Authorization')
    if (!authHeader) {
        console.log('no auth header')

        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const token = authHeader.replace('Bearer ', '')

    const user = Auth.getUser(token)
    console.log(user)

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    return user
})
