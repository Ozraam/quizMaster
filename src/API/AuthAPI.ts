import { Auth, LoginError } from "../Authentification/Auth";
import { DBManager } from "../database/dbManager";
import { Score, User } from "../database/types";

const auth = new Auth();

export async function login(req: Request): Promise<Response> {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
    const body = await req.json() as User;
    const token = await auth.login(body.username, body.password);
    if (token === LoginError.UserNotFound) {
        return new Response("User not found", { status: 404 });
    }
    if (token === LoginError.PasswordIncorrect) {
        return new Response("Password incorrect", { status: 401 });
    }
    return new Response(JSON.stringify({ token }), { status: 200 });
}

export async function signup(req: Request): Promise<Response> {
    if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
    const body = await req.json() as User;
    if (!auth.signup(body.username, body.password)) {
        return new Response("User already exists", { status: 409 });
    }
    return new Response("User created", { status: 201 });
}

export async function logout(req: Request): Promise<Response> {
    if (!req.headers.get("Authorization")) return new Response("Need a token to logout", { status: 401 });

    const token = req.headers.get("Authorization")!.split(" ")[1];

    auth.logout(token);

    return new Response("Logged out", { status: 200 });
}

export async function clearUsers(req: Request): Promise<Response> {
    auth.clearUsers();
    return new Response("", { status: 204 });
}

export async function getUser(req: Request): Promise<Response> {
    if (req.headers.get("Authorization") && !auth.isSessionValid(req.headers.get("Authorization")!.split(" ")[1])) {
        auth.logout(req.headers.get("Authorization")!.split(" ")[1]);
        return new Response("Unauthorized logout", { status: 401 });
    }

    if (!req.headers.get("Authorization")) {
        return new Response("Unauthorized no headers", { status: 401 });
    }

    const token = req.headers.get("Authorization")!.split(" ")[1];
    const user = auth.getUser(token);

    if (!user) {
        return new Response("User not found", { status: 404 });
    }

    user.scores = new Map<number, Score>();

    // get all scores of user
    const scores = DBManager.getInstance().getScoresOfUser(user.id);

    scores.forEach(score => {
        user.scores.set(score.quizId, score);
    });

    return new Response(JSON.stringify(user, replacer), { status: 200 });
}

export async function getAllUsers() {
    return new Response(JSON.stringify(DBManager.getInstance().getAllUsers()), { status:200 })
}

function replacer(key: any, value: any) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}