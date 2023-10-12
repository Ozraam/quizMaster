<script setup>
const user = useUser()
</script>

<template>
    <div class="info">
        <!-- For the moment the only information is username and the date of creation of the account -->
        <p>
            Username: <span
                id="username-info"
                class="info-span"
            >{{ user?.username }}</span>
        </p>

        <p>
            Date of creation: <span
                id="date-info"
                class="info-span"
            >{{ user?.created }}</span>
        </p>
    </div>
</template>

<style scoped>
.info-span {
    font-size: 1.2rem;
    margin-bottom: 10px;
    font-weight: 500;
}
</style>
