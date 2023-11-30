<script setup lang="ts">
const user = useUser()
onMounted(() => {
    useFetchUser()
})

const isHidden = ref(false)
const isMenuOpen = ref(false)

onMounted(() => {
    document.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            isHidden.value = true
            isMenuOpen.value = false
        } else {
            isHidden.value = false
        }
    })
})
</script>

<template>
    <header
        :class="{
            hidden: isHidden,
            'stay-open': isMenuOpen
        }"
    >
        <nuxt-link
            class="title"
            to="/"
        >
            QUIZ MASTER
        </nuxt-link>

        <nav class="header-nav">
            <ul>
                <li>
                    <nuxt-link
                        to="/"
                        class="nav-link"
                    >
                        Home
                    </nuxt-link>
                </li>

                <li>
                    <nuxt-link
                        v-if="!user"
                        to="/user/login"
                        class="nav-link"
                    >
                        Login
                    </nuxt-link>

                    <nuxt-link
                        v-else
                        to="/user/account"
                        class="nav-link"
                    >
                        Account
                    </nuxt-link>
                </li>

                <li>
                    <nuxt-link
                        v-if="user"
                        to="/create"
                        class="nav-link"
                    >
                        Create
                    </nuxt-link>
                </li>
            </ul>

            <button
                class="open-menu"
                @click="isMenuOpen = !isMenuOpen"
            >
                open
            </button>
        </nav>
    </header>
</template>

<style scoped lang="scss">
header {
    background-color: rgba($primary, 0.4);
    color: $primary;
    position: fixed;
    top: 30px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 1000px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: $text-size;
    transition: 0.3s ease-in-out;
    transition-property: transform background-color;
    z-index: 100;

    a {
        color: $primary;
        text-decoration: none;
    }

    padding: 10px;
    border-radius: 15px;

    .open-menu {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: -20px;
        padding: 5px 10px;
        background-color: transparent;
        border: none;
        color: $primary;
        cursor: pointer;
        opacity: 0;
        transition: 0.3s ease-in-out;
        transition-property: opacity;
    }

    &.hidden {
        transform: translateY(calc(-100% - 20px)) translateX(-50%);
        background-color: $secondary;
        border: 1px solid rgba($primary, 0.5);

        &.stay-open {
            transform: translateY(-50%) translateX(-50%);
        }

        .open-menu {
            opacity: 1;
        }
    }
}

.header-nav {
    display: flex;
    justify-content: center;

    ul {
        display: flex;
        justify-content: space-between;
        list-style: none;
        padding: 0;
        margin: 0;

        li {
            margin: 0 10px;
        }
    }
}
</style>
