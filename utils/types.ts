export type Answer = {
    id: number;
    answer: string;
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
    createdBy: number;
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
    isAdmin: boolean;
    isSuperAdmin: boolean;
    scores: { [quizId: number]: number };
}
