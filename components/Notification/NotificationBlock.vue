<script setup lang="ts">
defineProps({
    notification: {
        type: Object as PropType<{ title: string, text: string, id: number }>,
        required: true
    },
    warning: {
        type: Boolean as PropType<boolean>,
        default: false
    }
})

function deleteNotification() {
    // TODO: delete notification
}
</script>

<template>
    <li
        class="notification"
        :class="{ 'notification--warning': warning }"
    >
        <div class="notification__content">
            <div class="notification__title">
                {{ notification.title }}
            </div>

            <div class="notification__text">
                {{ notification.text }}
            </div>
        </div>

        <button
            class="notification__action"
            @click="deleteNotification"
        >
            ❌
        </button>
    </li>
</template>

<style scoped lang="scss">
.notification {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 5px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    transition: .3s;
    background-color: $valid;

    &__title {
        font-weight: 700;
        margin-bottom: 5px;
    }

    &__action {
        border: none;
        background-color: transparent;
        font-size: 10px;
        cursor: pointer;
        transition: transform .3s;
        border-radius: 50%;

        &:hover {
            transform: scale(1.1) rotate(90deg);
        }
    }

    &--warning {
        background-color: $wrong;
    }
}
</style>
