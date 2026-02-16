import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api', (req, res) => {
  res.json({ message: 'FinControl API v1.0.0' })
})

// Só inicia servidor se não estiver em teste
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`🚀 FinControl API running on port ${PORT}`)
  })
}

export default app
