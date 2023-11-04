const notifications = ref<{title: string, text: string, id: number, warning: boolean}[]>([])
const index = ref(0)
export function useNotifications() {
    return notifications
}

export function addNotification(title: string, text: string, warning = false) {
    notifications.value.push({ title, text, id: index.value, warning })
    const id = index.value++
    setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id)
    }, 5000)
}
