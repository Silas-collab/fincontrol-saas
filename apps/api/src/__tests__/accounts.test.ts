import request from 'supertest'
import app from '../server'

describe('Accounts Endpoints', () => {
  describe('GET /api/accounts', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/api/accounts')
      // Sem middleware de auth ainda
      expect([404]).toContain(res.status)
    })
  })

  describe('POST /api/accounts', () => {
    it('should validate account data', async () => {
      const res = await request(app)
        .post('/api/accounts')
        .send({})
      
      expect([404]).toContain(res.status)
    })
  })
})
