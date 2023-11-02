/* eslint-disable no-console */
export default defineEventHandler(async (event) => {
    const authHeader = getHeader(event, 'Authorization')
    if (!authHeader) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    const token = authHeader.replace('Bearer ', '')

    const user = await Auth.getUser(token)

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Unauthorized',
        })
    }

    return user
})
