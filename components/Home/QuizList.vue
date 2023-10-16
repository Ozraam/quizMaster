<script setup lang="ts">
const { data } = useFetch('/api/getQuizzes')
const quizList = data
const user = useUser()
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
            />
        </div>
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

    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap:10px
}
</style>
