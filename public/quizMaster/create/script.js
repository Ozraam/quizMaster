document.getElementById('quiz-title').addEventListener('input', (e) => {

    // limit the length of the title to 30 characters
    if (e.target.value.length > 30) {
        e.target.value = e.target.value.substring(0, 30);
    }

    document.title = (e.target.value.trim() == "" ? 'Untitled' : e.target.value.trim()) + ' | Create your Quiz !';
});

function addQuestion() {
    const questionTemplate = document.getElementById('question-template');
    const questionContainer = document.querySelector('.question-list');

    const questionElement = questionTemplate.content.cloneNode(true);

    questionElement.querySelector('.delete-question-button').addEventListener('click', (e) => {
        e.target.closest('.question').remove();

        // renumber the questions and answers
        const questions = document.querySelectorAll('.question');
        questions.forEach((question, index) => {
            question.dataset.questionNumber = index + 1;

            const answers = question.querySelectorAll('.answer');
            answers.forEach((answer) => {
                answer.querySelector('.answer input').name = 'answer-' + (question.dataset.questionNumber);
            });
            // TODO rename the id and for attributes for #question-text
        });
    });

    // rename id and for attributes for #question-text
    const questionText = questionElement.querySelector('#question-text');
    questionText.id = 'question-text-' + (questionContainer.childElementCount + 1);
    // and label for
    questionElement.querySelector('label').setAttribute('for', questionText.id);


    questionElement.querySelector('.add-answer-button').addEventListener('click', addAnswer);

    questionElement.querySelector('.question').dataset.questionNumber = questionContainer.childElementCount + 1;

    questionContainer.insertBefore(questionElement, questionContainer.lastElementChild);
}

function addAnswer(e) {
    const answerTemplate = document.getElementById('answer-template');
    const answerContainer = e.target.closest('.question').querySelector('.answer-list');

    const answerElement = answerTemplate.content.cloneNode(true);

    answerElement.querySelector('.delete-answer-button').addEventListener('click', (e) => {
        e.target.closest('.answer').remove();
    });

    answerElement.querySelector('.answer input').name = 'answer-' + e.target.closest('.question').dataset.questionNumber;

    answerContainer.appendChild(answerElement);
}

document.querySelector('.add-question-button').addEventListener('click', addQuestion);

document.querySelector('.submit-button').addEventListener('click', (e) => {
    e.preventDefault();

    const quizTitle = document.querySelector('#quiz-title').value.trim();
    if (quizTitle == "") {
        alert('Please enter a title for your quiz');
        return;
    }

    const questions = document.querySelectorAll('.question:not(.ignore)');
    if (questions.length == 0) {
        alert('Please add at least one question');
        return;
    }

    // description of the quiz
    const description = document.querySelector('#quiz-description').value.trim();
    if (description == "") {
        alert('Please enter a description for your quiz');
        return;
    }

    const data = {
        title: quizTitle,
        description: description,
        questions: []
    };

    questions.forEach((question) => {
        console.log(question.querySelector('.question-text'));
        const questionText = question.querySelector('input.question-text').value.trim();
        if (questionText == "") {
            alert('Please enter a question');
            return;
        }

        const answers = question.querySelectorAll('.answer');
        if (answers.length < 2) {
            alert('Please add at least two answers');
            return;
        }

        const correctAnswers = Array.from(answers).map((answer) => {
            const answerText = answer.querySelector('.answer-text').value.trim();
            if (answerText == "") {
                alert('Please enter an answer');
                return false;
            }

            return {
                answer: answerText,
                correct: answer.querySelector('.answer input[type="radio"]').checked
            }
        });

        if (correctAnswers.length == 0) {
            alert('Please select at least one correct answer');
            return;
        }

        data.questions.push({
            question: questionText,
            answers: correctAnswers
        });
    });

    if (data.questions.length != questions.length) {
        return;
    }
    
    fetch('/API/createQuiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        
    }).then(async (response) => {
        response.json().then((data) => {
            if (data.id) {
                window.location.href = '../quiz/?id=' + data.id;
            } else {
                alert(data.message);
            }
        });
    }).catch((error) => {
        console.error(error);
    });
});

addQuestion(false);
addAnswer({ target: document.querySelector('.add-answer-button') });