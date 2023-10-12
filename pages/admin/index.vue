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

            <div class="option-users">
                <p>
                    Edit users
                </p>

                <template class="user-card-template">
                    <li>
                        <p class="user-card-title" />

                        <a
                            href=""
                            class="user-card-button"
                        />
                    </li>
                </template>

                <ul class="user-list" />
            </div>
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

.option-users {
    text-align: center;
}

.option-users > p {
    font-size: large;
}
.user-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: 0;
    padding: 0;
    background-color: #f1f1f1;
    border-radius: 0.5rem;
    padding: 1rem 0;
    max-height: 25vh;
    overflow-y: auto;
}

.user-list li {
    list-style: none;
    display: flex;
    gap: 1rem;
    position: relative;
    width: 100%;
    justify-content: center;
}

.user-list li::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #818181;
    margin-top: 1rem;
    bottom: -0.5rem;
}

.user-list li:last-child::after {
    display: none;
}
</style>
