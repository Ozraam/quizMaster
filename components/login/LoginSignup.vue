<script setup lang="ts">
const username = ref('')
const password = ref('')

const emit = defineEmits(['signup', 'info-message'])

async function signUp() {
    const data = { username: username.value, password: password.value }
    const response = await useFetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    // status code 409 = username already exists
    if (response.error.value) {
        // document.querySelector('.error').innerHTML = 'Username already exists'
        emit('info-message', 'Username already exists', true)
    } else {
        // display success message
        // document.querySelector('.error').innerHTML = 'Account created successfully'
        emit('info-message', 'Account created successfully')
        emit('signup')
    }
}
</script>

<template>
    <form
        ref="signupRef"
        action=""
        class="signup-form"
        @submit.prevent="signUp"
    >
        <h1 class="title">
            Sign Up
        </h1>

        <div class="input-group username input-before">
            <label
                for="username-sign"
                class="input-label hide"
            >Username</label>

            <input
                id="username-sign"
                v-model="username"
                type="text"
                name="username"
                class="input"
                placeholder=" "
                autocomplete="off"
            >
        </div>

        <div class="input-group password input-before">
            <label
                for="password-sign"
                class="input-label hide"
            >Password</label>

            <input
                id="password-sign"
                v-model="password"
                type="password"
                name="password"
                class="input"
                placeholder=" "
                autocomplete="off"
            >
        </div>

        <div class="input-group">
            <button class="btn">
                Sign Up
            </button>
        </div>
    </form>
</template>
