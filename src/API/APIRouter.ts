import { Router } from "../Router";
import { clearDatabase, createQuiz, getQuiz, getQuizzes } from "./APIQuiz";
import { clearUsers, getUser, login, logout, signup } from "./AuthAPI";

const route = {
    '/API/': async () => new Response("API is running", { status: 200 }),
    '/API/getQuiz': getQuiz,
    '/API/getQuizzes': getQuizzes,
    '/ADMIN/clear': clearDatabase,
    '/ADMIN/clearUsers': clearUsers,
    '/API/createQuiz': createQuiz,
    '/API/login': login,
    '/API/signup': signup,
    '/API/logout': logout,
    '/API/getUser': getUser
}

export function setAPIRoute(router: Router) {
    for (const [path, handler] of Object.entries(route)) {
        router.addRoute(path, handler);
    }
}