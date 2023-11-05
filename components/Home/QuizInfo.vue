<script setup lang="ts">
const emit = defineEmits(['close', 'delete'])
const props = defineProps({
    quiz: {
        type: Object,
        required: true
    }
})

const user = useUser()

function deleteQuiz() {
    if (!user.value || (!user.value.isAdmin && user.value.id !== props.quiz.createdBy)) {
        return
    }

    useConfirm('Test', 'Are you sure you want to delete this quiz?', async () => {
        const res = await useFetch(
            '/api/quiz?id=' + props.quiz.id,
            {
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + user.value.token,
                }
            }
        )

        if (!res.error.value) {
            emit('delete')
            emit('close')
            addNotification('success', 'Quiz deleted')
        } else {
            addNotification('error', 'Failed to delete quiz', true)
        }
    })
}

async function createRoom() {
    const { error, data } = await useFetch('/api/RealTimeGame/createRoom', {
        query: { quizId: props.quiz.id },
        headers: {
            Authorization: 'Bearer ' + user.value.token,
        }
    })

    if (error.value) {
        addNotification('error', 'Failed to create room', true)
    } else {
        navigateTo('/room/' + data.value?.roomId)
    }
}
</script>

<template>
    <div
        class="blury-background"
        @click="$emit('close')"
    >
        <div
            class="quiz-info"
            @click.stop
        >
            <div class="quiz-info-container">
                <h2 class="quiz-info-title">
                    {{ quiz.title }}
                </h2>

                <p class="quiz-info-description">
                    {{ quiz.description }}
                </p>

                <nuxt-link
                    :to="'/quiz/' + quiz.id"
                    class="quiz-info-button"
                >
                    Start Quiz
                </nuxt-link>

                <button
                    v-if="user"
                    class="quiz-info-button"
                    @click="createRoom"
                >
                    Create Room
                </button>

                <button
                    v-if="user && (user.isAdmin || user.id === quiz.createdBy)"
                    class="quiz-info-button"
                    @click="deleteQuiz"
                >
                    Delete Quiz
                </button>
            </div>

            <div class="quiz-ranking">
                <!-- TODO -->
            </div>

            <button
                class="close"
                aria-label="close"
                @click="$emit('close')"
            >
                X
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.blury-background {
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

.quiz-info {
    position: relative;
    background-color: $primary;
    border: 1px solid $secondary;
    color: $secondary;
    padding: 20px;
    border-radius: 15px;

    &-title {
        font-size: $title-size;
    }

    &-description {
        font-size: $text-size;
    }

    &-button {
        display: block;
        width: fit-content;
        margin: 10px 0;
        padding: 5px 25px;
        background-color: $secondary;
        border: 2px solid $valid;
        border-radius: 500px;
        color: $valid;
        text-decoration: none;
        cursor: pointer;
        font-size: $text-size;

        &:hover {
            filter: brightness(1.2);
        }
    }
}

.close {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: transparent;
    border: 1px solid transparent;
    cursor: pointer;
    color: $secondary;
    width: 20px;
    height: 20px;

    &:hover {
        filter: brightness(1.2);
        border-color: $secondary;
        border-radius: 50%;
    }
}
</style>
