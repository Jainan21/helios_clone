import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Jewelry items', value: '24' },
  { label: 'Collections', value: '8' },
  { label: 'Pending updates', value: '3' },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-4xl border border-zinc-200 bg-zinc-50 p-10 shadow-sm shadow-zinc-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Admin dashboard</p>
              <h1 className="text-4xl font-bold">Store management</h1>
              <p className="max-w-2xl text-sm leading-relaxed text-zinc-600">
                Monitor jewelry listings, manage collections, and publish new inventory from one centralized admin console.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="jewelry">
                <Button className="rounded-full px-8 py-3">Manage Jewelry</Button>
              </Link>
              <Link to="collections">
                <Button variant="outline" className="rounded-full px-8 py-3">
                  Manage Collections
                </Button>
              </Link>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl border border-zinc-200 bg-white p-6">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
                  {item.label}
                </p>
                <p className="mt-4 text-4xl font-semibold text-zinc-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-6 rounded-4xl border border-zinc-200 bg-white p-6 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold">Store activity</h2>
              <p className="mt-2 text-sm text-zinc-600">
                Track recent catalog changes, new product requests, and collection updates from the team.
              </p>
            </div>
            <div className="space-y-3">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-medium text-zinc-700">New jewelry request</p>
                <p className="mt-2 text-sm text-zinc-500">Prepare product details for the upcoming Helios Summer drop.</p>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-medium text-zinc-700">Collection refresh</p>
                <p className="mt-2 text-sm text-zinc-500">Review seasonal collections and update featured images.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
