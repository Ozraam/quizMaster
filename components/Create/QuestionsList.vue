<script setup lang="ts">
defineExpose({
    getQuestions: () => questions.value
})

const questions: Ref<Array<{ text: string, answers: any; id:number }>> = ref([])
const currentEditingQuestion = ref(-1)

let answerID = 0
let questionID = 0

function addQuestion() {
    questions.value.push({
        text: 'Untitled question',
        answers: [],
        id: questionID++
    })

    currentEditingQuestion.value = questions.value.length - 1
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
    const ques = questions.value[index].answers.splice(indexAnswer, 1)

    if (ques[0].isCorrect && questions.value[index].answers.length > 0) {
        questions.value[index].answers[0].isCorrect = true
    }
}

function deleteQuestion(index: number) {
    questions.value.splice(index, 1)
}
</script>

<template>
    <create-question-adder @click="addQuestion" />

    <transition-group
        name="questions"
        tag="ul"
        class="questions-list"
    >
        <create-question
            v-for="(question, index) in questions"
            :key="question.id"
            :question="question"
            :question-index="index"
            @delete:question="deleteQuestion(index)"
            @edit:question="currentEditingQuestion = index"
        />
    </transition-group>

    <create-question-editor
        v-if="currentEditingQuestion !== -1"
        :question="questions[currentEditingQuestion]"
        :question-index="currentEditingQuestion"
        @close="currentEditingQuestion = -1"
        @add-answer="addAnswer(currentEditingQuestion)"
        @update:question="(question, index) => questions[index] = question"
        @delete:answer="(index) => deleteAnswer(currentEditingQuestion, index)"
        @update:answer="(answer, index) => updateAnswer(answer, currentEditingQuestion, index)"
    />
</template>

<style>
.questions-list {
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1em;
    max-width: 100%;
}
</style>

<style scoped lang="scss">
.questions-enter-active,
.questions-leave-active, .questions-move {
    transition: all 0.3s ease-in-out;
}

.questions-enter-from,
.questions-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.questions-leave-active {
  position: absolute;
}
</style>
