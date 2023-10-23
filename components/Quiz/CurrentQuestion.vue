<script setup lang="ts">
const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    questionIndex: {
        type: Number,
        required: true
    },
    answerSelected: {
        type: Object,
        required: false,
        default: undefined
    }
})

const emit = defineEmits(['answer-selected'])

const currentAnswer = computed({
    get() {
        return props.answerSelected
    },
    set(answer) {
        emit('answer-selected', answer)
    }
})

defineExpose({
    currentAnswer
})
</script>

<template>
    <div class="question">
        <h2 class="question-text">
            {{ question.question }}
        </h2>

        <p class="prompt-text">
            Choose the correct answer:
        </p>

        <ul class="answer-container">
            <quiz-answer
                v-for="(answer, index) in question.answers"
                :key="index"
                :answer="answer"
                :is-selected="currentAnswer === answer"
                @select-answer="currentAnswer = answer"
            />
        </ul>
    </div>
</template>

<style scoped>
ul {
    width: 100%;
    margin: 0;
    padding: 0;
}

.question-text {
    text-align: center;
    font-weight: 400;
    text-transform: capitalize;
    margin-bottom: 2em;
}

.answer-container {
    display: flex;
    gap: 10px;
}

.prompt-text {
    margin-bottom: 20px;
}
</style>
