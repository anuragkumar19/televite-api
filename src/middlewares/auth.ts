import { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import jwt, { JwtPayload } from 'jsonwebtoken'
import User from '../models/User'

export const userMiddleware = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
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

export const authorizeUserOnly = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.user) {
        res.status(401)
        throw new Error('Unauthorized.')
    }

    next()
}
