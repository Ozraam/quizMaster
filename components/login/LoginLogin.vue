<script setup lang="ts">
const username = ref('')
const password = ref('')

const emit = defineEmits(['login', 'info-message', 'switch-form'])

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
                class="input-input"
                placeholder="Username"
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
                class="input-input"
                placeholder="Password"
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

        <div class="small">
            Don't have an account?
            <a
                href="#"
                @click.prevent="$emit('switch-form')"
            >
                Sign up !
            </a>
        </div>
    </form>
</template>

<style scoped lang="scss">
.small {
    font-size: 0.8rem;
    margin-top: 10px;
}

.input-group {
    margin-top: 20px;

    .input-input {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid $primary;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.2s ease-in-out;
        border: 1px solid rgba($color: $secondary, $alpha: 0.4);

        &:focus {
            border-color: $secondary;
        }
    }

    .btn {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid $primary;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.2s ease-in-out;
        border: 1px solid rgba($color: $secondary, $alpha: 0.4);
        background-color: $primary;
        color: $secondary;
        cursor: pointer;

        &:hover {
            filter: brightness(1.2);
        }
    }
}
</style>
