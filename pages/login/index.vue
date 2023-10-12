<script setup>
const containerRef = ref(null)
const loginRef = ref(null)
const signupRef = ref(null)
const information = ref({
    error: false,
    text: '',
})

function switchForm() {
    containerRef.value.animate([
        { filter: 'blur(0px)' },
        { filter: 'blur(15px)' },
    ], {
        duration: 250,
        forwards: true,
    }).addEventListener('finish', () => {
        loginRef.value.$el.classList.toggle('hide')
        signupRef.value.$el.classList.toggle('hide')
        containerRef.value.animate([
            { filter: 'blur(15px)' },
            { filter: 'blur(0px)' },
        ],
        {
            duration: 250,
            forwards: true,
        })
    })
}

function loginDone() {
    navigateTo('/')
}

function infoMessage(text, error = false) {
    information.value = { text, error }
}
</script>

<template>
    <main>
        <div
            ref="containerRef"
            class="container"
        >
            <login-login
                ref="loginRef"
                @login="loginDone"
                @info-message="infoMessage"
            />

            <login-signup
                ref="signupRef"
                class="hide"
                @signup="switchForm"
                @info-message="infoMessage"
            />

            <div class="switch">
                <span class="switch-text">Don't have an account?</span>

                <button
                    class="switch-btn"
                    @click="switchForm"
                >
                    Sign Up
                </button>

                <span class="switch-text hide">Already have an account?</span>

                <button class="switch-btn hide">
                    Login
                </button>
            </div>

            <p :class="{ error: information.error }">
                {{ information.text }}
            </p>
        </div>
    </main>
</template>

<style scoped lang="scss">
.input-group {
    display: flex;
    flex-direction: column;
}

.container {
    max-width: 400px;
    position: relative;
}

.input {
    background-color: transparent;
    border: none;
    border-bottom: 1px solid black;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
}

.input:focus {
    outline: none;
}

.input-before {
    position: relative;
}

.input-before::before {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.2s ease-in-out;
    pointer-events: none;
}

.input-before:focus-within::before {
    top: 0;
    transform: translateY(0);
}
/* TODO : :has variant for firefox */
.input-before:has(> .input:not(:placeholder-shown)):before {
    top: 0;
    transform: translateY(0);
}

.username::before {
    content: "Username";
}

.password::before {
    content: "Password";
}

.hide {
    display: none;
}

.btn {
    background-color: transparent;
    border: 1px solid black;
    color: black;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
    cursor: pointer;
    font-size: 16px;
    border-radius: 5px;
    transition: all 0.1s ease-in-out;
}

.btn:hover {
    background-color: black;
    color: white;
    font-weight: bold;
}

.switch-btn {
    background-color: transparent;
    text-decoration: underline;
    border: none;
    cursor: pointer;
}

.switch-btn:hover {
    text-decoration: blue underline;
    color: blue;
}

.error {
    color: red;
}
</style>
