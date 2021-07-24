import User from '../models/User'

export const genUid = async (): Promise<number> => {
    const uid =
        Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000

    const user = await User.findOne({ uid })

    if (user) {
        return await genUid()
    }

    return uid
}
