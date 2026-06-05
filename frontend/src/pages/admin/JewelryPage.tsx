import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { api } from '@/api/axios'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const initialItems = [
  {
    id: 1,
    name: 'Khuvsgul Sunflower Stud Helios Silver',
    price: 395000,
    status: 'NEW_IN',
  },
  {
    id: 2,
    name: 'Silver Chain Helios',
    price: 799000,
    status: 'IN_STOCK',
  },
]

type JewelryItem = {
  id: number
  name: string
  price: number
  status: string
  slug?: string
  description?: string
  imageUrl?: string
}

type JewelryForm = {
  name: string
  slug: string
  description: string
  price: string
  status: string
}

const statusOptions = ['NEW_IN', 'IN_STOCK', 'SOLD_OUT']

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

export default function AdminJewelryPage() {
  const [items, setItems] = useState<JewelryItem[]>(initialItems)
  const [form, setForm] = useState<JewelryForm>({
    name: '',
    slug: '',
    description: '',
    price: '',
    status: 'NEW_IN',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const totalValue = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  function handleInput(event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    setMessage(null)

    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null)
    }
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)

    if (!form.name || !form.price || !form.description) {
      setMessage('Name, description, and price are required.')
      return
    }

    if (!selectedFile) {
      setMessage('Please select an image to upload.')
      return
    }

    try {
      const uploadData = new FormData()
      uploadData.append('file', selectedFile)

      const uploadResponse = await api.post<{ url: string }>('/jewelry/upload', uploadData)
      const imageUrl = uploadResponse.data.url

      const slug = form.slug || slugify(form.name)
      const createPayload = {
        name: form.name,
        slug,
        description: form.description,
        price: Number(form.price),
        status: form.status,
        medias: [
          {
            url: imageUrl,
            type: 'IMAGE',
            isThumbnail: true,
            sortOrder: 0,
          },
        ],
      }

      const createResponse = await api.post('/jewelry', createPayload)
      const createdItem = createResponse.data

      setItems((current) => [
        {
          id: createdItem.id,
          name: createdItem.name,
          price: createdItem.price,
          status: createdItem.status,
          slug: createdItem.slug,
          description: createdItem.description,
          imageUrl,
        },
        ...current,
      ])
      setForm({ name: '', slug: '', description: '', price: '', status: 'NEW_IN' })
      setSelectedFile(null)
      setPreviewUrl(null)
      setMessage('Jewelry item uploaded and created successfully.')
    } catch (error) {
      setMessage('Upload failed. Please try again.')
      console.error(error)
    }
  }

  function handleDelete(id: number) {
    setItems((current) => current.filter((item) => item.id !== id))
    setMessage('Jewelry item removed from the current list.')
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="rounded-4xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm shadow-zinc-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Jewelry management</p>
                <h1 className="text-3xl font-bold">Products & inventory</h1>
              </div>
              <div className="rounded-3xl bg-white px-5 py-4 text-sm text-zinc-700 shadow-sm shadow-zinc-100">
                Total value: <span className="font-semibold text-zinc-900">{new Intl.NumberFormat('vi-VN').format(totalValue)} đ</span>
              </div>
            </div>

            <Separator className="my-6" />

            <form onSubmit={handleAdd} className="grid gap-4 lg:grid-cols-[1fr_360px] lg:items-start">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-zinc-700">Name</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                    className="w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    placeholder="Product name"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="slug" className="text-sm font-medium text-zinc-700">Slug</label>
                  <input
                    id="slug"
                    name="slug"
                    value={form.slug}
                    onChange={handleInput}
                    className="w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    placeholder="auto-generated from name"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium text-zinc-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleInput}
                    rows={4}
                    className="w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    placeholder="Short product description"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="file" className="text-sm font-medium text-zinc-700">Image</label>
                  <input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                  />
                </div>

                {previewUrl ? (
                  <div className="rounded-3xl border border-zinc-200 bg-white p-4">
                    <img src={previewUrl} alt="Preview" className="h-64 w-full rounded-3xl object-cover" />
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="price" className="text-sm font-medium text-zinc-700">Price (VND)</label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleInput}
                    className="w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    placeholder="395000"
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="status" className="text-sm font-medium text-zinc-700">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleInput}
                    className="w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="rounded-full px-6 py-3">
                  Upload & create
                </Button>
              </div>
            </form>

            {message ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}
          </div>

          <div className="rounded-4xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-100">
            <div className="overflow-hidden rounded-3xl border border-zinc-200">
              <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-zinc-50 text-zinc-600">
                  <tr>
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-t border-zinc-200">
                      <td className="px-4 py-4 text-zinc-900">{item.name}</td>
                      <td className="px-4 py-4 text-zinc-700">{new Intl.NumberFormat('vi-VN').format(item.price)} đ</td>
                      <td className="px-4 py-4 text-zinc-700">{item.status.replace('_', ' ')}</td>
                      <td className="px-4 py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
