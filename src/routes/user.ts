import { Router } from 'express'
import {
    cancelOrRejectRequestOrUnfriendUser,
    me,
    sendOrAcceptRequest,
    updateName,
} from '../controllers/user'
import { authorizeUserOnly } from '../middlewares/auth'
import validate from '../middlewares/validate'
import { requestSchema, updateNameSchema } from '../utils/ValidationSchema'

const router = Router()

router.use(authorizeUserOnly)

router.get('/me', me)
router.put('/update/name', validate(updateNameSchema), updateName)

router.post('/request', validate(requestSchema), sendOrAcceptRequest)

router.delete(
    '/request',
    validate(requestSchema),
    cancelOrRejectRequestOrUnfriendUser
)

export default router
