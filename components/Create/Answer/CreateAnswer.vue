<script setup lang="ts">
const textRef = ref('')

const props = defineProps<{
    answer: { text: string, isCorrect: boolean, id:number };
    questionIndex: number;
}>()

const isCorrectProps = ref(props.answer.isCorrect)

const isCorrectRef = computed({
    get() {
        return props.answer.isCorrect
    },
    set(value) {
        isCorrectProps.value = value
    }
})
// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
    (event: 'update:answer', answer: {text: string, isCorrect: boolean, id:number}): void;
    (event: 'delete:answer'): void;
}>()

watch([isCorrectRef, textRef], ([newIsCorrect, text]) => {
    emit('update:answer', {
        text,
        isCorrect: newIsCorrect,
        id: props.answer.id
    })
})
</script>

<template>
    <li class="answer">
        <div class="answer-content">
            <div class="answer-correct">
                <input
                    type="radio"
                    :name="'answer-correct' + questionIndex"
                    class="answer-correct"
                    :checked="isCorrectRef"
                    @change="isCorrectRef = !isCorrectRef"
                >
            </div>

            <input
                v-model="textRef"
                type="text"
                name="answer-text"
                class="answer-text"
                placeholder="Answer text"
            >

            <button
                aria-label="Delete answer"
                class="delete-answer-button"
                @click="$emit('delete:answer')"
            >
                X
            </button>
        </div>
    </li>
</template>

<style scoped lang="scss">
.answer {
    list-style: none;
    margin: 0;
    padding: 0;

    &-text {
        margin-top: 2px;
        padding: 10px;
        border: 1px solid #a8a8a8;
        border-radius: 5px;
        text-decoration: none;
        color: $primary;
        transition: border-color 0.3s ease-in-out;
        background-color: transparent;
        width: 100%;
    }
}

.answer-content {
    display: flex;
    align-items: center;
}

.answer-correct {
    display: flex;
    align-items: center;
}

.delete-answer-button {
    background-color: transparent;
    border: 1px solid #a8a8a8;
    border-radius: 5px;
    cursor: pointer;
    transition: border-color 0.3s ease-in-out;
    aspect-ratio: 1;
}
</style>
