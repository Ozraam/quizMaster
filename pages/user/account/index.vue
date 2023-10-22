<!-- TODO: Style Rework -->
<script setup>
const user = useUser()
if (!user.value) {
    navigateTo('/user/login')
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

        <nuxt-link
            to="/admin"
            class="btn btn-admin"
        >
            Admin Panel
        </nuxt-link>
    </main>
</template>

<style scoped lang="scss">
main {
    color: $primary;
}
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
    color: $primary;

    &-admin {
        color: $primary;
        text-decoration: none;
    }
}

.btn:hover {
    border-color: $primary;
    border-width: 2px;
    padding: 9px;
}
</style>
