// eslint-disable-next-line import/no-named-as-default
import Database, { Database as DatabaseClass } from 'better-sqlite3'
import { Answer, Question, Quiz, User, Score } from '~/utils/types'

enum CommandTypes {
    SELECT = 'SELECT',
    INSERT = 'INSERT',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE'
}

/**
 * DBManager is a singleton class that manages the database.
 * It is used to retrieve data from the database and to update the database.
 */
export class DBManager {
    // eslint-disable-next-line no-use-before-define
    private static instance: DBManager
    private db: DatabaseClass

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
    getDB(): DatabaseClass {
        return this.db
    }

    /**
     * return the quiz with the given quizId
     * @param quizId quizId of the quiz to retrieve
     * @param hideAnswersCorrectness if true, the correctness of the answers will not be returned
     * @returns quiz with the given quizId or null if quiz does not exist
     */
    getQuiz(quizId: string, hideAnswersCorrectness = false) {
        // const quiz: Quiz = this.db.prepare('SELECT * FROM quiz WHERE id = ?').get(quizId) as Quiz
        const quiz: Quiz = SQLCommand.select('*').from('quiz').where('id = ?').get(this.db, quizId) as Quiz

        if (!quiz) { return null }
        // const questions: Question[] = this.db.prepare('SELECT * FROM question WHERE quiz_id = ?').all(quizId) as Question[]
        const questions: Question[] = SQLCommand.select('*').from('question').where('quiz_id = ?').all(this.db, quizId) as Question[]
        if (!questions) { return null }
        for (const question of questions) {
            // const answers = this.db.prepare('SELECT * FROM answer WHERE question_id = ?').all(question.id) as Answer[]
            const answers = SQLCommand.select('*').from('answer').where('question_id = ?').all(this.db, question.id) as Answer[]

            question.answers = answers.map((answer) => {
                return {
                    id: answer.id,
                    answer: answer.answer,
                    isCorrect: hideAnswersCorrectness ? false : !!answer.isCorrect,
                    question_id: answer.question_id
                } as Answer
            })
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
        // const quizIds = this.db.prepare('SELECT id FROM quiz').all() as { id: string }[]
        const quizIds = SQLCommand.select('id').from('quiz').all(this.db) as { id: string }[]
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
        // this.db.exec('DELETE FROM quiz')
        // this.db.exec('DELETE FROM question')
        // this.db.exec('DELETE FROM answer')
        SQLCommand.delete().from('quiz').execute(this.db)
        SQLCommand.delete().from('question').execute(this.db)
        SQLCommand.delete().from('answer').execute(this.db)
    }

    /**
     * Add a new quiz to the database.
     * @param quiz the quiz to add to the database
     * @returns the id of the quiz that was added to the database
     */
    createQuiz(quiz: Quiz) {
        // this.db.prepare('INSERT INTO quiz (title, description, created, modified, createdBy) VALUES (?, ?, ?, ?, ?)')
        //     .run(
        //         quiz.title,
        //         quiz.description,
        //         quiz.created.toISOString(),
        //         quiz.modified.toISOString(),
        //         quiz.createdBy
        //     )
        SQLCommand.insert('title', 'description', 'created', 'modified', 'createdBy').into('quiz').values(
            '?', '?', '?', '?', '?'
        ).execute(this.db, quiz.title,
            quiz.description,
            quiz.created.toISOString(),
            quiz.modified.toISOString(),
            quiz.createdBy
        )
        // TODO add order to SQLCommand
        const quizId = this.db.prepare('SELECT id, created from quiz ORDER BY id DESC LIMIT 1').get() as Quiz
        for (const question of quiz.questions) {
            // this.db.prepare('INSERT INTO question (question, quiz_id) VALUES (?, ?)')
            //     .run(question.text,
            //         quizId.id
            //     )
            SQLCommand.insert('question', 'quiz_id').into('question').values('?', '?').execute(this.db, question.text, quizId.id)
            // TODO add order to SQLCommand
            const questionId = this.db.prepare('SELECT * from question ORDER BY id DESC LIMIT 1').get() as Question
            for (const answer of question.answers) {
                // this.db.prepare('INSERT INTO answer (answer, question_id, isCorrect) VALUES (?, ?, ?)')
                //     .run(answer.answer,
                //         questionId.id,
                //         answer.isCorrect ? 1 : 0
                //     )
                SQLCommand.insert('answer', 'question_id', 'isCorrect').into('answer').values(
                    '?', '?', '?'
                ).execute(this.db, answer.answer,
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
        // const quiz = this.db.prepare('SELECT * FROM quiz WHERE id = ?').get(quizId) as Quiz
        const quiz = SQLCommand.select('*').from('quiz').where('id = ?').get(this.db, quizId) as Quiz

        if (!quiz) {
            return {
                statusCode: 404,
                message: 'Quiz not found'
            }
        }

        // check if score is higher than previous score
        // const scoreInDB = this.db.prepare('SELECT * FROM score WHERE quizId = ? AND userId = ?').get(quizId, user.id) as Score
        const scoreInDB = SQLCommand.select('*').from('score').where('quizId = ? AND userId = ?').get(this.db, quizId, user.id) as Score

        if (scoreInDB !== undefined) {
            if (scoreInDB.score < score) {
                // this.db.prepare('UPDATE score SET score = ? WHERE id = ?').run(score, scoreInDB.id)
                SQLCommand.update('score').set('score').where('id = ?').execute(this.db, score, scoreInDB.id)
            }
        } else {
            // this.db.prepare('INSERT INTO score (quizId, userId, score) VALUES (?, ?, ?)')
            //     .run(quizId, user.id, score)
            SQLCommand.insert('quizId', 'userId', 'score').into('score').values('?', '?', '?').execute(this.db, quizId, user.id, score)
        }
    }

    /**
     * Returns all scores of the user with the given id.
     * @param id id of a user
     * @returns all scores of the user with the given id
     */
    getScoresOfUser(id: number) {
        // const scores = this.db.prepare('SELECT * FROM score WHERE userId = ?').all(id) as Score[]
        const scores = SQLCommand.select('*').from('score').where('userId = ?').all(this.db, id) as Score[]
        return scores
    }

    /**
     * Deletes all quizzes and scores from the database.
     */
    clearQuizzes() {
        // this.db.exec('DELETE FROM score')
        // this.db.exec('DELETE FROM quiz')
        // this.db.exec('DELETE FROM question')
        // this.db.exec('DELETE FROM answer')
        SQLCommand.delete().from('score').execute(this.db)
        SQLCommand.delete().from('quiz').execute(this.db)
        SQLCommand.delete().from('question').execute(this.db)
        SQLCommand.delete().from('answer').execute(this.db)
    }

    /**
     * Returns all users in the database.
     * @returns all users in the database
     */
    getAllUsers() {
        // const users = this.db.prepare('SELECT * FROM users').all() as User[]
        const users = SQLCommand.select('*').from('users').all(this.db) as User[]
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
        // const user = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User
        const user = SQLCommand.select('*').from('users').where('id = ?').get(this.db, id) as User
        return user
    }

    /**
     * Update the user given as parameter with the new data in the object user.
     * @param user the use to update
     * @returns true if the user was updated, false if the user does not exist
     */
    updateUser(user: User): boolean {
        // const userInDB = this.db.prepare('SELECT * FROM users WHERE id = ?').get(user.id)
        const userInDB = SQLCommand.select('*').from('users').where('id = ?').get(this.db, user.id) as User
        if (!userInDB) { return false }
        // this.db.prepare('UPDATE users SET username = ? WHERE id = ?').run(user.username, user.id)
        SQLCommand.update('users').set('username').where('id = ?').execute(this.db, user.username, user.id)
        return true
    }

    /**
     * Delete the user with the given id.
     * @param id id of the user to delete
     */
    deleteUser(id: any) {
        // this.db.prepare('DELETE FROM users WHERE id = ?').run(id)
        SQLCommand.delete().from('users').where('id = ?').execute(this.db, id)
    }

    /**
     * Delete the quiz with the given quizId.
     * @param quizId id of the quiz to delete
     * @returns the deleted quiz or null if quiz does not exist
     */
    deleteQuiz(quizId: string) {
        const quiz = this.getQuiz(quizId)
        if (!quiz) { return null }
        // this.db.prepare('DELETE FROM score WHERE quizId = ?').run(quizId)
        // this.db.prepare('DELETE FROM quiz WHERE id = ?').run(quizId)
        // this.db.prepare('DELETE FROM answer WHERE question_id in (SELECT id FROM question WHERE quiz_id = ?)').run(quizId)
        // this.db.prepare('DELETE FROM question WHERE quiz_id = ?').run(quizId)
        SQLCommand.delete().from('score').where('quizId = ?').execute(this.db, quizId)
        SQLCommand.delete().from('quiz').where('id = ?').execute(this.db, quizId)
        SQLCommand.delete().from('answer').where('question_id in (SELECT id FROM question WHERE quiz_id = ?)').execute(this.db, quizId)
        SQLCommand.delete().from('question').where('quiz_id = ?').execute(this.db, quizId)
        return quiz
    }

    /**
     * update the role of the user given as parameter with the new data in the object user.
     * @param user the user to update the role of
     * @returns true if the user was updated, false if the user does not exist
     */
    updateUserRole(user: User) {
        // const userInDB = this.db.prepare('SELECT * FROM users WHERE id = ?').get(user.id)
        const userInDB = SQLCommand.select().select('*').from('users').where('id = ?').get(this.db, user.id) as User
        if (!userInDB) { return false }
        // this.db.prepare('UPDATE users SET role = ? WHERE id = ?').run(user.role, user.id)
        SQLCommand.update('users').set('role').where('id = ?').execute(this.db, user.role, user.id)
        return true
    }

    /**
     * Returns all roles in the database.
     * @returns all roles in the database
     */
    getAllRoles() {
        // const roles = this.db.prepare('SELECT * FROM roles').all()
        const roles = SQLCommand.select('*').from('roles').all(this.db)
        return roles
    }

    /**
     * check if the quiz with the given quizId exists in the database.
     * @param quizId the id of the quiz to check if it exists
     * @returns true if the quiz exists, false if the quiz does not exist
     */
    isQuizExist(quizId: string) {
        // const quiz = this.db.prepare('SELECT * FROM quiz WHERE id = ?').get(quizId) as Quiz
        const quiz = SQLCommand.select('*').from('quiz').where('id = ?').get(this.db, quizId) as Quiz
        return quiz !== undefined
    }
}

export class SQLCommand {
    private command: string

    constructor(type: CommandTypes = CommandTypes.SELECT) {
        if (type === CommandTypes.SELECT) {
            this.command = type + ' [columns] FROM [table] WHERE [conditions]'
        } else if (type === CommandTypes.INSERT) {
            this.command = type + ' INTO [table] ([columns]) VALUES ([values])'
        } else if (type === CommandTypes.UPDATE) {
            this.command = type + ' [table] SET [columns] WHERE [conditions]'
        } else if (type === CommandTypes.DELETE) {
            this.command = type + ' FROM [table] WHERE [conditions]'
        } else {
            throw new Error('Invalid command type')
        }
    }

    static select(...columns: any[]) {
        return new SQLCommand(CommandTypes.SELECT).select(...columns)
    }

    static insert(...columns: any[]) {
        return new SQLCommand(CommandTypes.INSERT).select(...columns)
    }

    static update(table: string) {
        return new SQLCommand(CommandTypes.UPDATE).from(table)
    }

    static delete() {
        return new SQLCommand(CommandTypes.DELETE)
    }

    select(...columns: any[]) {
        this.command = this.command.replace('[columns]', columns.join(', '))

        return this
    }

    from(table: string) {
        this.command = this.command.replace('[table]', table)

        return this
    }

    where(conditions: string) {
        this.command = this.command.replace('[conditions]', conditions)

        return this
    }

    values(...values: any[]) {
        this.command = this.command.replace('[values]', values.join(', '))

        return this
    }

    insert(...columns: any[]) {
        return this.select(...columns)
    }

    into(table: string) {
        return this.from(table)
    }

    update(table: string) {
        return this.from(table)
    }

    set(...columns: any[]) {
        return this.select(...columns.map((column) => {
            return column + ' = ?'
        }))
    }

    preProcessCommand() {
        this.command = this.command.replace('[columns]', '*')
        this.command = this.command.replace('[table]', '')
        this.command = this.command.replace('[conditions]', '1 = 1')
        this.command = this.command.replace('[values]', '')
    }

    execute(db: DatabaseClass, ...params: any[]) {
        this.preProcessCommand()

        return db.prepare(this.command).run(params)
    }

    get(db: DatabaseClass, ...params: any[]) {
        this.preProcessCommand()
        return db.prepare(this.command).get(params)
    }

    all(db: DatabaseClass, ...params: any[]) {
        this.preProcessCommand()
        return db.prepare(this.command).all(params)
    }
}
