class Quiz {
    constructor(questions) {
        this.questions = questions;
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
    }

    /**
     * @returns {boolean} true if quiz is complete, false if not
     */
    isComplete() {
        return this.currentQuestion === this.questions.length - 1;
    }

    nextQuestion() {
        document.querySelector('.progress-bar-foreground').style.width = `${(this.currentQuestion + 1) / this.questions.length * 100}%`;
        document.querySelector('.progress-bar-foreground').innerText = `${this.currentQuestion +1} / ${this.questions.length}`;
        if (this.isComplete()) {
            this.endQuiz();
            return;
        }
        const currentQuestionEl = document.getElementById(`question-${this.currentQuestion}`);
        currentQuestionEl.classList.add('hide');
        this.currentQuestion++;
        const nextQuestionEl = document.getElementById(`question-${this.currentQuestion}`);
        nextQuestionEl.classList.remove('hide');
    
        document.querySelector('.subtitle').innerText = `Question ${this.currentQuestion + 1}`;
        document.getElementById('previous').classList.remove('hide');
    
        if(nextQuestionEl.querySelector('.active') === null) {
            document.getElementById('submit').classList.add('hide');
        }
    }

    addAnswer(answer) {
        this.answers[this.currentQuestion] = answer;
    }

    /**
     * @param {int} answer number of the answer selected
     * @returns {boolean} true if answer is correct, false if not
     * @throws {Error} if answer is not a number
     */
    checkAnswer(answer, questionIndex) {
        if (typeof answer !== "number") {
            throw new Error("Answer must be a number");
        }
        
        return this.questions[questionIndex].answers[answer].correct;
    }

    previousQuestion() {
        if (this.currentQuestion === 0) {
            return;
        }
        const currentQuestionEl = document.getElementById(`question-${this.currentQuestion}`);
        currentQuestionEl.classList.add('hide');
        this.currentQuestion--;
        if (this.currentQuestion === 0) {
            document.getElementById('previous').classList.add('hide');
        }
        const nextQuestionEl = document.getElementById(`question-${this.currentQuestion}`);
        nextQuestionEl.classList.remove('hide');
        document.getElementById('end').classList.add('hide');
    
        document.getElementById('submit').classList.remove('hide');
    
        document.querySelector('.subtitle').innerText = `Question ${this.currentQuestion + 1}`;
        document.querySelector('.progress-bar-foreground').style.width = `${(this.currentQuestion) / this.questions.length * 100}%`;
        document.querySelector('.progress-bar-foreground').innerText = `${this.currentQuestion} / ${this.questions.length}`; 
    }

    /**
     * @returns {int} number of questions in quiz
     */
    getNumQuestions() {
        return this.questions.length;
    }

    /**
     * @returns {int} number of questions answere
     */
    getNumAnswered() {
        return this.answers.length;
    }

    render() {
        const quizContainer = document.querySelector(".quiz-container");
        const questionTemplate = document.querySelector(".question-template");
        const answerTemplate = document.querySelector(".answer-template");
        

        this.questions.forEach((question, index) => {
            const questionEl = document.importNode(questionTemplate.content, true);
            
            const questionText = questionEl.querySelector(".question-text");
            questionText.innerText = question.question;

            const answerButtons = []
            question.answers.forEach((answer, index) => {
                const answerEl = document.importNode(answerTemplate.content, true);
                answerEl.querySelector('.answer-text').innerText = answer.answer;
                answerEl.querySelector(".answer").addEventListener("click", () => {
                    document.getElementById("submit").classList.remove("hide");
                    this.addAnswer(index);
                    answerButtons.forEach((button, i) => {
                        if (i !== index) {
                            button.classList.remove("active");
                        } else {
                            button.classList.add("active");
                        }
                    });
                });
                answerButtons.push(answerEl.querySelector(".answer"));
                questionEl.querySelector(".answer-container").appendChild(answerEl);
            });
            questionEl.querySelector(".question").id = `question-${index}`;
            if (index > 0) {
                questionEl.querySelector(".question").classList.add("hide");
            }
            quizContainer.appendChild(questionEl);
        });
    }

    endQuiz() {
        const currentQuestionEl = document.getElementById(
            `question-${this.currentQuestion}`,
        );
        currentQuestionEl.classList.add("hide");
        const endEl = document.querySelector("#end");

        endEl.classList.remove("hide");
        document.getElementById("submit").classList.add("hide");
        document.getElementById("previous").classList.add("hide");
        document.querySelector(".backHome").classList.remove("hide");

        document.querySelector(".subtitle").innerText = `Quiz Complete!`;

        const scoreEl = document.querySelector(".score");
        this.score = this.getScore();
        scoreEl.innerText = this.score;
        document.querySelector(".total-score").innerText = this.questions.length + " : " + (this.score / this.questions.length * 100).toFixed(0) + "%";

        // SAVE SCORE TO DATABASE
        fetch('/API/saveScore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
            body: JSON.stringify({
                quizId: this.questions[0].quiz_id,
                score: this.score,
            }),
        })
        


        // DISPLAY CORRECT ANSWERS
        // -----------------------
        // display correct answers and user answers
        const answersEl = document.querySelector(".final-answers-list");
        const answerTemplate = document.querySelector(".final-answer-template");

        this.questions.forEach((question, index) => {
            const answerEl = document.importNode(answerTemplate.content, true);

            const questionText = answerEl.querySelector(".final-answer-question");
            questionText.innerText = question.question;

            const correctAnswerText = answerEl.querySelector(".final-answer-text");
            correctAnswerText.innerText = question.answers.find(answer => answer.correct).answer;

            const userAnswerText = answerEl.querySelector(".final-answer-user");
            userAnswerText.innerText = question.answers[this.answers[index]].answer;
            if (this.checkAnswer(this.answers[index], index)) {
                userAnswerText.classList.add("correct");
            } else {
                userAnswerText.classList.add("incorrect");
            }
            answersEl.appendChild(answerEl);
        });

        document.querySelector('.final-answers').classList.remove('hide');
    }

    /**
     * @returns {int} number of questions answered correctly
     * @throws {Error} if quiz is not complete
     */
    getScore() {
        if (!this.isComplete()) {
            throw new Error("Quiz is not complete");
        }
        let score = 0;
        this.answers.forEach((answer, index) => {
            if (this.checkAnswer(answer, index)) {
                score++;
            }
        });
        return score;
    }
}
