export default defineEventHandler((event) => {
    const {dbManager} = useDatabase();
    return dbManager.getQuizzes();
})