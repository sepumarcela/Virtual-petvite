         // router.jsx  (va directo en src/)
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'

// Layout y páginas existentes de la tienda
import RootLayout       from './components/layout/RootLayout'
import ProtectedRoute   from './components/layout/ProtectedRoute'

import HomePage         from './pages/HomePage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import ProductsPage     from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import FoodPage         from './pages/FoodPage'
import CartPage         from './pages/CartPage'
import NotFoundPage     from './pages/NotFoundPage'
import DashboardPage    from './pages/DashboardPage'
import OrdersPage       from './pages/OrdersPage'
import AddProductPage   from './pages/AddProductPage'

// ── ADMIN (nuevos) ────────────────────────────────────────
import AdminLayout      from './components/layout/AdminLayout'
import AdminLoginPage   from './pages/admin/AdminLoginPage'
import AdminDashboard   from './pages/admin/AdminDashboard'
import AdminProductos   from './pages/admin/AdminProductos'
import AdminPedidos     from './pages/admin/AdminPedidos'
import AdminClientes    from './pages/admin/AdminClientes'
import AdminImportar    from './pages/admin/AdminImportar'
import { useAdminAuth } from './context/AdminAuthContext'

// Guard que protege las rutas /admin/*
function AdminGuard() {
  const { isAdminAuthenticated, loading } = useAdminAuth()
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#2A8B8B', fontSize:18 }}>
      Cargando…
    </div>
  )
  if (!isAdminAuthenticated) return <Navigate to="/admin/login" replace />
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}

export const router = createBrowserRouter([

  // ── TIENDA CLIENTE (rutas que ya tenías) ─────────────────
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,           element: <HomePage /> },
      { path: 'login',         element: <LoginPage /> },
      { path: 'register',      element: <RegisterPage /> },
      { path: 'products',      element: <ProductsPage /> },
      { path: 'products/:id',  element: <ProductDetailPage /> },
      { path: 'food',          element: <FoodPage /> },
      { path: 'cart',          element: <CartPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard',     element: <DashboardPage /> },
          { path: 'orders',        element: <OrdersPage /> },
          { path: 'products/new',  element: <AddProductPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // ── PANEL ADMIN (rutas nuevas) ────────────────────────────
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <AdminGuard />,
    children: [
      { index: true,          element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard',    element: <AdminDashboard /> },
      { path: 'productos',    element: <AdminProductos /> },
      { path: 'pedidos',      element: <AdminPedidos /> },
      { path: 'clientes',     element: <AdminClientes /> },
      { path: 'importar',     element: <AdminImportar /> },
    ],
  },

])
