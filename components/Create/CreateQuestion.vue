<script setup lang="ts">
defineProps({
    question: {
        type: Object,
        required: true
    },
    questionIndex: {
        type: Number,
        required: true
    },
})

defineEmits(['delete:question', 'edit:question'])
</script>

<template>
    <li
        class="question"
        @click="$emit('edit:question')"
    >
        <h3 class="question-number">
            Question {{ questionIndex + 1 }}
        </h3>

        <div class="question-container">
            <p class="question-text-container">
                {{ question.text }}
            </p>

            <button
                class="question-delete"
                aria-label="Delete question"
                @click="$emit('delete:question')"
            >
                ❌
            </button>
        </div>
    </li>
</template>

<style scoped lang="scss">
.question {
    background-color: $primary;
    list-style: none;
    color: $secondary;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    max-width: 30vw;

    &-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        max-width: 100%;
    }

    &-text-container {
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &:hover {
        transform: scale(1.05);
    }

    &-delete {
        cursor: pointer;
    }
}
</style>
