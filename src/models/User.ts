import jwt from 'jsonwebtoken'
import { Document, model, Schema } from 'mongoose'
import { genUid } from '../utils/uid'
import { User } from './types'

const UserSchema = new Schema<User>(
    {
        email: {
            type: String,
            required: true,
        },
        otp: Number,
        otpExpiration: Number,
        uid: Number,
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
