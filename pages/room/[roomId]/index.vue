<script setup lang="ts">
const user = useUser()

if (!user.value) {
    navigateTo('/')
}

const roomRef : Ref<null | any> = ref(null)

const route = useRoute()

const roomId = route.params.roomId

const socket = useSocket()

socket.on('waitingConnection', () => {
    socket.emit('join', roomId, user.value.token)
})

socket.on('joined', (room) => {
    roomRef.value = room
})

socket.on('roomUpdated', (room) => {
    roomRef.value = room
})

socket.on('gameStarted', () => {
    navigateTo(`/room/${roomId}/game`)
})

onBeforeUnmount(() => {
    socket.removeAllListeners()
})

function startGame() {
    socket.emit('start', roomId)
}
</script>

<template>
    <main>
        <div
            v-if="roomRef"
        >
            <room-info
                :room="roomRef"
                @start-game="startGame"
            />
        </div>
    </main>
</template>
