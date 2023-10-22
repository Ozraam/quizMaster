<script setup lang="ts">
import { Socket, io } from 'socket.io-client'
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
    socket = io()

    socket.emit('ready', roomId, user.value.token)

    socket.on('question', (question) => {
        currentQuestion.value = question
    })
})
</script>

<template>
    <main>
        <quiz-current-question
            v-if="currentQuestion"
            :question="currentQuestion"
            :question-index="currentQuestion.index"
            :answer-selected="answerSelected"
            @answer-selected="answerSelected = $event"
        />
    </main>
</template>
