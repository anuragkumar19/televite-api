import { ObjectSchema } from 'joi'
import { ExpressHandler } from '../types'

export default (Schema: ObjectSchema) =>
    ((req, res, next) => {
        const { error, value } = Schema.validate(req.body)

        if (!error) {
            req.body = value
            next()
            return
        }

        res.status(400)
        throw new Error(error.details[0].message)
    }) as ExpressHandler
