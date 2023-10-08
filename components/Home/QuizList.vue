<script setup lang="ts">
const { data } = useFetch('/api/getQuizzes')
const quizList = data;

</script>


<template>
    <p class="quiz-list-title">
      Select a quiz below to start
    </p>
    <div class="quiz-list">
        <HomeQuizCard 
            :title="quiz.title"
            :description="quiz.description"
            v-for="quiz in quizList"
            :idQuiz="quiz.id"
            :score="0" 
            :max-score="0" 
        />
    </div>
</template>

<style scoped lang="scss">
.quiz-list-title::after {
    content: "";
    position: absolute;
    left: 0;
    display: block;
    width: 100%;
    height: 1px;
    background-color: #ccc;
    margin: 20px 0;
}

.quiz-list {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    padding-top: 40px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
</style>