import jwt, { JwtPayload } from 'jsonwebtoken'
import { Socket } from 'socket.io'
import { ExtendedError } from 'socket.io/dist/namespace'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import User from '../models/User'

export const authMiddleware = async (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>,
    next: (error?: ExtendedError) => void
) => {
    const { authorization } = socket.handshake.headers

    if (!authorization || typeof authorization !== 'string') {
        socket.emit('error', { message: 'Unauthorized' })
        socket.disconnect()
        return
    }

    const token = authorization.split(' ')[1]

    if (!token) {
        socket.emit('error', { message: 'Unauthorized' })
        socket.disconnect()
        return
    }

    try {
        const { id } = jwt.verify(
            token,
            process.env.JWT_ACCESS_TOKEN_SECRET
        ) as JwtPayload

        if (!id) {
            socket.emit('error', { message: 'Unauthorized' })
            socket.disconnect()
            return
        }

        const user = await User.findById(id)

        if (!user) {
            socket.emit('error', { message: 'Unauthorized' })
            socket.disconnect()
            return
        }

        socket.data.user = user
        next()
    } catch (err) {
        socket.emit('error', { message: 'Unauthorized' })
        socket.disconnect()
        return
    }
}
