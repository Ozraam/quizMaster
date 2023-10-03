import { Auth } from "../Authentification/Auth";
import { Role } from "../Authentification/Role";
import { Router } from "../Router";
import { clearDatabase, createQuiz, getQuiz, getQuizzes, updateScoreOfUser, clearQuizzes, deleteQuiz } from "./APIQuiz";
import { clearUsers, deleteUser, getAllUsers, getUser, getUserWithId, login, logout, signup, updateUser, updateUserRole } from "./AuthAPI";

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
    '/API/ADMIN/deleteQuiz': deleteQuiz,
    '/API/SUPERADMIN/updateUserRole': updateUserRole,
    '/API/SUPERADMIN/getRoles': async () => new Response(JSON.stringify(Role), { status: 200 })
}

export function setAPIRoute(router: Router) {
    for (const [path, handler] of Object.entries(route)) {
        router.addRoute(path, handler);
    }

    router.addMiddleware(roleMiddleware);
}

function checkAuthorization(req: Request) {
    const url = new URL(req.url);
    if(url.pathname.startsWith("/API/SUPERADMIN") || url.pathname.startsWith("/API/ADMIN")) {
        console.log("Checking authorization");
        
        const headers = req.headers;
        
        const auth = headers.get("Authorization");
        
        if(auth == null) return false;
        const token = auth.split(" ")[1];
        if(token == null) return false;
        
        const user = (new Auth()).getUser(token);
        if(user == null) return false;
        
        if((user.role & Role.superadmin) && url.pathname.startsWith("/API/SUPERADMIN")) return true;
        if((user.role & Role.admin) && url.pathname.startsWith("/API/ADMIN")) return true;
    }
}

function roleMiddleware(req: Request) : {ok: boolean, response: Promise<Response> | null} {
    if(checkAuthorization(req)) return { ok: true, response: null };
    const url = new URL(req.url);
    if(url.pathname.startsWith("/API/SUPERADMIN") || url.pathname.startsWith("/API/ADMIN")) {
        return { ok: false, response: new Promise(() => new Response("Unauthorized", { status: 401 })) };
    }
    return { ok: true, response: null };
}