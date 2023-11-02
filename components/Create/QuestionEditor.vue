<script setup lang="ts">
const emit = defineEmits(['close', 'addAnswer', 'update:question', 'delete:answer', 'update:answer'])

const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    questionIndex: {
        type: Number,
        required: true
    },
})

const questionTitle = ref(props.question.text)

function updateQuestion() {
    const question = {
        ...props.question,
        text: questionTitle.value
    }

    emit('update:question', question, props.questionIndex)
}
</script>

<template>
    <section
        class="question-editor-wrapper"
        @click="$emit('close')"
    >
        <div
            class="question-editor"
            @click.stop
        >
            <h3 class="question-editor-title">
                Question Editor
            </h3>

            <form @submit.prevent>
                <div>
                    <label for="question-text">
                        Question text
                    </label>

                    <input
                        id="question-text"
                        v-model="questionTitle"
                        type="text"
                        @input="updateQuestion"
                    >
                </div>

                <div class="question-editor-answers">
                    <label for="question-answers">
                        Answers
                    </label>

                    <create-answer-list
                        :answers="question.answers"
                        :question-index="questionIndex"
                        @add-answer="$emit('addAnswer')"
                        @delete:answer="$emit('delete:answer', $event)"
                        @update:answer="(answer, index) => $emit('update:answer', answer, index)"
                    />
                </div>
            </form>
        </div>
    </section>
</template>

<style scoped lang="scss">
.question-editor {
    &-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(5px);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    background-color: $primary;
    color: $secondary;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid $secondary;

    &-title {
        margin-bottom: 10px;
    }

    &-answers {
        margin-top: 10px;
    }
}
</style>
