import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)
const CART_KEY = 'petshop_cart'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? JSON.parse(stored) : []
  })

  const persist = (newItems) => {
    setItems(newItems)
    localStorage.setItem(CART_KEY, JSON.stringify(newItems))
  }

  const addItem = (product, quantity = 1) => {
    const exists = items.find((i) => i.id === product.id)
    if (exists) {
      persist(items.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i))
    } else {
      persist([...items, { ...product, quantity }])
    }
  }

  const removeItem = (productId) => persist(items.filter((i) => i.id !== productId))

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeItem(productId); return }
    persist(items.map((i) => i.id === productId ? { ...i, quantity } : i))
  }

  const clearCart = () => persist([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
