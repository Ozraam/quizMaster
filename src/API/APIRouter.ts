import { Router } from "../Router";
import { clearDatabase, createQuiz, getQuiz, getQuizzes, updateScoreOfUser, clearQuizzes } from "./APIQuiz";
import { clearUsers, deleteUser, getAllUsers, getUser, getUserWithId, login, logout, signup, updateUser } from "./AuthAPI";

const route = {
    '/API/': async () => new Response("API is running", { status: 200 }),
    '/API/getQuiz': getQuiz,
    '/API/getQuizzes': getQuizzes,
    '/API/ADMIN/clear': clearDatabase,
    '/API/ADMIN/clearUsers': clearUsers,
    '/API/ADMIN/clearQuizzes': clearQuizzes,
    '/API/getUserWithId': getUserWithId,
    '/API/createQuiz': createQuiz,
    '/API/login': login,
    '/API/signup': signup,
    '/API/logout': logout,
    '/API/getUser': getUser,
    '/API/getUsers': getAllUsers,
    '/API/saveScore': updateScoreOfUser,
    '/API/updateUser': updateUser,
    '/API/ADMIN/deleteUser': deleteUser
}

export function setAPIRoute(router: Router) {
    for (const [path, handler] of Object.entries(route)) {
        router.addRoute(path, handler);
    }
}