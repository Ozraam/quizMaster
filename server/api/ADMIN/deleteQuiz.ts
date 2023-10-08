export default defineEventHandler((event) => {
    const { dbManager } = useDatabase()
    const url = getRequestURL(event)
    const quizId = url.searchParams.get('id')
    if (quizId) {
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
