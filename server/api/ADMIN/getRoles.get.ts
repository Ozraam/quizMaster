export default defineEventHandler(() => {
    const { dbManager } = useDatabase()
    const roles = dbManager.getAllRoles()
    return roles
})
