import { Database } from "bun:sqlite";

export function createDatabase() {
    const db = new Database("./database/quizmaster.sqlite");
    // create a table named 'quiz'
    // with a column named 'id' of type 'integer' primary key autoincrement
    // and a column named 'title' of type 'text'
    // and a column named 'description' of type 'text'
    // and a column named 'created' of type 'date'
    // and a column named 'modified' of type 'date'
    db.exec(`
        CREATE TABLE IF NOT EXISTS quiz (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT,
            created DATE,
            modified DATE
        )
    `);

    // create a table named 'question'
    // with a column named 'id' of type 'integer' primary key autoincrement
    // and a column named 'quiz_id' of type 'integer'
    // and a column named 'question' of type 'text'
    db.exec(`
        CREATE TABLE IF NOT EXISTS question (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            quiz_id INTEGER,
            question TEXT
        )
    `);

    // create a table named 'answer'
    // with a column named 'id' of type 'integer' primary key autoincrement
    // and a column named 'question_id' of type 'integer'
    // and a column named 'answer' of type 'text'
    // and a column named 'correct' of type 'boolean'
    db.exec(`
        CREATE TABLE IF NOT EXISTS answer (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER,
            answer TEXT,
            correct BOOLEAN
        )
    `);

    db.close();
}
