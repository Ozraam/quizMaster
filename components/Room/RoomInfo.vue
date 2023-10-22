<script setup lang="ts">
const user = useUser()
defineProps({
    room: {
        type: Object,
        required: true
    }
})

defineEmits(['start-game'])
</script>

<template>
    <div class="container">
        <h1>
            Room {{ room.id }}
        </h1>

        <button
            v-if="room.admin.id == user.id"
            @click="$emit('start-game')"
        >
            Start Game
        </button>

        <div class="players">
            <h2>
                Players
            </h2>

            <ul>
                <li
                    v-for="user in room.users"
                    :key="user.id"
                >
                    {{ user.username }}
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    background-color: $primary;
    padding: 10px;
    border-radius: 10px;
}

li {
    list-style: none;
}
</style>
