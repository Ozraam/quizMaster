<script setup lang="ts">
const username = ref('')
const password = ref('')

const emit = defineEmits(['signup', 'info-message', 'switch-form'])

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
                class="input-input"
                placeholder=" "
                autocomplete="off"
                required
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
                class="input-input"
                placeholder=" "
                autocomplete="off"
                required
            >
        </div>

        <div class="input-group">
            <button class="btn">
                Sign Up
            </button>
        </div>

        <div>
            <p class="small">
                Already have an account?
                <a
                    href="#"
                    class="link"
                    @click.prevent="$emit('switch-form')"
                >
                    Login
                </a>
            </p>
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
