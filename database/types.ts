export type Question = {
    id: number;
    question: string;
    quiz_id: number;
    answers: Answer[];
}

export type Answer = {
    id: number;
    answer: string;
    question_id: number;
    correct: boolean;
}

export type Quiz = {
    id: number;
    title: string;
    description: string;
    created: Date;
    modified: Date;
    questions: Question[];
}