<script setup lang="ts">
defineProps<{
    answers: { text: string, isCorrect: boolean, id: number }[];
    questionIndex: number;
}>()

// eslint-disable-next-line func-call-spacing
defineEmits<{
    (event: 'add-answer'): void;
    (event: 'update:answer', answers: { text: string, isCorrect: boolean, id:number }, index: number): void;
    (event: 'delete:answer', index: number): void;
}>()
</script>

<template>
    <button
        aria-label="Add answer"
        class="add-answer-button"
        @click="$emit('add-answer')"
    >
        ➕ Add answer
    </button>

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

<style scoped lang="scss">
.answer-list {
    margin: 0;
    padding: 0;
}

.add-answer-button {
    background-color: $primary;
    color: $secondary;
    border: 1px solid rgba($secondary, 0.2);
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 10px;

    &:hover {
        background-color: darken($primary, 10%);
    }
}
</style>
