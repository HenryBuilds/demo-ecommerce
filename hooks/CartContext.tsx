'use client'

import { CartAction, CartContextType, CartItem, CartState } from '@/types/types'
import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { toast } from 'sonner'

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'shop-cart'

function calculateTotals(items: CartItem[]): { totalItems: number; totalAmount: number } {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  return { totalItems, totalAmount }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD_CART': {
      const items = action.payload
      const { totalItems, totalAmount } = calculateTotals(items)
      return { items, totalItems, totalAmount }
    }

    case 'ADD_ITEM': {
      const { quantity = 1, ...productData } = action.payload
      const existingItem = state.items.find(item => item.productId === productData.productId)
      
      let newItems: CartItem[]
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.productId === productData.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        const newItem: CartItem = {
          id: `${productData.productId}-${Date.now()}`,
          ...productData,
          quantity
        }
        newItems = [...state.items, newItem]
      }
      
      const { totalItems, totalAmount } = calculateTotals(newItems)
      return { items: newItems, totalItems, totalAmount }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.productId !== action.payload.productId)
      const { totalItems, totalAmount } = calculateTotals(newItems)
      return { items: newItems, totalItems, totalAmount }
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload
      
      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.productId !== productId)
        const { totalItems, totalAmount } = calculateTotals(newItems)
        return { items: newItems, totalItems, totalAmount }
      }
      
      const newItems = state.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
      const { totalItems, totalAmount } = calculateTotals(newItems)
      return { items: newItems, totalItems, totalAmount }
    }

    case 'CLEAR_CART': {
      return { items: [], totalItems: 0, totalAmount: 0 }
    }

    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const items = JSON.parse(savedCart) as CartItem[]
        dispatch({ type: 'LOAD_CART', payload: items })
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error)
    }
  }, [state.items])

  const addItem = (product: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number }) => {
    const quantity = product.quantity || 1
    dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity } })
    toast.success(`${product.name} added to cart`)
  }

  const removeItem = (productId: string) => {
    const item = state.items.find(item => item.productId === productId)
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } })
    if (item) {
      toast.success(`${item.name} removed from cart`)
    }
  }

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    toast.success('Cart cleared')
  }

  const getTotalPrice = () => state.totalAmount

  const getTotalItems = () => state.totalItems

  const isInCart = (productId: string) => {
    return state.items.some(item => item.productId === productId)
  }

  const getItemQuantity = (productId: string) => {
    const item = state.items.find(item => item.productId === productId)
    return item ? item.quantity : 0
  }

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isInCart,
    getItemQuantity
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}