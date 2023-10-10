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
    answerSelected: {
        type: Object,
        required: false,
        default: null
    }
})

defineEmits(['next-question', 'previous-question'])
</script>

<template>
    <div class="controls">
        <button
            v-if="currentQuestion > 0"
            id="previous"
            class="btn"
            @click="$emit('previous-question')"
        >
            Previous
        </button>

        <button
            v-if="answerSelected"
            id="submit"
            class="btn "
            @click="$emit('next-question')"
        >
            Submit
        </button>
    </div>
</template>

<style scoped>
.btn {

padding: 10px;
border: none;
background-color: transparent;
font-size: large;
font-weight: bold;
}

.btn:hover {
cursor: pointer;
border-radius: 10px;
}

#previous {
position: relative;
}

#previous:hover::before {
left: -10px;
}

#previous:before {
content: "<";
margin-right: 10px;
position: absolute;
left: -5px;
transition: left 0.2s;
transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

#submit {
position: relative;
}

#submit:hover::after {
right: -10px;
}

#submit:after {
content: ">";
margin-left: 10px;
position: absolute;
right: -5px;
transition: right 0.2s;
transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.controls {
    display: flex;
}
</style>
