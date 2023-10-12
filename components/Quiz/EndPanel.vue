<script setup lang="ts">
const props = defineProps({
    finalAnswers: {
        type: Object,
        required: true
    },
    quizId: {
        type: Number,
        required: true
    },
})

const score = computed(() => {
    return Object.values(props.finalAnswers).reduce((acc, answer) => {
        if (answer.answer.isCorrect) {
            return acc + 1
        }

        return acc
    }, 0)
})

function saveScore() {
    const user = useUser()
    if (!user.value) {
        return
    }
    useFetch('/api/saveScore', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + user.value.token,
        },
        body: JSON.stringify({
            quizId: props.quizId,
            score: score.value,
        }),
    })
    useFetchUser()
}

onMounted(() => {
    saveScore()
})
</script>

<template>
    <div
        id="end"
        class=""
    >
        <h3>
            Good job!
        </h3>

        <p class="end-text">
            You have completed the quiz!
        </p>

        <p class="end-text">
            Your score is <span class="score">{{ score }}</span>

            / <span class="total-score">{{ finalAnswers.length }}</span>
        </p>
    </div>

    <div class="final-answers ">
        <h3>
            Answers
        </h3>

        <ul class="final-answers-list">
            <quiz-correct-answer
                v-for="(answer, index) in finalAnswers"
                :key="index"
                :question="answer.question"
                :user-answer="answer.answer"
            />
        </ul>
    </div>

    <nuxt-link
        href="/"
        class=" backHome"
    >
        Back to home
    </nuxt-link>
</template>

<style scoped>
.backHome {
    margin-top: 20px;
    color: black;
    text-decoration: underline;
}

.backHome:hover {
    color: black;
    text-decoration: none;
}
</style>
