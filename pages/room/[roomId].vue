<script setup lang="ts">
import { io } from 'socket.io-client'
const user = useUser()

if (!user.value) {
    navigateTo('/')
}

const roomRef : Ref<null | any> = ref(null)

const route = useRoute()

const roomId = route.params.roomId

const socket = io()

socket.on('waitingConnection', () => {
    socket.emit('join', roomId, user.value.token)
})

socket.on('joined', (room) => {
    roomRef.value = room
})

socket.on('roomUpdated', (room) => {
    roomRef.value = room
})

onBeforeUnmount(() => {
    socket.close()
})
</script>

<template>
    <main>
        <div
            v-if="roomRef"
        >
            <span
                v-for="userRoom in roomRef.users"
                :key="userRoom.id"
            >
                {{ userRoom.username }}
            </span>
        </div>
    </main>
</template>
