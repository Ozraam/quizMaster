<script setup lang="ts">
defineProps({
    currentQuestion: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
})
</script>

<template>
    <div class="progress-bar">
        <span
            class="progress-bar-foreground"
            :style="{ width: currentQuestion/totalQuestions*100 + '%' }"
        >
            {{ currentQuestion }} / {{ totalQuestions }}
        </span>
    </div>
</template>

<style scoped lang="scss">
.progress-bar {
    width: 100%;
    height: 20px;
    background-color: white;
    border-radius: 10px;
    margin: 10px 0;
}

.progress-bar-foreground {
    display: block;
    overflow: hidden;
    width: 0%;
    height: 100%;
    background-color: #4caf50;
    border-radius: 10px;
    transition: width 0.5s ease-in-out;
    text-align: center;
}
</style>
