import Database, {Database as DatabseClass} from 'better-sqlite3';
import { Answer, Question, Quiz, User, Score } from './types';

export class DBManager {
    private static instance: DBManager;
    private db: DatabseClass;
    
    private constructor() {
        this.db = new Database('./server/utils/quizmaster.sqlite');
    }
    
    static getInstance(): DBManager {
        if (!DBManager.instance) {
            DBManager.instance = new DBManager();
        }
    
        return DBManager.instance;
    }
    
    getDB(): DatabseClass {
        return this.db;
    }

    getQuiz(quizId: string) {
        // retrieve quiz from database and return as JSON
        // database look like this:
        // quiz -> id, title, description, created, modified
        // question -> id, quiz_id, question
        // answer -> id, question_id, answer, correct

        const quiz : Quiz = this.db.prepare(`SELECT * FROM quiz WHERE id = ?`).get(quizId) as Quiz;
        if(!quiz) return null;
        const questions : Question[] = this.db.prepare(`SELECT * FROM question WHERE quiz_id = ?`).all(quizId) as Question[];
        if(!questions) return null;
        for(const question of questions) {
            const answers = this.db.prepare(`SELECT * FROM answer WHERE question_id = ?`).all(question.id) as Answer[];
            answers.forEach(answer => {
                answer.correct = answer.correct == true;
            });
            question.answers = answers;
        }
        quiz.questions = questions;
        
        return quiz;
    }

    getQuizzes() {
        const quizzes : Quiz[] = [];
        const quizIds = this.db.prepare(`SELECT id FROM quiz`).all() as {id: string}[];
        for(const quizId of quizIds) {
            const quiz = this.getQuiz(quizId.id as string);
            if(quiz) quizzes.push(quiz);
        }

        return quizzes;
    }

    clearDatabase() {
        this.db.exec(`DELETE FROM quiz`);
        this.db.exec(`DELETE FROM question`);
        this.db.exec(`DELETE FROM answer`);
    }

    createQuiz(quiz: Quiz) {
        this.db.prepare(`INSERT INTO quiz (title, description, created, modified) VALUES (?, ?, ?, ?)`)
            .run(
                quiz.title,
                quiz.description,
                quiz.created.toISOString(),
                quiz.modified.toISOString()
        );
        const quizId = this.db.prepare(`SELECT id, created from quiz ORDER BY id DESC LIMIT 1`).get() as Quiz;
        for(const question of quiz.questions) {
            this.db.prepare(`INSERT INTO question (question, quiz_id) VALUES (?, ?)`)
                .run( question.question,
                    quizId.id
                );
            const questionId = this.db.prepare(`SELECT * from question ORDER BY id DESC LIMIT 1`).get() as Question;
            for(const answer of question.answers) {
                this.db.prepare(`INSERT INTO answer (answer, question_id, correct) VALUES ($answer, $question_id, $correct)`)
                    .run({
                        $answer: answer.answer,
                        $question_id: questionId.id,
                        $correct: answer.correct
                    });
            }
        }
        
        return quizId;
    }

    updateScoreOfUser(quizId: number, user: User, score: number) {
        // update score of user in database if score is higher than previous score
        const quiz = this.db.prepare(`SELECT * FROM quiz WHERE id = ?`).get(quizId) as Quiz;
        
        if(!quiz) return new Response("Quiz Not Found", { status: 404 });

        // check if score is higher than previous score
        const scoreInDB = this.db.prepare(`SELECT * FROM score WHERE quizId = ? AND userId = ?`).get(quizId, user.id) as Score;

        if(scoreInDB) {
            if(scoreInDB.score < score) {
                this.db.prepare(`UPDATE score SET score = ? WHERE id = ?`).run(score, scoreInDB.id);
            }
        } else {
            this.db.prepare(`INSERT INTO score (quizId, userId, score) VALUES (?, ?, ?)`)
                .run(quizId, user.id, score);
        }

        return new Response("Updated", { status: 200 });
    }

    getScoresOfUser(id: number) {
        const scores = this.db.prepare(`SELECT * FROM score WHERE userId = ?`).all(id) as Score[];
        return scores;
    }

    clearQuizzes() {
        this.db.exec(`DELETE FROM quiz`);
        this.db.exec(`DELETE FROM question`);
        this.db.exec(`DELETE FROM answer`);
        return new Response("", { status: 204 });
    }

    clearQuiz(quizId: number) {
        if(!quizId) return new Response("No quizId given", { status: 400 });
        this.db.prepare(`DELETE FROM quiz WHERE id = ?`).run(quizId);
        this.db.prepare(`DELETE FROM question WHERE quiz_id = ?`).run(quizId);
        this.db.prepare(`DELETE FROM answer WHERE question_id = ?`).run(quizId);
        return new Response("", { status: 204 });
    }

    getAllUsers() {
        const users = this.db.prepare(`SELECT * FROM users`).all() as User[];
        users.forEach(user => {
            user.password = "";
        })
        return users;
    }

    getUserWithId(id: number) {
        const user = this.db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as User;
        return user;
    }

    updateUser(user: User) : boolean {
        const userInDB = this.db.prepare(`SELECT * FROM users WHERE id = ?`).get(user.id);
        if(!userInDB) return false;
        this.db.prepare(`UPDATE users SET username = ? WHERE id = ?`)
            .run(user.username, user.id);
        return true;
    }

    deleteUser(id: any) {
        this.db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
    }

    deleteQuiz(quizId: string) {
        const quiz = this.getQuiz(quizId);
        if(!quiz) return null;
        this.db.prepare(`DELETE FROM quiz WHERE id = ?`).run(quizId);
        this.db.prepare(`DELETE FROM answer WHERE question_id in (SELECT id FROM question WHERE quiz_id = ?)`).run(quizId);
        this.db.prepare(`DELETE FROM question WHERE quiz_id = ?`).run(quizId);
        return quiz;
    }

    updateUserRole(user: User) {
        const userInDB = this.db.prepare(`SELECT * FROM users WHERE id = ?`).get(user.id);
        if(!userInDB) return false;
        this.db.prepare(`UPDATE users SET role = ? WHERE id = ?`)
            .run(user.role, user.id);
        return true;
    }

    getAllRoles() {
        const roles = this.db.prepare(`SELECT * FROM roles`).all();
        return roles;
    }
}