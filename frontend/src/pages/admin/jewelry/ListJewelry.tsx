import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { JewelryContext, type JewelryItem } from '@/context/JewelryContext'

const LIMIT = 10

export default function ListJewelry() {
  const { getJewelry, deleteJewelry } = useContext(JewelryContext)
  const [items, setItems] = useState<JewelryItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  useEffect(() => {
    let isMounted = true

    setLoading(true)
    getJewelry({ page, limit: LIMIT })
      .then((response) => {
        if (!isMounted) {
          return
        }

        setItems(response.data)
        setTotalPage(Math.max(response.pagination.totalPage, 1))
      })
      .catch((error) => {
        if (isMounted) {
          setMessage('Could not load jewelry items.')
        }
        console.error(error)
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [getJewelry, page])

  async function handleDelete(id: number) {
    try {
      await deleteJewelry(id)
      setItems((current) => current.filter((item) => item.id !== id))
      setConfirmDeleteId(null)
      setMessage('Jewelry item deleted.')
    } catch (error) {
      setMessage('Delete failed. Please try again.')
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">Jewelry</p>
          <h1 className="text-3xl font-bold text-zinc-950">Product list</h1>
        </div>
        <Button asChild className="rounded-full bg-emerald-600 px-5 text-white hover:bg-emerald-700">
          <Link to="/admin/jewelry/action">Add jewelry</Link>
        </Button>
      </div>

      {message ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
          {message}
        </div>
      ) : null}

      <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm shadow-zinc-100">
        <div className="overflow-x-auto rounded-2xl border border-zinc-200">
          <table className="w-full min-w-190 border-collapse text-left text-sm">
            <thead className="bg-zinc-50 text-zinc-600">
              <tr>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Slug</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                    Loading jewelry...
                  </td>
                </tr>
              ) : null}

              {!loading && items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                    No jewelry found.
                  </td>
                </tr>
              ) : null}

              {!loading
                ? items.map((item) => (
                    <tr key={item.id} className="border-t border-zinc-200">
                      <td className="px-4 py-4 font-medium text-zinc-900">{item.name}</td>
                      <td className="px-4 py-4 text-zinc-600">{item.slug}</td>
                      <td className="px-4 py-4 text-zinc-700">{item.type.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-4 text-zinc-700">
                        {new Intl.NumberFormat('vi-VN').format(item.price)} VND
                      </td>
                      <td className="px-4 py-4 text-zinc-700">{item.status.replace('_', ' ')}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <Button asChild size="sm" className="bg-amber-500 text-white hover:bg-amber-600">
                            <Link to={`/admin/jewelry/action/${item.id}`}>Edit</Link>
                          </Button>
                          {confirmDeleteId === item.id ? (
                            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-1">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                              >
                                Confirm
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setConfirmDeleteId(item.id)}
                            >
                              Delete
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-sm text-zinc-500">
            Page {page} of {totalPage}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(current - 1, 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPage}
              onClick={() => setPage((current) => Math.min(current + 1, totalPage))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
