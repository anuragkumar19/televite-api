import { NextFunction, Request, Response } from 'express'
import { sentenceCase } from 'sentence-case'

export const notFound = (_req: Request, res: Response) => {
    res.status(404).json({ message: 'Not Found' })
}

export const errorHandler = (
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode

    if (err.statusCode) {
        statusCode = err.statusCode
    }

    statusCode === 500 && console.log(err)

    res.status(statusCode).json({
        message:
            statusCode === 500 ? 'Server Error!' : sentenceCase(err.message),
    })
}
