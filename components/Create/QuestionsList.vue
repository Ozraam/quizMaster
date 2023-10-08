<script setup lang="ts">
defineExpose({
    getQuestions: () => questions.value
})

const questions: Ref<Array<{ text: string, answers: any; id:number }>> = ref([])

let answerID = 0
let questionID = 0

function addQuestion() {
    questions.value.push({
        text: '',
        answers: [],
        id: questionID++
    })
}

function addAnswer(questionIndex: number) {
    questions.value[questionIndex].answers.push({
        text: '',
        isCorrect: questions.value[questionIndex].answers.length === 0,
        id: answerID++
    })
}

function updateAnswer(answer: { text: string, isCorrect: boolean }, index: number, indexAnswer: number) {
    if (answer.isCorrect) {
        questions.value[index].answers.forEach((answer: {text: string, isCorrect: boolean}) => {
            answer.isCorrect = false
        })
    }

    questions.value[index].answers[indexAnswer] = answer
}

function deleteAnswer(index: number, indexAnswer: number) {
    questions.value[index].answers.splice(indexAnswer, 1)
}

function deleteQuestion(index: number) {
    questions.value.splice(index, 1)
}
</script>

<template>
    <ul class="question-list">
        <create-question
            v-for="(question, index) in questions"
            :key="question.id"
            :question="question"
            :question-index="index"
            @update:question="questions[index] = $event"
            @add-answer="addAnswer(index)"
            @update:answer="(answer, indexAnswer) => updateAnswer(answer, index, indexAnswer)"
            @delete:answer="(indexAnswer) => deleteAnswer(index, indexAnswer)"
            @delete:question="() => deleteQuestion(index)"
        />

        <create-question-adder @click="addQuestion" />
    </ul>
</template>

<style scoped>
.question-list {
    margin: 0;
    padding: 0;
    display: flex;
    gap: 1em;
    overflow-x: auto;
    max-width: 100%;
}

.question-list::-webkit-scrollbar {
    /* personalize scrollbar */
    width: 10px;
    height: 5px;
}

.question-list::-webkit-scrollbar-track {
    /* personalize scrollbar */
    background: #f1f1f1;
    border-radius: 5px;
}

.question-list::-webkit-scrollbar-thumb {
    /* personalize scrollbar */
    background: #888;
    border-radius: 5px;
}
</style>
