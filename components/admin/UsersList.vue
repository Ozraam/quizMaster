<script setup lang="ts">
const loggedUser = useUser()
const users = (
    await useFetch('/api/ADMIN/getUsers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loggedUser.value.token}`,
        }

    })
).data
</script>

<template>
    <div class="option-users">
        <p>
            Edit users
        </p>

        <ul class="user-list">
            <admin-user-card
                v-for="user in users"
                :key="user.id"
                :user="user"
            />
        </ul>
    </div>
</template>

<style scoped lang="scss">
.option-users {
    text-align: center;
}

.option-users > p {
    font-size: large;
}
.user-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin: 0;
    padding: 0;
    background-color: #f1f1f1;
    border-radius: 0.5rem;
    padding: 1rem 0;
    max-height: 25vh;
    overflow-y: auto;
    color: $secondary;
}
</style>
