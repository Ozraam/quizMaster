const notifications = ref<{title: string, text: string, id: number, warning: boolean, close:() => void}[]>([])
const confirmation : Ref<{title: string, text: string, callback: () => void, close:() => void} | null> = ref(null)
const index = ref(0)
export function useNotifications() {
    return notifications
}

export function addNotification(title: string, text: string, warning = false) {
    const id = ++index.value
    setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== id)
    }, 5000)
    notifications.value.push({
        title,
        text,
        id: index.value,
        warning,
        close: () => {
            notifications.value = notifications.value.filter(n => n.id !== id)
        }
    })
}

export function useConfirmation() {
    return confirmation
}

export function useConfirm(title: string, text: string, callback: () => void) {
    if (confirmation.value) { return addNotification('Error', 'You already have a confirmation open', true) }
    const timeoutid = setTimeout(() => {
        confirmation.value = null
    }, 5000)
    confirmation.value = {
        title,
        text,
        callback: () => {
            clearTimeout(timeoutid)
            confirmation.value = null
            callback()
        },
        close: () => {
            clearTimeout(timeoutid)
            confirmation.value = null
        }
    }
}
