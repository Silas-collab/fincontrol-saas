import request from 'supertest'
import app from '../server'

describe('Health Check', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.timestamp).toBeDefined()
  })
})

describe('API Info', () => {
  it('should return API version', async () => {
    const res = await request(app).get('/api')
    expect(res.status).toBe(200)
    expect(res.body.message).toContain('FinControl API')
  })
})
