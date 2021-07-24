import { Server as ServerType } from 'http'
import { Server } from 'socket.io'

export default (server: ServerType) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
        },
        path: '/socket',
    })

    io.on('connection', (socket) => {
        socket.emit('msg', 'hello')
    })
}
