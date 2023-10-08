<script setup lang="ts">
const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    questionIndex: {
        type: Number,
        required: true
    }
})

const currentAnswer = ref(props.question.answers[0])

defineExpose({
    currentAnswer
})
</script>

<template>
    <h2 class="subtitle">
        Question {{ questionIndex + 1 }}
    </h2>

    <div class="question">
        <p class="question-text">
            {{ question.question }}
        </p>

        <ul class="answer-container">
            <quiz-answer
                v-for="(answer, index) in question.answers"
                :key="index"
                :answer="answer"
                @select-answer="currentAnswer = answer"
            />
        </ul>
    </div>

    <div class="quiz-container" />
</template>

<style scoped>
ul {
    width: 100%;
    margin: 0;
    padding: 0;
}

.question-text {
    text-align: center;
}
</style>
