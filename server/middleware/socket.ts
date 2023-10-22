/* eslint-disable no-console */
import { Server } from 'socket.io'
import { RealTimeGameManager } from '../utils/room/RealTimeGameManager'

let io : Server
const gameManager = RealTimeGameManager.getInstance()

export default defineEventHandler((event) => {
    if (!io) {
        io = new Server(event.node.res.socket?.server)
        io.on('connection', (socket) => {
            console.log('Connection', socket.id)
        })

        io.on('connect', (socket) => {
            socket.emit('waitingConnection')

            socket.on('join', (room, token) => {
                gameManager.join(socket, room, token)
            })

            socket.on('leave', (room, token) => {
                gameManager.leave(socket, room, token, io)
            })

            socket.on('disconnecting', () => {
                console.log('disconnected', socket.id)
                socket.broadcast.emit('message', `${socket.id} left`)
            })
        })
    }
})
