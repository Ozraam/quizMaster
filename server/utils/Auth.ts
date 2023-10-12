import * as bcrypt from 'bcrypt'
import * as jose from 'jose'
import { Score, User } from '~/utils/types'

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

    static async login(username: string, password: string): Promise<string | LoginError> {
        const db = DBManager.getInstance().getDB()
        username = username.toLowerCase()

        const user = await db.prepare(`
            SELECT * FROM users WHERE username = ?
        `).get(username) as User

        if (!user) { return LoginError.UserNotFound }

        const match = await bcrypt.compare(password, user.password)

        if (!match) { return LoginError.PasswordIncorrect }

        const token = await Auth.generateSessionToken(user)

        return token
    }

    static async generateSessionToken(user: User): Promise<string> {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

        const jwt = await new jose.SignJWT({ user })
            .setProtectedHeader({ alg: process.env.JWT_ALGORITHM! })
            .setIssuedAt()
            .setExpirationTime('5h')
            .sign(secret)

        return jwt
    }

    static async isSessionValid(token: string): Promise<User | null> {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

        try {
            const { payload } = await jose.jwtVerify(token, secret)
            return payload.user as User
        } catch (e) {
            return null
        }
    }

    static async getUser(token: string): Promise<User | null> {
        const user = await Auth.isSessionValid(token)
        if (!user) {
            return null
        }
        // get scores of user
        user.scores = {}

        const db = DBManager.getInstance().getDB()
        const scores = db.prepare(`
            SELECT * FROM score WHERE userId = ?
        `).all(user.id) as Score[]

        scores.forEach((score) => {
            user.scores[score.quizId] = score.score
        })

        user.isAdmin = !!(user.role & Role.admin)
        user.isSuperAdmin = !!(user.role & Role.superadmin)

        return user
    }

    static clearUsers() {
        const db = DBManager.getInstance().getDB()

        db.prepare(`
            DELETE FROM score WHERE userId NOT IN (SELECT id FROM users WHERE role & ? = 0)
        `).run(Role.superadmin)

        db.prepare(`
            DELETE FROM users WHERE role & ? = 0
        `).run(Role.superadmin)
    }
}
