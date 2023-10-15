import { Socket } from 'socket.io'
import { User } from '~/utils/types'

export class RealTimeUser {
    user: User
    socket: Socket

    constructor(user: User, socket: Socket) {
        user.password = ''
        this.user = user
        this.socket = socket
    }
}
