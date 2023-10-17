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

function focusAnswer() {
    answerRef.value?.click()
}

const answerRef : Ref<null | HTMLInputElement> = ref(null)

defineEmits<{(event: 'select-answer', answer: Answer): void}>()
</script>

<template>
    <li>
        <button
            class="answer"
            @click="focusAnswer"
        >
            <input
                :id="'answer' + answer.id"
                ref="answerRef"
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
        </button>
    </li>
</template>

<style scoped lang="scss">
li {
    list-style: none;
    margin: 0;
    cursor: pointer;
    width: 100%;
}

.answer {
    width: 100%;
    text-align: center;
    padding: 10px;
    background-color: $secondary;
    color: $primary;
    border-radius: 1000px;
    cursor: pointer;
    border: 2px solid $tertiary;
    transition: all 0.2s ease-in-out;

    &:hover {
        filter: brightness(1.5);
    }

    &-text {
        width: 100%;
        height: 100%;
    }

    &-text {
        cursor: pointer;
    }

    &:has(input:checked) {
        background-color: $tertiary;
        border-color: $secondary;
    }
}
</style>
