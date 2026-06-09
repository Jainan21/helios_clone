import { api } from '@/api/axios'
import type { CartItem } from '@/features/cart/store/cart.store'

type ApiCartItem = {
  quantity: number
  jewelry: {
    id: number
    slug: string
    name: string
    price: number
    medias?: Array<{
      url: string
      isThumbnail?: boolean
      sortOrder?: number
    }>
  }
}

const toCartItem = (item: ApiCartItem): CartItem => {
  const media = [...(item.jewelry.medias ?? [])].sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0))
  const thumbnail = media.find((current) => current.isThumbnail) ?? media[0]

  return {
    id: item.jewelry.id,
    slug: item.jewelry.slug,
    name: item.jewelry.name,
    price: item.jewelry.price,
    quantity: item.quantity,
    thumbnail: thumbnail?.url,
  }
}

export async function getCart(userId: number) {
  const response = await api.get<ApiCartItem[]>(`/cart/${userId}`)
  return response.data.map(toCartItem)
}

export async function addCartItem(userId: number, jewelryId: number, quantity: number) {
  const response = await api.post<ApiCartItem[]>(`/cart/${userId}/items`, {
    jewelryId,
    quantity,
  })
  return response.data.map(toCartItem)
}

export async function updateCartItem(userId: number, jewelryId: number, quantity: number) {
  const response = await api.patch<ApiCartItem[]>(`/cart/${userId}/items/${jewelryId}`, {
    quantity,
  })
  return response.data.map(toCartItem)
}

export async function removeCartItem(userId: number, jewelryId: number) {
  const response = await api.delete<ApiCartItem[]>(`/cart/${userId}/items/${jewelryId}`)
  return response.data.map(toCartItem)
}

export async function clearBackendCart(userId: number) {
  const response = await api.delete<ApiCartItem[]>(`/cart/${userId}`)
  return response.data.map(toCartItem)
}
