// eslint-disable-next-line import/no-named-as-default
import Database, { Database as DatabseClass } from 'better-sqlite3'
import { Answer, Question, Quiz, User, Score } from '~/utils/types'

/**
 * DBManager is a singleton class that manages the database.
 * It is used to retrieve data from the database and to update the database.
 */
export class DBManager {
    // eslint-disable-next-line no-use-before-define
    private static instance: DBManager
    private db: DatabseClass

    private constructor() {
        this.db = new Database('./server/utils/quizmaster.sqlite')
    }

    /**
     * Returns the instance of DBManager if it exists, otherwise creates a new instance and returns it.
     * @returns the instance of DBManager
     */
    static getInstance(): DBManager {
        if (!DBManager.instance) {
            DBManager.instance = new DBManager()
        }

        return DBManager.instance
    }

    /**
     * Returns the database.
     * @returns the database
     */
    getDB(): DatabseClass {
        return this.db
    }

    /**
     * return the quiz with the given quizId
     * @param quizId quizId of the quiz to retrieve
     * @returns quiz with the given quizId or null if quiz does not exist
     */
    getQuiz(quizId: string) {
        const quiz: Quiz = this.db.prepare('SELECT * FROM quiz WHERE id = ?').get(quizId) as Quiz

        if (!quiz) { return null }
        const questions: Question[] = this.db.prepare('SELECT * FROM question WHERE quiz_id = ?').all(quizId) as Question[]
        if (!questions) { return null }
        for (const question of questions) {
            const answers = this.db.prepare('SELECT * FROM answer WHERE question_id = ?').all(question.id) as Answer[]

            question.answers = answers
        }
        quiz.questions = questions

        return quiz
    }

    /**
     * Returns all quizzes in the database.
     * @returns all quizzes in the database
     */
    getQuizzes() {
        const quizzes: Quiz[] = []
        const quizIds = this.db.prepare('SELECT id FROM quiz').all() as { id: string }[]
        for (const quizId of quizIds) {
            const quiz = this.getQuiz(quizId.id as string)
            if (quiz) { quizzes.push(quiz) }
        }

        return quizzes
    }

    /**
     * Deletes all data from the database.
     */
    clearDatabase() {
        this.db.exec('DELETE FROM quiz')
        this.db.exec('DELETE FROM question')
        this.db.exec('DELETE FROM answer')
    }

    /**
     * Add a new quiz to the database.
     * @param quiz the quiz to add to the database
     * @returns the id of the quiz that was added to the database
     */
    createQuiz(quiz: Quiz) {
        this.db.prepare('INSERT INTO quiz (title, description, created, modified) VALUES (?, ?, ?, ?)')
            .run(
                quiz.title,
                quiz.description,
                quiz.created.toISOString(),
                quiz.modified.toISOString()
            )
        const quizId = this.db.prepare('SELECT id, created from quiz ORDER BY id DESC LIMIT 1').get() as Quiz
        for (const question of quiz.questions) {
            this.db.prepare('INSERT INTO question (question, quiz_id) VALUES (?, ?)')
                .run(question.text,
                    quizId.id
                )
            const questionId = this.db.prepare('SELECT * from question ORDER BY id DESC LIMIT 1').get() as Question
            for (const answer of question.answers) {
                this.db.prepare('INSERT INTO answer (answer, question_id, isCorrect) VALUES (?, ?, ?)')
                    .run(answer.text,
                        questionId.id,
                        answer.isCorrect ? 1 : 0
                    )
            }
        }

        return quizId
    }

    /**
     * Update the score of a user for a quiz.
     * @param quizId the id of the quiz of which the user's score should be updated
     * @param user the user of which the score should be updated
     * @param score the new score of the user
     */
    updateScoreOfUser(quizId: number, user: User, score: number) {
        // update score of user in database if score is higher than previous score
        const quiz = this.db.prepare('SELECT * FROM quiz WHERE id = ?').get(quizId) as Quiz

        if (!quiz) {
            return {
                statusCode: 404,
                message: 'Quiz not found'
            }
        }

        // check if score is higher than previous score
        const scoreInDB = this.db.prepare('SELECT * FROM score WHERE quizId = ? AND userId = ?').get(quizId, user.id) as Score

        if (scoreInDB !== undefined) {
            if (scoreInDB.score < score) {
                this.db.prepare('UPDATE score SET score = ? WHERE id = ?').run(score, scoreInDB.id)
            }
        } else {
            this.db.prepare('INSERT INTO score (quizId, userId, score) VALUES (?, ?, ?)')
                .run(quizId, user.id, score)
        }
    }

    /**
     * Returns all scores of the user with the given id.
     * @param id id of a user
     * @returns all scores of the user with the given id
     */
    getScoresOfUser(id: number) {
        const scores = this.db.prepare('SELECT * FROM score WHERE userId = ?').all(id) as Score[]
        return scores
    }

    /**
     * Deletes all quizzes and scores from the database.
     */
    clearQuizzes() {
        this.db.exec('DELETE FROM score')
        this.db.exec('DELETE FROM quiz')
        this.db.exec('DELETE FROM question')
        this.db.exec('DELETE FROM answer')
    }

    /**
     * Returns all users in the database.
     * @returns all users in the database
     */
    getAllUsers() {
        const users = this.db.prepare('SELECT * FROM users').all() as User[]
        users.forEach((user) => {
            user.password = ''
        })
        return users
    }

    /**
     * Returns the user with the given id.
     * @param id the id of the user to retrieve
     * @returns the user with the given id or null if user does not exist
     */
    getUserWithId(id: number) {
        const user = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User
        return user
    }

    /**
     * Update the user given as parameter with the new data in the object user.
     * @param user the use to update
     * @returns true if the user was updated, false if the user does not exist
     */
    updateUser(user: User): boolean {
        const userInDB = this.db.prepare('SELECT * FROM users WHERE id = ?').get(user.id)
        if (!userInDB) { return false }
        this.db.prepare('UPDATE users SET username = ? WHERE id = ?')
            .run(user.username, user.id)
        return true
    }

    /**
     * Delete the user with the given id.
     * @param id id of the user to delete
     */
    deleteUser(id: any) {
        this.db.prepare('DELETE FROM users WHERE id = ?').run(id)
    }

    /**
     * Delete the quiz with the given quizId.
     * @param quizId id of the quiz to delete
     * @returns the deleted quiz or null if quiz does not exist
     */
    deleteQuiz(quizId: string) {
        const quiz = this.getQuiz(quizId)
        if (!quiz) { return null }
        this.db.prepare('DELETE FROM score WHERE quizId = ?').run(quizId)
        this.db.prepare('DELETE FROM quiz WHERE id = ?').run(quizId)
        this.db.prepare('DELETE FROM answer WHERE question_id in (SELECT id FROM question WHERE quiz_id = ?)').run(quizId)
        this.db.prepare('DELETE FROM question WHERE quiz_id = ?').run(quizId)
        return quiz
    }

    /**
     * update the role of the user given as parameter with the new data in the object user.
     * @param user the user to update the role of
     * @returns true if the user was updated, false if the user does not exist
     */
    updateUserRole(user: User) {
        const userInDB = this.db.prepare('SELECT * FROM users WHERE id = ?').get(user.id)
        if (!userInDB) { return false }
        this.db.prepare('UPDATE users SET role = ? WHERE id = ?')
            .run(user.role, user.id)
        return true
    }

    /**
     * Returns all roles in the database.
     * @returns all roles in the database
     */
    getAllRoles() {
        const roles = this.db.prepare('SELECT * FROM roles').all()
        return roles
    }

    /**
     * check if the quiz with the given quizId exists in the database.
     * @param quizId the id of the quiz to check if it exists
     * @returns true if the quiz exists, false if the quiz does not exist
     */
    isQuizExist(quizId: string) {
        const quiz = this.db.prepare('SELECT * FROM quiz WHERE id = ?').get(quizId) as Quiz
        return quiz !== undefined
    }
}
