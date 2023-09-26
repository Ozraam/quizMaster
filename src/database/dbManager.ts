import { Database } from 'bun:sqlite';
import { Answer, Question, Quiz, User, Score } from './types';

export class DBManager {
    private static instance: DBManager;
    private db: Database;
    
    private constructor() {
        this.db = new Database('./src/database/quizmaster.sqlite');
    }
    
    static getInstance(): DBManager {
        if (!DBManager.instance) {
            DBManager.instance = new DBManager();
        }
    
        return DBManager.instance;
    }

    createTestQuiz() {
        const quiz = {
            title: 'Test Quiz',
            description: 'This is a test quiz',
            created: new Date(),
            modified: new Date()
        }

        this.db.query(`INSERT INTO quiz (title, description, created, modified) VALUES (?1, ?2, ?3, ?4)`)
            .run(
                quiz.title,
                quiz.description,
                quiz.created.toISOString(),
                quiz.modified.toISOString()
        );
        const quizId = this.db.query(`SELECT id, created from quiz ORDER BY id DESC LIMIT 1`).get() as Quiz;
        const questions = [
            {
                question: 'What is the capital of the Netherlands?',
                answers: [
                    {
                        answer: 'Amsterdam',
                        correct: true
                    },
                    {
                        answer: 'Rotterdam',
                        correct: false
                    },
                    {
                        answer: 'The Hague',
                        correct: false
                    },
                    {
                        answer: 'Utrecht',
                        correct: false
                    }
                ]
            },
        ]

        for(const question of questions) {
            this.db.query(`INSERT INTO question (question, quiz_id) VALUES (?1, ?2)`)
                .run( question.question,
                    quizId.id
                );
            const questionId = this.db.query(`SELECT * from question ORDER BY id DESC LIMIT 1`).get() as Question;
            for(const answer of question.answers) {
                this.db.query(`INSERT INTO answer (answer, question_id, correct) VALUES ($answer, $question_id, $correct)`)
                    .run({
                        $answer: answer.answer,
                        $question_id: questionId.id,
                        $correct: answer.correct
                    });
            }
        }
        
        return quizId;
    }
    
    getDB(): Database {
        return this.db;
    }

    getQuiz(quizId: string) {
        // retrieve quiz from database and return as JSON
        // database look like this:
        // quiz -> id, title, description, created, modified
        // question -> id, quiz_id, question
        // answer -> id, question_id, answer, correct

        const quiz : Quiz = this.db.query(`SELECT * FROM quiz WHERE id = ?1`).get(quizId) as Quiz;
        if(!quiz) return null;
        const questions : Question[] = this.db.query(`SELECT * FROM question WHERE quiz_id = ?1`).all(quizId) as Question[];
        if(!questions) return null;
        for(const question of questions) {
            const answers = this.db.query(`SELECT * FROM answer WHERE question_id = ?1`).all(question.id) as Answer[];
            answers.forEach(answer => {
                answer.correct = answer.correct == true;
            });
            question.answers = answers;
        }
        quiz.questions = questions;
        
        return quiz;
    }

    getQuizzes() {
        const quizzes = [];
        const quizIds = this.db.query(`SELECT id FROM quiz`).values();
        for(const quizId of quizIds) {
            const quiz = this.getQuiz(quizId[0] as string);
            quizzes.push(quiz);
        }

        return quizzes;
    }

    clearDatabase() {
        this.db.query(`DELETE FROM quiz`).run();
        this.db.query(`DELETE FROM question`).run();
        this.db.query(`DELETE FROM answer`).run();
    }

    createQuiz(quiz: Quiz) {
        this.db.query(`INSERT INTO quiz (title, description, created, modified) VALUES (?1, ?2, ?3, ?4)`)
            .run(
                quiz.title,
                quiz.description,
                quiz.created.toISOString(),
                quiz.modified.toISOString()
        );
        const quizId = this.db.query(`SELECT id, created from quiz ORDER BY id DESC LIMIT 1`).get() as Quiz;
        for(const question of quiz.questions) {
            this.db.query(`INSERT INTO question (question, quiz_id) VALUES (?1, ?2)`)
                .run( question.question,
                    quizId.id
                );
            const questionId = this.db.query(`SELECT * from question ORDER BY id DESC LIMIT 1`).get() as Question;
            for(const answer of question.answers) {
                this.db.query(`INSERT INTO answer (answer, question_id, correct) VALUES ($answer, $question_id, $correct)`)
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
        const quiz = this.db.query(`SELECT * FROM quiz WHERE id = ?1`).get(quizId) as Quiz;
        
        if(!quiz) return new Response("Quiz Not Found", { status: 404 });

        // check if score is higher than previous score
        const scoreInDB = this.db.query(`SELECT * FROM score WHERE quizId = ?1 AND userId = ?2`).get(quizId, user.id) as Score;

        if(scoreInDB) {
            if(scoreInDB.score < score) {
                this.db.query(`UPDATE score SET score = ?1 WHERE id = ?2`).run(score, scoreInDB.id);
            }
        } else {
            this.db.query(`INSERT INTO score (quizId, userId, score) VALUES (?1, ?2, ?3)`)
                .run(quizId, user.id, score);
        }

        return new Response("Updated", { status: 200 });
    }

    getScoresOfUser(id: number) {
        const scores = this.db.query(`SELECT * FROM score WHERE userId = ?1`).all(id) as Score[];
        return scores;
    }

    clearQuizzes() {
        this.db.query(`DELETE FROM quiz`).run();
        this.db.query(`DELETE FROM question`).run();
        this.db.query(`DELETE FROM answer`).run();
        return new Response("", { status: 204 });
    }

    clearQuiz(quizId: number) {
        if(!quizId) return new Response("No quizId given", { status: 400 });
        this.db.query(`DELETE FROM quiz WHERE id = ?1`).run(quizId);
        this.db.query(`DELETE FROM question WHERE quiz_id = ?1`).run(quizId);
        this.db.query(`DELETE FROM answer WHERE question_id = ?1`).run(quizId);
        return new Response("", { status: 204 });
    }

    getAllUsers() {
        const users = this.db.query(`SELECT * FROM users`).all() as User[];
        return users;
    }
}