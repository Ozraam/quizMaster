<script setup>
const containerRef = ref(null)
const loginRef = ref(null)
const signupRef = ref(null)
const information = ref({
    error: false,
    text: '',
})

const cacheLogin = ref(false)
const cacheRef = ref(null)

function switchForm() {
    cacheLogin.value = !cacheLogin.value
    /*
    @keyframes switch {
        from {
            left: 50%;
            right: 0;
        }

        50% {
            left: 0;
            right: 0;
        }

        to {
            left: 0;
            right: 50%;
        }
    }
    */

    const keyframes = [
        { left: '50%', right: 0 },
        { left: 0, right: 0 },
        { left: 0, right: '50%' },
    ]

    if (!cacheLogin.value) {
        keyframes.reverse()
    }

    cacheRef.value.animate(keyframes, {
        duration: 1000,
        easing: 'ease-in-out',
        fill: 'forwards',
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
    <main class="center">
        <div
            ref="containerRef"
            class="container"
        >
            <login-login
                ref="loginRef"
                @login="loginDone"
                @info-message="infoMessage"
                @switch-form="switchForm"
            />

            <login-signup
                ref="signupRef"
                @signup="switchForm"
                @info-message="infoMessage"
                @switch-form="switchForm"
            />

            <div
                ref="cacheRef"
                class="cache"
                :class="{ 'cache-login': cacheLogin }"
            >
                <!--  -->
            </div>
        </div>
    </main>
</template>

<style scoped lang="scss">
.center {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
}
.container {
    max-width: 400px;
    position: relative;
    background-color: $primary;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    border: 1px solid $secondary;
    gap: 20px;
}

.cache {
    position: absolute;
    top: 0;
    left: 50%;
    right: 0;
    height: 100%;
    background: linear-gradient(to right bottom, $tertiary, $secondary);
    border: 2px $secondary solid;
    border-radius: 0 5px 5px 0;
    transition: border-radius 0.5s ease-in-out;

    &.cache-login {
        border-radius: 5px 0 0 5px;
    }
}

.error {
    color: red;
}
</style>
