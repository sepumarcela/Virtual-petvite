import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider }      from './context/AuthContext'
import { CartProvider }      from './context/CartContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { router } from './router'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminAuthProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </AdminAuthProvider>
  </React.StrictMode>
)