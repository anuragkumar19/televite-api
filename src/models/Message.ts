import { Schema, model } from 'mongoose'
import { Message as MessageType } from './types'
import cloudinary from '../config/cloudinary'

const MessageSchema = new Schema<MessageType>({
    text: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
    },
    seen: {
        type: Boolean,
        default: false,
    },
    images: [
        {
            type: String,
            get: (v: string[]) =>
                v.map((img) =>
                    cloudinary.utils.private_download_url(img, '', {
                        resource_type: 'image',
                    })
                ),
        },
    ],
    videos: [
        {
            type: String,
            get: (v: string[]) =>
                v.map((video) =>
                    cloudinary.utils.private_download_url(video, '', {
                        resource_type: 'video',
                    })
                ),
        },
    ],
    files: [
        {
            type: String,
            get: (v: string[]) =>
                v.map((file) =>
                    cloudinary.utils.private_download_url(file, '', {
                        resource_type: 'raw',
                    })
                ),
        },
    ],
})

export const Message = model<MessageType>('Message', MessageSchema)
