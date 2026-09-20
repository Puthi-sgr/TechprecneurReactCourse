import { createContext, useContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'

export interface CartLine {
  productId: number
  name: string
  price: number
  quantity: number
}

/** Discriminated union: the `type` tag decides which payload fields exist. */
export type CartAction =
  | { type: 'ADD_ITEM'; productId: number; name: string; price: number }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QUANTITY'; productId: number; quantity: number }

/** Pure: no fetch, no localStorage, no console — state in, state out. */
export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((line) => line.productId === action.productId)
      if (existing === undefined) {
        return [
          ...state,
          {
            productId: action.productId,
            name: action.name,
            price: action.price,
            quantity: 1,
          },
        ]
      }
      return state.map((line) =>
        line.productId === action.productId
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      )
    }
    case 'REMOVE_ITEM': {
      return state.filter((line) => line.productId !== action.productId)
    }
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return state.filter((line) => line.productId !== action.productId)
      }
      return state.map((line) =>
        line.productId === action.productId
          ? { ...line, quantity: action.quantity }
          : line,
      )
    }
    default:
      return state
  }
}

interface CartContextValue {
  lines: CartLine[]
  dispatch: Dispatch<CartAction>
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(cartReducer, [])
  return (
    <CartContext.Provider value={{ lines, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
