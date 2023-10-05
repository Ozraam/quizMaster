import { useDatabase } from "~/composables/useDatabase.ts"

export default defineEventHandler((event) => {
    const {dbManager} = useDatabase();
    return dbManager.getQuizzes();
})