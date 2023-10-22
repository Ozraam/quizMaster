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

    addUser(user: User) {
        if (this.users.length === 0) {
            this.admin = user
        }
        this.users.push(user)
    }
}
