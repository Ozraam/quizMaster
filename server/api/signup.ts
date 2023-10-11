import { Auth } from '../utils/Auth'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if (!Auth.signup(body.username, body.password)) {
        throw createError({
            statusCode: 409,
            message: 'Username already taken',
        })
    }

    setResponseStatus(event, 201)
})
