import * as bcrypt from 'bcrypt'
import { User } from '~/utils/types'

export enum LoginError {
    UserNotFound,
    PasswordIncorrect
}

export class Auth {
    static signup(username: string, password: string) {
        const db = DBManager.getInstance().getDB()
        username = username.toLowerCase()
        // check if user already exists
        const user = db.prepare(`
            SELECT * FROM users WHERE username = ?
        `).get(username) as { username: string }
        

        if (user) { return false }

        bcrypt.genSalt(10, function(_:any, salt:any) {
            bcrypt.hash(password, salt, function(_err: any, hash:any) {
                db.prepare(`
                    INSERT INTO users (username, password, created)
                    VALUES (?, ?, datetime('now'))
                `).run(username, hash)
            })
        })

        return true
    }

    async login(username: string, password: string): Promise<string | LoginError> {
        const db = DBManager.getInstance().getDB()
        username = username.toLowerCase()
        const user = await db.prepare(`
            SELECT * FROM users WHERE username = ?
        `).get(username) as { usename: string, password: string, id: number }
        if (!user) { return LoginError.UserNotFound }
        if (!await Bun.password.verify(password, user.password)) {
            return LoginError.PasswordIncorrect
        }
        const expires30days = new Date()
        expires30days.setDate(expires30days.getDate() + 30)
        const token = this.generateSessionToken()
        db.prepare(`
            INSERT INTO sessions (token, user_id, expires)
            VALUES (?, ?, ?)
        `).run(token, user.id.toString(), expires30days.toISOString())
        return token
    }

    // TODO : Use JWT instead of random string
    generateSessionToken(): string {
        const db = DBManager.getInstance().getDB()
        const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        // check if token already exists
        const token = db.prepare(`
            SELECT * FROM sessions WHERE token = $token
        `).get({ $token: randomString }) as { token: string }
        if (token) {
            return this.generateSessionToken()
        }
        return randomString
    }

    isSessionValid(token: string): boolean {
        const db = DBManager.getInstance().getDB()
        const session = db.prepare(`
            SELECT * FROM sessions WHERE token = $token
        `).get({ $token: token }) as { token: string, expires: Date }
        if (!session) { return false }
        if (new Date(session.expires) < new Date()) {
            return false
        }
        return true
    }

    getUser(token: string): User | null {
        const db = DBManager.getInstance().getDB()
        const user = db.prepare(`
            SELECT users.username, users.id, created, role FROM users
            INNER JOIN sessions ON sessions.user_id = users.id
            WHERE sessions.token = $token
        `).get({ $token: token }) as User

        if (!user) { return null }
        return user
    }

    logout(token: string) {
        const db = DBManager.getInstance().getDB()
        db.prepare(`
        DELETE FROM sessions WHERE token = $token
        `).run({ $token: token })
    }

    clearUsers() {
        const db = DBManager.getInstance().getDB()
        db.prepare(`
            DELETE FROM users
        `).run()

        db.prepare(`
            DELETE FROM sessions
        `).run()
    }
}
