export default defineEventHandler((event) => {
    const url = getRequestURL(event)
    const userId = parseInt(url.searchParams.get('userId') ?? '-1')

    if (!userId || isNaN(userId) || userId < 1) {
        throw createError({
            statusCode: 400,
            message: 'Missing userId'
        })
    }

    return useDatabase().dbManager.getUserWithId(userId)
})
