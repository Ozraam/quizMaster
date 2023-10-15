import { Socket } from 'socket.io'
import { Room, RoomStatus } from './Room'
import { Game } from './Game'
import { User } from '~/utils/types'

export class RealTimeGameManager {
    rooms = new Map<string, Room>()
    // eslint-disable-next-line no-use-before-define
    static instance: RealTimeGameManager

    static getInstance() {
        if (!this.instance) {
            this.instance = new RealTimeGameManager()
        }

        return this.instance
    }

    // eslint-disable-next-line no-useless-constructor
    private constructor() {}

    async join(socket: Socket, roomId: string, token: string) {
        const user : User | null = await Auth.getUser(token)

        if (!user) {
            socket.emit('error', 'Unauthorized')
            return
        }

        if (!this.rooms.has(roomId)) {
            socket.emit('error', 'Room not found')
            return
        }

        const room = this.rooms.get(roomId)!

        if (room.status !== RoomStatus.Waiting) {
            socket.emit('error', 'Game already started')
            return
        }

        if (room.isUserInRoom(user.id)) {
            socket.emit('error', 'Already in room')
            return
        }

        user.password = ''
        room.users.push(user)

        socket.join(roomId)

        socket.emit('joined', room)
        socket.broadcast.emit('message', `${user.username} joined`)
        socket.broadcast.emit('roomUpdated', room)
    }

    createRoom(quizId: string) {
        const room = new Room(new Game(quizId))
        this.rooms.set(room.id.toString(), room)
        return room
    }

    async leave(socket: Socket, roomId: string, token: string) {
        const user : User | null = await Auth.getUser(token)

        if (!user) {
            socket.emit('error', 'Unauthorized')
            return
        }

        if (!this.rooms.has(roomId)) {
            socket.emit('error', 'Room not found')
            return
        }

        const room = this.rooms.get(roomId)!

        if (room.status === RoomStatus.Starting) {
            return
        }

        if (!room.isUserInRoom(user.id)) {
            socket.emit('error', 'Not in room')
            return
        }

        room.leaveRoom(user.id)

        socket.leave(roomId)

        socket.emit('left', room)
        socket.broadcast.emit('message', `${user.username} left`)
        socket.broadcast.emit('roomUpdated', room)
    }
}
