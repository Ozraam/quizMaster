<script setup lang="ts">
const user = useUser()
onMounted(() => {
    useFetchUser()
})
</script>

<template>
    <header>
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
                        to="/create"
                        class="nav-link"
                    >
                        Create
                    </nuxt-link>
                </li>
            </ul>
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

    a {
        color: $primary;
        text-decoration: none;
    }

    padding: 10px;
    border-radius: 15px;
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
