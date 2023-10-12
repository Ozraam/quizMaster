export default defineEventHandler(async (event) => {
    const { dbManager } = useDatabase()
    const body = await readBody(event)

    const token = getHeader(event, 'Authorization')?.replace('Bearer ', '')

    if (!token) { return createError({ statusCode: 401, message: 'Unauthorized token' }) }

    const quizId = body.quizId
    const user = await Auth.getUser(token)
    if (!user) {
        return createError({ statusCode: 401, message: 'Unauthorized user' })
    }

    const score = body.score

    return dbManager.updateScoreOfUser(quizId, user, score)
})
