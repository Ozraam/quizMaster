<script setup lang="ts">
defineProps({
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
        required: false,
        default: undefined
    },
    maxScore: {
        type: Number,
        required: true
    },
    idQuiz: {
        type: Number,
        required: true
    }
})

defineEmits(['click'])
</script>

<template>
    <div class="quiz-card-container">
        <div class="quiz-card">
            <span>
                <div class="quiz-card-title-container">
                    <h3 class="quiz-card-title">
                        {{ title }}
                    </h3>

                    <home-player-score
                        v-if="score !== undefined"
                        :score="score"
                        :max-score="maxScore"
                    />
                </div>

                <p class="quiz-card-description">
                    {{ description }}
                </p>
            </span>

            <button
                class="quiz-card-button"
                @click="$emit('click')"
            >
                More
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.quiz-card {
    position: relative;
    width: 100%;
    max-width: 200px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: $secondary;

    &-description {
        margin-bottom: 5px;
    }

    &-container {
        width: 100%;
        display: flex;
        justify-content: center;
    }
}

.quiz-card-title {
    margin-top: 0;
    font-size: 1.2rem;
    font-weight: 500;
}

.quiz-card-button {
    width: 100%;
    padding: 5px;
    border: 1px solid $secondary;
    background-color: $tertiary;
    border-radius: 500px;
    cursor: pointer;
    text-decoration: none;
    color: $primary;
    text-transform: uppercase;

    &:hover {
        filter: brightness(1.2);
    }
}

.quiz-card-title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
