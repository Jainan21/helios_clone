import { createContext, useMemo, type ReactNode } from 'react'
import { api } from '@/api/axios'

export type MediaType = 'IMAGE' | 'VIDEO'
export type JewelryStatus = 'ACTIVE' | 'SOLD_OUT' | 'NEW_IN' | 'PRE_ORDER' | 'HIDDEN'
export type JewelryType =
  | 'SILVER_RING'
  | 'SILVER_BRACELET'
  | 'SILVER_NECKLACE'
  | 'SILVER_PENDANT'
  | 'SILVER_CHARM'
  | 'SILVER_EARRINGS'
  | 'GOLD_JEWELRY'
  | 'GLASSES'
  | 'LEATHER_CRAFT'
  | 'OTHER_ACCESSORY'

export type JewelryMedia = {
  id?: number
  url: string
  type: MediaType
  isThumbnail?: boolean
  sortOrder?: number
}

export type JewelryItem = {
  id: number
  name: string
  price: number
  description: string
  material?: string
  stone?: string | null
  status: JewelryStatus
  type: JewelryType
  slug: string
  medias?: JewelryMedia[]
}

export type CreateJewelryPayload = {
  name: string
  price: number
  description: string
  material?: string
  stone?: string
  status?: JewelryStatus
  type?: JewelryType
  slug: string
  medias?: Omit<JewelryMedia, 'id'>[]
}

export type UpdateJewelryPayload = Partial<CreateJewelryPayload>

export type GetJewelryParams = {
  status?: JewelryStatus
  type?: JewelryType
  search?: string
  page?: number
  limit?: number
}

export type GetJewelryResponse = {
  data: JewelryItem[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPage: number
  }
}

type JewelryContextValue = {
  getJewelry: (params?: GetJewelryParams) => Promise<GetJewelryResponse>
  getJewelryById: (id: number) => Promise<JewelryItem>
  getJewelryBySlug: (slug: string) => Promise<JewelryItem>
  addJewelry: (payload: CreateJewelryPayload) => Promise<JewelryItem>
  editJewelry: (id: number, payload: UpdateJewelryPayload) => Promise<JewelryItem>
  deleteJewelry: (id: number) => Promise<JewelryItem>
  uploadJewelryImage: (file: File) => Promise<{ url: string }>
}

const missingProvider = () => {
  throw new Error('JewelryContext must be used within JewelryProvider')
}

export const JewelryContext = createContext<JewelryContextValue>({
  getJewelry: missingProvider,
  getJewelryById: missingProvider,
  getJewelryBySlug: missingProvider,
  addJewelry: missingProvider,
  editJewelry: missingProvider,
  deleteJewelry: missingProvider,
  uploadJewelryImage: missingProvider,
})

export function JewelryProvider({ children }: { children: ReactNode }) {
  const value = useMemo<JewelryContextValue>(
    () => ({
      async getJewelry(params) {
        const response = await api.get<GetJewelryResponse>('/jewelry', { params })
        return response.data
      },

      async getJewelryById(id) {
        const response = await api.get<JewelryItem>(`/jewelry/${id}`)
        return response.data
      },

      async getJewelryBySlug(slug) {
        const response = await api.get<JewelryItem>(`/jewelry/slug/${slug}`)
        return response.data
      },

      async addJewelry(payload) {
        const response = await api.post<JewelryItem>('/jewelry', payload)
        return response.data
      },

      async editJewelry(id, payload) {
        const response = await api.patch<JewelryItem>(`/jewelry/${id}`, payload)
        return response.data
      },

      async deleteJewelry(id) {
        const response = await api.delete<JewelryItem>(`/jewelry/${id}`)
        return response.data
      },

      async uploadJewelryImage(file) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post<{ url: string }>('/jewelry/upload', formData)
        return response.data
      },
    }),
    [],
  )

  return <JewelryContext.Provider value={value}>{children}</JewelryContext.Provider>
}
