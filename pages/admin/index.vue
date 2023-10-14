<script setup lang="ts">
const user = useUser()
const info = ref('')

if (!user.value || !user.value.isAdmin) {
    navigateTo('/')
}

async function clearUser() {
    if (!confirm('Are you sure you want to clear all users?')) {
        return
    }
    await useFetch('/api/ADMIN/clearUsers ', {
        method: 'delete',
        headers: {
            Authorization: `Bearer ${user.value.token}`
        }
    })
    info.value = 'Users cleared'
    clearInfoIn(3000)
}

async function clearQuiz() {
    if (!confirm('Are you sure you want to clear the quiz?')) {
        return
    }
    await useFetch('/api/ADMIN/clearQuiz ', {
        method: 'delete',
        headers: {
            Authorization: `Bearer ${user.value.token}`
        }
    })
    info.value = 'Quiz cleared'
    clearInfoIn(3000)
}

function clearInfoIn(ms: number) {
    setTimeout(() => {
        info.value = ''
    }, ms)
}
</script>

<template>
    <main>
        <h1>
            Administration
        </h1>

        <div>
            <h2>
                Options
            </h2>

            <p class="info">
                {{ info }}
            </p>

            <admin-option
                option-text="Clear Quiz"
                @click="clearQuiz"
            />

            <admin-option
                option-text="Clear Users"
                @click="clearUser"
            />

            <admin-users-list />
        </div>
    </main>
</template>

<style scoped>
h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}

h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

.info {
    font-size: large;
    margin-bottom: 1rem;
    color: green;
}
</style>
