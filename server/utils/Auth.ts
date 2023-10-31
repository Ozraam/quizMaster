import * as bcrypt from 'bcrypt'
import * as jose from 'jose'
import { Score, User } from '~/utils/types'

export enum LoginError {
    UserNotFound,
    PasswordIncorrect
}

/**
 * Static Class that handles authentication.
 * @todo refactor to use dbManager instead of direct database access
 */
export class Auth {
    /**
     * Creates a new user with the given username and password.
     * @param username username of the user to signup
     * @param password password of the user to signup
     * @returns true if the user was created, false if the user already exists
     */
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

    /**
     * Logs in the user with the given username and password.
     * @param username username of the user to login
     * @param password password of the user to login
     * @returns user token if login was successful, LoginError otherwise
     */
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

    /**
     * generates a new token for the given user using JWT that expires after 7 days.
     * @param user user to generate a token for
     * @returns new token for the given user
     */
    static async generateSessionToken(user: User): Promise<string> {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

        const jwt = await new jose.SignJWT({ user })
            .setProtectedHeader({ alg: process.env.JWT_ALGORITHM! })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(secret)

        return jwt
    }

    /**
     * Checks if the given token is valid.
     * @param token token to check
     * @returns user if the token is valid, null otherwise
     */
    static async isSessionValid(token: string): Promise<User | null> {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

        try {
            const { payload } = await jose.jwtVerify(token, secret)
            return payload.user as User
        } catch (e) {
            return null
        }
    }

    /**
     * Returns the user with the given token.
     * @param token token of the user to get
     * @returns user if the token is valid, null otherwise
     */
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

    /**
     * deletes all users that are not admins or superadmins.
     */
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
