import { Server, Socket } from 'socket.io'
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
            socket.emit('joined', room.getRoomWithoutGame())
            return
        }

        user.password = ''
        room.addUser(user, socket)

        socket.join(roomId)

        socket.emit('joined', room.getRoomWithoutGame())
        socket.to(roomId).emit('message', `${user.username} joined`)
        socket.to(roomId).emit('roomUpdated', room.getRoomWithoutGame())
    }

    createRoom(quizId: string) {
        const room = new Room(new Game(quizId))
        this.rooms.set(room.id.toString(), room)
        return room
    }

    async leave(socket: Socket, roomId: string, token: string, io: Server) {
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

        socket.emit('left', room.getRoomWithoutGame())
        io.to(roomId).emit('message', `${user.username} left`)
        io.to(roomId).emit('roomUpdated', room.getRoomWithoutGame())
    }

    leaveBySocket(socket: Socket, io: Server) {
        const room = this.getRoomBySocket(socket)
        if (room && room.status !== RoomStatus.Starting) {
            room.leaveRoomBySocket(socket)
            io.to(room.id.toString()).emit('message', `${socket.id} left`)
            io.to(room.id.toString()).emit('roomUpdated', room.getRoomWithoutGame())
        }
    }

    getRoomBySocket(socket: Socket) {
        return [...this.rooms.values()].find((room : Room) => {
            return room.getUserBySocket(socket) !== undefined
        })
    }

    startGame(roomId: string, io: Server) {
        const room = this.rooms.get(roomId)
        if (room) {
            room.startGame(io)
        }
    }

    async ready(socket: Socket, roomId: string, token: string, io: Server) {
        const room = this.rooms.get(roomId)

        if (!room) {
            socket.emit('error', 'Room not found')
            return
        }

        const user : User = (await Auth.getUser(token))!

        room.setReady(user)

        if (room.isEveryoneReady()) {
            room.game.sendQuestion(room, io)
        }
    }

    async setUsersAnswers(token: string, answers: number, roomId: number, io: Server) {
        const userId = (await Auth.getUser(token))!.id
        const room = this.rooms.get(roomId.toString())
        if (room) {
            room.game.setUsersAnswers(userId, room.game.currentQuestion, answers, room, io)
        }
    }

    getResults(roomId: string, io: Server) {
        const room = this.rooms.get(roomId)
        if (room) {
            room.getResults(io)
        }
    }
}
