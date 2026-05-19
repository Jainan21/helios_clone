
import { Minus, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function ProductDetailPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 md:grid-cols-2">
        {/* GALLERY */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[2rem] bg-zinc-100">
            <img
              src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1400&auto=format&fit=crop"
              alt="product"
              className="h-[700px] w-full object-cover"
            />
          </div>

          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border bg-zinc-100"
              >
                <img
                  src="https://images.unsplash.com/photo-1603561596112-db7f5f2f4fcd?q=80&w=1200&auto=format&fit=crop"
                  alt="thumb"
                  className="aspect-square w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div className="sticky top-24 h-fit space-y-8">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Helios Collection
            </p>

            <h1 className="mt-3 text-5xl font-bold">Silver Chain Helios</h1>

            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              Crafted from premium stainless steel with a minimal design that
              fits everyday streetwear and luxury aesthetics.
            </p>
          </div>

          <div>
            <p className="text-4xl font-bold">799.000đ</p>
            <p className="mt-2 text-sm text-zinc-500">
              Taxes included. Shipping calculated at checkout.
            </p>
          </div>

          <Separator />

          {/* SIZE */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">Size</h3>
              <button className="text-sm text-zinc-500 underline">
                Size guide
              </button>
            </div>

            <div className="flex gap-3">
              {['S', 'M', 'L'].map((size) => (
                <button
                  key={size}
                  className="flex h-12 w-12 items-center justify-center rounded-full border text-sm font-medium transition hover:bg-black hover:text-white"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div>
            <h3 className="mb-4 font-medium">Quantity</h3>

            <div className="flex w-fit items-center rounded-full border px-4 py-2">
              <button className="p-2">
                <Minus className="h-4 w-4" />
              </button>

              <span className="w-10 text-center">1</span>

              <button className="p-2">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="space-y-4">
            <Button className="h-14 w-full rounded-full text-base">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add to cart
            </Button>

            <Button
              variant="outline"
              className="h-14 w-full rounded-full text-base"
            >
              Buy now
            </Button>
          </div>

          {/* DETAILS */}
          <div className="space-y-4 rounded-[2rem] bg-zinc-100 p-6">
            <div>
              <h4 className="font-medium">Material</h4>
              <p className="mt-1 text-sm text-zinc-600">
                Premium stainless steel
              </p>
            </div>

            <div>
              <h4 className="font-medium">Shipping</h4>
              <p className="mt-1 text-sm text-zinc-600">
                Free shipping for orders above 1.000.000đ
              </p>
            </div>

            <div>
              <h4 className="font-medium">Warranty</h4>
              <p className="mt-1 text-sm text-zinc-600">
                6 months official warranty
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
