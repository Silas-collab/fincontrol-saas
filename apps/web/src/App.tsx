import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { PrivateRoute } from './components/PrivateRoute';

// Componente que envolve páginas privadas com Layout + PrivateRoute
function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <Layout>{children}</Layout>
    </PrivateRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Rotas privadas com Layout (Sidebar) */}
          <Route path="/dashboard" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
          <Route path="/accounts" element={<PrivateLayout><Accounts /></PrivateLayout>} />
          <Route path="/transactions" element={<PrivateLayout><Transactions /></PrivateLayout>} />
          <Route path="/categories" element={<PrivateLayout><Categories /></PrivateLayout>} />
          <Route path="/budgets" element={<PrivateLayout><Budgets /></PrivateLayout>} />
          <Route path="/goals" element={<PrivateLayout><Goals /></PrivateLayout>} />
          <Route path="/reports" element={<PrivateLayout><Reports /></PrivateLayout>} />
          <Route path="/settings" element={<PrivateLayout><Settings /></PrivateLayout>} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
