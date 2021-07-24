import { connect } from 'mongoose'
import { MONGO_URI } from '../constants'

export default async () => {
    try {
        const conn = await connect(MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        })

        console.log(
            `Database connected: ${conn.connection.host}`.blue.underline.bold
        )
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}
