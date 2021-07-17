import express from 'express'
import dotenv from 'dotenv'
import 'colors'
import { __prod__ } from './constants'
import morgan from 'morgan'

import connectDB from './config/db'

const main = async () => {
    // Load env vars
    dotenv.config()

    // Connect to database
    await connectDB()

    const app = express()

    !__prod__ && app.use(morgan('dev'))

    const PORT = process.env.PORT || 3005

    app.listen(PORT, () =>
        console.log(
            `Server Started in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
                .green.underline.bold
        )
    )
}

main().catch((err) => console.error(err))
