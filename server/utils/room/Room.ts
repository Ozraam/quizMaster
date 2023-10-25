import { Server, Socket } from 'socket.io'
import { Game } from './Game'
import { User } from '~/utils/types'

export enum RoomStatus {
    Waiting = 'waiting',
    Starting = 'starting',
    WaitingForPlayers = 'waitingForPlayers',
    Started = 'started',
    Ended = 'ended',
}

export class Room {
    static roomIds = 0
    users : User[] = []
    game: Game
    status: RoomStatus = RoomStatus.Waiting
    id: number
    admin: User | null = null
    usersSocket: Map<User, Socket> = new Map()
    usersReady: Map<number, boolean> = new Map()

    constructor(game: Game) {
        this.game = game

        this.id = Room.roomIds++
    }

    isUserInRoom(userId: number) {
        return this.users.some(user => user.id === userId)
    }

    leaveRoom(userId: number) {
        this.users = this.users.filter(user => user.id !== userId)
        if (this.admin?.id === userId) {
            this.admin = this.users[0] || null
        }
    }

    leaveRoomBySocket(socket: Socket) {
        const user = this.getUserBySocket(socket)
        if (user) {
            this.leaveRoom(user.id)
        }
    }

    getUserBySocket(socket: Socket) {
        return this.users.find(user => this.usersSocket.get(user) === socket)
    }

    addUser(user: User, socket: Socket) {
        if (this.users.length === 0) {
            this.admin = user
        }
        this.users.push(user)
        this.usersSocket.set(user, socket)
    }

    getRoomWithoutGame() {
        return {
            id: this.id,
            status: this.status,
            admin: this.admin,
            users: this.users,
        }
    }

    startGame(io: Server) {
        this.status = RoomStatus.Starting
        io.to(this.id.toString()).emit('gameStarted', this.id)
        this.usersReady = new Map(this.users.map(user => [user.id, false]))
    }

    isEveryoneReady() {
        return [...this.usersReady.values()].every(ready => ready)
    }

    setReady(user: User) {
        this.usersReady.set(user.id, true)
    }

    getResults(io: Server) {
        const result = this.game.getResults()

        let object = {}

        result.forEach((value, key) => {
            const user = this.users.find(user => user.id === key)
            if (user) {
                object = {
                    ...object,
                    [user.username]: value,
                }
            }
        })

        const sorted = Object.entries(object).sort((a :any, b:any) => b[1] - a[1])

        const message = {
            results: sorted,
            quizLength: this.game.quiz.questions.length,
        }

        io.to(this.id.toString()).emit('sendresults', message)
    }
}
