import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'

// Import routes
import authRoutes from './routes/authRoutes'
import userRoutes from './routes/userRoutes'
import accountRoutes from './routes/accountRoutes'
import transactionRoutes from './routes/transactionRoutes'
import categoryRoutes from './routes/categoryRoutes'
import budgetRoutes from './routes/budgetRoutes'
import goalRoutes from './routes/goalRoutes'
import dashboardRoutes from './routes/dashboardRoutes'
import workspaceRoutes from './routes/workspaceRoutes'

dotenv.config()

const app = express()

// Security middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// RATE LIMITING REMOVIDO - Sem limitação de requisições

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// API Info
app.get('/api', (req, res) => {
  res.json({
    message: 'FinControl API v1.0.0',
    endpoints: [
      '/api/auth',
      '/api/users',
      '/api/accounts',
      '/api/transactions',
      '/api/categories',
      '/api/budgets',
      '/api/goals',
      '/api/dashboard',
      '/api/workspaces'
    ]
  })
})

// Register all routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/accounts', accountRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/goals', goalRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/workspaces', workspaceRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.path,
    method: req.method
  })
})

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  })
})

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`🚀 FinControl API running on port ${PORT}`)
  console.log(`📋 Health check: http://localhost:${PORT}/health`)
  console.log(`🔑 Auth endpoint: http://localhost:${PORT}/api/auth`)
})

export default app
