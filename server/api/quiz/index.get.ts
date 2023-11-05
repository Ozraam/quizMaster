export default defineEventHandler((event) => {
    const { dbManager } = useDatabase()

    const quizId = getQuery(event).quizId as string | undefined
    const hideAnswers = getQuery(event).hideAnswers === 'true'

    if (quizId === undefined) {
        throw createError({
            statusCode: 400,
            message: 'Invalid quiz ID'
        })
    }

    const quiz = dbManager.getQuiz(quizId!, hideAnswers)

    if (quiz === undefined) {
        throw createError({
            statusCode: 404,
            message: 'Quiz not found'
        })
    }

    return quiz
})
