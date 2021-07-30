import asyncHandler from 'express-async-handler'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { __prod__ } from '../constants'
import User from '../models/User'
import { sendOtp } from '../utils/email'
import { genOtp } from '../utils/otp'
import { ExpressHandler } from '../types'

export const login: ExpressHandler = asyncHandler(async (req, res) => {
    const { email } = req.body

    let user = await User.findOne({ email })

    if (!user) {
        user = await User.create({ email })
    }

    user.otp = genOtp()
    user.otpExpiration = Date.now() + 5 * 60 * 1000 // 5 min

    await sendOtp(email, user.otp)
    user = await user.save()
    res.status(200).json({ message: 'Otp send!' })
})

export const verifyOtp: ExpressHandler = asyncHandler(async (req, res) => {
    const { email, otp } = req.body

    const user = await User.findOne({ email })

    if (!user) {
        res.status(400)
        throw new Error('Account does not exist with this email.')
    }

    if (!user.otpExpiration || !user.otp) {
        res.status(400)
        throw new Error('OTP expired.')
    }

    if (user.otpExpiration <= Date.now()) {
        res.status(400)
        throw new Error('OTP expired.')
    }

    if (user.otp !== otp) {
        res.status(400)
        throw new Error('OTP does not match.')
    }

    user.otp = undefined
    user.otpExpiration = undefined

    await user.save()

    // Generate refresh token and access token
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 20, // 20 yrs 😁😜
        httpOnly: true,
        secure: __prod__,
        path: '/api/auth/refresh-token',
    })

    res.status(200).json({ data: { accessToken, refreshToken } })
})

export const refreshToken: ExpressHandler = asyncHandler(async (req, res) => {
    const refreshToken: string =
        req.cookies[process.env.REFRESH_TOKEN_COOKIE_NAME] ||
        req.body.refreshToken

    if (!refreshToken) {
        res.status(401)
        throw new Error('Unauthorized.')
    }

    try {
        const { id } = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET
        ) as JwtPayload

        const user = await User.findById(id)

        if (!user) {
            res.status(401)
            throw new Error('Unauthorized.')
        }

        const accessToken = user.generateAccessToken()

        res.status(200).json({ data: { accessToken } })
    } catch (err) {
        res.status(401)
        throw new Error('Unauthorized.')
    }
})

export const logOut: ExpressHandler = (_req, res) => {
    res.cookie(process.env.REFRESH_TOKEN_COOKIE_NAME, 'logout', {
        expires: new Date('12-12-2012'),
        httpOnly: true,
        secure: __prod__,
        path: '/api/auth/refresh-token',
    })
        .status(200)
        .json({ message: 'Logged out.' })
}
