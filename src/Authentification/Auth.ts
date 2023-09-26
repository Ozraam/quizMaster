import Database from "bun:sqlite";
import { User } from "../database/types";
import { DBManager } from "../database/dbManager";

export enum LoginError {
    UserNotFound,
    PasswordIncorrect
}

export class Auth {
    db: Database;
    constructor() {
        this.db = DBManager.getInstance().getDB();
    }

    signup(username: string, password: string) {
        username = username.toLowerCase();
        // check if user already exists
        const user = this.db.query(`
            SELECT * FROM users WHERE username = $username
        `).get({ $username: username }) as { username: string };
        
        if (user) return false;
        

        Bun.password.hash(password).then((hash) => {
            this.db.query(`
                INSERT INTO users (username, password, created)
                VALUES ($username, $password, datetime('now'))
            `).run({
                $username: username,
                $password: hash
            });
        })

        return true;
    }

    async login(username: string, password: string): Promise<string | LoginError> {
        username = username.toLowerCase();
        const user = await this.db.query(`
            SELECT * FROM users WHERE username = $username
        `).get({ $username: username }) as { usename: string, password: string, id: number };
        if (!user) return LoginError.UserNotFound;
        if (!await Bun.password.verify(password, user.password)) {
            return LoginError.PasswordIncorrect;
        }
        const expires30days = new Date();
        expires30days.setDate(expires30days.getDate() + 30);
        const token = this.generateSessionToken();
        this.db.query(`
            INSERT INTO sessions (token, user_id, expires)
            VALUES ($token, $user_id, $expires)
        `).run({
            $token: token,
            $user_id: user.id.toString(),
            $expires: expires30days.toISOString()
        });
        return token;
    }

    // TODO : Use JWT instead of random string
    generateSessionToken(): string {
        let randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        // check if token already exists
        const token = this.db.query(`
            SELECT * FROM sessions WHERE token = $token
        `).get({ $token: randomString }) as { token: string };
        if (token) {
            return this.generateSessionToken();
        }
        return randomString;
    }

    isSessionValid(token: string): boolean {
        const session = this.db.query(`
            SELECT * FROM sessions WHERE token = $token
        `).get({ $token: token }) as { token: string, expires: Date };
        if (!session) return false;
        if (new Date(session.expires) < new Date()) {
            return false;
        }
        return true;
    }

    getUser(token: string): User | null {
        const user = this.db.query(`
            SELECT users.username, users.id, created FROM users
            INNER JOIN sessions ON sessions.user_id = users.id
            WHERE sessions.token = $token
        `).get({ $token: token }) as User;
        
        if (!user) return null;
        return user;
    }

    logout(token: string) {
        this.db.query(`
        DELETE FROM sessions WHERE token = $token
        `).run({ $token: token });
    }

    clearUsers() {
        this.db.query(`
            DELETE FROM users
        `).run();

        this.db.query(`
            DELETE FROM sessions
        `).run();
    }
}