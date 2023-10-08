<script setup lang="ts">
const route = useRoute()

const quiz = (await useFetch('/api/quiz?quizId=' + route.params.quizId)).data as Ref<any>

const currentQuestion = ref(0)

const finalAnswers = ref([])
</script>

<template>
    <main>
        <h1 class="quiz-title">
            QUIZ : 01
        </h1>

        <quiz-progress />

        <quiz-current-question
            :question="quiz.questions[currentQuestion]"
            :question-index="currentQuestion"
        />

        <div
            id="end"
            class=""
        >
            <h3>
                Good jo// console.log(quiz.value.questions[currentQuestion.value])b!
            </h3>

            <p class="end-text">
                You have completed the quiz!
            </p>

            <p class="end-text">
                Your score is <span class="score">0</span>

                / <span class="total-score">0</span>
            </p>
        </div>

        <template class="final-answer-template">
            <li>
                <p class="final-answer">
                    <span class="final-answer-question">
                        question text
                    </span>
                    Answer :
                    <span class="final-answer-text">
                        answer text
                    </span>
                    Your answer :
                    <span class="final-answer-user">
                        user answer
                    </span>
                </p>
            </li>
        </template>

        <div class="final-answers ">
            <h3>
                Answers
            </h3>

            <ul class="final-answers-list" />
        </div>

        <div class="controls">
            <button
                id="previous"
                class="btn "
            >
                Previous
            </button>

            <button
                id="submit"
                class="btn "
            >
                Submit
            </button>

            <a
                href="/"
                class=" backHome"
            >Back to home</a>
        </div>
    </main>
</template>

<style scoped>
.question {
    width: 100%;
    padding: 20px;
    /* border-radius: 26px;
    background: #e0e0e0;
    box-shadow:  19px 19px 38px #cecece,
                -19px -19px 38px #f2f2f2; */
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px 0;
}

.question-text {
    width: 100%;
    padding: 10px;
    font-size: large;
    font-weight: bold;
}

.controls {
    display: flex;
}

.btn {

    padding: 10px;
    border: none;
    background-color: transparent;
    font-size: large;
    font-weight: bold;
}

.btn:hover {
    cursor: pointer;
    border-radius: 10px;
}

#previous {
    position: relative;
}

#previous:hover::before {
    left: -10px;
}

#previous:before {
    content: "<";
    margin-right: 10px;
    position: absolute;
    left: -5px;
    transition: left 0.2s;
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

#submit {
    position: relative;
}

#submit:hover::after {
    right: -10px;
}

#submit:after {
    content: ">";
    margin-left: 10px;
    position: absolute;
    right: -5px;
    transition: right 0.2s;
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.title {
    font-size: large;
    font-weight: bold;
    margin: 20px 0;
}

.nav ul {
    display: flex;
    width: 100%;
    gap: 10px;
}

header {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.backHome {
    color: black;
    text-decoration: underline;
}

.backHome:hover {
    color: black;
    text-decoration: none;
}

.title {
    margin-top: 10px;
}

.progress-bar {
    width: 100%;
    height: 20px;
    background-color: white;
    border-radius: 10px;
    margin: 10px 0;
}

.progress-bar-foreground {
    display: block;
    overflow: hidden;
    width: 0%;
    height: 100%;
    background-color: #4caf50;
    border-radius: 10px;
    transition: width 0.5s ease-in-out;
    text-align: center;
}

.final-answers .correct {
    color: blue;
}

.final-answers .incorrect {
    color: red;
}

.final-answer-question {
    font-weight: bold;
}

.final-answer-text {
    text-decoration: underline;
}

.final-answers h3 {
    text-align: center;
}
</style>
