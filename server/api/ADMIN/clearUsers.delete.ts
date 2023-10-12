export default defineEventHandler((event) => {
    Auth.clearUsers()

    setResponseStatus(event, 200)
})
