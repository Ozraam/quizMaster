<script setup lang="ts">
useSeoMeta({
    title: 'Quiz Master',
    description: 'Here you can test your knowledge of the world with us'
})

useHead({
    htmlAttrs: {
        lang: 'en'
    }
})
</script>

<template>
    <main>
        <home-title />

        <home-quiz-list />
    </main>
</template>

<style scoped lang="scss">
.slogan {
    margin-top: 0;
    font-weight: 400;
    font-size: 1.3rem;
}
</style>
