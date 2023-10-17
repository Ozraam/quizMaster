<template>
    <div class="title-section">
        <h1 class="page-title">
            Welcome to Quiz Master
        </h1>

        <h2 class="slogan">
            Where you can test your knowledge of the world with us !
        </h2>

        <nuxt-link
            to="/user/login"
            class="btn"
        >
            Join us now !
        </nuxt-link>
    </div>
</template>

<style scoped lang="scss">
.title-section {
    color: $primary;
    width: 100%;
    display: flex;
    flex-direction: column;
    max-width: 700px;
}

.page-title {
    font-size: $title-size * 1.2;
}

.slogan {
    font-size: $sub-title-size;
}

.btn {
    margin-top: 20px;
    font-weight: bold;
    text-decoration: none;
    color: $primary;
    background-color: $tertiary;
    padding: 10px 23px;
    width: fit-content;
    border-radius: 50px;

    &:hover {
        filter: brightness(1.2);
    }
}
</style>
