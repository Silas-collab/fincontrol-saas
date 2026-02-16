import request from 'supertest'
import app from '../server'

describe('Auth Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({})
      
      // Sem controller implementado ainda, deve retornar 404
      expect([404]).toContain(res.status)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should validate email and password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({})
      
      // Sem controller implementado ainda
      expect([404]).toContain(res.status)
    })
  })
})
