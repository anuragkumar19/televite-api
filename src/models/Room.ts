import { model, Schema } from 'mongoose'
import { Room } from './types'

const RoomSchema = new Schema<Room>(
    {
        users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
    }
)

export default model<Room>('Room', RoomSchema)
