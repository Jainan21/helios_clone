import { create } from 'zustand'

export type CartItem = {
  id: number
  slug: string
  name: string
  price: number
  quantity: number
  thumbnail?: string
}

type CartStore = {
  items: CartItem[]
  setItems: (items: CartItem[]) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  clearCart: () => set({ items: [] }),
}))
