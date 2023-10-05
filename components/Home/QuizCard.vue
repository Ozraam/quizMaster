<script setup lang="ts">
const props = defineProps({
    description: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    maxScore: {
        type: Number,
        required: true
    },
    id: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="quiz-card">
        <span>
            <div class="quiz-card-title-container">
                <h3 class="quiz-card-title">
                    {{ title }}
                </h3>

                <HomePlayerScore :score="score" :max-score="maxScore"/>
            </div>
            <p class="quiz-card-description">
                {{ description }}
            </p>
        </span>
        <span class="quiz-card-button-container">
            <a :href="'/quiz?id='+id" class="quiz-card-button">
                Start
            </a>
            <button class="quiz-card-button quiz-card-button-delete hide">
                Delete
            </button>
        </span>
    </div>
</template>

<style scoped lang="scss">
.quiz-card {
    position: relative;
    width: 100%;
    max-width: 250px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.quiz-card-title {
    margin-top: 0;
    font-size: 1.2rem;
    font-weight: 500;
}

.quiz-card-button {
    max-width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    text-decoration: none;
    color: black;
}

.quiz-card-button {
    width: 100%;
    display: flex;
    justify-content: center;
}

.quiz-card-button:hover {
    background-color: #ccc;
}

.hide {
    display: none;
}

.quiz-card-title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.quiz-card-button-delete {
    margin-top: 10px;
    background-color: #f00;
    color: #fff;
    border: 1px solid #f00;
    font-size: 1.05rem;
    font-weight: bold;
}

.quiz-card-button-delete:hover {
    background-color: #fff;
    color: #f00;
}

.quiz-card-button-delete:active {
    background-color: #f00;
    color: #fff;
}
</style>