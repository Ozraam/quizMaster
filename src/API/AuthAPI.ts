import { Auth, LoginError } from "../Authentification/Auth";
import { User } from "../database/types";

const auth = new Auth();

export async function login(req: Request) : Promise<Response> {
    if(req.method !== "POST") return new Response("Method not allowed", { status: 200 });
    const body = await req.json() as User;
    const token = await auth.login(body.username, body.password);
    if (token === LoginError.UserNotFound) {
        return new Response("User not found", { status: 404 });
    }
    if (token === LoginError.PasswordIncorrect) {
        return new Response("Password incorrect", { status: 401 });
    }
    return new Response(JSON.stringify({token}), { status: 200 });
}

export async function signup(req: Request) : Promise<Response> {
    if(req.method !== "POST") return new Response("Method not allowed", { status: 200 });
    const body = await req.json() as User;
    if(!auth.signup(body.username, body.password)) {
        return new Response("User already exists", { status: 409 });
    }
    return new Response("User created", { status: 201 });
}

export async function logout(req: Request) : Promise<Response> {
    if(req.method !== "POST") return new Response("Method not allowed", { status: 200 });
    const body = await req.json() as { token: string };
    
    auth.logout(body.token);
    return new Response("Logged out", { status: 200 });
}