import supertest from 'supertest'
import mongoose from 'mongoose'
import app from '../index'
import User from '../models/User'
import connectDB from '../config/db'

beforeAll((done) => {
    connectDB().then(() => done())
})

afterAll((done) => {
    User.deleteMany().then(() => {
        mongoose.connection.close().then(() => done())
    })
})

// Auth routes tests
test('POST /api/auth/login - Validation test', async () => {
    await supertest(app).post('/api/auth/login').send({}).expect(400)
    await supertest(app)
        .post('/api/auth/login')
        .send({ email: 'ababa' })
        .expect(400)
})

let cred = {
    email: 'test@example.com',
    accessToken: null as any,
    refreshToken: null as any,
}

test('POST /api/auth/login', async () => {
    await supertest(app)
        .post('/api/auth/login')
        .send({ email: cred.email })
        .expect(200)

    const user = await User.findOne({ email: cred.email })

    expect(user).toBeDefined()
})

test('POST /api/auth/verify-otp', async () => {
    const user = await User.findOne({ email: cred.email })

    await supertest(app)
        .post('/api/auth/verify-otp')
        .send({ email: 'test2@example.com', otp: user!.otp! + 1 })
        .expect(400)

    await supertest(app)
        .post('/api/auth/verify-otp')
        .send({ email: cred.email, otp: user!.otp! + 1 })
        .expect(400)

    const {
        body: {
            data: { accessToken, refreshToken },
        },
    } = await supertest(app)
        .post('/api/auth/verify-otp')
        .send({ email: cred.email, otp: user!.otp })

    expect(accessToken).toBeDefined()
    expect(refreshToken).toBeDefined()

    cred = {
        ...cred,
        accessToken,
        refreshToken,
    }
})

test('POST /api/auth/refresh-token', async () => {
    await supertest(app).put('/api/auth/refresh-token').send({}).expect(401)

    await supertest(app)
        .put('/api/auth/refresh-token')
        .send({ refreshToken: 'anything' })
        .expect(401)

    await supertest(app)
        .put('/api/auth/refresh-token')
        .send({ refreshToken: cred.accessToken })
        .expect(401)

    const {
        body: {
            data: { accessToken },
        },
    } = await supertest(app)
        .put('/api/auth/refresh-token')
        .send({ refreshToken: cred.refreshToken })
        .expect(200)

    expect(accessToken).toBeDefined()
    cred.accessToken = accessToken
})

test('POST /api/user/me', async () => {
    await supertest(app).get('/api/user/me').expect(401)

    await supertest(app)
        .get('/api/user/me')
        .set('Authorization', 'bearer ' + cred.refreshToken)
        .expect(401)

    await supertest(app)
        .get('/api/user/me')
        .set('Authorization', 'bearer ' + cred.accessToken)
        .expect(200)
})
