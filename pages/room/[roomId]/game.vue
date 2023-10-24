<script setup lang="ts">
import { Socket } from 'socket.io-client'
const user = useUser()

if (!user.value) {
    navigateTo('/')
}

const route = useRoute()

const roomId = route.params.roomId

let socket : Socket

const currentQuestion : Ref<null | any> = ref(null)

const answerSelected : Ref<null | any> = ref(null)

onMounted(() => {
    socket = useSocket()

    socket.emit('ready', roomId, user.value.token)

    socket.on('question', (question) => {
        currentQuestion.value = question
        answerSelected.value = null
    })

    socket.on('requestAnswer', () => {
        socket.emit('answer', roomId, user.value.token, answerSelected.value?.id)
    })

    socket.on('gameEnded', () => {
        navigateTo(`/room/${roomId}/results`)
    })
})

onBeforeUnmount(() => {
    socket.removeAllListeners()
})
</script>

<template>
    <main>
        <section
            class="quiz-section"
            :class="{ animate: currentQuestion ? true : false }"
            :style="{ '--question-index': currentQuestion?.index.toString() }"
        >
            <quiz-current-question
                v-if="currentQuestion"
                class="quiz-current-question"
                :question="currentQuestion"
                :question-index="currentQuestion.index"
                :answer-selected="answerSelected"
                @answer-selected="answerSelected = $event"
            />
        </section>
    </main>
</template>

<style scoped lang="scss">
.quiz-section {
    --question-index: 0;
    max-width: 700px;
    margin: 3em auto;
    padding: 10px 20px;
    background-color: $primary;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    --radius: 30px;

    &::before {
        counter-reset: variable var(--question-index);
        content: counter(variable);

        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: $primary;
        width: var(--radius);
        height: var(--radius);
        text-align: center;
        line-height: var(--radius);
        border: 2px solid $secondary;
        border-radius: 50%;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -100%);
        background-color: $secondary;
        width: 2px;
        height: calc(var(--radius) / 2);
        transform-origin: bottom;
    }

    &.animate::after {
        animation: rotate 10s linear infinite;
    }
}

@keyframes rotate {
    0% {
        transform: translate(-50%, -100%) rotate(0deg);
    }
    100% {
        transform: translate(-50%, -100%) rotate(360deg);
    }
}

.quiz-current-question {
    position: relative;
    z-index: 2;
}
</style>
