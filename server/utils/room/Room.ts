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

    constructor(game: Game) {
        this.game = game

        this.id = Room.roomIds++
    }

    isUserInRoom(userId: number) {
        return this.users.some(user => user.id === userId)
    }

    leaveRoom(userId: number) {
        this.users = this.users.filter(user => user.id !== userId)
    }
}
