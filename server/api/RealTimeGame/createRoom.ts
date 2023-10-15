export default defineEventHandler((event) => {
    const gameManager = RealTimeGameManager.getInstance()

    const url = getRequestURL(event)
    const quizId = url.searchParams.get('quizId')

    if (quizId && DBManager.getInstance().isQuizExist(quizId)) {
        const room = gameManager.createRoom(quizId)
        return { roomId: room.id }
    }

    throw createError({
        statusCode: 404,
        message: 'Quiz not found'
    })
})
