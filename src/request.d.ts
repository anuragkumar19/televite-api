import { AnyNaptrRecord } from 'dns'

declare global {
    namespace Express {
        interface Request {
            user: any
        }
    }
}
