<script setup lang="ts">

useSeoMeta({
  title: 'Quiz Master',
  description: 'Here you can test your knowledge of the world with us',
})

useHead({
  htmlAttrs: {
    lang: 'en'
  },
})
</script>

<template>
  <main>
    <h1 class="page-title">
      Welcome to Quiz Master
    </h1>
    <h2 class="slogan">
      Where you can test your knowledge of the world with us
    </h2>

    <HomeQuizList />
  </main>
</template>

<style scoped lang="scss">

.slogan {
    margin-top: 0;
    font-weight: 400;
    font-size: 1.3rem;
}
</style>