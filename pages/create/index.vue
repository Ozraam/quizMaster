<!-- TODO: Style Rework -->
<script setup lang="ts">
const quizTitle = ref('Untitled')
const quizDescription = ref('')
const questionsList: Ref<{ getQuestions: () => { text: string, answers: { text: string, isCorrect: boolean }[] }[] } | null> = ref(null)

useSeoMeta({
    title: quizTitle.value + ' | Create your quiz !',
    description: 'Create your own quiz and share it with your friends'
})

async function addQuizToDatabase() {
    const quizTitleTrim = quizTitle.value.trim()
    if (quizTitleTrim === '') {
        addNotification('error', 'Please enter a title for your quiz', true)
        return
    }

    const questions = questionsList.value!.getQuestions()
    if (questions.length === 0) {
        addNotification('error', 'Please add at least one question', true)
        return
    }

    // description of the quiz
    const description = quizDescription.value.trim()
    if (description === '') {
        addNotification('error', 'Please enter a description for your quiz', true)
        return
    }

    const data = {
        title: quizTitleTrim,
        description,
        questions
    }

    const goodQuestions = questions.map((question: { text: string, answers: { text: string, isCorrect: boolean }[] }) => {
        const questionText = question.text.trim()
        if (questionText === '') {
            addNotification('error', 'Please enter a question text to question ' + (questions.indexOf(question) + 1), true)
            return false
        }

        const answers = question.answers
        if (answers.length < 2) {
            addNotification('error', 'Please add at least two answers to question ' + (questions.indexOf(question) + 1), true)
            return false
        }

        const goodAnswers = Array.from(answers).map((answer: { text: string, isCorrect: boolean }) => {
            const answerText = answer.text.trim()
            if (answerText === '') {
                addNotification('error', 'Please enter an answer text to question ' + (questions.indexOf(question) + 1), true)
                return false
            }
            return true
        })

        return true && goodAnswers.every((answer: boolean) => answer)
    })

    if (!goodQuestions.every((question: boolean) => question)) {
        return
    }

    const res = await useFetch('/api/quiz', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (!res.error.value) {
        const quiz = res.data.value
        addNotification('success', 'Quiz created !')
        await navigateTo('/quiz/' + quiz!.quizId)
    } else {
        addNotification('error', 'An error occured', true)
    }
}
</script>

<template>
    <main>
        <h1>
            Create your quiz !
        </h1>

        <create-quiz-details
            :title="quizTitle"
            :description="quizDescription"
            @update:title="quizTitle = $event"
            @update:description="quizDescription = $event"
        />

        <section>
            <h2>
                Questions
            </h2>

            <create-questions-list ref="questionsList" />
        </section>

        <button
            class="submit-button"
            @click="addQuizToDatabase"
        >
            Submit
        </button>
    </main>
</template>

<style scoped lang="scss">
main {
    color: $primary;
}

h2 {
    margin: 0;
    margin-top: 0.1em;
    padding: 0;
}

.submit-button {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #a8a8a8;
    border-radius: 5px;
    text-decoration: none;
    color: $primary;
    transition: border-color 0.3s ease-in-out;
    background-color: transparent;
    font-size: larger;
    cursor: pointer;
}

body::-webkit-scrollbar {
    /* personalize scrollbar */
    width: 5px;
    height: 5px;
}

body::-webkit-scrollbar-track {
    /* personalize scrollbar */
    background: #f1f1f1;
    border-radius: 5px;
}

body::-webkit-scrollbar-thumb {
    /* personalize scrollbar */
    background: #888;
    border-radius: 5px;
}
</style>
