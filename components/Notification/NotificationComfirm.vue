<script setup lang="ts">
defineProps({
    confirmation: {
        type: Object as PropType<{ title: string, text: string, callback: () => void, close:() => void }>,
        required: true
    }
})
</script>

<template>
    <div class="notification-confirm">
        <div class="notification-confirm__content">
            <div class="notification-confirm__title">
                {{ confirmation.title }}
            </div>

            <div class="notification-confirm__text">
                {{ confirmation.text }}
            </div>
        </div>

        <div class="notification-confirm__actions">
            <button
                class="notification-confirm__action"
                @click="confirmation.callback"
            >
                Yes
            </button>

            <button
                class="notification-confirm__action"
                @click="confirmation.close"
            >
                No
            </button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.notification-confirm {
    padding: 5px;
    border-radius: 10px;
    transition: .3s;
    background-color: $valid;
    overflow: hidden;

    &__title {
        font-weight: 700;
        margin-bottom: 5px;
    }

    &__action {
        cursor: pointer;
        padding: 3px;
        border-radius: 3px;
        border: 1px solid $secondary;

        &:hover {
            background-color: $secondary;
            color: $primary;
        }
    }

    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 5px;
        background-color: $secondary;
        animation: notification-confirm__action 5s forwards linear;
    }

    &__actions {
        display: flex;
        gap: 5px;
    }
}

@keyframes notification-confirm__action {
    from {
        width: 100%;
    }

    to {
        width: 0;
    }
}
</style>
