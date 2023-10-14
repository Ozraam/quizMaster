<script setup lang="ts">
const props = defineProps({
    user: {
        type: Object as PropType<User>,
        required: true
    }
})

const emit = defineEmits(['infoUpdated', 'infoUpdateError'])

const loggedUser = useUser()

const username = ref(props.user.username)

function updateUser() {
    const newUser = props.user
    newUser.username = username.value
    useFetch('/api/ADMIN/user', {
        method: 'PUT',
        body: newUser,
        headers: {
            Authorization: `Bearer ${loggedUser.value.token}`,
            'Content-Type': 'application/json'
        },
    }).then((res) => {
        if (!res.error.value) {
            emit('infoUpdated')
        } else {
            emit('infoUpdateError')
        }
    })
}
</script>

<template>
    <form
        class="user-form-info"
        @submit.prevent="updateUser"
    >
        <div class="user-form-inputs">
            <label for="username">Username</label>

            <input
                id="username"
                v-model="username"
                type="text"
                name="username"
            >
        </div>

        <div class="user-form-inputs">
            <label for="date">User created</label>

            <input
                id="date"
                type="date"
                name="date"
                readonly
                :value="(new Date(user?.created)).toISOString().split('T')[0]"
            >
        </div>

        <button type="submit">
            Save
        </button>
    </form>
</template>

<style scoped>
.user-form-inputs {
    display: flex;
    flex-direction: column;
}

.user-form-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
