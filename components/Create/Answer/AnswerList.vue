<script setup lang="ts">
const props = defineProps<{
    answers: { text: string, isCorrect: boolean, id: number }[];
    questionIndex: number;
}>()

defineEmits<{
    (event: 'add-answer'): void;
    (event: 'update:answer', answers: { text: string, isCorrect: boolean, id:number }, index: number): void;
    (event: 'delete:answer', index: number): void;
}>()
</script>

<template>
    <h3>
        Answers
        <button
            aria-label="Add answer"
            class="add-answer-button"
            @click="$emit('add-answer')"
        >
            +
        </button>
    </h3>

    <ul class="answer-list">
        <create-answer
            v-for="(answer, index) in answers"
            :key="answer.id"
            :question-index="questionIndex"
            :answer="answer"
            @update:answer="(answer) => $emit('update:answer', answer, index)"
            @delete:answer="() => $emit('delete:answer', index)"
        />
    </ul>
</template>

<style scoped>
.answer-list {
    margin: 0;
    padding: 0;
}

.add-answer-button {
    font-size: larger;
    background-color: transparent;
    border: 1px solid #a8a8a8;
    border-radius: 5px;
    cursor: pointer;
    transition: border-color 0.3s ease-in-out;
}

.add-answer-button:hover {
    border-color: black;
}
</style>
