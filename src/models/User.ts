import jwt from 'jsonwebtoken'
import { Document, model, Schema } from 'mongoose'
import cloudinary from '../config/cloudinary'
import { DEFAULT_PROFILE_IMAGE } from '../constants'
import { genUid } from '../utils/uid'
import { User } from './types'

// const ContactSchema = new Schema(
//     {
//         name: { type: String, required: true },
//         uid: { type: Number, required: true },
//     },
//     { timestamps: true }
// )

const FriendSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
    },
})

const UserSchema = new Schema<User>(
    {
        email: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            default(this: User & Document): string {
                return this.email.split('@')[0]
            },
        },
        otp: Number,
        otpExpiration: Number,
        uid: Number,
        profilePicture: {
            type: String,
            default: DEFAULT_PROFILE_IMAGE,
            get: (v: string) =>
                v == DEFAULT_PROFILE_IMAGE
                    ? v
                    : cloudinary.utils.private_download_url(v, '', {
                          resource_type: 'image',
                      }),
        },
        // contacts: [ContactSchema],
        sentRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        pendingRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        friends: [FriendSchema],
    },
    {
        timestamps: true,
    }
)

UserSchema.pre('save', async function (next) {
    if (!this.uid) {
        this.uid = await genUid()
    }

    next()
})

UserSchema.method('generateAccessToken', function (this: User & Document) {
    return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: '5m',
    })
})

UserSchema.method('generateRefreshToken', function (this: User & Document) {
    return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_TOKEN_SECRET)
})

export default model<User>('User', UserSchema)
