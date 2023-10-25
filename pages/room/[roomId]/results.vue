<script setup lang="ts">
import { Socket } from 'socket.io-client'
const user = useUser()

if (!user.value) {
    navigateTo('/')
}

const route = useRoute()

const roomId = route.params.roomId

let socket : Socket

const resultsRef : Ref<{results: any, quizLength: number} | null> = ref(null)

onMounted(() => {
    socket = useSocket()
    socket.on('sendresults', (results) => {
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
        <section class="results-container">
            <h2>Results</h2>

            <div
                v-if="resultsRef"
                class="results"
            >
                <div
                    v-for="([name, result], index) in resultsRef.results"
                    :key="name"
                    class="result"
                >
                    <p>{{ index + 1 }}.</p>

                    <p>{{ name }}</p>

                    <p>{{ result }} / {{ resultsRef.quizLength }}</p>
                </div>
            </div>

            <div v-else>
                <p>Loading..</p>
            </div>

            <a href="/">
                Back to home
            </a>
        </section>
    </main>
</template>

<style scoped lang="scss">
.results {
    &-container {
        background-color: $primary;
        padding: 1rem;
        border-radius: 1rem;
    }
}

.result {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .5rem 1rem;
    background-color: $secondary;
    border-radius: 1rem;
    margin-bottom: 1rem;
    color: $primary;
    border: 2px solid $wrong;
}
</style>
