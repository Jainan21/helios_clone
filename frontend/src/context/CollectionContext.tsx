import { createContext, useMemo, type ReactNode } from 'react'
import { api } from '@/api/axios'
import type { CreateJewelryPayload, JewelryItem, JewelryMedia } from '@/context/JewelryContext'

export type CollectionItem = {
  id: number
  name: string
  description: string
  medias?: JewelryMedia[]
  jewelry?: JewelryItem[]
  _count?: {
    jewelry: number
  }
  createdAt?: string
}

export type CreateCollectionPayload = {
  name: string
  description: string
  medias?: Omit<JewelryMedia, 'id'>[]
  jewelryIds?: number[]
  newJewelry?: CreateJewelryPayload[]
}

export type GetCollectionsResponse = {
  data: CollectionItem[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPage: number
  }
}

type CollectionContextValue = {
  getCollections: (params?: { page?: number; limit?: number }) => Promise<GetCollectionsResponse>
  getCollectionById: (id: number) => Promise<CollectionItem>
  addCollection: (payload: CreateCollectionPayload) => Promise<CollectionItem>
  uploadCollectionMedia: (file: File) => Promise<{ url: string }>
}

const missingProvider = () => {
  throw new Error('CollectionContext must be used within CollectionProvider')
}

export const CollectionContext = createContext<CollectionContextValue>({
  getCollections: missingProvider,
  getCollectionById: missingProvider,
  addCollection: missingProvider,
  uploadCollectionMedia: missingProvider,
})

export function CollectionProvider({ children }: { children: ReactNode }) {
  const value = useMemo<CollectionContextValue>(
    () => ({
      async getCollections(params) {
        const response = await api.get<GetCollectionsResponse>('/collections', { params })
        return response.data
      },

      async getCollectionById(id) {
        const response = await api.get<CollectionItem>(`/collections/${id}`)
        return response.data
      },

      async addCollection(payload) {
        const response = await api.post<CollectionItem>('/collections', payload)
        return response.data
      },

      async uploadCollectionMedia(file) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await api.post<{ url: string }>('/collections/upload', formData)
        return response.data
      },
    }),
    [],
  )

  return <CollectionContext.Provider value={value}>{children}</CollectionContext.Provider>
}
