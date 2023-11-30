<script setup>
defineProps({
    optionText: {
        type: String,
        required: true
    },
})

defineEmits(['click'])
</script>

<template>
    <div class="option">
        <p>
            {{ optionText }}
        </p>

        <button
            class="button"
            @click="$emit('click')"
        >
            Clear
        </button>
    </div>
</template>

<style scoped lang="scss">
.option {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
}

.button {
    width: fit-content;
    padding: 0.5rem 1rem;
    border: 1px solid #818181;
    border-radius: 0.5rem;
    color: $primary;
    background-color: transparent;
    font-size: 1rem;
    cursor: pointer;
    text-decoration: none;

    &:hover {
        background-color: #818181;
        color: $secondary;
    }
}
</style>
