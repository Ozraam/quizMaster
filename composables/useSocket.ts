import { Socket, io } from 'socket.io-client'

let socket : Socket | null = null

export function useSocket() {
    if (!socket || !socket!.active) {
        socket = io()
    }
    return socket
}
