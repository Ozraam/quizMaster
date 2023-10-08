<script setup lang="ts">
const emit = defineEmits(['update:title', 'update:description'])

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

const title = ref(props.title)
const description = ref(props.description)

watch(title, (newTitle) => {
    if (newTitle.length > 30) {
        newTitle = newTitle.slice(0, 30)
        title.value = newTitle
    }
    emit('update:title', newTitle)
})

watch(description, (newDescription) => {
    emit('update:description', newDescription)
})
</script>

<template>
    <div>
        <div class="form-group">
            <label for="quiz-title">Quiz title :</label>

            <input
                id="quiz-title"
                v-model="title"
                type="text"
                name="quiz-title"
                placeholder="Untitled"
                @input="e => $emit('update:title', title)"
            >
        </div>

        <div class="form-group">
            <label for="quiz-description">Quiz description :</label>

            <textarea
                id="quiz-description"
                v-model="description"
                name="quiz-description"
                cols="30"
                rows="10"
                placeholder="Description"
            />
        </div>
    </div>
</template>

<style scoped>
h1 {
    margin-bottom: 10px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

#quiz-description {
    margin-top: 2px;
    padding: 10px;
    border: 1px solid #a8a8a8;
    border-radius: 5px;
    text-decoration: none;
    color: black;
    transition: border-color 0.3s ease-in-out;
    background-color: transparent;
    width: 100%;
    resize: vertical;
}

#quiz-title {
    margin-top: 2px;
    padding: 10px;
    border: 1px solid #a8a8a8;
    border-radius: 5px;
    text-decoration: none;
    color: black;
    transition: border-color 0.3s ease-in-out;
    background-color: transparent;
    width: 100%;
}
</style>
