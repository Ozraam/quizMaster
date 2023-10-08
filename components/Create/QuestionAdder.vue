<script setup>
defineEmits(['click'])
</script>

<template>
    <li class="question">
        <button aria-label="Add question" class="add-question-button" @click="$emit('click')">
            +
        </button>
    </li>
</template>

<style scoped>
.question {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;

    margin-top: 10px;
    padding: 10px;
    border: 1px solid #a8a8a8;
    border-radius: 5px;
    text-decoration: none;
    color: black;
    transition: border-color 0.3s ease-in-out;
    background-color: transparent;
    min-width: 10em;
    width: 10em;
    aspect-ratio: 1/1.5;
    overflow: auto;
}

.add-question-button {
    font-size: larger;
    background-color: transparent;
    border: none;
    width: 100%;
    height: 100%;
    cursor: pointer;
}

</style>