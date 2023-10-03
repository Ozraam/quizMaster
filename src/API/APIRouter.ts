import { Router } from "../Router";
import { clearDatabase, createQuiz, getQuiz, getQuizzes, updateScoreOfUser, clearQuizzes, deleteQuiz } from "./APIQuiz";
import { clearUsers, deleteUser, getAllUsers, getUser, getUserWithId, login, logout, signup, updateUser } from "./AuthAPI";

const route = {
    '/API/': async () => new Response("API is running", { status: 200 }),
    '/API/getQuiz': getQuiz,
    '/API/getQuizzes': getQuizzes,
    '/API/SUPERADMIN/clear': clearDatabase,
    '/API/SUPERADMIN/clearUsers': clearUsers,
    '/API/SUPERADMIN/clearQuizzes': clearQuizzes,
    '/API/getUserWithId': getUserWithId,
    '/API/createQuiz': createQuiz,
    '/API/login': login,
    '/API/signup': signup,
    '/API/logout': logout,
    '/API/getUser': getUser,
    '/API/getUsers': getAllUsers,
    '/API/saveScore': updateScoreOfUser,
    '/API/updateUser': updateUser,
    '/API/ADMIN/deleteUser': deleteUser,
    '/API/ADMIN/deleteQuiz': deleteQuiz
}

export function setAPIRoute(router: Router) {
    for (const [path, handler] of Object.entries(route)) {
        router.addRoute(path, handler);
    }
}