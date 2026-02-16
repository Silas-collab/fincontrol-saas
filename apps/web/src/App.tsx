import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Accounts from './pages/Accounts'
import Budgets from './pages/Budgets'
import Goals from './pages/Goals'
import Reports from './pages/Reports'

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="goals" element={<Goals />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App
