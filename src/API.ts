import { DBManager } from "./database/dbManager";

const dbManager = DBManager.getInstance();

export async function getQuiz(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const quizId = url.searchParams.get("id");
    if (quizId) {
        const quiz = dbManager.getQuiz(quizId);
        if (!quiz) return new Response("Not Found", { status: 404 });
        return new Response(JSON.stringify(quiz), { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
}

export async function getQuizzes(): Promise<Response> {
    const quizzes = dbManager.getQuizzes();
    return new Response(JSON.stringify(quizzes), { status: 200 });
}

export async function clearDatabase() {
    dbManager.clearDatabase();
    return new Response("OK", { status: 200 });
}

export async function createQuiz(req:Request) {
    if(req.method !== "POST") return new Response("Method not allowed", { status: 200 });

    const quiz = await req.json();

    if(!quiz.created) quiz.created = new Date();
    if(!quiz.modified) quiz.modified = new Date();
    
    const quizId = dbManager.createQuiz(quiz);

    return new Response(JSON.stringify({id: quizId.id}), { status: 200 });
}