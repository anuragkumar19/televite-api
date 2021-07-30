import { Router } from 'express'
import { login, logOut, refreshToken, verifyOtp } from '../controllers/auth'
import { authorizeUserOnly } from '../middlewares/auth'
import validate from '../middlewares/validate'
import {
    loginSchema,
    refreshTokenSchema,
    verifyOtpSchema,
} from '../utils/ValidationSchema'

const router = Router()

router.post('/login', validate(loginSchema), login)
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp)
router.put('/refresh-token', validate(refreshTokenSchema), refreshToken)
router.post('/logout', authorizeUserOnly, logOut)

export default router
