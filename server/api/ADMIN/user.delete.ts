export default defineEventHandler(async (event) => {
    const user = await readBody(event)
    useDatabase().dbManager.deleteUser(user.id)
    setResponseStatus(event, 200)
})
