export default defineEventHandler((event) => {
    useDatabase().dbManager.clearQuizzes()

    setResponseStatus(event, 200)
})
