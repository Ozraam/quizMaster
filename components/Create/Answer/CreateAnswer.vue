<script setup lang="ts">
const props = defineProps<{
    answer: { answer: string, isCorrect: boolean, id:number };
    questionIndex: number;
}>()

const textRef = ref(props.answer.answer)
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
    (event: 'update:answer', answer: {answer: string, isCorrect: boolean, id:number}): void;
    (event: 'delete:answer'): void;
}>()

watch(textRef, () => {
    emitUpdate()
})

function emitUpdate() {
    emit('update:answer', {
        answer: textRef.value,
        isCorrect: isCorrectProps.value,
        id: props.answer.id
    })
}
</script>

<template>
    <li class="answer">
        <div class="answer-content">
            <div class="answer-correct">
                <input
                    type="radio"
                    :name="'answer-correct' + questionIndex"
                    class="answer-correct-switch"
                    :checked="isCorrectRef"
                    @change="() => {isCorrectRef = !isCorrectRef; emitUpdate()}"
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
                ❌
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
        transition: border-color 0.3s ease-in-out;
        background-color: transparent;
        width: 100%;
    }
}

.answer-content {
    display: flex;
    align-items: center;
    gap: 10px;
}

.answer-correct {
        display: flex;
        align-items: center;
        gap: 10px;
        border: 2px solid $secondary;
        border-radius: 20px;
        overflow: hidden;

        input {
            appearance: none;
            width: 20px;
            height: 30px;
            position: relative;
            cursor: pointer;

            &::before {
                content: '';
                position: absolute;
                display: block;
                width: 5px;
                height: 20px;
                border-radius: 30px;
                background-color: $wrong;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                transition: background-color 0.2s ease-in-out;
            }

            &::after {
                content: '';
                position: absolute;
                display: block;
                width: 15px;
                height: 15px;
                border-radius: 50%;
                background-color: $secondary;
                left: 0;
                top: 15px;
                transition: top 0.2s ease-in-out;
            }

            &:checked {

                &::after {
                    top: 0;
                }

                &::before {
                    background-color: $valid;
                }
            }
        }
    }

.delete-answer-button {
    background-color: transparent;
    border: 1px solid #a8a8a8;
    border-radius: 5px;
    cursor: pointer;
    transition: border-color 0.3s ease-in-out;
    aspect-ratio: 1;

    &:hover {
        background-color: #a8a8a8;
    }
}
</style>
