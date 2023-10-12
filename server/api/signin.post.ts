import { Auth, LoginError } from '../utils/Auth'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const token = await Auth.login(body.username, body.password)

    if (token === LoginError.UserNotFound) {
        throw createError({
            statusCode: 404,
            message: 'User not found',
        })
    }

    if (token === LoginError.PasswordIncorrect) {
        throw createError({
            statusCode: 401,
            message: 'Password incorrect',
        })
    }

    return { token }
})
