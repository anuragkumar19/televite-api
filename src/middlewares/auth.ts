import asyncHandler from 'express-async-handler'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/User'
import { ExpressHandler } from '../types'

export const userMiddleware: ExpressHandler = asyncHandler(
    async (req, _res, next) => {
        const Authorization = req.header('Authorization')

        if (Authorization && typeof Authorization === 'string') {
            try {
                const accessToken = Authorization.split(' ')[1]

                if (accessToken) {
                    const { id } = jwt.verify(
                        accessToken,
                        process.env.JWT_ACCESS_TOKEN_SECRET
                    ) as JwtPayload

                    if (id) {
                        req.user = await User.findById(id)
                    }
                }
            } catch (err) {
                //...
            }
        }

        next()
    }
)

export const authorizeUserOnly: ExpressHandler = (req, res, next) => {
    if (!req.user) {
        res.status(401)
        throw new Error('Unauthorized.')
    }

    next()
}
