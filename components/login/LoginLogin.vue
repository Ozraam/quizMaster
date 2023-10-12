<script setup lang="ts">
const username = ref('')
const password = ref('')

const emit = defineEmits(['login', 'info-message'])

const user = useUser()

if (user.value) {
    emit('info-message', 'You are already logged in', true)
    emit('login')
}

async function login() {
    const data = { username: username.value, password: password.value }
    const response = await useFetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    // status code 401 = wrong username or password
    if (response.error.value) {
        emit('info-message', 'Wrong username or password', true)
    } else {
        setToken(response.data.value!.token)

        emit('info-message', 'Logged in successfully')
        emit('login')
    }
}
</script>

<template>
    <form
        ref="loginRef"
        action=""
        class="login-form"
        @submit.prevent="login"
    >
        <h1 class="title">
            Login
        </h1>

        <div class="input-group username input-before">
            <label
                for="username"
                class="input-label hide"
            >Username</label>

            <input
                id="username"
                v-model="username"
                type="text"
                name="username"
                class="input"
                placeholder=" "
                autocomplete="off"
                required
            >
        </div>

        <div class="input-group password input-before">
            <label
                for="password"
                class="input-label hide"
            >Password</label>

            <input
                id="password"
                v-model="password"
                type="password"
                name="password"
                class="input"
                placeholder=" "
                required
            >
        </div>

        <div class="input-group">
            <button
                class="btn"
            >
                Login
            </button>
        </div>
    </form>
</template>
