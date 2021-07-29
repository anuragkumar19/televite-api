import { Router } from 'express'
import authRouter from './auth'
import userRouter from './user'

const router = Router()

router.use('/api/auth', authRouter)
router.use('/api/user', userRouter)

export default router
