<script setup lang="ts">
useSeoMeta({
    title: 'Quiz Master',
    description: 'Here you can test your knowledge of the world with us',
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
