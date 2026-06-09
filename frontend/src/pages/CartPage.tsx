import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Header from '@/components/ui/header'
import MainHeader from '@/components/ui/main_header'
import Footer from '@/components/ui/footer'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/features/cart/store/cart.store'
import { clearBackendCart, getCart, removeCartItem, updateCartItem } from '@/features/cart/api/cart.api'
import { useAuth } from '@/context/AuthContext'

const formatPrice = (price: number) => `${new Intl.NumberFormat('vi-VN').format(price)} VND`

export default function CartPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isReady } = useAuth()
  const { items, setItems, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    if (!isReady) {
      return
    }

    if (!user?.id) {
      clearCart()
      navigate('/login', { replace: true, state: { from: location.pathname } })
      return
    }

    setLoading(true)
    getCart(user.id)
      .then(setItems)
      .catch((error) => {
        setMessage('Could not load cart.')
        console.error(error)
      })
      .finally(() => setLoading(false))
  }, [clearCart, isReady, location.pathname, navigate, setItems, user?.id])

  async function handleQuantity(jewelryId: number, quantity: number) {
    if (!user?.id) {
      return
    }

    try {
      const nextItems = await updateCartItem(user.id, jewelryId, quantity)
      setItems(nextItems)
    } catch (error) {
      setMessage('Could not update cart.')
      console.error(error)
    }
  }

  async function handleRemove(jewelryId: number) {
    if (!user?.id) {
      return
    }

    try {
      const nextItems = await removeCartItem(user.id, jewelryId)
      setItems(nextItems)
    } catch (error) {
      setMessage('Could not remove item.')
      console.error(error)
    }
  }

  async function handleClear() {
    if (!user?.id) {
      return
    }

    try {
      const nextItems = await clearBackendCart(user.id)
      setItems(nextItems)
    } catch (error) {
      setMessage('Could not clear cart.')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="relative">
        <div className="absolute z-10 w-full">
          <MainHeader />
        </div>

        <main className="mx-auto min-h-[70vh] w-[90%] pt-36">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-400">Cart</p>
          <h1 className="mt-3 text-4xl font-bold uppercase">Shopping cart</h1>

          {message ? <div className="mt-6 border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-200">{message}</div> : null}
          {loading ? <div className="mt-10 text-sm text-zinc-400">Loading cart...</div> : null}

          {!loading && items.length === 0 ? (
            <div className="mt-12 border border-zinc-800 bg-zinc-950 p-10 text-center">
              <p className="text-zinc-300">Your cart is empty.</p>
              <Button asChild className="mt-6 rounded-none bg-white px-6 text-black hover:bg-zinc-200">
                <Link to="/products">Continue shopping</Link>
              </Button>
            </div>
          ) : null}

          {!loading && items.length > 0 ? (
            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
              <div className="grid gap-4">
                {items.map((item) => (
                  <div key={item.id} className="grid gap-4 border border-zinc-800 bg-zinc-950 p-4 sm:grid-cols-[120px_1fr_auto]">
                    <Link to={`/products/${item.slug}`} className="block overflow-hidden bg-zinc-900">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.name} className="aspect-square w-full object-cover" />
                      ) : (
                        <div className="aspect-square w-full" />
                      )}
                    </Link>

                    <div className="space-y-2">
                      <Link to={`/products/${item.slug}`} className="font-semibold uppercase hover:text-amber-400">
                        {item.name}
                      </Link>
                      <p className="text-sm text-zinc-400">{formatPrice(item.price)}</p>
                      <button type="button" onClick={() => handleRemove(item.id)} className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-red-300">
                        <Trash2 className="size-4" />
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:block sm:space-y-4">
                      <div className="flex w-fit items-center rounded-full border border-zinc-700 px-3 py-1">
                        <button type="button" className="p-2" onClick={() => handleQuantity(item.id, item.quantity - 1)}>
                          <Minus className="size-4" />
                        </button>
                        <span className="w-9 text-center">{item.quantity}</span>
                        <button type="button" className="p-2" onClick={() => handleQuantity(item.id, item.quantity + 1)}>
                          <Plus className="size-4" />
                        </button>
                      </div>
                      <p className="text-right font-semibold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="h-fit border border-zinc-800 bg-zinc-950 p-6">
                <h2 className="text-xl font-semibold uppercase">Order summary</h2>
                <div className="mt-6 flex justify-between border-b border-zinc-800 pb-4 text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="mt-4 text-sm text-zinc-500">Shipping and discounts are calculated at checkout.</p>
                <Button className="mt-6 h-12 w-full rounded-none bg-white text-black hover:bg-zinc-200">
                  Checkout
                </Button>
                <Button variant="outline" onClick={handleClear} className="mt-3 h-12 w-full rounded-none border-zinc-700 bg-black text-white hover:bg-zinc-900">
                  Clear cart
                </Button>
              </aside>
            </div>
          ) : null}
        </main>
      </div>
      <Footer />
    </div>
  )
}
