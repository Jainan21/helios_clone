import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Header from '@/components/ui/header'
import MainHeader from '@/components/ui/main_header'
import Footer from '@/components/ui/footer'
import { JewelryContext, type JewelryItem } from '@/context/JewelryContext'
import { useCartStore } from '@/features/cart/store/cart.store'
import { useAuth } from '@/context/AuthContext'
import { addCartItem } from '@/features/cart/api/cart.api'

const formatPrice = (price: number) => `${new Intl.NumberFormat('vi-VN').format(price)} VND`

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { getJewelryBySlug } = useContext(JewelryContext)
  const { user } = useAuth()
  const [item, setItem] = useState<JewelryItem | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState<string | null>(null)
  const [cartMessage, setCartMessage] = useState<string | null>(null)
  const setCartItems = useCartStore((state) => state.setItems)

  useEffect(() => {
    if (!slug) {
      return
    }

    let isMounted = true

    getJewelryBySlug(slug)
      .then((response) => {
        if (!isMounted) {
          return
        }

        const sortedMedia = [...(response.medias ?? [])].sort(
          (first, second) => (first.sortOrder ?? 0) - (second.sortOrder ?? 0),
        )
        const thumbnail = sortedMedia.find((media) => media.isThumbnail) ?? sortedMedia[0]

        setItem({ ...response, medias: sortedMedia })
        setSelectedImage(thumbnail?.url ?? null)
      })
      .catch((error) => {
        if (isMounted) {
          setMessage('Product not found.')
        }
        console.error(error)
      })

    return () => {
      isMounted = false
    }
  }, [getJewelryBySlug, slug])

  const images = useMemo(() => item?.medias?.filter((media) => media.type === 'IMAGE') ?? [], [item])
  const thumbnail = useMemo(() => images.find((media) => media.isThumbnail) ?? images[0], [images])

  async function handleAddToCart() {
    if (!item) {
      return
    }

    if (!user?.id) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    try {
      const items = await addCartItem(user.id, item.id, quantity)
      setCartItems(items)
      setCartMessage('Added to cart.')
    } catch (error) {
      setCartMessage('Could not add to cart.')
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

        <div className="pt-32">
          {message && !item ? (
            <div className="mx-auto flex min-h-[55vh] w-[90%] items-center justify-center text-center">
              <div>
                <p className="text-lg text-zinc-300">{message}</p>
                <Button asChild className="mt-6 rounded-full bg-white px-6 text-black hover:bg-zinc-200">
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            </div>
          ) : null}

          {item ? (
            <div className="mx-auto grid w-[90%] gap-10 py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
              <div className="space-y-4">
                <div className="overflow-hidden bg-neutral-900">
                  {selectedImage ? (
                    <img src={selectedImage} alt={item.name} className="h-[72vh] min-h-[520px] w-full object-cover" />
                  ) : (
                    <div className="flex h-[72vh] min-h-[520px] items-center justify-center text-zinc-500">
                      No image
                    </div>
                  )}
                </div>

                {images.length > 0 ? (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((media) => (
                      <button
                        key={media.id ?? media.url}
                        type="button"
                        onClick={() => setSelectedImage(media.url)}
                        className={`h-28 w-28 shrink-0 overflow-hidden border ${
                          selectedImage === media.url ? 'border-amber-400' : 'border-zinc-800'
                        }`}
                      >
                        <img src={media.url} alt={item.name} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="sticky top-8 h-fit space-y-8 bg-black/80 py-2">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-amber-400">{item.status.replace('_', ' ')}</p>
                  <h1 className="mt-4 text-4xl font-bold uppercase leading-tight lg:text-5xl">{item.name}</h1>
                  <p className="mt-6 text-base leading-relaxed text-zinc-300">{item.description}</p>
                </div>

                <div>
                  <p className="text-3xl font-bold">{formatPrice(item.price)}</p>
                  <p className="mt-2 text-sm text-zinc-500">Taxes included. Shipping calculated at checkout.</p>
                </div>

                <Separator className="bg-zinc-800" />

                <div className="grid gap-4 text-sm">
                  <div className="flex justify-between border-b border-zinc-800 pb-3">
                    <span className="text-zinc-500">Type</span>
                    <span>{item.type.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-3">
                    <span className="text-zinc-500">Material</span>
                    <span>{item.material ?? 'Silver S925'}</span>
                  </div>
                  {item.stone ? (
                    <div className="flex justify-between border-b border-zinc-800 pb-3">
                      <span className="text-zinc-500">Stone</span>
                      <span>{item.stone}</span>
                    </div>
                  ) : null}
                </div>

                <div>
                  <h3 className="mb-4 font-medium">Quantity</h3>
                  <div className="flex w-fit items-center rounded-full border border-zinc-700 px-4 py-2">
                    <button type="button" className="p-2" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center">{quantity}</span>
                    <button type="button" className="p-2" onClick={() => setQuantity((current) => current + 1)}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {cartMessage ? (
                    <div className="border border-emerald-900 bg-emerald-950/60 px-4 py-3 text-sm text-emerald-200">
                      {cartMessage}
                    </div>
                  ) : null}
                  <Button onClick={handleAddToCart} className="h-14 w-full rounded-full bg-white text-base text-black hover:bg-zinc-200">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Add to cart
                  </Button>
                  <Button variant="outline" className="h-14 w-full rounded-full border-zinc-700 bg-black text-base text-white hover:bg-zinc-900">
                    Buy now
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  )
}
