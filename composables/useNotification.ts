const notifications = ref<{title: string, text: string, id: number}[]>([])
const index = ref(0)
export function useNotifications() {
    return notifications
}

export function addNotification(title: string, text: string) {
    notifications.value.push({ title, text, id: index.value })
    index.value++
    setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== index.value)
    }, 5000)
}
