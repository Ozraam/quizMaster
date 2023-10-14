<script setup lang="ts">
definePageMeta({
    middleware: ['admin']
})

const route = useRoute()

const userId = route.params.id as string
const loggedUser = useUser()

const user = (await useFetch('/api/ADMIN/getUser', {
    query: {
        userId
    },
    headers: {
        Authorization: `Bearer ${loggedUser.value.token}`,
    }
})).data as User

const info = ref('')

function deleteUser() {
    if (!loggedUser.value || !user || !confirm('Are you sure?')) {
        return
    }

    useFetch('/api/ADMIN/user', {
        method: 'DELETE',
        body: user,
        headers: {
            Authorization: `Bearer ${loggedUser.value.token}`,
            'Content-Type': 'application/json'
        },
    }).then((res) => {
        if (!res.error.value) {
            info.value = 'User deleted'
            navigateTo('/admin')
        } else {
            info.value = 'User delete error'
        }
    })
}
</script>

<template>
    <main>
        <div
            class="user-form"
        >
            <admin-user-info-edit
                :user="user"
                @info-updated="info = 'User info updated'"
                @info-update-error="info = 'User info update error'"
            />

            <admin-user-roles
                :user="user"
                @info-updated="info = 'User roles updated'"
                @info-update-error="info = 'User roles update error'"
            />

            <p>
                {{ info }}
            </p>

            <button
                type="button"
                class="delete"
                @click="deleteUser"
            >
                Delete
            </button>
        </div>
    </main>
</template>

<style scoped>
.user-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 40rem;
    padding: 2rem;
    border-radius: 1rem;
    background-color: #fff;
    box-shadow: 0 0 1rem rgba(0, 0, 0, 0.2);
}

.user-form-inputs {
    display: flex;
    flex-direction: column;
}
</style>
