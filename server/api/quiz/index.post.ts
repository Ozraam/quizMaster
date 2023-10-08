import { Quiz } from "~/utils/types";

export default defineEventHandler(async (event) => {
    const {dbManager} = useDatabase();
    
    // Get the body of the request
    const body = await readBody(event) as Quiz;
    
    body.created = new Date();
    body.modified = new Date();
    
    const id = dbManager.createQuiz(body).id
    return {
        quizId: id
    };
})