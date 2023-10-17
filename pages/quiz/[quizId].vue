<script setup lang="ts">
const route = useRoute()

const quiz = (await useFetch('/api/quiz?quizId=' + route.params.quizId)).data as Ref<any>

const currentQuestion = ref(0)

const currentAnswer = computed({
    get() {
        return finalAnswers.value[currentQuestion.value]?.answer
    },
    set(answer) {
        if (finalAnswers.value.length < currentQuestion.value + 1) {
            finalAnswers.value.push({
                question: quiz.value.questions[currentQuestion.value],
                answer
            })
        } else {
            finalAnswers.value[currentQuestion.value] = {
                question: quiz.value.questions[currentQuestion.value],
                answer
            }
        }
    }
})

const finalAnswers : Ref<Array<any>> = ref([])

function nextQuestion() {
    currentQuestion.value++
}
</script>

<template>
    <main class="center">
        <section class="quiz-section">
            <h1 class="quiz-title">
                {{ quiz.title }}
            </h1>

            <!-- <quiz-progress
                :current-question="currentQuestion"
                :total-questions="quiz.questions.length"
            /> -->

            <quiz-current-question
                v-if="currentQuestion < quiz.questions.length"
                :question="quiz.questions[currentQuestion]"
                :question-index="currentQuestion"
                :answer-selected="currentAnswer"
                @answer-selected="currentAnswer = $event"
            />

            <quiz-end-panel
                v-if="currentQuestion === quiz.questions.length"
                :final-answers="finalAnswers"
                :quiz-id="quiz.id"
            />

            <quiz-control
                v-else
                :current-question="currentQuestion"
                :total-questions="quiz.questions.length"
                :answer-selected="currentAnswer"
                @next-question="nextQuestion"
                @previous-question="currentQuestion--"
            />
        </section>
    </main>
</template>

<style scoped lang="scss">
.quiz-section {
    max-width: 700px;
    margin: 0 auto;
    padding: 10px 20px;
    background-color: $primary;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.quiz-title{
    margin-bottom: 10px;

    &::after {
        content: '';
        display: block;
        width: 100%;
        border: 1px solid $tertiary;
        position: absolute;
        left: 0;
    }
}

.center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}
</style>
