import supertest from 'supertest'
import app from '../index'

// Middleware tests
test('404 middleware', async () => {
    await supertest(app).get('/').expect(404)
})

test('Error handler', async () => {
    await supertest(app)
        .post('/api/auth/login')
        .send('{//}' /* Invalid JSON */)
        .expect(400)
})

test('should include CORS & credentials header', async () => {
    const { headers } = await supertest(app).get('/')

    expect(headers['access-control-allow-origin']).toBe(process.env.CORS_ORIGIN)
    expect(headers['access-control-allow-credentials']).toBe('true')
})
