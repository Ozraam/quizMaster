export type Answer = {
    id: number;
    text: string;
    question_id: number;
    isCorrect: boolean;
}

export type Question = {
    id: number;
    text: string;
    quiz_id: number;
    answers: Answer[];
}

export type Quiz = {
    id: number;
    title: string;
    description: string;
    created: Date;
    modified: Date;
    questions: Question[];
}

export type Score = {
    id: number;
    quizId: number;
    userId: number;
    score: number;
}

export type User = {
    id: number;
    username: string;
    password: string;
    created: Date;
    role: number;
    scores: { [quizId: number]: number };
}
