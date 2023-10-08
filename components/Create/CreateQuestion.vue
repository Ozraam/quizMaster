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

const questionRef = ref(props.question.text)

defineEmits(['update:question', 'update:answer', 'add-answer', 'delete:answer', 'delete:question'])
</script>

<template>
    <li class="question">
        <h3 class="question-number">
            Question 1
        </h3>

        <button class="delete-question-button" aria-label="Delete question" @click="$emit('delete:question')">
            X
        </button>

        <div class="question-content">
            <div class="question-text-container">
                <label for="question-text">Question text :</label>
                <input type="text" name="question-text" id="question-text" placeholder="Question text"
                    class="question-text" v-model="questionRef"
                    @input="e => $emit('update:question', {...question, text: questionRef})"
                    >
            </div>
        </div>
        <CreateAnswerList 
            :answers="question.answers" 
            :question-index="questionIndex"
            @update:answer="(answers, index) => $emit('update:answer', answers, index)"
            @add-answer="$emit('add-answer')"
            @delete:answer="index => $emit('delete:answer', index)"
            />
    </li>
</template>

<style scoped lang="scss">
.question {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;

    margin-top: 10px;
    padding: 10px;
    border: 1px solid #a8a8a8;
    border-radius: 5px;
    text-decoration: none;
    color: black;
    transition: border-color 0.3s ease-in-out;
    background-color: transparent;
    min-width: 10em;
    width: 10em;
    aspect-ratio: 1/1.5;
    overflow: auto;
}
.delete-question-button {
    position: absolute;
    top: 0;
    right: 0;
    margin: 5px;
    background-color: transparent;
    border: 1px solid #a8a8a8;
    border-radius: 5px;
    cursor: pointer;
    transition: border-color 0.3s ease-in-out;
    aspect-ratio: 1;
}

.delete-question-button:hover {
    border-color: black;
}

.question:hover {
    border-color: black;
}

.question label {
    font-size: small;
}

.question h3 {
    margin: 0;
    margin-top: 0.1em;
    padding: 0;
}

.question::-webkit-scrollbar {
    /* personalize scrollbar */
    width: 5px;
    height: 5px;
}

.question::-webkit-scrollbar-track {
    /* personalize scrollbar */
    background: #f1f1f1;
    border-radius: 5px;
}

.question::-webkit-scrollbar-thumb {
    /* personalize scrollbar */
    background: #888;
    border-radius: 5px;
}

.question-text {
    margin-top: 2px;
    padding: 10px;
    border: 1px solid #a8a8a8;
    border-radius: 5px;
    text-decoration: none;
    color: black;
    transition: border-color 0.3s ease-in-out;
    background-color: transparent;
    width: 100%;
}
</style>