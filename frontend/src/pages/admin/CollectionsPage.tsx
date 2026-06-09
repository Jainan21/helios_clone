import { useContext, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CollectionContext, type CollectionItem } from '@/context/CollectionContext'
import {
  JewelryContext,
  type CreateJewelryPayload,
  type JewelryItem,
  type JewelryStatus,
  type JewelryType,
  type MediaType,
} from '@/context/JewelryContext'

type MediaFormItem = {
  clientId: string
  url: string
  file?: File
  type: MediaType
  isThumbnail: boolean
  sortOrder: number
}

type NewProductForm = {
  clientId: string
  name: string
  slug: string
  description: string
  price: string
  material: string
  stone: string
  status: JewelryStatus
  type: JewelryType
  medias: MediaFormItem[]
}

const MAX_MEDIA_SIZE_MB = 8
const MAX_MEDIA_SIZE_BYTES = MAX_MEDIA_SIZE_MB * 1024 * 1024
const jewelryTypeOptions: JewelryType[] = [
  'SILVER_RING',
  'SILVER_BRACELET',
  'SILVER_NECKLACE',
  'SILVER_PENDANT',
  'SILVER_CHARM',
  'SILVER_EARRINGS',
  'GOLD_JEWELRY',
  'GLASSES',
  'LEATHER_CRAFT',
  'OTHER_ACCESSORY',
]

const createClientId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
const formatFileSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

const createEmptyProduct = (): NewProductForm => ({
  clientId: createClientId(),
  name: '',
  slug: '',
  description: '',
  price: '',
  material: '',
  stone: '',
  status: 'NEW_IN',
  type: 'SILVER_RING',
  medias: [],
})

const getThumbnail = (item: JewelryItem) => {
  const sortedMedia = [...(item.medias ?? [])].sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0))
  return sortedMedia.find((media) => media.isThumbnail) ?? sortedMedia[0]
}

export default function AdminCollectionsPage() {
  const { getCollections, addCollection, uploadCollectionMedia } = useContext(CollectionContext)
  const { getJewelry, uploadJewelryImage } = useContext(JewelryContext)
  const previewUrlsRef = useRef<string[]>([])

  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [unassignedJewelry, setUnassignedJewelry] = useState<JewelryItem[]>([])
  const [selectedJewelryIds, setSelectedJewelryIds] = useState<number[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [collectionMedias, setCollectionMedias] = useState<MediaFormItem[]>([])
  const [newProducts, setNewProducts] = useState<NewProductForm[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loadData = () => {
    getCollections({ page: 1, limit: 20 })
      .then((response) => setCollections(response.data))
      .catch((error) => {
        setMessage('Could not load collections.')
        console.error(error)
      })

    getJewelry({ page: 1, limit: 100, collection: 'unassigned' })
      .then((response) => setUnassignedJewelry(response.data))
      .catch((error) => {
        setMessage('Could not load unassigned products.')
        console.error(error)
      })
  }

  useEffect(() => {
    loadData()

    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function addMediaFromFiles(files: File[], currentLength: number) {
    const oversizedFiles = files.filter((file) => file.size > MAX_MEDIA_SIZE_BYTES)
    const acceptedFiles = files.filter((file) => file.size <= MAX_MEDIA_SIZE_BYTES)

    if (oversizedFiles.length > 0) {
      setMessage(
        `Some files were not added because they are bigger than ${MAX_MEDIA_SIZE_MB} MB: ${oversizedFiles
          .map((file) => `${file.name} (${formatFileSize(file.size)})`)
          .join(', ')}`,
      )
    }

    return acceptedFiles.map((file, index) => {
      const previewUrl = URL.createObjectURL(file)
      previewUrlsRef.current.push(previewUrl)

      return {
        clientId: createClientId(),
        url: previewUrl,
        file,
        type: 'IMAGE' as const,
        isThumbnail: currentLength === 0 && index === 0,
        sortOrder: currentLength + index,
      }
    })
  }

  function handleCollectionFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    if (files.length > 0) {
      setCollectionMedias((current) => [...current, ...addMediaFromFiles(files, current.length)])
    }
    event.target.value = ''
  }

  function handleProductFiles(productId: string, event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    setNewProducts((current) =>
      current.map((product) =>
        product.clientId === productId
          ? {
              ...product,
              medias: [...product.medias, ...addMediaFromFiles(files, product.medias.length)],
            }
          : product,
      ),
    )
    event.target.value = ''
  }

  function updateProduct(productId: string, field: keyof Omit<NewProductForm, 'clientId' | 'medias'>, value: string) {
    setNewProducts((current) => current.map((product) => (product.clientId === productId ? { ...product, [field]: value } : product)))
  }

  function updateMediaSort(mediaId: string, value: string, productId?: string) {
    if (productId) {
      setNewProducts((current) =>
        current.map((product) =>
          product.clientId === productId
            ? {
                ...product,
                medias: product.medias.map((media) => (media.clientId === mediaId ? { ...media, sortOrder: Number(value) } : media)),
              }
            : product,
        ),
      )
      return
    }

    setCollectionMedias((current) => current.map((media) => (media.clientId === mediaId ? { ...media, sortOrder: Number(value) } : media)))
  }

  function removeMedia(mediaId: string, productId?: string) {
    const removeAndRepairThumbnail = (items: MediaFormItem[]) => {
      const removedItem = items.find((item) => item.clientId === mediaId)
      if (removedItem?.file) {
        URL.revokeObjectURL(removedItem.url)
      }

      const remainingItems = items.filter((item) => item.clientId !== mediaId)
      if (remainingItems.length === 0 || remainingItems.some((item) => item.isThumbnail)) {
        return remainingItems
      }

      return remainingItems.map((item, index) => ({ ...item, isThumbnail: index === 0 }))
    }

    if (productId) {
      setNewProducts((current) =>
        current.map((product) => (product.clientId === productId ? { ...product, medias: removeAndRepairThumbnail(product.medias) } : product)),
      )
      return
    }

    setCollectionMedias(removeAndRepairThumbnail)
  }

  async function uploadMediaItems(items: MediaFormItem[], uploader: (file: File) => Promise<{ url: string }>) {
    const uploaded = await Promise.all(
      items.map(async (item) => ({
        url: item.file ? (await uploader(item.file)).url : item.url,
        type: item.type,
        isThumbnail: item.isThumbnail,
        sortOrder: item.sortOrder,
      })),
    )

    if (!uploaded.some((media) => media.isThumbnail) && uploaded[0]) {
      uploaded[0].isThumbnail = true
    }

    return uploaded
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) {
      return
    }

    setMessage(null)

    if (!name || !description) {
      setMessage('Collection name and description are required.')
      return
    }

    if (collectionMedias.length === 0) {
      setMessage('Add at least one collection image or GIF.')
      return
    }

    const invalidProduct = newProducts.find((product) => !product.name || !product.price || !product.description || product.medias.length === 0)
    if (invalidProduct) {
      setMessage('Each new product needs name, price, description, and at least one image.')
      return
    }

    setSaving(true)

    try {
      const medias = await uploadMediaItems(collectionMedias, uploadCollectionMedia)
      const newJewelry: CreateJewelryPayload[] = await Promise.all(
        newProducts.map(async (product) => ({
          name: product.name,
          slug: product.slug || slugify(product.name),
          description: product.description,
          price: Number(product.price),
          material: product.material || undefined,
          stone: product.stone || undefined,
          status: product.status,
          type: product.type,
          medias: await uploadMediaItems(product.medias, uploadJewelryImage),
        })),
      )

      await addCollection({
        name,
        description,
        medias,
        jewelryIds: selectedJewelryIds,
        newJewelry,
      })

      setName('')
      setDescription('')
      setCollectionMedias([])
      setNewProducts([])
      setSelectedJewelryIds([])
      setMessage('Collection created.')
      loadData()
    } catch (error) {
      setMessage('Create collection failed. Please check the data and try again.')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Collection management</p>
          <h1 className="text-3xl font-bold text-zinc-950">Manage collections</h1>
        </div>
      </div>

      {message ? <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">{message}</div> : null}

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-100">
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Collection name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={saving}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                disabled={saving}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>
          </div>

          <label className="grid content-start gap-2 text-sm font-medium text-zinc-700">
            Collection images or GIFs
            <input
              type="file"
              accept="image/*,.gif"
              multiple
              onChange={handleCollectionFiles}
              disabled={saving}
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="flex min-h-56 gap-4">
            {collectionMedias.length === 0 ? (
              <div className="flex min-h-52 w-full items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white text-sm text-zinc-500">
                No collection media selected.
              </div>
            ) : null}

            {collectionMedias.map((media) => (
              <div key={media.clientId} className="grid w-[240px] shrink-0 gap-3 rounded-2xl border border-zinc-200 bg-white p-3">
                <img src={media.url} alt="Collection media" className="aspect-[4/3] w-full rounded-xl border border-zinc-200 object-cover" />
                <label className="grid gap-1 text-sm font-medium text-zinc-700">
                  Sort order
                  <input
                    type="number"
                    value={media.sortOrder}
                    onChange={(event) => updateMediaSort(media.clientId, event.target.value)}
                    disabled={saving}
                    className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black"
                  />
                </label>
                <Button type="button" variant="outline" size="sm" disabled={saving} onClick={() => removeMedia(media.clientId)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>

        <section className="grid gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">Select existing products</h2>
            <p className="text-sm text-zinc-500">Only products without a collection are shown.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {unassignedJewelry.map((item) => {
              const thumbnail = getThumbnail(item)
              const checked = selectedJewelryIds.includes(item.id)

              return (
                <label key={item.id} className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={saving}
                    onChange={(event) =>
                      setSelectedJewelryIds((current) =>
                        event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id),
                      )
                    }
                  />
                  {thumbnail ? <img src={thumbnail.url} alt={item.name} className="h-14 w-14 rounded-xl object-cover" /> : null}
                  <span className="font-medium text-zinc-800">{item.name}</span>
                </label>
              )
            })}
          </div>
        </section>

        <section className="grid gap-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Add new products to this collection</h2>
              <p className="text-sm text-zinc-500">New products are created with this collection already mapped.</p>
            </div>
            <Button type="button" variant="outline" className="rounded-full px-5" disabled={saving} onClick={() => setNewProducts((current) => [...current, createEmptyProduct()])}>
              Add product
            </Button>
          </div>

          {newProducts.map((product, productIndex) => (
            <div key={product.clientId} className="grid gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-zinc-900">New product {productIndex + 1}</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={saving}
                  onClick={() => setNewProducts((current) => current.filter((item) => item.clientId !== product.clientId))}
                >
                  Remove product
                </Button>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <input value={product.name} onChange={(event) => updateProduct(product.clientId, 'name', event.target.value)} disabled={saving} placeholder="Product name" className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
                <input value={product.slug} onChange={(event) => updateProduct(product.clientId, 'slug', event.target.value)} disabled={saving} placeholder="Slug, optional" className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
                <input type="number" value={product.price} onChange={(event) => updateProduct(product.clientId, 'price', event.target.value)} disabled={saving} placeholder="Price" className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
                <select value={product.type} onChange={(event) => updateProduct(product.clientId, 'type', event.target.value)} disabled={saving} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black">
                  {jewelryTypeOptions.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
                <input value={product.material} onChange={(event) => updateProduct(product.clientId, 'material', event.target.value)} disabled={saving} placeholder="Material" className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
                <input value={product.stone} onChange={(event) => updateProduct(product.clientId, 'stone', event.target.value)} disabled={saving} placeholder="Stone" className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
              </div>

              <textarea value={product.description} onChange={(event) => updateProduct(product.clientId, 'description', event.target.value)} rows={3} disabled={saving} placeholder="Product description" className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black" />

              <label className="grid gap-2 text-sm font-medium text-zinc-700">
                Product images
                <input type="file" accept="image/*,.gif" multiple disabled={saving} onChange={(event) => handleProductFiles(product.clientId, event)} className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
              </label>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.medias.map((media) => (
                  <div key={media.clientId} className="grid w-[180px] shrink-0 gap-2 rounded-2xl border border-zinc-200 bg-white p-3">
                    <img src={media.url} alt="Product media" className="aspect-square rounded-xl object-cover" />
                    <input type="number" value={media.sortOrder} onChange={(event) => updateMediaSort(media.clientId, event.target.value, product.clientId)} disabled={saving} className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-black" />
                    <Button type="button" variant="outline" size="sm" disabled={saving} onClick={() => removeMedia(media.clientId, product.clientId)}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <Button type="submit" disabled={saving} className="w-fit rounded-full bg-emerald-600 px-8 py-3 text-white hover:bg-emerald-700">
          {saving ? 'Creating...' : 'Create collection'}
        </Button>
      </form>

      <section className="grid gap-4">
        <h2 className="text-xl font-semibold text-zinc-950">Collections</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => {
            const sortedMedia = [...(collection.medias ?? [])].sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0))
            const thumbnail = sortedMedia.find((media) => media.isThumbnail) ?? sortedMedia[0]

            return (
              <Link key={collection.id} to={`/collections/${collection.id}`} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm shadow-zinc-100">
                {thumbnail ? <img src={thumbnail.url} alt={collection.name} className="aspect-[4/3] w-full object-cover" /> : null}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-zinc-950">{collection.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600">{collection.description}</p>
                  <p className="mt-4 text-sm font-semibold text-zinc-500">{collection._count?.jewelry ?? collection.jewelry?.length ?? 0} products</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
