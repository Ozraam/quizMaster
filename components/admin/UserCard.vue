<script setup lang="ts">
defineProps<{
    user: User
}>()
</script>

<template>
    <li class="user-card">
        <p class="user-card-title">
            {{ user.username }}
        </p>

        <nuxt-link
            :to="'/admin/user/' + user.id"
            class="user-card-button"
        >
            Edit
        </nuxt-link>
    </li>
</template>

<style scoped lang="scss">
.user-card {
    list-style: none;
    display: flex;
    gap: 1rem;
    position: relative;
    width: 100%;
    justify-content: space-between;

    &-title {
        padding-left: 1rem;
    }

    &-button {
        padding: 0 1rem;
        background-color: #f1f1f1;
        border-radius: 0.5rem;
        color: #000;
        text-decoration: none;

        &:hover {
            background-color: #e1e1e1;
        }
    }

    &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 1px;
        background-color: #818181;
        margin-top: 1rem;
        bottom: -0.5rem;
    }

    &:last-child::after {
        display: none;
    }
}
</style>
