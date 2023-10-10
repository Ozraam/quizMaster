<script setup lang="ts">
defineProps({
    answer: {
        type: Object,
        required: true
    },
    isSelected: {
        type: Boolean,
        required: false,
        default: false
    }
})

defineEmits<{(event: 'select-answer', answer: Answer): void}>()
</script>

<template>
    <li>
        <div class="answer">
            <input
                :id="'answer' + answer.id"
                type="radio"
                name="question-answer"
                class="answer-radio hidden"
                :checked="isSelected"
                @click="$emit('select-answer', answer)"
            >

            <label
                class="answer-text"
                :for="'answer' + answer.id"
            >
                {{ answer.answer }}
            </label>
        </div>
    </li>
</template>

<style scoped lang="scss">
li {
    list-style: none;
    margin: 10px 0;
    cursor: pointer;
}

.answer {
    width: 100%;
    padding: 10px;
    border: none;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: large;

    &-text {
        padding: 10px;
    }
}

.answer:hover {
    cursor: pointer;
}

.answer-text {
    position: relative;
    cursor: pointer;
}

.answer-text::after {
    content: '';
    position: absolute;
    border-bottom: 2px solid black;
    width: 0;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    transition: width 0.2s ease-in-out;
}

.answer:hover .answer-text::after, .answer.active .answer-text::after, .answer-radio:checked + .answer-text::after {
    width: 100%;
}
</style>
