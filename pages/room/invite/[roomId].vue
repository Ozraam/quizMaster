<script setup lang="ts">
const route = useRoute()

const roomId = route.params.roomId
</script>

<template>
    <main>
        <h1>Join room {{ roomId }}</h1>

        <nuxt-link :to="'/room/' + roomId">
            Join
        </nuxt-link>
    </main>
</template>

<style scoped lang="scss">
main {
    color: $primary;
}
</style>
