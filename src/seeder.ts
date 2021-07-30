import 'dotenv-safe/config'
import 'colors'
import connectDB from './config/db'
import jwt from 'jsonwebtoken'
import users from './fake_data/users.json'
import User from './models/User'
import fs from 'fs'
import path from 'path'
import { __prod__ } from './constants'

const main = async () => {
    if (__prod__) {
        throw new Error('Cannot run seeder in production'.red)
    }

    // Connect to database
    await connectDB()

    console.log('Deleting data...'.bgRed)

    await User.deleteMany()

    console.log('Data Deleted.'.bgRed)
    console.log('Inserting Data'.bgGreen)

    const DBusers = await User.insertMany(users)

    console.log('Data inserted.'.bgGreen)

    const jwts = DBusers.map((user) => {
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            uid: user.uid,
            accessToken: jwt.sign(
                { id: user._id },
                process.env.JWT_ACCESS_TOKEN_SECRET
            ),
        }
    })

    fs.writeFileSync(
        path.join(__dirname, '..', 'http', 'tokens.txt'),
        JSON.stringify(jwts, undefined, 4),
        {
            encoding: 'utf-8',
        }
    )

    console.log('JWT generated at http/tokens.txt.'.bgBlue)
}

main()
    .catch((err) => console.log(err))
    .finally(() => process.exit())
