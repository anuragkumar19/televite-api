import { Router } from 'express'
import { authorizeUserOnly } from '../middlewares/auth'
import authRouter from './auth'

const router = Router()

router.use('/api/auth', authRouter)

// temp test route
router.get('/private', authorizeUserOnly, (_req, res) => res.send('private'))

export default router
