<script setup lang="ts">
const notifications = useNotifications()
const confirnation = useConfirmation()
</script>

<template>
    <section>
        <transition name="confirm">
            <notification-comfirm
                v-if="confirnation"
                :confirmation="confirnation"
                class="notification-comfirm"
            />
        </transition>

        <transition-group
            tag="ul"
            class="notifications"
            name="notifications"
        >
            <notification-block
                v-for="notification in notifications"
                :key="notification.id"
                :notification="notification"
            />
        </transition-group>
    </section>
</template>

<style lang="scss">
.notifications {
    position: absolute;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 1em;
    bottom: 0;
    right: 0;
    padding: 20px;
}

.notifications-enter-active,
.notifications-leave-active, .notifications-move {
    transition: all 0.3s ease-in-out;
}

.notifications-enter-from,
.notifications-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.notifications-leave-active {
  position: absolute;
}

.notification-comfirm {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 20px;
}

.confirm-enter-active,
.confirm-leave-active {
    transition: 0.3s ease-in-out;
    transition-property: transform, opacity;
    transform-origin: left;
}

.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
