export const __prod__ = process.env.NODE_ENV === 'production'
export const __test__ = process.env.NODE_ENV == 'test'
export const MONGO_URI = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}-${process.env.NODE_ENV}?retryWrites=true&w=majority`
export const PUBLIC_PROFILE_FIELDS = ['name', 'profilePicture', 'uid']
