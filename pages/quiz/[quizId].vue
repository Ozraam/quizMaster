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
    <main>
        <h1 class="quiz-title">
            QUIZ : 01
        </h1>

        <quiz-progress
            :current-question="currentQuestion"
            :total-questions="quiz.questions.length"
        />

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
    </main>
</template>
