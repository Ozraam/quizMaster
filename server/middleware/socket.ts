import { Server } from 'socket.io'
import { RealTimeGameManager } from '../utils/room/RealTimeGameManager'

let io : Server
const gameManager = RealTimeGameManager.getInstance()

export default defineEventHandler((event) => {
    if (!io) {
        io = new Server(event.node.res.socket?.server)

        io.on('connect', (socket) => {
            socket.emit('waitingConnection')

            socket.on('join', (room, token) => {
                gameManager.join(socket, room, token)
            })

            socket.on('leave', (room, token) => {
                gameManager.leave(socket, room, token, io)
            })

            socket.on('disconnecting', () => {
                socket.broadcast.emit('message', `${socket.id} left`)
                gameManager.leaveBySocket(socket, io)
            })

            socket.on('start', (room) => {
                gameManager.startGame(room, io)
            })

            socket.on('ready', (room, token) => {
                gameManager.ready(socket, room, token, io)
            })

            socket.on('answer', (room, token, answers) => {
                gameManager.setUsersAnswers(token, answers, room, io)
            })

            socket.on('getResults', (roomId) => {
                gameManager.getResults(roomId, io)
            })
        })
    }
})
