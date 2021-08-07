import { ObjectId } from 'mongoose'

// export interface Contact {
//     name: string
//     uid: number
// }

export interface Friend {
    user: ObjectId
    room: ObjectId
}

export interface User {
    name: string
    email: string
    otp?: number
    otpExpiration?: number
    profilePicture: string
    uid: number
    // contacts: Contact[]
    sentRequests: ObjectId[]
    pendingRequests: ObjectId[]
    friends: Friend[]
    generateAccessToken: () => string
    generateRefreshToken: () => string
}

export interface Message {
    text?: string
    images: string[]
    videos: string[]
    files: string[]
}

export interface Room {
    users: ObjectId[]
    messages: Message[]
}
