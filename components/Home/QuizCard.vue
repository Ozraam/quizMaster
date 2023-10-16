<script setup lang="ts">
const user = useUser()

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

async function deleteQuiz() {
    if (!user.value || !user.value.isAdmin || !confirm('Are you sure you want to delete this quiz?')) {
        return
    }

    const res = await useFetch(
        '/api/ADMIN/deleteQuiz?id=' + props.idQuiz,
        {
            headers: {
                Authorization: 'Bearer ' + user.value.token,
            }
        }
    )

    if (!res.error.value) {
        window.location.reload()
    } else {
        alert('Failed to delete quiz')
    }
}

async function createRoom() {
    const { error, data } = await useFetch('/api/RealTimeGame/createRoom', {
        query: { quizId: props.idQuiz },
        headers: {
            Authorization: 'Bearer ' + user.value.token,
        }
    })

    if (error.value) {
        alert('Failed to create room')
    } else {
        navigateTo('/room/' + data.value?.roomId)
    }
}
</script>

<template>
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

        <span class="quiz-card-button-container">
            <button
                class="quiz-card-button"
            >
                More
            </button>
        </span>
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
