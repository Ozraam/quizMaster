<script setup lang="ts">
const user = useUser()
useFetchUser()
</script>

<template>
    <header>
        <nuxt-link
            class="title"
            to="/"
        >
            QUIZ MASTER
        </nuxt-link>

        <nav class="nav">
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
    background-color: $primary;
}
</style>
