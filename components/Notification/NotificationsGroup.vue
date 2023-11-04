<script setup lang="ts">
const notifications = useNotifications()
</script>

<template>
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
</style>
