import { Router } from "../Router";
import { clearDatabase, createQuiz, getQuiz, getQuizzes } from "./APIQuiz";
import { login, logout, signup } from "./AuthAPI";

const route = {
    '/API/getQuiz': getQuiz,
    '/API/getQuizzes': getQuizzes,
    '/ADMIN/clear': clearDatabase,
    '/API/createQuiz': createQuiz,
    '/API/login': login,
    '/API/signup': signup,
    '/API/logout': logout,
    '/API/': async () => new Response("API is running", { status: 200 })
}

export function setAPIRoute(router: Router) {
    for (const [path, handler] of Object.entries(route)) {
        router.addRoute(path, handler);
    }
}