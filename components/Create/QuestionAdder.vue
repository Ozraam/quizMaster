<script setup>
defineEmits(['click'])
</script>

<template>
    <button
        aria-label="Add question"
        class="add-question-button"
        @click="$emit('click')"
    >
        ➕ Add question
    </button>
</template>

<style scoped lang="scss">
.add-question-button {
    background-color: $primary;
    border: 1px solid $secondary;
    border-radius: 5px;
    padding: 10px;
    margin: 10px 0;
    cursor: pointer;

    &:hover {
        background-color: $secondary;
        color: $primary;
        border: 1px solid $primary;
    }

    &:focus {
        outline: none;
    }

    &:active {
        transform: scale(0.95);
    }
}
</style>
