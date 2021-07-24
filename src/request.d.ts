import { User } from './models/types'
import { Document } from 'mongoose'

declare global {
    namespace Express {
        interface Request {
            user: (User & Document) | null | undefined
        }
    }
}
