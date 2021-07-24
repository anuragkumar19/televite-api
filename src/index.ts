import 'dotenv-safe/config'
import 'colors'
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import morgan from 'morgan'
import connectDB from './config/db'
import { __prod__, __test__ } from './constants'
import { errorHandler, notFound } from './middlewares/error'
import router from './routes'
import socketio from './socketio'
import cookieParser from 'cookie-parser'
import { userMiddleware } from './middlewares/auth'

// Connect to database
!__test__ && connectDB()

const app = express()

const server = createServer(app)

// Socketio server
socketio(server)

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
)
app.use(express.json())
app.use(cookieParser())
app.use(userMiddleware)

!__prod__ && app.use(morgan('dev'))

// Routes
app.use(router)

// Handle 404
app.use(notFound)

// Handle Errors
app.use(errorHandler)

const PORT = process.env.PORT || 3005

!__test__ &&
    server.listen(PORT, () =>
        console.log(
            `Server Started in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`
                .green.underline.bold
        )
    )

export default app
