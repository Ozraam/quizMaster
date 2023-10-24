<script setup lang="ts">
import { Socket } from 'socket.io-client'
const user = useUser()

if (!user.value) {
    navigateTo('/')
}

const route = useRoute()

const roomId = route.params.roomId

let socket : Socket

const resultsRef = ref(null)

onMounted(() => {
    socket = useSocket()
    socket.on('sendresults', (results) => {
        console.log(results, 'results')
        resultsRef.value = results
    })
    socket.emit('getResults', roomId)
})

onBeforeUnmount(() => {
    socket.removeAllListeners()
    socket.close()
})
</script>

<template>
    <main>
        {{ resultsRef }}
        none TODO
    </main>
</template>
