// fetch all quizzes from the API

try {
    const res = await fetch(
        'API/getQuizzes',
        { 
            method: 'GET' 
        }
    )
    if (res.ok) {
        const quizzes = (await res.json());
        // render the quizzes
        const quizList = document.querySelector('.quiz-list');
        const quizCardTemplate = document.querySelector('.quiz-card-template');
        for (const quiz of quizzes) {
            const quizCard = document.importNode(quizCardTemplate.content, true);
            quizCard.querySelector('.quiz-card-title').innerText = quiz.title;
            quizCard.querySelector('.quiz-card-description').innerText = quiz.description;
            quizCard.querySelector('.quiz-card-button').href = `quiz/?id=${quiz.id}`;
            quizCard.querySelector('.quiz-card-button').innerText = 'Start Quiz ' + quiz.id;
            quizList.appendChild(quizCard);
        }
    } else {
        console.error('Failed to load quizzes');
    }
} catch (e) {
    console.error(e);
}