import { connect } from 'mongoose'

export default async () => {
    try {
        const conn = await connect(
            `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}-${process.env.NODE_ENV}?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            }
        )

        console.log(
            `Database connected: ${conn.connection.host}`.blue.underline.bold
        )
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}
