<script setup lang="ts">
const props = defineProps({
    user: {
        type: Object as PropType<User>,
        required: true
    }
})
const loggedUser = useUser()

const roles = (
    await useFetch('/api/ADMIN/getRoles', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${loggedUser.value.token}`,
        }
    }
    )
).data as Ref<{ id: number, name: string, value: number }[] | null>

const emit = defineEmits(['infoUpdated', 'infoUpdateError'])

function updateRoles() {
    if (!loggedUser.value) {
        return
    }

    const newRoles = rolesSelect.value?.map((role: HTMLInputElement) => {
        return roles.value?.find((r: any) => r.name === role.value && role.checked)
    }).reduce((acc: number, role: any) => {
        return acc | role?.value
    }, 0)

    const newUser = props.user
    newUser.role = newRoles

    useFetch('/api/ADMIN/userRole', {
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

const rolesSelect = ref([])
</script>

<template>
    <form
        class="user-form-roles"
        @submit.prevent="updateRoles"
    >
        <div class="user-form-inputs">
            <label for="role">Role</label>

            <ul id="role">
                <li
                    v-for="role in roles"
                    :key="role.id"
                    class="role"
                >
                    <input
                        :id="role.name"
                        ref="rolesSelect"
                        type="checkbox"
                        name="role"
                        :value="role.name"
                        :checked="(user.role & role.value) > 0"
                    >

                    <label :for="role.name">{{ role.name }}</label>
                </li>
            </ul>
        </div>

        <button class="save-role">
            Save role
        </button>
    </form>
</template>

<style scoped>
input[type="checkbox"] {
    margin-right: .4rem;
}

.role {
    list-style: none;
}

.user-form-roles {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}
</style>
