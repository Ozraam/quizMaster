<script setup>
const user = useUser()
if (!user.value) {
    navigateTo('/login')
}

function logout() {
    useResetSession()
    navigateTo('/')
}
</script>

<template>
    <main>
        <h1>
            User dashboard
        </h1>

        <h2 class="username">
            Welcome, {{ user?.username }}
        </h2>

        <account-info />

        <button
            id="logout-btn"
            class="btn"
            @click="logout"
        >
            Logout
        </button>
    </main>
</template>

<style scoped lang="scss">
.username {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
    margin-top: 10px;
}

.btn {
    margin-top: 2em;
    font-size: large;
    background-color: transparent;
    padding: 10px;
    border: 1px solid #a8a8a8;
    border-radius: 5px;
    cursor: pointer;
    transition: border-color 0.3s ease-in-out;
    width: fit-content;
}

.btn:hover {
    border-color: black;
}
</style>
