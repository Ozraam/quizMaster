export default defineEventHandler(async (event) => {
    const { dbManager } = useDatabase()
    const url = getRequestURL(event)

    const token = getHeader(event, 'Authorization')?.split(' ')[1]

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const user = await Auth.getUser(token)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized'
        })
    }

    const quizId = url.searchParams.get('id')
    if (quizId) {
        if (!user.isAdmin && user.id !== dbManager.getQuiz(quizId)?.createdBy) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            })
        }

        const quiz = dbManager.deleteQuiz(quizId)
        if (!quiz) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Quiz not found'
            })
        }
        return quiz
    }

    throw createError({
        statusCode: 404,
        statusMessage: 'Quiz not found'
    })
})
