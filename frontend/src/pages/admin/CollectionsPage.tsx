import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const initialCollections = [
  {
    id: 1,
    name: 'Helios Essentials',
    description: 'Minimal and modern pieces for everyday wear.',
    itemCount: 12,
  },
  {
    id: 2,
    name: 'Silver Heritage',
    description: 'Timeless silver jewelry with elegant detailing.',
    itemCount: 8,
  },
]

type CollectionItem = (typeof initialCollections)[number]

type CollectionForm = {
  name: string
  description: string
}

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<CollectionItem[]>(initialCollections)
  const [form, setForm] = useState<CollectionForm>({ name: '', description: '' })
  const [message, setMessage] = useState<string | null>(null)

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!form.name || !form.description) {
      setMessage('Name and description are required.')
      return
    }

    const nextCollection: CollectionItem = {
      id: collections.length ? Math.max(...collections.map((item) => item.id)) + 1 : 1,
      name: form.name,
      description: form.description,
      itemCount: 0,
    }

    setCollections((current) => [nextCollection, ...current])
    setForm({ name: '', description: '' })
    setMessage('Collection added locally. Connect to the API to save changes.')
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="rounded-4xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm shadow-zinc-100">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Collection management</p>
              <h1 className="text-3xl font-bold">Manage collections</h1>
              <p className="max-w-2xl text-sm leading-relaxed text-zinc-600">
                Organize product groups and create curated collections for the store.
              </p>
            </div>

            <Separator className="my-6" />

            <form onSubmit={handleAdd} className="grid gap-4 md:grid-cols-[1fr_320px] md:items-end">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium text-zinc-700">Collection name</label>
                  <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    placeholder="e.g. Helios Essentials"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium text-zinc-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-3xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10"
                    placeholder="Short collection description"
                  />
                </div>
              </div>
              <Button type="submit" className="rounded-full px-6 py-3">
                Create collection
              </Button>
            </form>

            {message ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {collections.map((collection) => (
              <div key={collection.id} className="rounded-4xl border border-zinc-200 bg-white p-6 shadow-sm shadow-zinc-100">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-900">{collection.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">{collection.description}</p>
                  </div>
                  <div className="rounded-full bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700">
                    {collection.itemCount} items
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
