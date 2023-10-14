export default defineEventHandler(async (event) => {
    const user = await readBody(event)

    const { dbManager } = useDatabase()
    if (!dbManager.updateUser(user)) {
        throw createError({
            statusCode: 400,
            message: 'Failed to update user'
        })
    }

    return user
})
