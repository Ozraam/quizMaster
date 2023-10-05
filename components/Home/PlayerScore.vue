<script setup lang="ts">
const props = defineProps({
    score: {
        type: Number,
        required: true
    },
    maxScore: {
        type: Number,
        required: true
    }
})
</script>

<template>
    <div class="player-score">
        {{ score }} / {{ maxScore }}
    </div>
</template>

<style scoped lang="scss">
.player-score {
    right: 10px;
    border: 1px solid #0F0;
    background-color: rgba(0, 255, 0, 0.2);
    border-radius: 10px;
    padding: 4px;
    font-size: small;
}
</style>