// router.jsx  (va directo en src/)
import { createBrowserRouter } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import FoodPage from './pages/FoodPage'
import CartPage from './pages/CartPage'
import NotFoundPage from './pages/NotFoundPage'

import DashboardPage from './pages/DashboardPage'
import OrdersPage from './pages/OrdersPage'
import AddProductPage from './pages/AddProductPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true,          element: <HomePage /> },
      { path: 'login',        element: <LoginPage /> },
      { path: 'register',     element: <RegisterPage /> },
      { path: 'products',     element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'food',         element: <FoodPage /> },
      { path: 'cart',         element: <CartPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard',    element: <DashboardPage /> },
          { path: 'orders',       element: <OrdersPage /> },
          { path: 'products/new', element: <AddProductPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
