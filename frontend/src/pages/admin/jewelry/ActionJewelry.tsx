import { useContext, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  JewelryContext,
  type CreateJewelryPayload,
  type JewelryStatus,
  type JewelryType,
  type MediaType,
} from '@/context/JewelryContext'

type JewelryForm = {
  name: string
  slug: string
  description: string
  price: string
  material: string
  stone: string
  status: JewelryStatus
  type: JewelryType
}

type MediaFormItem = {
  clientId: string
  id?: number
  url: string
  file?: File
  type: MediaType
  isThumbnail: boolean
  sortOrder: number
}

const statusOptions: JewelryStatus[] = ['NEW_IN', 'ACTIVE', 'SOLD_OUT', 'PRE_ORDER', 'HIDDEN']
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
const MAX_MEDIA_SIZE_MB = 5
const MAX_MEDIA_SIZE_BYTES = MAX_MEDIA_SIZE_MB * 1024 * 1024

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

const createMediaClientId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`
const formatFileSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`

export default function ActionJewelry() {
  const { id } = useParams()
  const jewelryId = id ? Number(id) : null
  const isEdit = Number.isFinite(jewelryId)
  const navigate = useNavigate()
  const previewUrlsRef = useRef<string[]>([])
  const { getJewelryById, addJewelry, editJewelry, uploadJewelryImage } = useContext(JewelryContext)

  const [form, setForm] = useState<JewelryForm>({
    name: '',
    slug: '',
    description: '',
    price: '',
    material: '',
    stone: '',
    status: 'NEW_IN',
    type: 'SILVER_RING',
  })
  const [mediaItems, setMediaItems] = useState<MediaFormItem[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const title = useMemo(() => (isEdit ? 'Edit jewelry' : 'Add jewelry'), [isEdit])

  useEffect(() => {
    if (!isEdit || !jewelryId) {
      return
    }

    let isMounted = true

    getJewelryById(jewelryId)
      .then((item) => {
        if (!isMounted) {
          return
        }

        setForm({
          name: item.name,
          slug: item.slug,
          description: item.description,
          price: String(item.price),
          material: item.material ?? '',
          stone: item.stone ?? '',
          status: item.status,
          type: item.type,
        })

        setMediaItems(
          (item.medias ?? [])
            .sort((first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0))
            .map((media, index) => ({
              clientId: String(media.id ?? createMediaClientId()),
              id: media.id,
              url: media.url,
              type: media.type,
              isThumbnail: media.isThumbnail ?? index === 0,
              sortOrder: media.sortOrder ?? index,
            })),
        )
      })
      .catch((error) => {
        if (isMounted) {
          setMessage('Could not load jewelry item.')
        }
        console.error(error)
      })

    return () => {
      isMounted = false
    }
  }, [getJewelryById, isEdit, jewelryId])

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  function handleInput(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    setMessage(null)

    if (files.length === 0) {
      return
    }

    const oversizedFiles = files.filter((file) => file.size > MAX_MEDIA_SIZE_BYTES)
    const acceptedFiles = files.filter((file) => file.size <= MAX_MEDIA_SIZE_BYTES)

    if (oversizedFiles.length > 0) {
      setMessage(
        `Some images were not added because they are bigger than ${MAX_MEDIA_SIZE_MB} MB: ${oversizedFiles
          .map((file) => `${file.name} (${formatFileSize(file.size)})`)
          .join(', ')}`,
      )
    }

    if (acceptedFiles.length === 0) {
      event.target.value = ''
      return
    }

    setMediaItems((current) => {
      const hasThumbnail = current.some((item) => item.isThumbnail)
      const nextItems = acceptedFiles.map((file, index) => {
        const previewUrl = URL.createObjectURL(file)
        previewUrlsRef.current.push(previewUrl)

        return {
          clientId: createMediaClientId(),
          url: previewUrl,
          file,
          type: 'IMAGE' as const,
          isThumbnail: !hasThumbnail && index === 0,
          sortOrder: current.length + index,
        }
      })

      return [...current, ...nextItems]
    })

    event.target.value = ''
  }

  function handleThumbnailChange(clientId: string) {
    setMediaItems((current) =>
      current.map((item) => ({
        ...item,
        isThumbnail: item.clientId === clientId,
      })),
    )
  }

  function handleSortOrderChange(clientId: string, value: string) {
    setMediaItems((current) =>
      current.map((item) =>
        item.clientId === clientId
          ? {
              ...item,
              sortOrder: Number(value),
            }
          : item,
      ),
    )
  }

  function handleRemoveMedia(clientId: string) {
    setMediaItems((current) => {
      const removedItem = current.find((item) => item.clientId === clientId)
      if (removedItem?.file) {
        URL.revokeObjectURL(removedItem.url)
      }

      const remainingItems = current.filter((item) => item.clientId !== clientId)
      if (remainingItems.length === 0 || remainingItems.some((item) => item.isThumbnail)) {
        return remainingItems
      }

      return remainingItems.map((item, index) => ({
        ...item,
        isThumbnail: index === 0,
      }))
    })
  }

  async function buildMediaPayload() {
    const uploadedMedia = await Promise.all(
      mediaItems.map(async (item) => {
        const url = item.file ? (await uploadJewelryImage(item.file)).url : item.url

        return {
          url,
          type: item.type,
          isThumbnail: item.isThumbnail,
          sortOrder: item.sortOrder,
        }
      }),
    )

    if (!uploadedMedia.some((media) => media.isThumbnail) && uploadedMedia[0]) {
      uploadedMedia[0].isThumbnail = true
    }

    return uploadedMedia
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) {
      return
    }

    setMessage(null)

    if (!form.name || !form.price || !form.description) {
      setMessage('Name, description, and price are required.')
      return
    }

    if (mediaItems.length === 0) {
      setMessage('Please add at least one image.')
      return
    }

    setSaving(true)

    try {
      const medias = await buildMediaPayload()
      const payload: CreateJewelryPayload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description,
        price: Number(form.price),
        material: form.material || undefined,
        stone: form.stone || undefined,
        status: form.status,
        type: form.type,
        medias,
      }

      if (isEdit && jewelryId) {
        await editJewelry(jewelryId, payload)
      } else {
        await addJewelry(payload)
      }

      navigate('/admin/jewelry')
    } catch (error) {
      setMessage(isEdit ? 'Update failed. Please try again.' : 'Create failed. Please try again.')
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Jewelry</p>
          <h1 className="text-3xl font-bold text-zinc-950">{title}</h1>
        </div>
        <Button asChild variant="outline" className="rounded-full px-5">
          <Link to="/admin/jewelry">Back to list</Link>
        </Button>
      </div>

      {message ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-100">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleInput}
              disabled={saving}
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Slug
            <input
              name="slug"
              value={form.slug}
              onChange={handleInput}
              placeholder="auto-generated from name"
              disabled={saving}
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-zinc-700">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleInput}
              rows={5}
              disabled={saving}
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Material
              <input
                name="material"
                value={form.material}
                onChange={handleInput}
                disabled={saving}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Stone
              <input
                name="stone"
                value={form.stone}
                onChange={handleInput}
                disabled={saving}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>
          </div>
          </div>

          <div className="grid content-start gap-4">
            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Price (VND)
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleInput}
                disabled={saving}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Status
              <select
                name="status"
                value={form.status}
                onChange={handleInput}
                disabled={saving}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-zinc-700">
              Product type
              <select
                name="type"
                value={form.type}
                onChange={handleInput}
                disabled={saving}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              >
                {jewelryTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </label>

            <Button type="submit" disabled={saving} className="rounded-full bg-emerald-600 px-6 py-3 text-white hover:bg-emerald-700">
              {saving ? 'Saving...' : title}
            </Button>
          </div>
        </div>

        <section className="grid gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Images</h2>
              <p className="text-sm text-zinc-500">Choose a thumbnail and set display order for each image.</p>
            </div>
            <label className="grid gap-2 text-sm font-medium text-zinc-700 sm:w-80">
              Upload images
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={saving}
                className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
              />
            </label>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex min-h-64 gap-4">
              {mediaItems.length === 0 ? (
                <div className="flex min-h-60 w-full items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white text-sm text-zinc-500">
                  No images selected.
                </div>
              ) : null}

            {mediaItems.map((media) => (
              <div key={media.clientId} className="grid w-[260px] shrink-0 gap-3 rounded-2xl border border-zinc-200 bg-white p-3 sm:w-[280px] xl:w-[300px]">
                <img
                  src={media.url}
                  alt="Jewelry media"
                  className="aspect-square w-full rounded-xl border border-zinc-200 bg-white object-cover"
                />
                <div className="grid gap-2">
                  <label className="flex items-center gap-2 text-sm text-zinc-700">
                    <input
                      type="radio"
                      name="thumbnail"
                      checked={media.isThumbnail}
                      onChange={() => handleThumbnailChange(media.clientId)}
                      disabled={saving}
                    />
                    Thumbnail
                  </label>
                  <label className="grid gap-1 text-sm font-medium text-zinc-700">
                    Sort order
                    <input
                      type="number"
                      value={media.sortOrder}
                      onChange={(event) => handleSortOrderChange(media.clientId, event.target.value)}
                      disabled={saving}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    />
                  </label>
                  <Button type="button" variant="outline" size="sm" disabled={saving} onClick={() => handleRemoveMedia(media.clientId)}>
                    Remove image
                  </Button>
                </div>
              </div>
            ))}
            </div>
          </div>
        </section>
      </form>
    </div>
  )
}
