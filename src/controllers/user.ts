import asyncHandler from 'express-async-handler'
import { PUBLIC_PROFILE_FIELDS } from '../constants'
import Room from '../models/Room'
import User from '../models/User'
import { ExpressHandler } from '../types'

export const me: ExpressHandler = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user!._id)
        .populate('friends.user', PUBLIC_PROFILE_FIELDS.join(' '))
        .populate('pendingRequests', PUBLIC_PROFILE_FIELDS.join(' '))
        .populate('sentRequests', PUBLIC_PROFILE_FIELDS.join(' '))

    res.status(200).json(user)
})

export const getUsersPublicProfile: ExpressHandler = asyncHandler(
    async (req, res) => {
        const user = await User.findOne({
            uid: req.params.uid as any as number,
        }).select(PUBLIC_PROFILE_FIELDS.join(' '))

        if (!user) {
            res.status(404)
            throw new Error('Not found')
        }

        res.status(200).json(user)
    }
)

export const updateName: ExpressHandler = asyncHandler(async (req, res) => {
    req.user!.name = req.body.name as string
    await req.user!.save()
    res.status(200).json({ message: 'Updated' })
})

export const sendOrAcceptRequest: ExpressHandler = asyncHandler(
    async (req, res) => {
        const { uid } = req.body

        if (req.user!.uid === uid) {
            res.status(400)
            throw new Error('Cannot send request to yourself')
        }

        const user = await User.findOne({ uid })

        if (!user) {
            res.status(400)
            throw new Error('User not found')
        }

        // If friend -> CLIENT_ERROR
        if (
            req.user!.friends.findIndex((friend) =>
                user._id.equals(friend.user)
            ) !== -1
        ) {
            res.status(400)
            throw new Error('Alrerady Friend')
        }

        // If already send -> CLIENT_ERROR
        if (
            req.user!.sentRequests.findIndex((id) => user._id.equals(id)) !== -1
        ) {
            res.status(400)
            throw new Error('Alrerady sent request')
        }

        // If request pending -> ACCEPT_REQUEST & CREATE_ROOM & GIVE_ACCESS_TO_BOTH_IN_ROOM
        const pendingIndex = req.user!.pendingRequests.findIndex((id) =>
            user._id.equals(id)
        )

        if (pendingIndex !== -1) {
            // Remove from sent and pending request
            req.user!.pendingRequests.splice(pendingIndex, 1)

            const sentIndex = user.sentRequests.findIndex((id) =>
                req.user!._id.equals(id)
            )
            user.sentRequests.splice(sentIndex, 1)

            // Create a room for users
            const room = await Room.create({
                users: [user._id, req.user!._id],
            })

            // Add room and user's id to both users's friends[]
            user.friends.push({
                room: room._id,
                user: req.user!._id,
            })

            req.user!.friends.push({
                room: room._id,
                user: user._id,
            })

            await user.save()
            await req.user!.save()

            res.status(200).json({ room, message: 'Request Accepted' })
            return
        }

        // If not pending, not send and not friend -> SEND_REQUEST
        user.pendingRequests.push(req.user!._id)
        req.user?.sentRequests.push(user._id)

        await user.save()
        await req.user!.save()

        res.status(200).json({ message: 'Request sent.' })
    }
)

export const cancelOrRejectRequestOrUnfriendUser: ExpressHandler = asyncHandler(
    async (req, res) => {
        const { uid } = req.body

        if (req.user!.uid === uid) {
            res.status(400)
            throw new Error('Cannot send request to yourself')
        }

        const user = await User.findOne({ uid })

        if (!user) {
            res.status(400)
            throw new Error('User not found')
        }

        // If friend -> UNFRIEND_USER & DELETE_RELATED_DATA
        const friendIndexOfCurrUser = req.user!.friends.findIndex((friend) =>
            user._id.equals(friend.user)
        )

        if (friendIndexOfCurrUser !== -1) {
            const roomId = req.user!.friends[friendIndexOfCurrUser].room

            req.user!.friends.splice(friendIndexOfCurrUser, 1)

            const friendIndexOfUser = user.friends.findIndex((friend) =>
                req.user!._id.equals(friend.user)
            )

            user.friends.splice(friendIndexOfUser, 1)

            await user.save()
            await req.user!.save()

            await Room.findByIdAndDelete(roomId)

            res.status(200).json({ message: 'User removed from friend' })
            return
        }

        // If send -> CANCEL_REQUEST
        const sentIndex = req.user!.sentRequests.findIndex((id) =>
            user._id.equals(id)
        )

        if (sentIndex !== -1) {
            req.user!.sentRequests.splice(sentIndex, 1)

            const pendingIndex = user.pendingRequests.findIndex((id) =>
                req.user!._id.equals(id)
            )

            user.pendingRequests.splice(pendingIndex, 1)

            await user.save()
            await req.user!.save()

            res.status(200).json({ message: 'Friend request cancled' })
            return
        }

        // If request pending -> REJECT_REQUEST
        const pendingIndex = req.user!.pendingRequests.findIndex((id) =>
            user._id.equals(id)
        )

        if (pendingIndex !== -1) {
            req.user!.pendingRequests.splice(pendingIndex, 1)

            const currSentIndex = user.sentRequests.findIndex((id) =>
                req.user!._id.equals(id)
            )
            user.sentRequests.splice(currSentIndex, 1)

            await user.save()
            await req.user!.save()

            res.status(200).json({ message: 'Friend request rejected' })
            return
        }

        res.status(400).json({ message: 'Can not perform this action' })
    }
)

export const updateProfilePicture: ExpressHandler = asyncHandler(
    async (req, res) => {
        req.user!.profilePicture = req.file!.filename
        const user = await req.user!.save()

        res.status(200).json({ data: user.profilePicture })
    }
)
