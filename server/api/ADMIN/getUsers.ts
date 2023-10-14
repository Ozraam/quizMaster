export default defineEventHandler(() => {
    const { dbManager } = useDatabase()
    return dbManager.getAllUsers()
})
