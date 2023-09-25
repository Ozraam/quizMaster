

function getURLParameter(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

// fetch the quiz from the API
const quizId = getURLParameter('id');

const questionTemplate = document.querySelector('.question-template');

let questions;
const res = await fetch(
    '/API/getQuiz?id=' + quizId,
    { 
        method: 'GET' 
    }
    )
if (res.ok) {
    questions = (await res.json()).questions;
    
} else {
    console.error('Failed to load quiz questions');
}

const quiz = new Quiz(questions);
quiz.render();

document.getElementById('submit').addEventListener('click', quiz.nextQuestion.bind(quiz));

document.getElementById('previous').addEventListener('click', quiz.previousQuestion.bind(quiz));
