<script setup lang="ts">
defineProps({
    question: {
        type: Object,
        required: true
    },
    userAnswer: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <li class="final-answers-list">
        <div class="final-answer">
            <div>
                <span class="final-answer-question">
                    {{ question.question }}
                </span>
            </div>

            <div>
                Answer :
                {{ question.answers.find((answer: any) => answer.isCorrect)?.answer }}
            </div>

            <div>
                Your answer :
                <span
                    class="final-answer-user"
                    :style="{ color: userAnswer.isCorrect ? 'green' : 'red' }"
                >
                    {{ userAnswer.answer }}
                </span>
            </div>
        </div>
    </li>
</template>

<style scoped lang="scss">
.final-answers-list {
    list-style: none;
    padding: 0;
}

.final-answer-question {
    font-weight: bold;
}

.final-answer-text {
    text-decoration: underline;
}

.final-answers h3 {
    text-align: center;
}

.final-answer {
    display: grid;
    grid-template-columns: 1fr 2fr 2fr;
    max-width: 500px;
}
</style>
