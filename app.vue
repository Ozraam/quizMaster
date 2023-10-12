<script setup lang="ts">
const user = useUser()
useFetchUser()
</script>

<template>
    <div>
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
                            to="/login"
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

        <nuxt-page />
    </div>
</template>

<style scoped lang="scss">
.nav ul {
    display: flex;
    width: 100%;
    gap: 10px;
    padding: 0;
}

.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav ul li {
    list-style: none;
}

header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: absolute;
    padding: 10px 20px;
}

header .nav-link {
    text-decoration: none;
    color: black;
}

header .nav-link:hover {
    text-decoration: underline;
}

.title {
    font-size: large;
    font-weight: bold;
    margin: 10px 0;
    text-decoration: none;
    color: black;
    cursor: pointer;
}
</style>
