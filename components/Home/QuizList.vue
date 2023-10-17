<script setup lang="ts">
const { data } = useFetch('/api/getQuizzes')
const quizList = data
const user = useUser()

async function loadQuizzes() {
    const { data } = await useFetch('/api/getQuizzes')
    quizList.value = data.value
}

const quizDisplay = ref(-1)
</script>

<template>
    <div class="quiz-list-container">
        <h2 class="quiz-list-title">
            Quiz List
        </h2>

        <div class="quiz-list">
            <home-quiz-card
                v-for="(quiz, index) in quizList"
                :key="index"
                :title="quiz.title"
                :description="quiz.description"
                :id-quiz="quiz.id"
                :score="user?.scores[quiz.id]"
                :max-score="quiz.questions.length"
                @click="quizDisplay = index"
            />
        </div>

        <home-quiz-info
            v-if="quizDisplay !== -1"
            :quiz="quizList![quizDisplay]"
            @close="quizDisplay = -1"
            @delete="loadQuizzes"
        />
    </div>
</template>

<style scoped lang="scss">
.quiz-list {
    &-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 40px;
    }

    &-title {
        color: $primary;
        margin-bottom: 20px;
    }

    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}
</style>
