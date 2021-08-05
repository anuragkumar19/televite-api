import { Router } from 'express'
import {
    cancelOrRejectRequestOrUnfriendUser,
    getUsersPublicProfile,
    me,
    sendOrAcceptRequest,
    updateName,
    updateProfilePicture,
} from '../controllers/user'
import { authorizeUserOnly } from '../middlewares/auth'
import { upload } from '../middlewares/upload'
import validate from '../middlewares/validate'
import { requestSchema, updateNameSchema } from '../utils/ValidationSchema'

const router = Router()

router.use(authorizeUserOnly)

router.get('/me', me)
router.put('/update/name', validate(updateNameSchema), updateName)
router.put(
    '/update/profilePicture',
    upload('image', 'image', 5000000),
    updateProfilePicture
)

router.get('/profile/:uid', getUsersPublicProfile)
router.post('/request', validate(requestSchema), sendOrAcceptRequest)
router.delete(
    '/request',
    validate(requestSchema),
    cancelOrRejectRequestOrUnfriendUser
)

export default router
